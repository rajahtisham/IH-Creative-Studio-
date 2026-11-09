import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  Briefcase,
  Users,
  ShieldCheck,
  Plus,
  ArrowRight,
  FileText,
  Download,
  Filter,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
  Printer,
  ChevronRight,
  UserCheck,
} from 'lucide-react';
import { KanbanProject, Invoice, TeamMember, CurrencyCode } from '../../types';
import { formatCurrency } from '../../utils/currency';

interface FounderDashboardProps {
  currency: CurrencyCode;
}

const initialProjects: KanbanProject[] = [
  {
    id: 'PRJ-101',
    name: 'Apex Omni-Channel Trading & AI Engine',
    client: 'Apex Capital Ltd (Elena Rostova)',
    status: 'development',
    priority: 'critical',
    budgetUsd: 48000,
    leadArchitect: 'Ihtisham Hussain Raja',
    progressPercent: 78,
    deadline: '2026-11-28',
    techTags: ['React Native', 'Next.js 14', 'Gemini AI', 'PostgreSQL'],
  },
  {
    id: 'PRJ-102',
    name: 'Krypton Cyber Zero-Trust Threat Portal',
    client: 'Krypton Security Group',
    status: 'qa_audit',
    priority: 'high',
    budgetUsd: 36000,
    leadArchitect: 'Hamza Tariq',
    progressPercent: 92,
    deadline: '2026-11-18',
    techTags: ['TypeScript', 'WAF Gateway', 'Redis', 'Docker'],
  },
  {
    id: 'PRJ-103',
    name: 'Vanguard 3D Spatial Brand Identity',
    client: 'Vanguard Luxury Group',
    status: 'design',
    priority: 'medium',
    budgetUsd: 22000,
    leadArchitect: 'Ayesha Khan',
    progressPercent: 45,
    deadline: '2026-12-10',
    techTags: ['Three.js', 'Figma Tokens', 'Spline 3D', 'Motion'],
  },
  {
    id: 'PRJ-104',
    name: 'Sovereign Health Tele-Robotics API',
    client: 'Sovereign MedTech Corp',
    status: 'backlog',
    priority: 'high',
    budgetUsd: 55000,
    leadArchitect: 'Ihtisham Hussain Raja',
    progressPercent: 15,
    deadline: '2027-01-15',
    techTags: ['FastAPI', 'WebSockets', 'AWS ECS', 'ISO 27001'],
  },
  {
    id: 'PRJ-105',
    name: 'Aura Autonomous Fleet Logistics Platform',
    client: 'Aura Mobility Inc',
    status: 'delivered',
    priority: 'critical',
    budgetUsd: 62000,
    leadArchitect: 'Ihtisham Hussain Raja',
    progressPercent: 100,
    deadline: '2026-10-30',
    techTags: ['Cloudflare Edge', 'Redis', 'Multi-Currency', 'Python'],
  },
];

const initialInvoices: Invoice[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'IH-2026-089',
    clientName: 'Elena Rostova',
    clientCompany: 'Apex Capital Ltd',
    clientEmail: 'elena.rostova@apexcapital.io',
    amountUsd: 24000,
    date: '2026-11-01',
    dueDate: '2026-11-15',
    status: 'paid',
    milestoneRef: 'Milestone 2: High-Fi UI/UX & WebSocket Gateway Sign-off',
    items: [
      { description: 'Cross-Platform React Native Core Architecture', amount: 14000 },
      { description: 'Gemini 3.8 Flash Scope Synthesizer Integration', amount: 6000 },
      { description: 'ISO 27001 256-Bit SSL WAF Deployment', amount: 4000 },
    ],
  },
  {
    id: 'inv-2',
    invoiceNumber: 'IH-2026-090',
    clientName: 'Marcus Vance',
    clientCompany: 'Krypton Security Group',
    clientEmail: 'marcus@kryptonsec.io',
    amountUsd: 18000,
    date: '2026-11-04',
    dueDate: '2026-11-20',
    status: 'pending',
    milestoneRef: 'Milestone 3: Penetration Testing & Load Testing Finalization',
    items: [
      { description: 'OWASP Top 10 Automated Security Audit Harness', amount: 10000 },
      { description: 'Multi-Tenant RBAC Authorization Matrix', amount: 8000 },
    ],
  },
  {
    id: 'inv-3',
    invoiceNumber: 'IH-2026-091',
    clientName: 'Julian Croft',
    clientCompany: 'Vanguard Luxury Group',
    clientEmail: 'julian@vanguardlux.fr',
    amountUsd: 11000,
    date: '2026-10-25',
    dueDate: '2026-11-08',
    status: 'paid',
    milestoneRef: 'Milestone 1: 3D Brand Strategy & Three.js Shader Prototypes',
    items: [
      { description: 'Interactive WebGL 3D Showcase Shaders', amount: 7000 },
      { description: 'Design System & Typography Tokens', amount: 4000 },
    ],
  },
];

