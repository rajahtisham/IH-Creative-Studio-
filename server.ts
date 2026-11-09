import express from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI client on server
const aiApiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (aiApiKey) {
  ai = new GoogleGenAI({
    apiKey: aiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// In-Memory Real-Time State Store for Collaboration
interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  assignedTo?: string;
  updatedBy?: string;
  updatedAt: string;
}

interface Task {
  id: string;
  title: string;
  module: string;
  status: 'backlog' | 'in_progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee: string;
  checklist: ChecklistItem[];
  originFeedbackId?: string;
  notes: string;
  estimatedHours: number;
}

interface FeedbackAnnotation {
  id: string;
  deliverableId: string;
  type: 'design_pin' | 'code_line' | 'video_timestamp';
  author: string;
  authorRole: string;
  targetRef: string; // e.g. "X:42%, Y:65%" or "Line 48" or "00:14"
  comment: string;
  status: 'open' | 'converted' | 'resolved';
  convertedTaskId?: string;
  createdAt: string;
}

interface ProjectCollaborativeState {
  projectId: string;
  sprintDocumentation: string;
  tasks: Task[];
  feedbackAnnotations: FeedbackAnnotation[];
  lastModifiedBy: string;
  lastModifiedAt: string;
}

const defaultTasks: Task[] = [
  {
    id: 'TASK-101',
    title: 'Implement 256-Bit SSL WAF & Rate Limiter Gateway',
    module: 'Cyber Security & Infra',
    status: 'in_progress',
    priority: 'critical',
    assignee: 'Ihtisham Hussain Raja (Founder/Arch)',
    notes: 'Enforce zero-trust JWT verification with Redis token bucket rate limiting on /api/*',
    estimatedHours: 8,
    checklist: [
      { id: 'c-1', text: 'Configure Cloudflare WAF enterprise rule-set', completed: true, updatedAt: new Date().toISOString() },
      { id: 'c-2', text: 'Implement sliding window counter in Redis', completed: true, updatedAt: new Date().toISOString() },
      { id: 'c-3', text: 'Conduct OWASP Top 10 automated penetration fuzzing', completed: false, updatedAt: new Date().toISOString() },
      { id: 'c-4', text: 'Generate ISO 27001 cyber verification manifest', completed: false, updatedAt: new Date().toISOString() },
    ],
  },
  {
    id: 'TASK-102',
    title: 'High-Fi Glassmorphism Mobile & Web Component Architecture',
    module: 'Enterprise UI/UX',
    status: 'in_progress',
    priority: 'high',
    assignee: 'Ayesha Khan (Lead UI/UX Designer)',
    notes: 'Apply Cyberpunk gold & cyan neon accents, backdrop-blur-md, and 60 FPS motion tokens',
    estimatedHours: 12,
    checklist: [
      { id: 'c-5', text: 'Finalize Figma design tokens for gold #F59E0B & cyan #06B6D4', completed: true, updatedAt: new Date().toISOString() },
      { id: 'c-6', text: 'Build interactive milestone roadmap stepper', completed: true, updatedAt: new Date().toISOString() },
      { id: 'c-7', text: 'Optimize SVG icons for zero-latency asset rendering', completed: false, updatedAt: new Date().toISOString() },
    ],
  },
  {
    id: 'TASK-103',
    title: 'Real-Time WebSocket State Sync Engine & Presence Hub',
    module: 'Real-Time Backend Engine',
    status: 'review',
    priority: 'high',
    assignee: 'Hamza Tariq (Lead Full-Stack Eng)',
    notes: 'Broadcast task checklist modifications, sprint markdown sync, and client deliverable tasks',
    estimatedHours: 14,
    checklist: [
      { id: 'c-8', text: 'Mount ws WebSocketServer on Node.js HTTP server', completed: true, updatedAt: new Date().toISOString() },
      { id: 'c-9', text: 'Add heartbeat ping/pong to prevent stale socket drop', completed: true, updatedAt: new Date().toISOString() },
      { id: 'c-10', text: 'Broadcast cursor presence and live collaborative edits', completed: true, updatedAt: new Date().toISOString() },
    ],
  },
  {
    id: 'TASK-104',
    title: 'Client Granular Feedback to Actionable Sprint Task Converter',
    module: 'Client Experience Portal',
    status: 'completed',
    priority: 'medium',
    assignee: 'Zain Ul Abideen (Senior QA & Systems)',
    notes: 'Automatically ingest design pins, code line comments, and video stamps into active sprint tasks',
    estimatedHours: 6,
    checklist: [
      { id: 'c-11', text: 'Interactive canvas pin-drop on design screenshots', completed: true, updatedAt: new Date().toISOString() },
      { id: 'c-12', text: 'Line-by-line annotation panel on source code review', completed: true, updatedAt: new Date().toISOString() },
      { id: 'c-13', text: 'Video segment timestamp tagging', completed: true, updatedAt: new Date().toISOString() },
      { id: 'c-14', text: 'Automated 1-click sprint task transformation', completed: true, updatedAt: new Date().toISOString() },
    ],
  },
];

const defaultSprintDoc = `# Sprint #14 Architecture & Execution Manifest
**Project**: Apex Omni-Channel FinTech & AI Automation Suite  
**Engineering Lead**: Ihtisham Hussain Raja (Managing Director)  
**Standard**: ISO 27001 Certified • Zero-Trust Glassmorphism Standard  

---
### 1. Architectural Scope
- Seamless real-time state synchronization across Mobile (Expo/React Native) and Web (Next.js/React).
- Integrated Gemini 3.8 Flash automated scope synthesis for client proposals.
- Strict 60 FPS micro-animations and zero-latency WebSocket dispatch.

### 2. Live Engineering Directives
1. **Security Policy**: Every API endpoint handling financial transactions or deliverable approval requires 256-bit SSL validation.
2. **Quality Benchmark**: No UI component may render with raw layout shifts; use skeleton loaders and optimistic cache states.
3. **Collaboration Protocol**: Active team members must log working sprint hours using the built-in precision time logger.
`;

const defaultAnnotations: FeedbackAnnotation[] = [
  {
    id: 'FB-201',
    deliverableId: 'DELIV-01',
    type: 'design_pin',
    author: 'Elena Rostova (Client VIP)',
    authorRole: 'Chief Product Officer, Apex Capital',
    targetRef: 'X: 74%, Y: 32%',
    comment: 'The CTA button on the trading card needs higher contrast gold glow #F59E0B so it stands out against the dark obsidian backdrop.',
    status: 'converted',
    convertedTaskId: 'TASK-102',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'FB-202',
    deliverableId: 'DELIV-02',
    type: 'code_line',
    author: 'Elena Rostova (Client VIP)',
    authorRole: 'Chief Product Officer, Apex Capital',
    targetRef: 'Line 42 (RateLimiter.ts)',
    comment: 'Verify if 5,000 requests/sec peak traffic will trigger any false positive 429 drops for VIP accounts.',
    status: 'converted',
    convertedTaskId: 'TASK-101',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'FB-203',
    deliverableId: 'DELIV-03',
    type: 'video_timestamp',
    author: 'Elena Rostova (Client VIP)',
    authorRole: 'Chief Product Officer, Apex Capital',
    targetRef: '00:14 (Logo Rotation)',
    comment: 'Ease the 3D cyber holographic rotation curve slightly slower at the apex moment.',
    status: 'open',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
];

// Project collaborative room store
const projectStore: Record<string, ProjectCollaborativeState> = {
  'proj-apex': {
    projectId: 'proj-apex',
    sprintDocumentation: defaultSprintDoc,
    tasks: defaultTasks,
    feedbackAnnotations: defaultAnnotations,
    lastModifiedBy: 'Ihtisham Hussain Raja',
    lastModifiedAt: new Date().toISOString(),
  },
};

function getProjectState(id: string = 'proj-apex'): ProjectCollaborativeState {
  if (!projectStore[id]) {
    projectStore[id] = {
      projectId: id,
      sprintDocumentation: defaultSprintDoc,
      tasks: JSON.parse(JSON.stringify(defaultTasks)),
      feedbackAnnotations: JSON.parse(JSON.stringify(defaultAnnotations)),
      lastModifiedBy: 'Ihtisham Hussain Raja',
      lastModifiedAt: new Date().toISOString(),
    };
  }
  return projectStore[id];
}

// Connected WebSocket Clients
interface ClientSession {
  ws: WebSocket;
  id: string;
  userName: string;
  userRole: string;
  projectId: string;
  color: string;
  activeField?: string;
}

const connectedClients = new Map<WebSocket, ClientSession>();

function broadcastToProject(projectId: string, message: any, excludeWs?: WebSocket) {
  const payload = JSON.stringify(message);
  for (const [ws, session] of connectedClients.entries()) {
    if (session.projectId === projectId && ws.readyState === WebSocket.OPEN) {
      if (excludeWs && ws === excludeWs) continue;
      ws.send(payload);
    }
  }
}

function getActivePeers(projectId: string) {
  const peers: { id: string; name: string; role: string; color: string; activeField?: string }[] = [];
  for (const session of connectedClients.values()) {
    if (session.projectId === projectId) {
      peers.push({
        id: session.id,
        name: session.userName,
        role: session.userRole,
        color: session.color,
        activeField: session.activeField,
      });
    }
  }
  return peers;
}

// API Route: Dynamic Content Generation for Hero & Agency Showcase via Gemini API
app.post('/api/showcase/generate', async (req, res) => {
  try {
    const {
      industryFocus = 'Enterprise AI, FinTech & Cyber Security',
      targetAudience = 'Fortune 500 Leaders, Unicorn Founders, Series A+ Startups',
      tone = 'Luxury Dark Mode Cyberpunk Authority',
      keywords = ['Autonomous AI Agents', 'Zero-Trust Architecture', '60 FPS Glassmorphism', 'High-Scalability Distributed Systems'],
    } = req.body;

    const promptText = `
You are the Chief Brand Strategist and Creative Technologist at IH Creative Studio, an elite enterprise digital agency founded by Ihtisham Hussain Raja.
Generate fresh, razor-sharp, magnetic marketing copy, service descriptions, and case study summaries tailored to current industry trends.

Parameters:
- Industry Focus: ${industryFocus}
- Target Audience: ${targetAudience}
- Tone: ${tone}
- Focus Keywords: ${keywords.join(', ')}
- Agency Founder: Ihtisham Hussain Raja
- WhatsApp Direct: +92 310 9328042
- Email: ih.creativestudio.pk@gmail.com
- Core Slogan: "We engineer digital masterpieces that scale businesses."

Generate a strictly valid JSON response with:
1. hero:
   - badge: short punchy badge e.g. "NEXT-GEN ENTERPRISE ENGINEERING • ISO 27001 HARDENED"
   - headlinePrefix: main hook line
   - headlineGradient: high-impact glowing phrase (e.g. "Digital Masterpieces That Dominate Markets")
   - subheadline: 2 sentences articulating bespoke craftsmanship, speed, and business ROI under Ihtisham Hussain Raja's leadership
   - stats: array of 4 stats (label, value, description)
2. services: array of 6 core services (Web/Mobile App Dev, AI Agents & Automation, Enterprise UI/UX, 3D Brand Strategy, DevOps Cloud Architecture, Cyber Audits), each with:
   - title
   - tagline
   - description: 2-3 sentences of technical depth
   - techStack: array of 4-5 tech tags
   - metricsHighlight: e.g. "99.99% Uptime", "Sub-100ms Latency"
3. caseStudies: array of 3 concise, compelling enterprise case study summaries:
   - clientName
   - sector
   - challenge
   - solution
   - resultMetric
   - techTags: array of 3-4 tags
4. founderStatement: A powerful 2-3 sentence quote from Ihtisham Hussain Raja on why average code is an existential business risk.
`;

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: promptText,
          config: {
            systemInstruction:
              'You are the Elite Brand & Technology Strategist for IH Creative Studio. You write authoritative, razor-sharp copy for multi-million dollar tech enterprises. Return strictly valid JSON.',
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                hero: {
                  type: Type.OBJECT,
                  properties: {
                    badge: { type: Type.STRING },
                    headlinePrefix: { type: Type.STRING },
                    headlineGradient: { type: Type.STRING },
                    subheadline: { type: Type.STRING },
                    stats: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          label: { type: Type.STRING },
                          value: { type: Type.STRING },
                          description: { type: Type.STRING },
                        },
                        required: ['label', 'value', 'description'],
                      },
                    },
                  },
                  required: ['badge', 'headlinePrefix', 'headlineGradient', 'subheadline', 'stats'],
                },
                services: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      tagline: { type: Type.STRING },
                      description: { type: Type.STRING },
                      techStack: { type: Type.ARRAY, items: { type: Type.STRING } },
                      metricsHighlight: { type: Type.STRING },
                    },
                    required: ['title', 'tagline', 'description', 'techStack', 'metricsHighlight'],
                  },
                },
                caseStudies: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      clientName: { type: Type.STRING },
                      sector: { type: Type.STRING },
                      challenge: { type: Type.STRING },
                      solution: { type: Type.STRING },
                      resultMetric: { type: Type.STRING },
                      techTags: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                    required: ['clientName', 'sector', 'challenge', 'solution', 'resultMetric', 'techTags'],
                  },
                },
                founderStatement: { type: Type.STRING },
              },
              required: ['hero', 'services', 'caseStudies', 'founderStatement'],
            },
          },
        });

        const parsed = JSON.parse(response.text || '{}');
        return res.json({ success: true, data: parsed, poweredBy: 'Gemini 3.8 Flash' });
      } catch (geminiErr: any) {
        console.warn('[IH Creative Studio] Gemini showcase transient note:', geminiErr?.message || geminiErr);
        // Seamlessly continue to resilient fallback
      }
    }

    // High-fidelity fallback
    const fallbackShowcase = {
      hero: {
        badge: 'ZERO-COMPROMISE DIGITAL CRAFTSMANSHIP • GLOBAL ENTERPRISE TIER',
        headlinePrefix: 'We Architect & Engineer',
        headlineGradient: 'Digital Masterpieces That Scale Businesses',
        subheadline:
          'Led by Managing Director Ihtisham Hussain Raja, IH Creative Studio fuses cutting-edge AI automation, military-grade cyber hardening, and hypnotic 60 FPS glassmorphic design to build market leaders.',
        stats: [
          { label: 'Client Retention Rate', value: '98.4%', description: 'Long-term enterprise contracts' },
          { label: 'Cyber Security Index', value: '99.8%', description: 'Zero-trust architecture audited' },
          { label: 'Production Uptime', value: '99.99%', description: 'Multi-region fault-tolerant clusters' },
          { label: 'Global Founders Served', value: '45+', description: 'USA, UK, Europe, UAE & Pakistan' },
        ],
      },
      services: [
        {
          title: 'Web & Mobile App Development',
          tagline: 'Cross-Platform React Native, Flutter & Next.js 14',
          description:
            'Engineered for 60 FPS fluid rendering, offline-first resilience, and unified codebase parity across iOS, Android, and Web.',
          techStack: ['React Native (Expo)', 'Next.js 14', 'TypeScript', 'Tailwind CSS', 'Redux/Zustand'],
          metricsHighlight: 'Sub-1.2s Cold Start • 60 FPS Micro-Interactions',
        },
        {
          title: 'AI Agents & Intelligent Automation',
          tagline: 'Autonomous Gemini Workflows & LLM Orchestration',
          description:
            'Custom AI agents that synthesize complex data, automate client intake, optimize customer support, and execute multi-step business logic.',
          techStack: ['Gemini 3.8 Flash', 'LangChain/LlamaIndex', 'Vector DBs', 'FastAPI', 'Redis Queue'],
          metricsHighlight: 'Up to 64% Operational Overhead Reduction',
        },
        {
          title: 'Enterprise UI/UX & Design Systems',
          tagline: 'Ultra-Responsive Glassmorphism & Cyber Aesthetics',
          description:
            'Obsidian palettes, glowing cyberpunk neon accents (Gold #F59E0B, Cyan #06B6D4), zero-pill discipline, and tactile visual hierarchies that convert.',
          techStack: ['Figma Tokens', 'Framer Motion', 'Tailwind v4', 'Glassmorphism', 'Design Tokens'],
          metricsHighlight: '+310% User Engagement Retention',
        },
        {
          title: '3D Brand Strategy & Visual Identity',
          tagline: 'Spatial Computing, Three.js & Brand Dominance',
          description:
            'Interactive 3D digital assets, real-time WebGL product showcases, and distinctive brand identities designed to establish category leadership.',
          techStack: ['Three.js', 'WebGL', 'Blender 3D', 'Spline', 'SVG Shader Pipelines'],
          metricsHighlight: '4K Photorealistic Asset Delivery',
        },
        {
          title: 'DevOps & Cloud Architecture',
          tagline: 'Distributed Kubernetes, AWS & Cloudflare R2',
          description:
            'High-concurrency infrastructure engineered for zero-downtime blue/green deployments, automated scaling, and global edge caching.',
          techStack: ['AWS ECS/EKS', 'Cloudflare Workers', 'Docker', 'Terraform', 'GitHub Actions CI/CD'],
          metricsHighlight: '<45ms Worldwide Edge Response Time',
        },
        {
          title: 'Cyber Audits & Zero-Trust Hardening',
          tagline: '256-Bit SSL Encryption, WAF & GDPR Compliance',
          description:
            'Deep vulnerability assessments, OWASP Top 10 penetration sweeps, multi-factor JWT/TOTP authentication, and strict compliance manifests.',
          techStack: ['OWASP ZAP', '256-bit TLS', 'JWT + MFA', 'Rate Limiter WAF', 'ISO 27001 Standards'],
          metricsHighlight: 'Bank-Grade Zero-Trust Defense',
        },
      ],
      caseStudies: [
        {
          clientName: 'Apex Wealth & Derivatives',
          sector: 'High-Frequency FinTech',
          challenge: 'Legacy portal suffered 8-second latency under market volatility and lacked real-time client collaboration.',
          solution: 'Re-architected with WebSocket state streaming, React 19 UI, and Gemini algorithmic market summarization.',
          resultMetric: 'Latency dropped to 85ms; trading volume surged +420%.',
          techTags: ['Next.js 14', 'WebSockets', 'Gemini AI', 'PostgreSQL'],
        },
        {
          clientName: 'Krypton Cyber Defense',
          sector: 'Enterprise Security SaaS',
          challenge: 'Needed an intuitive zero-trust threat management dashboard with real-time incident triage and client approval pipelines.',
          solution: 'Delivered luxury dark-mode glassmorphism interface with instant pin-point annotations and automated ticket dispatch.',
          resultMetric: 'Zero breach incidents; client satisfaction score: 99.4%.',
          techTags: ['React Native', 'TypeScript', 'WAF Gateway', 'Motion'],
        },
        {
          clientName: 'Aura Spatial Logistics',
          sector: 'AI Supply Chain & Fleet',
          challenge: 'Required real-time tracking of 50,000+ autonomous units with dynamic cost estimation and multi-currency billing.',
          solution: 'Constructed distributed microservices with dynamic currency switchers (USD, PKR, EUR, GBP) and AI route synthesis.',
          resultMetric: '$2.8M operational cost saved annually.',
          techTags: ['Cloudflare Edge', 'Redis', 'Multi-Currency', 'Python'],
        },
      ],
      founderStatement:
        '“In the modern digital economy, mediocre software is a silent business killer. At IH Creative Studio, we treat every system as an architectural monument—bulletproof, hyper-optimized, and visually unforgettable.” — Ihtisham Hussain Raja, Founder & Managing Director',
    };

    return res.json({ success: true, data: fallbackShowcase, poweredBy: 'IH Creative Engine (Local Pro)' });
  } catch (err: any) {
    console.error('Error in showcase generate:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// API Route: Generate AI Technical Scope & Architecture Proposal
app.post('/api/proposals/generate', async (req, res) => {
  try {
    const {
      projectName,
      clientName,
      clientEmail,
      industry,
      platforms,
      coreObjectives,
      techPreferences,
      expectedUsers,
      securityTier,
      budgetRange,
      targetTimeline,
      selectedAddons,
    } = req.body;

    const promptText = `
You are the Chief Technology Officer and Lead Solutions Architect at IH Creative Studio, an elite enterprise digital engineering agency founded by Ihtisham Hussain Raja.
Generate a comprehensive, bespoke technical scope proposal and architectural roadmap for a prospective client.

Client & Project Brief:
- Project Name: ${projectName || 'Enterprise Digital Platform'}
- Client: ${clientName || 'Valued Client'} (${clientEmail || 'N/A'})
- Industry: ${industry || 'Technology & Enterprise SaaS'}
- Target Platforms: ${Array.isArray(platforms) ? platforms.join(', ') : platforms || 'Cross-Platform Mobile (iOS/Android) & Next.js Web'}
- Core Objectives & Vision: ${coreObjectives || 'High-performance scalable architecture with automated workflows'}
- Technology Preferences: ${techPreferences || 'Modern TypeScript, React/React Native, Node.js/Python, PostgreSQL, AWS/Cloudflare'}
- Expected User Scale: ${expectedUsers || '100K+ Monthly Active Users'}
- Security Tier: ${securityTier || 'Enterprise ISO 27001 / GDPR 256-bit Hardened'}
- Budget Bracket: ${budgetRange || '$25,000 - $50,000 USD'}
- Target Delivery Timeline: ${targetTimeline || '10 - 14 Weeks'}
- Selected Add-ons: ${Array.isArray(selectedAddons) ? selectedAddons.join(', ') : selectedAddons || 'None'}

Generate a professional JSON response with:
1. executiveSummary: A punchy, authoritative 2-3 paragraph summary showcasing how IH Creative Studio will engineer this digital masterpiece under the leadership of Ihtisham Hussain Raja.
2. architecturalRoadmap: An array of 4 phases (Phase 1: Deep Discovery & Cyber Architecture, Phase 2: Ultra-High-Fi Glassmorphism UI/UX & Design System, Phase 3: Distributed Full-Stack Core Development, Phase 4: Penetration Auditing, Load-Testing & Global Launch). Each phase should have phase, title, durationWeeks, keyDeliverables (array of 3-4 items), and techMilestones.
3. recommendedTechStack: An object with frontend, backend, databaseCloud, aiAutomation, cyberSecurity arrays.
4. strategicAddonsBreakdown: array of recommendations based on selected add-ons.
5. estimatedInvestment: summary object with minBudget, maxBudget, recommendedCurrency: "USD", estimatedWeeks, and roiProjection.
6. founderGuarantee: A personalized message from Managing Director Ihtisham Hussain Raja on IH Creative Studio's standard of excellence and 99.8% SLA commitment.
`;

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: promptText,
          config: {
            systemInstruction:
              'You are the Lead Systems Architect at IH Creative Studio. You craft high-end, detailed technical proposals with cyberpunk/enterprise precision for high-value clients. Return strictly valid JSON.',
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                executiveSummary: { type: Type.STRING },
                architecturalRoadmap: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      phase: { type: Type.STRING },
                      title: { type: Type.STRING },
                      durationWeeks: { type: Type.STRING },
                      keyDeliverables: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                      techMilestones: { type: Type.STRING },
                    },
                    required: ['phase', 'title', 'durationWeeks', 'keyDeliverables', 'techMilestones'],
                  },
                },
                recommendedTechStack: {
                  type: Type.OBJECT,
                  properties: {
                    frontend: { type: Type.ARRAY, items: { type: Type.STRING } },
                    backend: { type: Type.ARRAY, items: { type: Type.STRING } },
                    databaseCloud: { type: Type.ARRAY, items: { type: Type.STRING } },
                    aiAutomation: { type: Type.ARRAY, items: { type: Type.STRING } },
                    cyberSecurity: { type: Type.ARRAY, items: { type: Type.STRING } },
                  },
                  required: ['frontend', 'backend', 'databaseCloud', 'aiAutomation', 'cyberSecurity'],
                },
                strategicAddonsBreakdown: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      rationale: { type: Type.STRING },
                      impact: { type: Type.STRING },
                    },
                    required: ['title', 'rationale', 'impact'],
                  },
                },
                estimatedInvestment: {
                  type: Type.OBJECT,
                  properties: {
                    minBudget: { type: Type.NUMBER },
                    maxBudget: { type: Type.NUMBER },
                    recommendedCurrency: { type: Type.STRING },
                    estimatedWeeks: { type: Type.STRING },
                    roiProjection: { type: Type.STRING },
                  },
                  required: ['minBudget', 'maxBudget', 'recommendedCurrency', 'estimatedWeeks', 'roiProjection'],
                },
                founderGuarantee: { type: Type.STRING },
              },
              required: [
                'executiveSummary',
                'architecturalRoadmap',
                'recommendedTechStack',
                'estimatedInvestment',
                'founderGuarantee',
              ],
            },
          },
        });

        const parsed = JSON.parse(response.text || '{}');
        return res.json({ success: true, data: parsed, poweredBy: 'Gemini 3.8 Flash' });
      } catch (geminiErr: any) {
        console.warn('[IH Creative Studio] Gemini proposal transient note:', geminiErr?.message || geminiErr);
        // Continue to resilient fallback proposal
      }
    }

    // High-fidelity fallback
    const fallbackProposal = {
      executiveSummary: `IH Creative Studio, spearheaded by Founder & Managing Director Ihtisham Hussain Raja, has formulated an end-to-end technical blueprint tailored for ${projectName || 'your enterprise system'}. We synthesize modern micro-frontend paradigms, bulletproof distributed microservices, and specialized AI automation to guarantee seamless scaling beyond ${expectedUsers || '100,000+ users'}.\n\nOur engineering standard adheres to zero-compromise design aesthetics featuring ultra-responsive glassmorphism, 60 FPS fluid micro-interactions, and 256-bit encryption compliance. Every phase is strictly verified through our proprietary automated test suites and cyber-audit harness.`,
      architecturalRoadmap: [
        {
          phase: 'Phase 01',
          title: 'Deep Discovery, Threat Modeling & Architecture Design',
          durationWeeks: '2 Weeks',
          keyDeliverables: [
            'System Architecture Specification & Component Diagrams',
            'Database Entity-Relationship & Distributed Caching Topology',
            'ISO 27001 / GDPR Compliance Threat Matrix',
            'Interactive High-Fidelity Glassmorphism UI Prototypes in Figma',
          ],
          techMilestones: 'Approval of core entity contracts and interactive UX wireframes.',
        },
        {
          phase: 'Phase 02',
          title: 'Cross-Platform Frontend & Component Design System',
          durationWeeks: '3 - 4 Weeks',
          keyDeliverables: [
            'Mobile Expo/React Native & Web Next.js 14 Unified UI Library',
            '60 FPS Micro-Interactions & Cyberpunk Neon Aesthetics',
            'Offline-First State Management & Optimistic UI Caching',
            'Multi-Role Dynamic Dashboard Shells (Admin, Client, Team)',
          ],
          techMilestones: 'Client sign-off on design system tokens and test flight build.',
        },
        {
          phase: 'Phase 03',
          title: 'Full-Stack Core API, AI Agents & Real-Time Engine',
          durationWeeks: '4 - 5 Weeks',
          keyDeliverables: [
            'Distributed REST / WebSocket Real-Time Gateway',
            'Gemini AI Automation Pipeline & Context Memory Engine',
            'PostgreSQL Relational Schema with Row-Level Security (RLS)',
            'Automated Invoice & Settlement Ledger Service',
          ],
          techMilestones: 'Zero-latency live messaging integration and stress-tested ingestion pipeline.',
        },
        {
          phase: 'Phase 04',
          title: 'Cyber Audit, Load Testing & Global Multi-Region Deployment',
          durationWeeks: '2 Weeks',
          keyDeliverables: [
            'End-to-End Penetration Test & Security Hardening Certificate',
            'Automated CI/CD Pipeline on AWS ECS / Cloudflare R2',
            'Sub-100ms Global CDN Latency Verification',
            'Founder Handover, 24/7 SLA Activation & VIP Care',
          ],
          techMilestones: 'Production live cutover and founder warranty activation.',
        },
      ],
      recommendedTechStack: {
        frontend: ['Next.js 14 / React 19', 'React Native (Expo)', 'Tailwind CSS v4', 'Framer Motion', 'Lucide Enterprise'],
        backend: ['Node.js (TypeScript)', 'Express / NestJS Gateway', 'WebSockets / Socket.io Engine'],
        databaseCloud: ['PostgreSQL (Prisma / Supabase)', 'Redis In-Memory Cache', 'AWS S3 / Cloudflare R2'],
        aiAutomation: ['Gemini 3.8 Flash SDK', 'Intelligent Brief Synthesizer', 'Automated Scope Auditor'],
        cyberSecurity: ['256-Bit SSL/TLS Encryption', 'JWT + TOTP Multi-Factor Authentication', 'WAF Rate Limiting & Zero-Trust RBAC'],
      },
      strategicAddonsBreakdown: [
        {
          title: 'Cyber Hardening & Penetration Audit',
          rationale: 'Mandatory zero-trust security layer shielding API endpoints against automated attacks and OWASP Top 10 vulnerabilities.',
          impact: 'Guarantees 99.99% uptime resilience and bank-grade data privacy.',
        },
        {
          title: 'AI Automation & Custom Agent Integrations',
          rationale: 'Equips your platform with predictive intelligence, real-time brief generation, and automated client interactions.',
          impact: 'Reduces operational overhead by up to 64% within the first quarter.',
        },
      ],
      estimatedInvestment: {
        minBudget: 18500,
        maxBudget: 36000,
        recommendedCurrency: 'USD',
        estimatedWeeks: '11 - 13 Weeks',
        roiProjection: 'Estimated 3.8x ROI within 6 months post-deployment through operational velocity and digital brand authority.',
      },
      founderGuarantee:
        '“At IH Creative Studio, we do not ship mediocre software. Every line of code and every interaction is engineered as a digital masterpiece built to scale your business into a category leader.” — Ihtisham Hussain Raja, Founder & Managing Director',
    };

    return res.json({ success: true, data: fallbackProposal, poweredBy: 'IH Creative Engine (Local Pro)' });
  } catch (error: any) {
    console.error('Error generating AI proposal:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate proposal',
    });
  }
});

