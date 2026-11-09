import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Compass,
  CheckCircle2,
  Clock,
  Shield,
  PhoneCall,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Send,
  Eye,
  Check,
  Code,
  Film,
  Layout,
  CornerDownRight,
  ExternalLink,
  Lock,
  FileCheck,
} from 'lucide-react';
import { FeedbackAnnotation, CurrencyCode } from '../../types';

interface ClientPortalProps {
  feedbackAnnotations: FeedbackAnnotation[];
  onAddFeedback: (feedback: Partial<FeedbackAnnotation>) => void;
  onConvertFeedbackToTask: (feedbackId: string) => void;
  currency: CurrencyCode;
}

export const ClientPortal: React.FC<ClientPortalProps> = ({
  feedbackAnnotations,
  onAddFeedback,
  onConvertFeedbackToTask,
  currency,
}) => {
  const [activePhase, setActivePhase] = useState<number>(3);
  const [deliverableMode, setDeliverableMode] = useState<'design' | 'code' | 'video'>('design');
  const [approvedMilestones, setApprovedMilestones] = useState<number[]>([1, 2]);
  const [showApprovalSuccess, setShowApprovalSuccess] = useState(false);
  const [mfaEnabled, setMfaEnabled] = useState(true);

  // Design Pin Feedback Form State
  const [pendingPin, setPendingPin] = useState<{ x: number; y: number } | null>(null);
  const [pinComment, setPinComment] = useState('');

  // Code Line Comment State
  const [selectedCodeLine, setSelectedCodeLine] = useState<number | null>(42);
  const [codeComment, setCodeComment] = useState('');

  // Video Timestamp State
  const [videoTimestamp, setVideoTimestamp] = useState('00:14');
  const [videoComment, setVideoComment] = useState('');

  const roadmapPhases = [
    {
      id: 1,
      phase: 'Phase 01',
      title: 'Discovery & Threat Modeling',
      status: 'Completed',
      percent: 100,
      deliverables: ['System Architecture Diagram', 'Entity Relations', 'ISO 27001 Matrix'],
      eta: 'Completed Oct 28',
    },
    {
      id: 2,
      phase: 'Phase 02',
      title: 'High-Fi UI/UX & Prototypes',
      status: 'Completed',
      percent: 100,
      deliverables: ['Figma Tokens', '60 FPS Micro-Interactions', 'Component Library'],
      eta: 'Completed Nov 04',
    },
    {
      id: 3,
      phase: 'Phase 03',
      title: 'Distributed Core & WebSockets',
      status: 'In Progress (Active)',
      percent: 78,
      deliverables: ['Cross-Platform Mobile App', 'Real-Time Sync Hub', 'Gemini AI Pipeline'],
      eta: 'Target: Nov 28',
    },
    {
      id: 4,
      phase: 'Phase 04',
      title: 'Cyber Audit & Production Launch',
      status: 'Upcoming',
      percent: 0,
      deliverables: ['OWASP Pen-Test Audit', 'Cloudflare WAF Cutover', 'Founder Handover'],
      eta: 'Target: Dec 12',
    },
  ];

  // Canvas Click to drop pinpoint annotation on design
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    setPendingPin({ x, y });
  };

  const handleSavePinFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingPin || !pinComment.trim()) return;

    onAddFeedback({
      deliverableId: 'DELIV-01',
      type: 'design_pin',
      author: 'Elena Rostova (Client VIP)',
      authorRole: 'Chief Product Officer, Apex Capital',
      targetRef: `X: ${pendingPin.x}%, Y: ${pendingPin.y}%`,
      comment: pinComment.trim(),
    });

    setPendingPin(null);
    setPinComment('');
  };

  const handleSaveCodeFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCodeLine || !codeComment.trim()) return;

    onAddFeedback({
      deliverableId: 'DELIV-02',
      type: 'code_line',
      author: 'Elena Rostova (Client VIP)',
      authorRole: 'Chief Product Officer, Apex Capital',
      targetRef: `Line ${selectedCodeLine} (RateLimiter.ts)`,
      comment: codeComment.trim(),
    });

    setCodeComment('');
  };

  const handleSaveVideoFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoComment.trim()) return;

    onAddFeedback({
      deliverableId: 'DELIV-03',
      type: 'video_timestamp',
      author: 'Elena Rostova (Client VIP)',
      authorRole: 'Chief Product Officer, Apex Capital',
      targetRef: `${videoTimestamp} (Brand Video)`,
      comment: videoComment.trim(),
    });

    setVideoComment('');
  };

  const handleApproveMilestone = () => {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F59E0B', '#06B6D4', '#10B981'],
    });

    if (!approvedMilestones.includes(activePhase)) {
      setApprovedMilestones([...approvedMilestones, activePhase]);
    }
    setShowApprovalSuccess(true);
    setTimeout(() => setShowApprovalSuccess(false), 4000);
  };

  const sampleCodeSnippet = [
    { line: 38, code: 'import { Redis } from "@upstash/redis";' },
    { line: 39, code: 'import { Request, Response, NextFunction } from "express";' },
    { line: 40, code: '' },
    { line: 41, code: '// Rate Limiter sliding window configuration' },
    { line: 42, code: 'const LIMITER_MAX_BURST = 5000; // Peak queries allowed per sec' },
    { line: 43, code: 'const WINDOW_SECONDS = 1; // 1-second rolling bucket' },
    { line: 44, code: '' },
    { line: 45, code: 'export async function verifyRateLimit(req: Request, res: Response, next: NextFunction) {' },
    { line: 46, code: '  const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;' },
    { line: 47, code: '  const currentTokens = await redis.incr(`ratelimit:${clientIp}`);' },
    { line: 48, code: '  if (currentTokens > LIMITER_MAX_BURST) {' },
    { line: 49, code: '    return res.status(429).json({ error: "Rate limit exceeded. WAF protection active." });' },
    { line: 50, code: '  }' },
    { line: 51, code: '  return next();' },
    { line: 52, code: '}' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      {/* Top Client Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-emerald-950/30 via-[#0B0F17] to-cyan-950/30 border border-emerald-500/40 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">
                Client Experience Portal
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                VIP APEX CAPITAL ACCOUNT
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Client Principal: <strong>Elena Rostova (CPO)</strong> • Managing Director in Charge:{' '}
              <strong className="text-amber-400">Ihtisham Hussain Raja</strong>
            </p>
          </div>
        </div>

        {/* VIP Founder Line Hotline CTA */}
        <div className="flex items-center gap-3">
          <a
            href="https://wa.me/923109328042?text=Hello%20Ihtisham%20Hussain%20Raja,%20I%20am%20calling%20from%20the%20Client%20Portal%20regarding%20our%20active%20Apex%20milestones."
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold text-xs shadow-lg shadow-amber-500/20 hover:scale-105 transition-all"
          >
            <PhoneCall className="w-4 h-4" />
            <span>VIP Hotline to Founder Raja</span>
          </a>

          <div className="hidden sm:flex items-center gap-2 p-2 rounded-xl bg-[#070A0F] border border-white/10 text-xs font-mono">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-300">MFA Active</span>
          </div>
        </div>
      </div>

      {/* 1. Milestone Roadmap Stepper */}
      <div className="p-6 rounded-2xl bg-[#070A0F] border border-white/10 space-y-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Project Milestone Roadmap Stepper</span>
            </h2>
            <p className="text-xs text-slate-400">
              Real-time progress verified across each architectural deployment phase.
            </p>
          </div>

          <span className="text-xs font-mono text-emerald-400 font-bold">
            Overall Health: 99.8% On Track
          </span>
        </div>

        {/* Stepper Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {roadmapPhases.map((phase) => {
            const isSelected = activePhase === phase.id;
            const isApproved = approvedMilestones.includes(phase.id);

            return (
              <div
                key={phase.id}
                onClick={() => setActivePhase(phase.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-cyan-950/30 border-cyan-500/60 shadow-md shadow-cyan-500/10'
                    : 'bg-[#0B0F17] border-white/10 hover:border-white/20'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                    <span className="text-amber-400 font-bold">{phase.phase}</span>
                    {isApproved ? (
                      <span className="text-emerald-400 flex items-center gap-1 text-[10px]">
                        <CheckCircle2 className="w-3 h-3" /> Signed Off
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[10px]">{phase.status}</span>
                    )}
                  </div>

                  <h3 className="text-xs font-bold text-white leading-snug">{phase.title}</h3>

                  <ul className="mt-2.5 space-y-1 text-[11px] text-slate-400 font-mono">
                    {phase.deliverables.map((d, i) => (
                      <li key={i} className="truncate">• {d}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-slate-500">{phase.eta}</span>
                  <span className="text-cyan-400 font-bold">{phase.percent}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Granular Client Deliverable Review & Feedback Canvas */}
      <div className="p-6 rounded-2xl bg-[#070A0F] border border-cyan-500/30 space-y-6 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-mono font-bold uppercase">
              GRANULAR DELIVERABLE FEEDBACK HARNESS
            </div>
            <h2 className="text-lg font-bold text-white mt-1">
              Interactive Sign-Off & Pinpoint Feedback
            </h2>
            <p className="text-xs text-slate-400">
              Click directly on visual elements, code lines, or video frames to annotate. Comments convert automatically into sprint tasks.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center bg-[#0B0F17] p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setDeliverableMode('design')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                deliverableMode === 'design'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layout className="w-3.5 h-3.5" />
              <span>UI Design Pins</span>
            </button>

            <button
              onClick={() => setDeliverableMode('code')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                deliverableMode === 'code'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Code Snippet Review</span>
            </button>

            <button
              onClick={() => setDeliverableMode('video')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                deliverableMode === 'video'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Video / 3D Scrubber</span>
            </button>
          </div>
        </div>

        {/* View A: Design Pinpoint Canvas */}
        {deliverableMode === 'design' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Click anywhere on the mockup preview to drop a pin and leave feedback:</span>
              <span className="text-amber-400 font-mono">
                {feedbackAnnotations.filter((f) => f.type === 'design_pin').length} pins placed
              </span>
            </div>

            {/* Interactive Mockup Canvas */}
            <div
              onClick={handleCanvasClick}
              className="relative w-full h-80 rounded-2xl bg-gradient-to-br from-[#0B0F17] via-[#070A0F] to-[#0f172a] border border-white/10 p-6 flex flex-col justify-between overflow-hidden cursor-crosshair select-none group shadow-inner"
            >
              {/* Background Mockup Elements */}
              <div className="absolute inset-0 p-6 pointer-events-none opacity-85">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    <span className="text-[11px] font-mono text-slate-400 ml-2">
                      Apex Trading Portal — Dark Cyberpunk Mode
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800">
                    60 FPS MOTION
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                    <div className="text-[10px] text-slate-400 font-mono">PORTFOLIO VALUATION</div>
                    <div className="text-xl font-mono font-bold text-amber-400">$2,480,950</div>
                    <div className="text-[10px] text-emerald-400 font-mono">+18.4% today</div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                    <div className="text-[10px] text-slate-400 font-mono">GEMINI AI SIGNAL</div>
                    <div className="text-sm font-bold text-cyan-300">Bullish Liquidity Matrix</div>
                    <div className="text-[10px] text-slate-400 font-mono">Confidence: 96.2%</div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                    <div className="text-[10px] text-slate-400 font-mono">INSTANT ORDER CTA</div>
                    <div className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-center text-xs">
                      Execute Swap
                    </div>
                  </div>
                </div>
              </div>

              {/* Render Existing Pins */}
              {feedbackAnnotations
                .filter((f) => f.type === 'design_pin')
                .map((pin) => {
                  const parts = pin.targetRef.match(/X:\s*(\d+)%,\s*Y:\s*(\d+)%/);
                  const x = parts ? Number(parts[1]) : 50;
                  const y = parts ? Number(parts[2]) : 50;

                  return (
                    <div
                      key={pin.id}
                      style={{ left: `${x}%`, top: `${y}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group/pin"
                    >
                      <div className="relative flex items-center justify-center">
                        <span className="w-5 h-5 rounded-full bg-amber-500 animate-ping absolute opacity-75" />
                        <div className="w-6 h-6 rounded-full bg-amber-500 text-black font-bold text-[10px] flex items-center justify-center shadow-lg border border-white">
                          ●
                        </div>
                      </div>

                      {/* Tooltip on Hover */}
                      <div className="hidden group-hover/pin:block absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-56 p-2.5 rounded-xl bg-[#0B0F17] border border-amber-500/40 text-[11px] shadow-2xl z-30 pointer-events-auto">
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-1">
                          <span className="text-amber-400 font-bold">{pin.id}</span>
                          <span>{pin.targetRef}</span>
                        </div>
                        <p className="text-white font-medium">{pin.comment}</p>
                        {pin.status === 'converted' && (
                          <div className="mt-1.5 text-[9px] text-emerald-400 font-mono flex items-center gap-1">
                            <Check className="w-2.5 h-2.5" /> Converted to Sprint Task ({pin.convertedTaskId})
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

              {/* Pending Pin Marker */}
              {pendingPin && (
                <div
                  style={{ left: `${pendingPin.x}%`, top: `${pendingPin.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                >
                  <div className="w-6 h-6 rounded-full bg-cyan-400 text-black font-bold text-[10px] flex items-center justify-center shadow-lg border border-white animate-bounce">
                    ?
                  </div>
                </div>
              )}
            </div>

            {/* Pin Feedback Input Form */}
            {pendingPin && (
              <form
                onSubmit={handleSavePinFeedback}
                className="p-4 rounded-xl bg-[#0B0F17] border border-cyan-500/40 space-y-3 animate-fadeIn"
              >
                <div className="flex items-center justify-between text-xs font-mono text-cyan-400 font-semibold">
                  <span>Annotation Pin Target: X: {pendingPin.x}%, Y: {pendingPin.y}%</span>
                  <button
                    type="button"
                    onClick={() => setPendingPin(null)}
                    className="text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>

                <input
                  type="text"
                  value={pinComment}
                  onChange={(e) => setPinComment(e.target.value)}
                  placeholder="e.g. Elevate glow contrast on this CTA button to match electric gold..."
                  className="w-full px-3 py-2 rounded-lg bg-[#070A0F] border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none"
                  autoFocus
                  required
                />

                <div className="flex justify-end gap-2">
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400 transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Drop Pin & Notify Team</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* View B: Code Line Review Canvas */}
        {deliverableMode === 'code' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Click any line number to annotate backend architecture & security logic:</span>
              <span className="text-cyan-400 font-mono">File: RateLimiter.ts (Core WAF)</span>
            </div>

            {/* Code Inspector */}
            <div className="rounded-xl bg-[#0B0F17] border border-white/10 font-mono text-xs overflow-hidden">
              <div className="bg-[#070A0F] px-4 py-2 text-[11px] text-slate-400 border-b border-white/5 flex items-center justify-between">
                <span>src/infra/security/RateLimiter.ts</span>
                <span className="text-emerald-400 text-[10px]">256-BIT SSL HARDENED</span>
              </div>

              <div className="p-3 divide-y divide-white/[0.02]">
                {sampleCodeSnippet.map((row) => {
                  const isSelected = selectedCodeLine === row.line;
                  return (
                    <div
                      key={row.line}
                      onClick={() => setSelectedCodeLine(row.line)}
                      className={`flex items-center gap-4 py-1 px-2 rounded cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-cyan-950/40 text-cyan-300'
                          : 'hover:bg-white/[0.03] text-slate-300'
                      }`}
                    >
                      <span className="w-8 text-right text-slate-600 select-none">
                        {row.line}
                      </span>
                      <span className="flex-1 whitespace-pre">{row.code}</span>
                      {row.line === 42 && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-sans">
                          1 Comment
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Code Feedback Form */}
            {selectedCodeLine && (
              <form
                onSubmit={handleSaveCodeFeedback}
                className="p-4 rounded-xl bg-[#0B0F17] border border-cyan-500/40 space-y-3"
              >
                <div className="text-xs font-mono text-cyan-400 font-semibold">
                  Annotate Line {selectedCodeLine} in RateLimiter.ts
                </div>

                <input
                  type="text"
                  value={codeComment}
                  onChange={(e) => setCodeComment(e.target.value)}
                  placeholder="e.g. Ensure 5000 burst capacity handles high-frequency trade spikes without 429 drops..."
                  className="w-full px-3 py-2 rounded-lg bg-[#070A0F] border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none"
                  required
                />

                <div className="flex justify-end gap-2">
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-cyan-500 text-black font-bold text-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Code Annotation</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* View C: Video / 3D Scrubber Canvas */}
        {deliverableMode === 'video' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Timestamp scrubber for 3D Brand motion assets:</span>
              <span className="text-purple-400 font-mono">Current Frame: {videoTimestamp}</span>
            </div>

            <div className="p-6 rounded-2xl bg-[#0B0F17] border border-white/10 text-center space-y-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 p-1 mx-auto shadow-xl">
                <div className="w-full h-full bg-[#070A0F] rounded-xl flex items-center justify-center text-purple-400 font-mono font-bold text-xl">
                  3D
                </div>
              </div>
              <div className="text-sm font-bold text-white">
                Apex Holographic Cyber Monogram Render (4K 60 FPS)
              </div>

              {/* Scrubber Bar */}
              <div className="max-w-md mx-auto space-y-2">
                <input
                  type="range"
                  min="0"
                  max="60"
                  defaultValue="14"
                  onChange={(e) => {
                    const secs = Number(e.target.value);
                    const formatted = `00:${secs.toString().padStart(2, '0')}`;
                    setVideoTimestamp(formatted);
                  }}
                  className="w-full accent-purple-400 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>00:00</span>
                  <span className="text-purple-400 font-bold">{videoTimestamp}</span>
                  <span>01:00</span>
                </div>
              </div>
            </div>

            {/* Video Feedback Form */}
            <form
              onSubmit={handleSaveVideoFeedback}
              className="p-4 rounded-xl bg-[#0B0F17] border border-purple-500/40 space-y-3"
            >
              <div className="text-xs font-mono text-purple-400 font-semibold">
                Annotate Video at Timestamp: {videoTimestamp}
              </div>

              <input
                type="text"
                value={videoComment}
                onChange={(e) => setVideoComment(e.target.value)}
                placeholder="e.g. Smooth the rotation curve slightly slower at this apex moment..."
                className="w-full px-3 py-2 rounded-lg bg-[#070A0F] border border-white/10 text-white text-xs focus:border-purple-400 focus:outline-none"
                required
              />

              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-purple-500 text-white font-bold text-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Video Timestamp Comment</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Existing Annotations & 1-Click Sprint Task Conversion List */}
        <div className="space-y-3 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CornerDownRight className="w-4 h-4 text-amber-400" />
              <span>Granular Feedback Logs & Sprint Task Converter</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">
              {feedbackAnnotations.length} total client annotations
            </span>
          </div>

          <div className="space-y-3">
            {feedbackAnnotations.map((fb) => (
              <div
                key={fb.id}
                className="p-4 rounded-xl bg-[#0B0F17] border border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-amber-400 font-bold">{fb.id}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-cyan-400 font-semibold">{fb.targetRef}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400 text-[11px]">{fb.author}</span>
                  </div>
                  <p className="text-slate-200 font-medium">"{fb.comment}"</p>
                </div>

                <div className="flex items-center gap-2">
                  {fb.status === 'converted' ? (
                    <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-mono flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Task #{fb.convertedTaskId} Assigned</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => onConvertFeedbackToTask(fb.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-md shadow-amber-500/10 transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Convert to Actionable Sprint Task</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. One-Click Deliverable Review & Approval Action */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/30 via-slate-900 to-amber-950/30 border border-emerald-500/40 flex flex-wrap items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase">
                FORMAL CLIENT SIGN-OFF
              </span>
              <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                256-BIT CRYPTOGRAPHIC VERIFICATION
              </span>
            </div>
            <h3 className="text-lg font-black text-white mt-1">
              Approve Phase {activePhase} Deliverables & Advance Sprints
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Signs off on current design systems and code builds for Elena Rostova (Apex Capital).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleApproveMilestone}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-500 text-black font-extrabold text-xs shadow-xl shadow-emerald-500/25 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 fill-current text-black" />
              <span>Sign Off & Approve Deliverable</span>
            </button>
          </div>
        </div>

        {showApprovalSuccess && (
          <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/60 text-emerald-300 text-xs flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>
                <strong>Deliverable Officially Approved!</strong> Notification transmitted to Founder Ihtisham Hussain Raja and sprint engineering team.
              </span>
            </div>
            <span className="font-mono text-[11px] text-emerald-400">
              HASH: #IH-APEX-9981-VERIFIED
            </span>
          </div>
        )}
      </div>

      {/* Security & Quality Standards Verification Card */}
      <div className="p-6 rounded-2xl bg-[#070A0F] border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Security & Quality Standards Verification</h3>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold">
            Audit Level: Bank-Grade Sovereign
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-[#0B0F17] border border-white/5 space-y-1">
            <div className="text-slate-400">ENCRYPTION PROTOCOL</div>
            <div className="text-white font-bold">256-Bit SSL/TLS End-to-End</div>
            <div className="text-[10px] text-emerald-400">Strict Transport Security Active</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0B0F17] border border-white/5 space-y-1">
            <div className="text-slate-400">AUTHENTICATION TIER</div>
            <div className="text-white font-bold">JWT + TOTP Multi-Factor (MFA)</div>
            <div className="text-[10px] text-cyan-400">Role-Based Access Control (RBAC)</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0B0F17] border border-white/5 space-y-1">
            <div className="text-slate-400">COMPLIANCE CERTIFICATION</div>
            <div className="text-white font-bold">ISO 27001 & GDPR Hardened</div>
            <div className="text-[10px] text-purple-400">Zero-Trust WAF Audited</div>
          </div>
        </div>
      </div>
    </div>
  );
};
