import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Download,
  Send,
  Shield,
  Layers,
  Cpu,
  Calendar,
  DollarSign,
  PhoneCall,
  Loader2,
  FileText,
  Copy,
  Check,
} from 'lucide-react';
import { ProposalResult, CurrencyCode } from '../../types';
import { formatCurrency } from '../../utils/currency';

interface AiProposalIntakeProps {
  currency: CurrencyCode;
  initialConfig?: {
    platforms: string[];
    scale: string;
    addons: string[];
    estimatedTotal: number;
    timelineWeeks: string;
  };
  onSubmitToPipeline?: (proposal: ProposalResult, projectName: string) => void;
}

export const AiProposalIntake: React.FC<AiProposalIntakeProps> = ({
  currency,
  initialConfig,
  onSubmitToPipeline,
}) => {
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [proposalResult, setProposalResult] = useState<ProposalResult | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [submittedToStudio, setSubmittedToStudio] = useState<boolean>(false);

  // Form Fields
  const [projectName, setProjectName] = useState('Apex FinTech Next-Gen Portal');
  const [clientName, setClientName] = useState('Elena Rostova');
  const [clientEmail, setClientEmail] = useState('elena.rostova@apexcapital.io');
  const [industry, setIndustry] = useState('FinTech & Enterprise Asset Management');
  const [platforms, setPlatforms] = useState<string[]>(
    initialConfig?.platforms || ['Cross-Platform Mobile (iOS/Android)', 'Web Next.js 14']
  );
  const [coreObjectives, setCoreObjectives] = useState(
    'Real-time WebSocket trading telemetry, Gemini AI portfolio synthesis, and 256-bit zero-trust security architecture.'
  );
  const [techPreferences, setTechPreferences] = useState(
    'React Native Expo, Next.js 14, Node.js TypeScript, PostgreSQL, Redis, AWS ECS & Cloudflare Edge'
  );
  const [expectedUsers, setExpectedUsers] = useState(
    initialConfig?.scale || 'Growth Startup (100K+ Users)'
  );
  const [securityTier, setSecurityTier] = useState('Enterprise ISO 27001 / GDPR 256-Bit SSL Hardened');
  const [budgetRange, setBudgetRange] = useState(
    initialConfig ? `$${initialConfig.estimatedTotal.toLocaleString()} USD` : '$25,000 - $45,000 USD'
  );
  const [targetTimeline, setTargetTimeline] = useState(
    initialConfig?.timelineWeeks || '10 - 12 Weeks'
  );

  const handleNextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleGenerateProposal = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/proposals/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
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
          selectedAddons: initialConfig?.addons || [],
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setProposalResult(json.data);
      }
    } catch (err) {
      console.error('Error generating proposal:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyProposalToClipboard = () => {
    if (!proposalResult) return;
    const text = `IH CREATIVE STUDIO — PROPOSAL SPECIFICATION
Project: ${projectName}
Client: ${clientName} (${clientEmail})
Founder: Ihtisham Hussain Raja (+92 310 9328042)

EXECUTIVE SUMMARY:
${proposalResult.executiveSummary}

ESTIMATED TIMELINE: ${proposalResult.estimatedInvestment.estimatedWeeks}
BUDGET RANGE: $${proposalResult.estimatedInvestment.minBudget.toLocaleString()} - $${proposalResult.estimatedInvestment.maxBudget.toLocaleString()} USD

FOUNDER GUARANTEE:
${proposalResult.founderGuarantee}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendToWhatsApp = () => {
    if (!proposalResult) return;
    const text = encodeURIComponent(
      `Hello Ihtisham Hussain Raja,\n\nI have generated an AI Architecture Proposal for "${projectName}" with IH Creative Studio.\n\nClient: ${clientName} (${clientEmail})\nEstimated Scope: ${proposalResult.estimatedInvestment.estimatedWeeks}\nBudget Range: $${proposalResult.estimatedInvestment.minBudget.toLocaleString()} - $${proposalResult.estimatedInvestment.maxBudget.toLocaleString()} USD.\n\nLet's schedule an executive consultation.`
    );
    window.open(`https://wa.me/923109328042?text=${text}`, '_blank');
  };

  const handlePipelineSubmit = () => {
    if (proposalResult && onSubmitToPipeline) {
      onSubmitToPipeline(proposalResult, projectName);
      setSubmittedToStudio(true);
    }
  };

  return (
    <section id="proposal-intake-section" className="max-w-5xl mx-auto px-4 py-16">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5" /> AI ARCHITECTURE SYNTHESIZER
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Interactive Project Intake & AI Proposal Generator
        </h2>
        <p className="text-sm sm:text-base text-slate-400 mt-2">
          Harness Gemini 3.8 Flash to synthesize instant enterprise roadmap specs, tech stack allocations, and investment milestones.
        </p>
      </div>

      {!proposalResult ? (
        <div className="rounded-2xl bg-[#070A0F] border border-white/10 p-6 sm:p-8 shadow-2xl">
          {/* 3-Step Stepper Progress Bar */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
            {[
              { num: 1, label: 'Project & Client Scope' },
              { num: 2, label: 'Architecture & Security' },
              { num: 3, label: 'Valuation & Timeline' },
            ].map((s) => (
              <div
                key={s.num}
                className={`flex items-center gap-2.5 ${
                  step === s.num
                    ? 'text-amber-400 font-bold'
                    : step > s.num
                    ? 'text-emerald-400 font-medium'
                    : 'text-slate-500'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono border ${
                    step === s.num
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                      : step > s.num
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                      : 'border-slate-700 text-slate-500'
                  }`}
                >
                  {step > s.num ? '✓' : s.num}
                </div>
                <span className="hidden sm:inline text-xs">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Step 1: Project Details */}
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Step 1: Core Project Definition</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Project / Application Name
                  </label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="e.g. Sovereign AI Healthcare Platform"
                    className="w-full px-3 py-2.5 rounded-lg bg-[#0B0F17] border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Industry / Vertical
                  </label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g. FinTech, Defense SaaS, Autonomous AI"
                    className="w-full px-3 py-2.5 rounded-lg bg-[#0B0F17] border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Client Contact Name
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Elena Rostova"
                    className="w-full px-3 py-2.5 rounded-lg bg-[#0B0F17] border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Client Email
                  </label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="e.g. elena@apexcapital.io"
                    className="w-full px-3 py-2.5 rounded-lg bg-[#0B0F17] border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Core Objectives & Vision
                </label>
                <textarea
                  rows={3}
                  value={coreObjectives}
                  onChange={(e) => setCoreObjectives(e.target.value)}
                  placeholder="Articulate what business metrics you want this platform to achieve..."
                  className="w-full px-3 py-2.5 rounded-lg bg-[#0B0F17] border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Step 2: Architecture & Security */}
          {step === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-amber-400" />
                <span>Step 2: Architecture & Security Requirements</span>
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tech Stack Preferences
                </label>
                <input
                  type="text"
                  value={techPreferences}
                  onChange={(e) => setTechPreferences(e.target.value)}
                  placeholder="e.g. React Native, Next.js 14, Node.js, PostgreSQL, AWS"
                  className="w-full px-3 py-2.5 rounded-lg bg-[#0B0F17] border border-white/10 text-white text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Expected Concurrent User Scale
                  </label>
                  <select
                    value={expectedUsers}
                    onChange={(e) => setExpectedUsers(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-[#0B0F17] border border-white/10 text-white text-xs focus:border-amber-400 focus:outline-none"
                  >
                    <option value="MVP / Early Traction (10K Users)">MVP / Early Traction (10K Users)</option>
                    <option value="Growth Startup (100K+ Users)">Growth Startup (100K+ Users)</option>
                    <option value="Enterprise Hyper-Scale (1M+ Users)">Enterprise Hyper-Scale (1M+ Users)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Cyber Security Tier
                  </label>
                  <select
                    value={securityTier}
                    onChange={(e) => setSecurityTier(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-[#0B0F17] border border-white/10 text-white text-xs focus:border-amber-400 focus:outline-none"
                  >
                    <option value="Enterprise ISO 27001 / GDPR 256-Bit SSL Hardened">
                      Enterprise ISO 27001 / GDPR 256-Bit SSL Hardened
                    </option>
                    <option value="Sovereign Grade Zero-Trust Cryptographic Armor">
                      Sovereign Grade Zero-Trust Cryptographic Armor
                    </option>
                    <option value="Standard High-Security SSL & Rate Limiting">
                      Standard High-Security SSL & Rate Limiting
                    </option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Valuation & Timeline */}
          {step === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>Step 3: Timeline & Investment Brackets</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Target Budget Allocation
                  </label>
                  <input
                    type="text"
                    value={budgetRange}
                    onChange={(e) => setBudgetRange(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-[#0B0F17] border border-white/10 text-white text-xs focus:border-emerald-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Target Timeline
                  </label>
                  <input
                    type="text"
                    value={targetTimeline}
                    onChange={(e) => setTargetTimeline(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-[#0B0F17] border border-white/10 text-white text-xs focus:border-emerald-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/20 via-cyan-950/20 to-emerald-950/20 border border-white/10 text-xs text-slate-300 space-y-1">
                <div className="text-amber-400 font-semibold flex items-center gap-1.5">
                  <Shield className="w-4 h-4" /> Direct Founder Oversight
                </div>
                <div>
                  Upon proposal synthesis, your project brief is submitted directly to Managing Director <strong>Ihtisham Hussain Raja</strong> and our principal systems architecture council.
                </div>
              </div>
            </div>
          )}

          {/* Step Navigation Controls */}
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-white/10">
            {step > 1 ? (
              <button
                onClick={handlePrevStep}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                onClick={handleNextStep}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-colors cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleGenerateProposal}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-cyan-500 to-emerald-500 hover:opacity-95 text-black text-xs font-black shadow-xl shadow-amber-500/25 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                    <span>Synthesizing Architecture via Gemini 3.8 Flash...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-black" />
                    <span>Generate AI Proposal Spec</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Generated Proposal View */
        <div className="rounded-2xl bg-[#070A0F] border border-amber-500/40 p-6 sm:p-8 shadow-2xl space-y-8 animate-fadeIn">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-semibold uppercase">
                PROPOSAL SYNTHESIZED • GEMINI 3.8 FLASH
              </div>
              <h3 className="text-2xl font-black text-white mt-1">{projectName}</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Prepared for <strong className="text-white">{clientName}</strong> ({clientEmail}) • IH Creative Studio
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={copyProposalToClipboard}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B0F17] hover:bg-slate-800 border border-white/10 text-xs font-medium text-slate-300 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied Spec' : 'Copy'}</span>
              </button>

              <button
                onClick={handleSendToWhatsApp}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>WhatsApp Founder</span>
              </button>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono text-amber-400 uppercase tracking-wider font-semibold">
              Executive Architectural Summary
            </h4>
            <div className="p-4 rounded-xl bg-[#0B0F17] border border-white/10 text-xs text-slate-300 leading-relaxed whitespace-pre-line font-normal">
              {proposalResult.executiveSummary}
            </div>
          </div>

          {/* 4-Phase Roadmap */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
              Architectural Roadmap & Sprint Milestones
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {proposalResult.architecturalRoadmap.map((phase, pIdx) => (
                <div
                  key={pIdx}
                  className="p-4 rounded-xl bg-[#0B0F17] border border-white/10 space-y-2.5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-amber-400 font-bold">{phase.phase}</span>
                      <span className="text-slate-400 font-medium">{phase.durationWeeks}</span>
                    </div>
                    <div className="text-sm font-bold text-white mt-1">{phase.title}</div>

                    <ul className="mt-2 space-y-1.5 text-xs text-slate-300">
                      {phase.keyDeliverables.map((deliv, dIdx) => (
                        <li key={dIdx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span>{deliv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 mt-2 border-t border-white/5 text-[11px] text-slate-400">
                    <span className="text-slate-500 font-mono">Gatekeeper Milestone: </span>
                    {phase.techMilestones}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Tech Stack Matrix */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold">
              Recommended Technology Infrastructure
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              <div className="p-3 rounded-xl bg-[#0B0F17] border border-white/10">
                <div className="text-[11px] font-mono text-cyan-400 font-semibold mb-1">Frontend</div>
                <div className="flex flex-wrap gap-1">
                  {proposalResult.recommendedTechStack.frontend.map((t, idx) => (
                    <span key={idx} className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/5 text-slate-300">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#0B0F17] border border-white/10">
                <div className="text-[11px] font-mono text-amber-400 font-semibold mb-1">Backend</div>
                <div className="flex flex-wrap gap-1">
                  {proposalResult.recommendedTechStack.backend.map((t, idx) => (
                    <span key={idx} className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/5 text-slate-300">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#0B0F17] border border-white/10">
                <div className="text-[11px] font-mono text-emerald-400 font-semibold mb-1">Database & Cloud</div>
                <div className="flex flex-wrap gap-1">
                  {proposalResult.recommendedTechStack.databaseCloud.map((t, idx) => (
                    <span key={idx} className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/5 text-slate-300">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#0B0F17] border border-white/10">
                <div className="text-[11px] font-mono text-purple-400 font-semibold mb-1">AI Automation</div>
                <div className="flex flex-wrap gap-1">
                  {proposalResult.recommendedTechStack.aiAutomation.map((t, idx) => (
                    <span key={idx} className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/5 text-slate-300">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#0B0F17] border border-white/10">
                <div className="text-[11px] font-mono text-red-400 font-semibold mb-1">Cyber Hardening</div>
                <div className="flex flex-wrap gap-1">
                  {proposalResult.recommendedTechStack.cyberSecurity.map((t, idx) => (
                    <span key={idx} className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/5 text-slate-300">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Investment & Timeline Summary */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/30 via-slate-900 to-emerald-950/30 border border-amber-500/30 flex flex-wrap items-center justify-between gap-6">
            <div>
              <div className="text-xs text-slate-400 font-mono">Estimated Investment Range</div>
              <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono mt-0.5">
                {formatCurrency(proposalResult.estimatedInvestment.minBudget, currency)} — {formatCurrency(proposalResult.estimatedInvestment.maxBudget, currency)}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Target Timeline: <strong className="text-white">{proposalResult.estimatedInvestment.estimatedWeeks}</strong>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setProposalResult(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
              >
                Modify Brief
              </button>

              <button
                onClick={handlePipelineSubmit}
                disabled={submittedToStudio}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold text-xs shadow-lg shadow-amber-500/20 hover:opacity-95 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submittedToStudio ? 'Submitted to Pipeline!' : 'Submit to Studio Pipeline'}</span>
              </button>
            </div>
          </div>

          {/* Founder Guarantee */}
          <div className="p-4 rounded-xl bg-[#0B0F17] border border-white/10 text-xs italic text-slate-300 text-center font-mono">
            {proposalResult.founderGuarantee}
          </div>
        </div>
      )}
    </section>
  );
};