const teamRoster: TeamMember[] = [
  {
    id: 'tm-1',
    name: 'Ihtisham Hussain Raja',
    role: 'Founder & Managing Director',
    specialization: 'Principal Distributed Architecture, High-Security Systems, Strategic Growth',
    avatar: 'IH',
    activeProjects: ['PRJ-101', 'PRJ-104', 'PRJ-105'],
    utilizationRate: 95,
    status: 'in_sprint',
  },
  {
    id: 'tm-2',
    name: 'Hamza Tariq',
    role: 'Lead Full-Stack & Systems Engineer',
    specialization: 'React Native, Node.js TypeScript, WebSockets, Redis Gateway',
    avatar: 'HT',
    activeProjects: ['PRJ-101', 'PRJ-102'],
    utilizationRate: 88,
    status: 'in_sprint',
  },
  {
    id: 'tm-3',
    name: 'Ayesha Khan',
    role: 'Lead UI/UX Architect',
    specialization: 'Luxury Glassmorphism, 60 FPS Micro-Interactions, Figma Tokens',
    avatar: 'AK',
    activeProjects: ['PRJ-101', 'PRJ-103'],
    utilizationRate: 82,
    status: 'in_sprint',
  },
  {
    id: 'tm-4',
    name: 'Zain Ul Abideen',
    role: 'Senior QA & Cyber Security Auditor',
    specialization: 'OWASP Penetration Sweeps, ISO 27001 Certification, WAF Rules',
    avatar: 'ZA',
    activeProjects: ['PRJ-102', 'PRJ-104'],
    utilizationRate: 75,
    status: 'available',
  },
];

