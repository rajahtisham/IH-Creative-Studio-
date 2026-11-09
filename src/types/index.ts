export type AppRole = 'public' | 'founder' | 'team' | 'client';

export type CurrencyCode = 'USD' | 'PKR' | 'EUR' | 'GBP';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rate: number; // conversion from USD
  label: string;
}

export interface ServiceCard {
  id: string;
  title: string;
  tagline: string;
  description: string;
  iconName: string;
  techStack: string[];
  metricsHighlight: string;
  startingPriceUsd: number;
}

export interface CaseStudy {
  clientName: string;
  sector: string;
  challenge: string;
  solution: string;
  resultMetric: string;
  techTags: string[];
}

export interface ShowcaseData {
  hero: {
    badge: string;
    headlinePrefix: string;
    headlineGradient: string;
    subheadline: string;
    stats: { label: string; value: string; description: string }[];
  };
  services: {
    title: string;
    tagline: string;
    description: string;
    techStack: string[];
    metricsHighlight: string;
  }[];
  caseStudies: CaseStudy[];
  founderStatement: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  assignedTo?: string;
  updatedBy?: string;
  updatedAt: string;
}

export interface Task {
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

export interface FeedbackAnnotation {
  id: string;
  deliverableId: string;
  type: 'design_pin' | 'code_line' | 'video_timestamp';
  author: string;
  authorRole: string;
  targetRef: string; // e.g. "X: 74%, Y: 32%" or "Line 42" or "00:14"
  comment: string;
  status: 'open' | 'converted' | 'resolved';
  convertedTaskId?: string;
  createdAt: string;
}

export interface ActivePeer {
  id: string;
  name: string;
  role: string;
  color: string;
  activeField?: string;
}

export interface ProjectState {
  projectId: string;
  sprintDocumentation: string;
  tasks: Task[];
  feedbackAnnotations: FeedbackAnnotation[];
  lastModifiedBy: string;
  lastModifiedAt: string;
}

export interface ProposalResult {
  executiveSummary: string;
  architecturalRoadmap: {
    phase: string;
    title: string;
    durationWeeks: string;
    keyDeliverables: string[];
    techMilestones: string;
  }[];
  recommendedTechStack: {
    frontend: string[];
    backend: string[];
    databaseCloud: string[];
    aiAutomation: string[];
    cyberSecurity: string[];
  };
  strategicAddonsBreakdown: {
    title: string;
    rationale: string;
    impact: string;
  }[];
  estimatedInvestment: {
    minBudget: number;
    maxBudget: number;
    recommendedCurrency: string;
    estimatedWeeks: string;
    roiProjection: string;
  };
  founderGuarantee: string;
}

export interface KanbanProject {
  id: string;
  name: string;
  client: string;
  status: 'backlog' | 'design' | 'development' | 'qa_audit' | 'delivered';
  priority: 'medium' | 'high' | 'critical';
  budgetUsd: number;
  leadArchitect: string;
  progressPercent: number;
  deadline: string;
  techTags: string[];
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientCompany: string;
  clientEmail: string;
  amountUsd: number;
  date: string;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  items: { description: string; hours?: number; rate?: number; amount: number }[];
  milestoneRef: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  specialization: string;
  avatar: string;
  activeProjects: string[];
  utilizationRate: number; // percentage
  status: 'available' | 'in_sprint' | 'on_call';
}

export interface ChatMessage {
  id: string;
  sender: string;
  role: string;
  color: string;
  text: string;
  attachment?: { name: string; size: string; type: string };
  timestamp: string;
  isAiResponse?: boolean;
}

export interface TimeLogEntry {
  id: string;
  projectId: string;
  module: string;
  taskNotes: string;
  durationSeconds: number;
  loggedAt: string;
  developer: string;
  billable: boolean;
}