// API Route: Live Chat AI Assistant / Founder Desk Auto-Reply
app.post('/api/chat/assistant', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `You are the executive AI concierge for IH Creative Studio (founded by Ihtisham Hussain Raja). 
Provide a crisp, prestigious, knowledgeable answer to the client or team member. 
Studio specialties: Web/Mobile App Dev, AI Agents & Automation, Enterprise UI/UX, 3D Brand Strategy, DevOps Cloud Architecture, Cyber Audits.
Founder Contact: WhatsApp +92 310 9328042, Email: ih.creativestudio.pk@gmail.com.
User message: "${message}"`,
      });

      return res.json({ reply: response.text });
    }

    return res.json({
      reply: `Thank you for contacting IH Creative Studio. Founder Ihtisham Hussain Raja and our lead engineering desk have received your transmission. We build scalable, high-security digital masterpieces. Feel free to connect via WhatsApp direct at +92 310 9328042 or email ih.creativestudio.pk@gmail.com.`,
    });
  } catch (error: any) {
    console.error('Error in chat assistant:', error);
    return res.status(500).json({
      reply: 'Our executive desk has received your transmission. You can also reach Ihtisham Hussain Raja directly on WhatsApp: +92 310 9328042.',
    });
  }
});

// API Route: Fetch collaborative state directly if needed via REST
app.get('/api/projects/:id/state', (req, res) => {
  const project = getProjectState(req.params.id);
  res.json({
    project,
    activePeers: getActivePeers(req.params.id),
  });
});

