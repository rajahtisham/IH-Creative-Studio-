import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  Shield,
  Smartphone,
  Cpu,
  Layers,
  Box,
  Cloud,
  Lock,
  ArrowRight,
  TrendingUp,
  CheckCircle,
  RefreshCw,
  PhoneCall,
  Terminal,
  ExternalLink,
} from 'lucide-react';
import { ShowcaseData, CurrencyCode } from '../../types';
import { formatCurrency } from '../../utils/currency';

interface HeroAndShowcaseProps {
  onStartBrief: () => void;
  onOpenEstimator: () => void;
  currency: CurrencyCode;
}

const initialShowcaseData: ShowcaseData = {
  hero: {
    badge: 'ZERO-COMPROMISE DIGITAL CRAFTSMANSHIP • GLOBAL ENTERPRISE TIER',
    headlinePrefix: 'We Architect & Engineer',
    headlineGradient: 'Digital Masterpieces That Scale Businesses',
    subheadline:
      'Spearheaded by Founder & Managing Director Ihtisham Hussain Raja, IH Creative Studio fuses cutting-edge AI automation, military-grade cyber hardening, and hypnotic 60 FPS glassmorphic design to build market leaders.',
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

export const HeroAndShowcase: React.FC<HeroAndShowcaseProps> = ({
  onStartBrief,
  onOpenEstimator,
  currency,
}) => {
  const [showcase, setShowcase] = useState<ShowcaseData>(initialShowcaseData);
  const [isGeneratingCopy, setIsGeneratingCopy] = useState(false);
  const [showAiConsole, setShowAiConsole] = useState(false);
  const [industryFocus, setIndustryFocus] = useState('Enterprise AI, FinTech & Cyber Security');
  const [tone, setTone] = useState('Luxury Dark Mode Cyberpunk Authority');
  const [customKeywords, setCustomKeywords] = useState('Autonomous Agents, 60 FPS Glassmorphism, Zero-Trust Architecture');
  const [aiGeneratedSuccess, setAiGeneratedSuccess] = useState(false);

  const handleGenerateShowcase = async () => {
    setIsGeneratingCopy(true);
    setAiGeneratedSuccess(false);
    try {
      const res = await fetch('/api/showcase/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          industryFocus,
          tone,
          keywords: customKeywords.split(',').map((k) => k.trim()),
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setShowcase(data.data);
        setAiGeneratedSuccess(true);
      }
    } catch (err) {
      console.error('Failed to generate showcase via Gemini:', err);
    } finally {
      setIsGeneratingCopy(false);
    }
  };

  const getServiceIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Smartphone className="w-5 h-5 text-amber-400" />;
      case 1:
        return <Cpu className="w-5 h-5 text-cyan-400" />;
      case 2:
        return <Layers className="w-5 h-5 text-emerald-400" />;
      case 3:
        return <Box className="w-5 h-5 text-amber-400" />;
      case 4:
        return <Cloud className="w-5 h-5 text-cyan-400" />;
      case 5:
        return <Lock className="w-5 h-5 text-emerald-400" />;
      default:
        return <Zap className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="relative overflow-hidden cyber-grid pb-20">
      {/* Background Cyber Glowing Orbs */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-40 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[800px] left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-[130px] pointer-events-none" />

      {/* AI Dynamic Showcase Console Toggle Banner */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-gradient-to-r from-amber-950/40 via-cyan-950/30 to-slate-900/60 border border-amber-500/30 shadow-lg">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                Gemini 3.8 Flash Showcase Synthesizer
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                  ACTIVE
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                Re-tune copy, services & case studies dynamically to current industry trends & keywords.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAiConsole(!showAiConsole)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B0F17] hover:bg-slate-800 border border-white/10 text-xs font-semibold text-slate-200 transition-all cursor-pointer"
            >
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>{showAiConsole ? 'Hide AI Console' : 'Tune with Gemini AI'}</span>
            </button>
            <button
              onClick={handleGenerateShowcase}
              disabled={isGeneratingCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-95 text-black text-xs font-bold shadow-md shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingCopy ? 'animate-spin' : ''}`} />
              <span>{isGeneratingCopy ? 'Synthesizing...' : '1-Click Refresh Copy'}</span>
            </button>
          </div>
        </div>

        {/* AI Console Accordion */}
        {showAiConsole && (
          <div className="mt-3 p-4 rounded-xl bg-[#070A0F] border border-cyan-500/30 shadow-xl animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Industry Focus & Sector
                </label>
                <select
                  value={industryFocus}
                  onChange={(e) => setIndustryFocus(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-lg bg-[#0B0F17] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                >
                  <option value="Enterprise AI, FinTech & Cyber Security">Enterprise AI, FinTech & Cyber Security</option>
                  <option value="Autonomous Agents & Workflow Automation">Autonomous Agents & Workflow Automation</option>
                  <option value="Defense, Military Grade Zero-Trust & Infra">Defense, Military Grade Zero-Trust & Infra</option>
                  <option value="Spatial Computing, WebGL 3D & Digital Luxury">Spatial Computing, WebGL 3D & Digital Luxury</option>
                  <option value="Global Supply Chain & Autonomous Fleet">Global Supply Chain & Autonomous Fleet</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Brand Voice Tone
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-lg bg-[#0B0F17] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                >
                  <option value="Luxury Dark Mode Cyberpunk Authority">Luxury Dark Mode Cyberpunk Authority</option>
                  <option value="Stealth Billion-Dollar Enterprise">Stealth Billion-Dollar Enterprise</option>
                  <option value="High-Impact Silicon Valley Engineering">High-Impact Silicon Valley Engineering</option>
                  <option value="Sovereign Grade Security & Cryptography">Sovereign Grade Security & Cryptography</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Agency Keywords (Comma-separated)
                </label>
                <input
                  type="text"
                  value={customKeywords}
                  onChange={(e) => setCustomKeywords(e.target.value)}
                  placeholder="e.g. Next.js 14, 60 FPS, React Native, WAF"
                  className="w-full px-2.5 py-2 rounded-lg bg-[#0B0F17] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
              <span className="text-[11px] text-slate-400">
                Powered directly by server-side Gemini 3.8 Flash SDK.
              </span>
              <button
                onClick={handleGenerateShowcase}
                disabled={isGeneratingCopy}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Execute Gemini Showcase Synthesis</span>
              </button>
            </div>
          </div>
        )}

        {aiGeneratedSuccess && (
          <div className="mt-2 p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            Showcase copy, services & case studies dynamically re-synthesized with Gemini 3.8 Flash!
          </div>
        )}
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 pt-12 pb-16 text-center lg:text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            {/* Top Cyber Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-medium tracking-wide">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>{showcase.hero.badge}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08]">
              {showcase.hero.headlinePrefix}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-cyan-300 to-emerald-400">
                {showcase.hero.headlineGradient}
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              {showcase.hero.subheadline}
            </p>

            {/* Value Proposition Callouts */}
            <div className="p-4 rounded-xl bg-[#070A0F]/90 border border-white/10 text-xs text-slate-300 space-y-2">
              <div className="flex items-center gap-2 text-white font-semibold">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Our Core Operating Creed:</span>
              </div>
              <blockquote className="italic text-amber-300/90 font-mono text-sm border-l-2 border-amber-500 pl-3">
                “We engineer digital masterpieces that scale businesses.”
              </blockquote>
              <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                <span>Founder: <strong>Ihtisham Hussain Raja</strong></span>
                <span className="text-emerald-400 font-mono">WhatsApp: +92 310 9328042</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onStartBrief}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-black font-extrabold text-sm shadow-xl shadow-amber-500/25 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Synthesize AI Scope Brief</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenEstimator}
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] border border-cyan-500/30 text-cyan-300 font-semibold text-sm shadow-lg transition-all cursor-pointer"
              >
                <span>Interactive Cost Estimator</span>
              </button>

              <a
                href="https://wa.me/923109328042?text=Hello%20Ihtisham%20Hussain%20Raja,%20I%20would%20like%20to%20discuss%20a%20new%20digital%20masterpiece%20project%20for%20our%20company."
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-3.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-500/30 text-emerald-400 text-sm font-mono font-medium transition-colors"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Direct WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Right Visual Cyber Architecture Card */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md rounded-2xl p-1 bg-gradient-to-b from-amber-500/30 via-cyan-500/20 to-emerald-500/30 shadow-2xl">
              <div className="rounded-[15px] bg-[#070A0F] p-6 space-y-5 border border-white/10">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-mono text-emerald-400 font-semibold">
                      ENGINEERING ENGINE V4.8
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    60 FPS • ZERO-TRUST
                  </span>
                </div>

                {/* Cyberpunk Visual Node Preview */}
                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 rounded-lg bg-[#0B0F17] border border-amber-500/20 flex items-center justify-between">
                    <span className="text-slate-400">FOUNDER & CHIEF ARCH:</span>
                    <span className="text-amber-400 font-bold">Ihtisham Hussain Raja</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#0B0F17] border border-cyan-500/20 flex items-center justify-between">
                    <span className="text-slate-400">AI CORE INTEGRATION:</span>
                    <span className="text-cyan-400 font-bold">Gemini 3.8 Flash SDK</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#0B0F17] border border-emerald-500/20 flex items-center justify-between">
                    <span className="text-slate-400">CROSS-PLATFORM STACK:</span>
                    <span className="text-emerald-400 font-bold">React Native + Next.js</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#0B0F17] border border-white/10 flex items-center justify-between">
                    <span className="text-slate-400">SECURITY COMPLIANCE:</span>
                    <span className="text-white font-bold">ISO 27001 / 256-Bit SSL</span>
                  </div>
                </div>

                {/* Quick Live Pipeline Tracker */}
                <div className="pt-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5 font-mono">
                    <span>Studio Workload Capacity</span>
                    <span className="text-amber-400 font-semibold">94% Active</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-amber-500 via-cyan-400 to-emerald-400 w-[94%]" />
                  </div>
                </div>

                <div className="text-[11px] text-center text-slate-400 italic">
                  “Average code costs millions in technical debt. We build zero-debt masterpieces.”
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-16 pt-10 border-t border-white/10">
          {showcase.hero.stats.map((stat, i) => (
            <div
              key={i}
              className="p-5 rounded-xl bg-[#070A0F]/80 border border-white/10 hover:border-amber-500/30 transition-all text-center lg:text-left"
            >
              <div className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200 font-mono">
                {stat.value}
              </div>
              <div className="text-xs font-bold text-white mt-1">{stat.label}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">{stat.description}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Core Services Grid */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-medium mb-3">
            <Zap className="w-3.5 h-3.5" /> SPECIALIZED PILLARS
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Six Enterprise Capabilities Engineered to Dominate
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-3">
            Every service is led by senior staff architects under Ihtisham Hussain Raja's direct oversight.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {showcase.services.map((service, idx) => (
            <div
              key={idx}
              className="group p-6 rounded-2xl bg-[#070A0F] border border-white/10 hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-500/5 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-[#0B0F17] border border-white/10 group-hover:border-cyan-500/30 transition-colors">
                    {getServiceIcon(idx)}
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/10">
                    PILLAR 0{idx + 1}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs font-mono text-amber-400 mt-0.5">{service.tagline}</p>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{service.description}</p>

                {/* Tech Stack Pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {service.techStack.map((tech, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 text-slate-300 border border-white/10"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                  {service.metricsHighlight}
                </span>
                <button
                  onClick={onOpenEstimator}
                  className="text-slate-400 group-hover:text-white flex items-center gap-1 font-semibold text-[11px] transition-colors"
                >
                  <span>Estimate</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-medium mb-3">
            <TrendingUp className="w-3.5 h-3.5" /> PROVEN ARCHITECTURE
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Case Studies in Hyper-Scale Execution
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-2">
            Measurable business transformation delivered for mission-critical client operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {showcase.caseStudies.map((cs, cIdx) => (
            <div
              key={cIdx}
              className="p-6 rounded-2xl bg-[#070A0F] border border-white/10 hover:border-amber-500/30 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-amber-400 font-semibold">
                    {cs.sector}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">VERIFIED</span>
                </div>

                <h3 className="text-base font-bold text-white">{cs.clientName}</h3>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400 font-medium">Challenge: </span>
                    <span className="text-slate-300">{cs.challenge}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Engineered Solution: </span>
                    <span className="text-slate-300">{cs.solution}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 pt-1">
                  {cs.techTags.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950/40 text-cyan-300 border border-cyan-800/40"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="text-[11px] text-slate-400">Business Outcome:</div>
                <div className="text-xs font-bold text-emerald-400 font-mono mt-0.5">
                  {cs.resultMetric}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Founder Statement Callout */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="p-8 rounded-2xl bg-gradient-to-r from-amber-950/30 via-[#0B0F17] to-cyan-950/30 border border-amber-500/40 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 p-1 flex-shrink-0 shadow-lg shadow-amber-500/20">
              <div className="w-full h-full bg-[#0B0F17] rounded-xl flex items-center justify-center text-amber-400 font-black text-2xl font-mono">
                IH
              </div>
            </div>

            <div className="space-y-2 text-center md:text-left">
              <div className="text-xs font-mono text-amber-400 font-semibold tracking-wider uppercase">
                Direct Founder Guarantee • Ihtisham Hussain Raja
              </div>
              <p className="text-sm sm:text-base text-slate-200 italic font-medium leading-relaxed">
                {showcase.founderStatement}
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-1 text-xs text-slate-400 font-mono">
                <span>WhatsApp: <strong className="text-emerald-400">+92 310 9328042</strong></span>
                <span>•</span>
                <span>Email: <strong className="text-cyan-400">ih.creativestudio.pk@gmail.com</strong></span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