export const FounderDashboard: React.FC<FounderDashboardProps> = ({ currency }) => {
  const [activeTab, setActiveTab] = useState<'kanban' | 'ledger' | 'team'>('kanban');
  const [projects, setProjects] = useState<KanbanProject[]>(initialProjects);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);

  // New Project Form State
  const [newProjectName, setNewProjectName] = useState('');
  const [newClient, setNewClient] = useState('');
  const [newBudget, setNewBudget] = useState(35000);
  const [newPriority, setNewPriority] = useState<'medium' | 'high' | 'critical'>('high');

  const handleMoveProjectStatus = (projectId: string, nextStatus: KanbanProject['status']) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, status: nextStatus } : p))
    );
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName) return;

    const newProj: KanbanProject = {
      id: 'PRJ-' + Math.floor(100 + Math.random() * 900),
      name: newProjectName,
      client: newClient || 'Enterprise Client',
      status: 'backlog',
      priority: newPriority,
      budgetUsd: Number(newBudget),
      leadArchitect: 'Ihtisham Hussain Raja',
      progressPercent: 10,
      deadline: '2026-12-30',
      techTags: ['React Native', 'Node.js', 'Cyber Security'],
    };

    setProjects([newProj, ...projects]);
    setShowAddProjectModal(false);
    setNewProjectName('');
    setNewClient('');
  };

  const columns: { id: KanbanProject['status']; title: string; color: string }[] = [
    { id: 'backlog', title: '1. Backlog & Discovery', color: 'border-slate-600 text-slate-300' },
    { id: 'design', title: '2. UI/UX Design System', color: 'border-amber-500/50 text-amber-400' },
    { id: 'development', title: '3. Full-Stack Sprints', color: 'border-cyan-500/50 text-cyan-400' },
    { id: 'qa_audit', title: '4. QA & Cyber Audit', color: 'border-purple-500/50 text-purple-400' },
    { id: 'delivered', title: '5. Delivered & Launched', color: 'border-emerald-500/50 text-emerald-400' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      {/* Top Founder Executive Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-amber-950/30 via-[#0B0F17] to-cyan-950/30 border border-amber-500/40 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 p-1 flex-shrink-0 shadow-lg shadow-amber-500/20">
            <div className="w-full h-full bg-[#0B0F17] rounded-xl flex items-center justify-center font-black text-amber-400 text-xl font-mono">
              IH
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">
                Founder Business Control Suite
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                MANAGING DIRECTOR ACCESS
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Founder & Chief Architect: <strong className="text-white">Ihtisham Hussain Raja</strong> • WhatsApp Direct:{' '}
              <a href="https://wa.me/923109328042" target="_blank" rel="noreferrer" className="text-emerald-400 font-mono underline">
                +92 310 9328042
              </a>
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center bg-[#070A0F] p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setActiveTab('kanban')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'kanban'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Kanban Pipeline
          </button>
          <button
            onClick={() => setActiveTab('ledger')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'ledger'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Financial Ledger
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'team'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Team Allocation
          </button>
        </div>
      </div>

      {/* Executive KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#070A0F] border border-white/10 hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>MONTHLY RUN-RATE (MRR)</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono mt-2">
            {formatCurrency(128450, currency)}
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-mono">
            <TrendingUp className="w-3 h-3" /> +24.8% vs last month
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#070A0F] border border-white/10 hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>ACTIVE CLIENT PROJECTS</span>
            <Briefcase className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono mt-2">
            14 <span className="text-xs font-normal text-slate-400">active</span>
          </div>
          <div className="text-[11px] text-cyan-400 mt-1 font-mono">
            US, UK, UAE & Pakistan accounts
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#070A0F] border border-white/10 hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>CLIENT RETENTION RATE</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono mt-2">
            98.4%
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">
            Average LTV: $84,000 USD
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#070A0F] border border-white/10 hover:border-purple-500/40 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>CYBER SECURITY INDEX</span>
            <ShieldCheck className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-400 font-mono mt-2">
            99.8%
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">
            Zero-Trust & ISO 27001 Audited
          </div>
        </div>
      </div>

      {/* Tab 1: Interactive Project Kanban Pipeline */}
      {activeTab === 'kanban' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-amber-400" />
                <span>Interactive Project Kanban Pipeline</span>
              </h2>
              <p className="text-xs text-slate-400">
                Track status, budget allocations, and stage transitions across client engagements.
              </p>
            </div>

            <button
              onClick={() => setShowAddProjectModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-xs hover:opacity-95 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Client Project</span>
            </button>
          </div>

          {/* Kanban Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
            {columns.map((col) => {
              const colProjects = projects.filter((p) => p.status === col.id);
              return (
                <div
                  key={col.id}
                  className="rounded-2xl bg-[#070A0F] border border-white/10 p-3.5 flex flex-col justify-between min-h-[480px]"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <span className={`text-xs font-mono font-bold ${col.color}`}>
                        {col.title}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/5 text-slate-400">
                        {colProjects.length}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {colProjects.map((p) => (
                        <div
                          key={p.id}
                          className="p-3.5 rounded-xl bg-[#0B0F17] border border-white/10 hover:border-amber-500/40 shadow-sm transition-all space-y-2.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono text-slate-400">{p.id}</span>
                            <span
                              className={`text-[9px] font-mono px-1.5 py-0.2 rounded uppercase ${
                                p.priority === 'critical'
                                  ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                                  : p.priority === 'high'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                  : 'bg-slate-700 text-slate-300'
                              }`}
                            >
                              {p.priority}
                            </span>
                          </div>

                          <div className="text-xs font-bold text-white leading-snug">{p.name}</div>
                          <div className="text-[11px] text-slate-400 truncate">{p.client}</div>

                          {/* Progress Bar */}
                          <div>
                            <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                              <span>Progress</span>
                              <span className="text-white font-bold">{p.progressPercent}%</span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-cyan-400"
                                style={{ width: `${p.progressPercent}%` }}
                              />
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-[10px] font-mono pt-1 text-slate-400 border-t border-white/5">
                            <span>Valuation:</span>
                            <span className="text-amber-400 font-semibold">
                              {formatCurrency(p.budgetUsd, currency)}
                            </span>
                          </div>

                          {/* Quick Workflow Move Buttons */}
                          <div className="flex items-center justify-end gap-1 pt-1">
                            {col.id !== 'backlog' && (
                              <button
                                onClick={() => {
                                  const idx = columns.findIndex((c) => c.id === col.id);
                                  if (idx > 0) handleMoveProjectStatus(p.id, columns[idx - 1].id);
                                }}
                                className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300"
                                title="Move back"
                              >
                                ◀
                              </button>
                            )}
                            {col.id !== 'delivered' && (
                              <button
                                onClick={() => {
                                  const idx = columns.findIndex((c) => c.id === col.id);
                                  if (idx < columns.length - 1)
                                    handleMoveProjectStatus(p.id, columns[idx + 1].id);
                                }}
                                className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 font-bold"
                                title="Advance Stage"
                              >
                                Advance ▶
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 text-center text-[10px] text-slate-500 font-mono">
                    Total: {colProjects.length} items
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Financial & Invoice Settlement Ledger */}
      {activeTab === 'ledger' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>Financial & Invoice Settlement Ledger</span>
              </h2>
              <p className="text-xs text-slate-400">
                Itemized milestone billing, client retainers, and downloadable official PDF receipts.
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-[#070A0F] border border-white/10 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#0B0F17] text-slate-400 border-b border-white/10">
                  <tr>
                    <th className="p-4">INVOICE #</th>
                    <th className="p-4">CLIENT & ENTITY</th>
                    <th className="p-4">MILESTONE DETAILS</th>
                    <th className="p-4">AMOUNT</th>
                    <th className="p-4">STATUS</th>
                    <th className="p-4 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 font-bold text-white">{inv.invoiceNumber}</td>
                      <td className="p-4">
                        <div className="text-white font-medium">{inv.clientName}</div>
                        <div className="text-[11px] text-slate-400">{inv.clientCompany}</div>
                      </td>
                      <td className="p-4 text-slate-300 max-w-xs truncate">
                        {inv.milestoneRef}
                      </td>
                      <td className="p-4 font-bold text-amber-400">
                        {formatCurrency(inv.amountUsd, currency)}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                            inv.status === 'paid'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setSelectedInvoice(inv)}
                          className="flex items-center gap-1.5 ml-auto px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white text-[11px] border border-white/10 transition-colors cursor-pointer"
                        >
                          <FileText className="w-3 h-3 text-cyan-400" />
                          <span>View Receipt</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Team Assignment & Resource Allocation */}
      {activeTab === 'team' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>Team Assignment & Capacity Allocation</span>
            </h2>
            <p className="text-xs text-slate-400">
              Senior engineers and designers assigned to live enterprise client sprints.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teamRoster.map((member) => (
              <div
                key={member.id}
                className="p-5 rounded-2xl bg-[#070A0F] border border-white/10 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-amber-500 p-[1px]">
                      <div className="w-full h-full bg-[#0B0F17] rounded-[10px] flex items-center justify-center font-bold text-white font-mono text-sm">
                        {member.avatar}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{member.name}</div>
                      <div className="text-xs text-cyan-400 font-mono">{member.role}</div>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold ${
                      member.status === 'in_sprint'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {member.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="text-xs text-slate-300">{member.specialization}</div>

                <div>
                  <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                    <span>Sprint Capacity Utilization</span>
                    <span className="text-white font-bold">{member.utilizationRate}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-amber-500"
                      style={{ width: `${member.utilizationRate}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-white/5">
                  <span>Assigned Projects:</span>
                  <div className="flex gap-1.5">
                    {member.activeProjects.map((pId) => (
                      <span key={pId} className="px-1.5 py-0.5 rounded bg-white/5 text-amber-300">
                        {pId}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Printable PDF Receipt Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-[#0B0F17] border border-amber-500/40 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black font-mono">
                  IH
                </div>
                <div>
                  <div className="text-xs font-mono text-amber-400 font-bold uppercase">
                    OFFICIAL SETTLEMENT RECEIPT
                  </div>
                  <div className="text-base font-bold text-white">
                    {selectedInvoice.invoiceNumber}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" /> Print / Save PDF
                </button>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Receipt Details */}
            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <span className="text-slate-400">ISSUED BY:</span>
                <div className="text-white font-bold mt-0.5">IH Creative Studio</div>
                <div className="text-slate-300">Managing Director: Ihtisham Hussain Raja</div>
                <div className="text-slate-400">WhatsApp: +92 310 9328042</div>
                <div className="text-slate-400">ih.creativestudio.pk@gmail.com</div>
              </div>

              <div className="text-right">
                <span className="text-slate-400">BILLED TO:</span>
                <div className="text-white font-bold mt-0.5">{selectedInvoice.clientName}</div>
                <div className="text-slate-300">{selectedInvoice.clientCompany}</div>
                <div className="text-slate-400">{selectedInvoice.clientEmail}</div>
                <div className="text-emerald-400 mt-1 font-bold uppercase">
                  STATUS: {selectedInvoice.status}
                </div>
              </div>
            </div>

            {/* Milestone Description */}
            <div className="p-3 rounded-xl bg-[#070A0F] border border-white/10 text-xs">
              <span className="text-slate-400 font-mono">Milestone Scope: </span>
              <span className="text-white font-semibold">{selectedInvoice.milestoneRef}</span>
            </div>

            {/* Itemized Table */}
            <div className="border border-white/10 rounded-xl overflow-hidden font-mono text-xs">
              <div className="bg-[#070A0F] px-4 py-2 text-slate-400 flex justify-between">
                <span>ITEM DESCRIPTION</span>
                <span>AMOUNT</span>
              </div>
              <div className="divide-y divide-white/5">
                {selectedInvoice.items.map((item, i) => (
                  <div key={i} className="px-4 py-3 flex justify-between text-slate-200">
                    <span>{item.description}</span>
                    <span className="font-bold text-amber-400">
                      {formatCurrency(item.amount, currency)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="bg-[#070A0F] px-4 py-3 flex justify-between border-t border-white/10 font-bold text-sm">
                <span className="text-white">Total Settled:</span>
                <span className="text-amber-400">
                  {formatCurrency(selectedInvoice.amountUsd, currency)}
                </span>
              </div>
            </div>

            {/* Official Stamp & Signature */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs font-mono">
              <div className="p-2 rounded-lg border border-emerald-500/40 text-emerald-400 text-[10px] uppercase font-bold tracking-wider inline-flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> 256-Bit Cryptographically Verified
              </div>

              <div className="text-right">
                <div className="text-[11px] text-slate-400 italic">Digitally Signed by:</div>
                <div className="text-xs font-bold text-white mt-0.5">Ihtisham Hussain Raja</div>
                <div className="text-[10px] text-slate-500">Founder & Managing Director</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Project Modal */}
      {showAddProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-[#0B0F17] border border-amber-500/40 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white">Create New Client Project</h3>
              <button
                onClick={() => setShowAddProjectModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Project Name</label>
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="e.g. Zenith Autonomous Fleet AI"
                  className="w-full px-3 py-2 rounded-lg bg-[#070A0F] border border-white/10 text-white focus:border-amber-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Client Entity</label>
                <input
                  type="text"
                  value={newClient}
                  onChange={(e) => setNewClient(e.target.value)}
                  placeholder="e.g. Zenith Global Ventures"
                  className="w-full px-3 py-2 rounded-lg bg-[#070A0F] border border-white/10 text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Budget (USD)</label>
                  <input
                    type="number"
                    value={newBudget}
                    onChange={(e) => setNewBudget(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-[#070A0F] border border-white/10 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-[#070A0F] border border-white/10 text-white focus:border-amber-400 focus:outline-none"
                  >
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddProjectModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-amber-500 text-black font-bold"
                >
                  Create & Launch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