// Server status endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    agency: 'IH Creative Studio',
    founder: 'Ihtisham Hussain Raja',
    whatsapp: '+92 310 9328042',
    email: 'ih.creativestudio.pk@gmail.com',
    aiEnabled: Boolean(ai),
    connectedWsClients: connectedClients.size,
    timestamp: new Date().toISOString(),
  });
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';
  const server = http.createServer(app);

  // Initialize WebSocket Server
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    const clientId = 'peer-' + Math.random().toString(36).substring(2, 9);
    const session: ClientSession = {
      ws,
      id: clientId,
      userName: 'Team Member',
      userRole: 'Engineer',
      projectId: 'proj-apex',
      color: '#06B6D4',
    };
    connectedClients.set(ws, session);

    // Send initial handshake
    ws.send(
      JSON.stringify({
        type: 'CONNECTED',
        payload: {
          clientId,
          projectState: getProjectState(session.projectId),
          activePeers: getActivePeers(session.projectId),
        },
      })
    );

    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        const currentSession = connectedClients.get(ws);
        if (!currentSession) return;

        switch (message.type) {
          case 'JOIN_PROJECT': {
            currentSession.projectId = message.payload.projectId || 'proj-apex';
            currentSession.userName = message.payload.userName || 'Team Member';
            currentSession.userRole = message.payload.userRole || 'Engineer';
            currentSession.color = message.payload.color || '#06B6D4';

            // Send full project state to newly joined client
            ws.send(
              JSON.stringify({
                type: 'PROJECT_STATE_SYNC',
                payload: {
                  projectState: getProjectState(currentSession.projectId),
                  activePeers: getActivePeers(currentSession.projectId),
                },
              })
            );

            // Announce new peer to project
            broadcastToProject(currentSession.projectId, {
              type: 'PEER_JOINED',
              payload: {
                peer: {
                  id: currentSession.id,
                  name: currentSession.userName,
                  role: currentSession.userRole,
                  color: currentSession.color,
                },
                activePeers: getActivePeers(currentSession.projectId),
              },
            });
            break;
          }

          case 'UPDATE_CHECKLIST': {
            const { taskId, checklistId, completed, updatedBy } = message.payload;
            const project = getProjectState(currentSession.projectId);
            const task = project.tasks.find((t) => t.id === taskId);
            if (task) {
              const item = task.checklist.find((c) => c.id === checklistId);
              if (item) {
                item.completed = completed;
                item.updatedBy = updatedBy || currentSession.userName;
                item.updatedAt = new Date().toISOString();
                project.lastModifiedBy = currentSession.userName;
                project.lastModifiedAt = new Date().toISOString();

                // Broadcast checklist update to all peers in project
                broadcastToProject(currentSession.projectId, {
                  type: 'CHECKLIST_UPDATED',
                  payload: {
                    taskId,
                    checklistId,
                    completed,
                    updatedBy: currentSession.userName,
                    updatedAt: item.updatedAt,
                    tasks: project.tasks,
                  },
                });
              }
            }
            break;
          }

          case 'UPDATE_DOC': {
            const { content, updatedBy } = message.payload;
            const project = getProjectState(currentSession.projectId);
            project.sprintDocumentation = content;
            project.lastModifiedBy = updatedBy || currentSession.userName;
            project.lastModifiedAt = new Date().toISOString();

            // Broadcast document update to other peers
            broadcastToProject(
              currentSession.projectId,
              {
                type: 'DOC_UPDATED',
                payload: {
                  content,
                  updatedBy: currentSession.userName,
                  updatedAt: project.lastModifiedAt,
                },
              },
              ws // Exclude sender to avoid typing interruption
            );
            break;
          }

          case 'ADD_TASK': {
            const project = getProjectState(currentSession.projectId);
            const newTask: Task = {
              id: 'TASK-' + Math.floor(100 + Math.random() * 900),
              title: message.payload.title || 'Untitled Sprint Task',
              module: message.payload.module || 'Sprint Deliverables',
              status: message.payload.status || 'in_progress',
              priority: message.payload.priority || 'medium',
              assignee: message.payload.assignee || currentSession.userName,
              notes: message.payload.notes || '',
              estimatedHours: message.payload.estimatedHours || 4,
              checklist: message.payload.checklist || [
                { id: 'c-' + Math.random().toString(36).substring(2, 6), text: 'Initial scoping and technical setup', completed: false, updatedAt: new Date().toISOString() },
              ],
            };
            project.tasks.unshift(newTask);
            project.lastModifiedBy = currentSession.userName;
            project.lastModifiedAt = new Date().toISOString();

            broadcastToProject(currentSession.projectId, {
              type: 'TASK_ADDED',
              payload: {
                task: newTask,
                tasks: project.tasks,
                addedBy: currentSession.userName,
              },
            });
            break;
          }

          case 'CONVERT_FEEDBACK_TO_TASK': {
            const { feedbackId } = message.payload;
            const project = getProjectState(currentSession.projectId);
            const feedback = project.feedbackAnnotations.find((f) => f.id === feedbackId);

            if (feedback && feedback.status !== 'converted') {
              const taskId = 'TASK-' + Math.floor(100 + Math.random() * 900);
              const newTask: Task = {
                id: taskId,
                title: `Address Client Feedback: ${feedback.comment.slice(0, 45)}...`,
                module: feedback.type === 'design_pin' ? 'UI/UX Polish' : feedback.type === 'code_line' ? 'Code Hardening' : 'Motion/Video Review',
                status: 'in_progress',
                priority: 'high',
                assignee: 'Team Member',
                originFeedbackId: feedback.id,
                notes: `Client Comment: "${feedback.comment}" on ${feedback.targetRef} by ${feedback.author} (${feedback.authorRole})`,
                estimatedHours: 3,
                checklist: [
                  { id: 'c-fb1', text: `Review target deliverable at ${feedback.targetRef}`, completed: false, updatedAt: new Date().toISOString() },
                  { id: 'c-fb2', text: 'Implement requested revision and verify 60 FPS / compliance', completed: false, updatedAt: new Date().toISOString() },
                  { id: 'c-fb3', text: 'Notify client for final sign-off', completed: false, updatedAt: new Date().toISOString() },
                ],
              };

              feedback.status = 'converted';
              feedback.convertedTaskId = taskId;
              project.tasks.unshift(newTask);
              project.lastModifiedBy = currentSession.userName;
              project.lastModifiedAt = new Date().toISOString();

              broadcastToProject(currentSession.projectId, {
                type: 'FEEDBACK_CONVERTED',
                payload: {
                  feedbackId,
                  taskId,
                  task: newTask,
                  tasks: project.tasks,
                  annotations: project.feedbackAnnotations,
                  convertedBy: currentSession.userName,
                },
              });
            }
            break;
          }

          case 'ADD_FEEDBACK': {
            const project = getProjectState(currentSession.projectId);
            const newFeedback: FeedbackAnnotation = {
              id: 'FB-' + Math.floor(200 + Math.random() * 800),
              deliverableId: message.payload.deliverableId || 'DELIV-01',
              type: message.payload.type || 'design_pin',
              author: message.payload.author || currentSession.userName,
              authorRole: message.payload.authorRole || 'Client Reviewer',
              targetRef: message.payload.targetRef || 'Element Marker',
              comment: message.payload.comment || 'Revision requested',
              status: 'open',
              createdAt: new Date().toISOString(),
            };

            project.feedbackAnnotations.unshift(newFeedback);
            project.lastModifiedBy = currentSession.userName;
            project.lastModifiedAt = new Date().toISOString();

            broadcastToProject(currentSession.projectId, {
              type: 'FEEDBACK_ADDED',
              payload: {
                feedback: newFeedback,
                annotations: project.feedbackAnnotations,
              },
            });
            break;
          }

          case 'CHAT_MESSAGE': {
            broadcastToProject(currentSession.projectId, {
              type: 'CHAT_MESSAGE',
              payload: {
                id: 'msg-' + Date.now(),
                sender: currentSession.userName,
                role: currentSession.userRole,
                color: currentSession.color,
                text: message.payload.text,
                attachment: message.payload.attachment,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              },
            });
            break;
          }

          case 'CURSOR_PRESENCE': {
            currentSession.activeField = message.payload.activeField;
            broadcastToProject(
              currentSession.projectId,
              {
                type: 'PEER_PRESENCE_UPDATED',
                payload: {
                  peerId: currentSession.id,
                  name: currentSession.userName,
                  color: currentSession.color,
                  activeField: message.payload.activeField,
                },
              },
              ws
            );
            break;
          }
        }
      } catch (err) {
        console.error('Error handling WS message:', err);
      }
    });

    ws.on('close', () => {
      const currentSession = connectedClients.get(ws);
      if (currentSession) {
        const projectId = currentSession.projectId;
        connectedClients.delete(ws);
        broadcastToProject(projectId, {
          type: 'PEER_LEFT',
          payload: {
            peerId: currentSession.id,
            activePeers: getActivePeers(projectId),
          },
        });
      }
    });
  });

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[IH Creative Studio] Full-Stack Server & WebSockets running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
