import React, { useState } from 'react';
import {
  Calculator,
  Check,
  ShieldCheck,
  Zap,
  Sparkles,
  ArrowRight,
  Clock,
  Coins,
  Globe,
  Layers,
  Smartphone,
  Cpu,
  Server,
} from 'lucide-react';
import { CurrencyCode } from '../../types';
import { formatCurrency } from '../../utils/currency';

interface ServiceEstimatorProps {
  currency: CurrencyCode;
  onApplyToBrief: (config: {
    platforms: string[];
    scale: string;
    addons: string[];
    estimatedTotal: number;
    timelineWeeks: string;
  }) => void;
}

interface PlatformOption {
  id: string;
  name: string;
  icon: any;
  basePriceUsd: number;
  baseWeeks: number;
}

interface AddonOption {
  id: string;
  name: string;
  description: string;
  priceUsd: number;
  additionalWeeks: number;
}

const PLATFORMS: PlatformOption[] = [
  { id: 'web', name: 'Web Next.js 14 / React 19', icon: Globe, basePriceUsd: 8500, baseWeeks: 4 },
  { id: 'mobile', name: 'Cross-Platform Mobile (iOS & Android)', icon: Smartphone, basePriceUsd: 9500, baseWeeks: 5 },
  { id: 'backend', name: 'Distributed Backend & Cloud Infra', icon: Server, basePriceUsd: 7000, baseWeeks: 4 },
  { id: 'ai', name: 'Gemini AI Agents & Automation Core', icon: Cpu, basePriceUsd: 6500, baseWeeks: 3 },
];

const SCALES = [
  { id: 'mvp', name: 'MVP / Fast Prototype', multiplier: 1.0, timelineModifier: 1.0, description: 'Quick-to-market validation for early traction' },
  { id: 'growth', name: 'Growth Startup (100K+ Users)', multiplier: 1.5, timelineModifier: 1.35, description: 'Scalable microservices with caching & high concurrency' },
  { id: 'enterprise', name: 'Enterprise Hyper-Scale (1M+ Users)', multiplier: 2.2, timelineModifier: 1.7, description: 'Multi-region fault-tolerant clusters, zero-trust & ISO compliance' },
];

const ADDONS: AddonOption[] = [
  {
    id: 'seo',
    name: 'SEO & Performance Architecture',
    description: 'Dynamic OpenGraph, JSON-LD microdata, Core Web Vitals 95+ score optimization',
    priceUsd: 2200,
    additionalWeeks: 1,
  },
  {
    id: 'ai_bot',
    name: 'Custom AI Assistant & Autonomous Agents',
    description: 'Gemini 3.8 Flash multi-turn context agent with vector memory & tool execution',
    priceUsd: 4800,
    additionalWeeks: 2,
  },
  {
    id: 'cyber',
    name: 'Cyber Hardening & Penetration Audit',
    description: 'OWASP Top 10 penetration sweep, WAF rate limiting, JWT + MFA and ISO 27001 report',
    priceUsd: 3900,
    additionalWeeks: 1.5,
  },
  {
    id: 'sla',
    name: '24/7 VIP SLA & Founder Priority Support',
    description: 'Sub-15 minute response time with direct WhatsApp hotline to Ihtisham Hussain Raja',
    priceUsd: 3000,
    additionalWeeks: 0,
  },
  {
    id: 'cdn',
    name: 'Multi-Region CDN & Cloudflare Edge R2',
    description: 'Global asset replication with sub-50ms edge latency worldwide',
    priceUsd: 1800,
    additionalWeeks: 1,
  },
];

export const ServiceEstimator: React.FC<ServiceEstimatorProps> = ({
  currency,
  onApplyToBrief,
}) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['web', 'mobile']);
  const [selectedScale, setSelectedScale] = useState<string>('growth');
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['cyber', 'ai_bot']);

  const togglePlatform = (id: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter((p) => p !== id) : prev) : [...prev, id]
    );
  };

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  // Compute pricing
  const currentScale = SCALES.find((s) => s.id === selectedScale) || SCALES[1];

  let rawPlatformCost = selectedPlatforms.reduce((acc, pId) => {
    const p = PLATFORMS.find((plat) => plat.id === pId);
    return acc + (p ? p.basePriceUsd : 0);
  }, 0);

  let rawPlatformWeeks = selectedPlatforms.reduce((acc, pId) => {
    const p = PLATFORMS.find((plat) => plat.id === pId);
    return Math.max(acc, p ? p.baseWeeks : 0);
  }, 0);

  const scaledCost = rawPlatformCost * currentScale.multiplier;
  const addonsCost = selectedAddons.reduce((acc, aId) => {
    const a = ADDONS.find((ad) => ad.id === aId);
    return acc + (a ? a.priceUsd : 0);
  }, 0);

  const addonsWeeks = selectedAddons.reduce((acc, aId) => {
    const a = ADDONS.find((ad) => ad.id === aId);
    return acc + (a ? a.additionalWeeks : 0);
  }, 0);

  const totalCostUsd = Math.round(scaledCost + addonsCost);
  const totalWeeks = Math.round(rawPlatformWeeks * currentScale.timelineModifier + addonsWeeks);
  const timelineWeeksString = `${totalWeeks - 1} - ${totalWeeks + 2} Weeks`;

  const handleApply = () => {
    onApplyToBrief({
      platforms: selectedPlatforms.map(
        (id) => PLATFORMS.find((p) => p.id === id)?.name || id
      ),
      scale: currentScale.name,
      addons: selectedAddons.map(
        (id) => ADDONS.find((a) => a.id === id)?.name || id
      ),
      estimatedTotal: totalCostUsd,
      timelineWeeks: timelineWeeksString,
    });
  };

  return (
    <section id="estimator-section" className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-medium mb-3">
          <Calculator className="w-3.5 h-3.5" /> PRECISION VALUATION ENGINE
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Interactive Service Customizer & Cost Estimator
        </h2>
        <p className="text-sm sm:text-base text-slate-400 mt-2">
          Calculate instant budgets and timelines converted in real-time across USD, PKR, EUR, and GBP.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Configuration Controls */}
        <div className="lg:col-span-8 space-y-8">
          {/* Step 1: Platforms Selection */}
          <div className="p-6 rounded-2xl bg-[#070A0F] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>1. Select Platform Targets</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                {selectedPlatforms.length} selected
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PLATFORMS.map((plat) => {
                const Icon = plat.icon;
                const isSelected = selectedPlatforms.includes(plat.id);
                return (
                  <div
                    key={plat.id}
                    onClick={() => togglePlatform(plat.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-cyan-950/30 border-cyan-500/50 shadow-md shadow-cyan-500/10'
                        : 'bg-[#0B0F17] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`p-2 rounded-lg ${
                            isSelected ? 'bg-cyan-500/20 text-cyan-300' : 'bg-white/5 text-slate-400'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-white">{plat.name}</span>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                          isSelected
                            ? 'bg-cyan-500 border-cyan-500 text-black'
                            : 'border-slate-600'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                    <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                      <span>Base Investment:</span>
                      <span className="text-amber-400 font-semibold">
                        {formatCurrency(plat.basePriceUsd, currency)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 2: Scale & Architectural Complexity */}
          <div className="p-6 rounded-2xl bg-[#070A0F] border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>2. System Scale & Concurrency Tier</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {SCALES.map((scale) => {
                const isSelected = selectedScale === scale.id;
                return (
                  <div
                    key={scale.id}
                    onClick={() => setSelectedScale(scale.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-amber-950/30 border-amber-500/60 shadow-md shadow-amber-500/10'
                        : 'bg-[#0B0F17] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-white">{scale.name}</span>
                      <div
                        className={`w-3.5 h-3.5 rounded-full border ${
                          isSelected ? 'bg-amber-400 border-amber-400' : 'border-slate-600'
                        }`}
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">{scale.description}</p>
                    <div className="mt-2 text-[10px] font-mono text-amber-400">
                      Multiplier: {scale.multiplier}x
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 3: Add-on Capabilities */}
          <div className="p-6 rounded-2xl bg-[#070A0F] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>3. Add-on Modules & Cyber Hardening</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                {selectedAddons.length} enabled
              </span>
            </div>

            <div className="space-y-3">
              {ADDONS.map((addon) => {
                const isChecked = selectedAddons.includes(addon.id);
                return (
                  <div
                    key={addon.id}
                    onClick={() => toggleAddon(addon.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-4 ${
                      isChecked
                        ? 'bg-emerald-950/25 border-emerald-500/40 shadow-sm'
                        : 'bg-[#0B0F17] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center border ${
                          isChecked
                            ? 'bg-emerald-500 border-emerald-500 text-black'
                            : 'border-slate-600'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{addon.name}</div>
                        <div className="text-[11px] text-slate-400">{addon.description}</div>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0 font-mono">
                      <div className="text-xs font-bold text-emerald-400">
                        +{formatCurrency(addon.priceUsd, currency)}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        +{addon.additionalWeeks} wk
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Live Estimate Summary Card */}
        <div className="lg:col-span-4 sticky top-24">
          <div className="rounded-2xl p-1 bg-gradient-to-b from-amber-500/30 via-cyan-500/20 to-emerald-500/30 shadow-2xl">
            <div className="rounded-[15px] bg-[#070A0F] p-6 space-y-6 border border-white/10">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                  ESTIMATE SUMMARY
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                  LIVE CONVERSION
                </span>
              </div>

              {/* Total Estimated Cost */}
              <div>
                <div className="text-xs text-slate-400 font-medium">Estimated Total Investment</div>
                <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-200 font-mono mt-1">
                  {formatCurrency(totalCostUsd, currency)}
                </div>
                <div className="text-[11px] text-slate-400 mt-1 font-mono">
                  Base USD: ${totalCostUsd.toLocaleString()} • Currency: {currency}
                </div>
              </div>

              {/* Estimated Timeline */}
              <div className="p-3.5 rounded-xl bg-[#0B0F17] border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs text-slate-300 font-medium">Target Delivery</span>
                </div>
                <span className="text-xs font-bold text-cyan-300 font-mono">
                  {timelineWeeksString}
                </span>
              </div>

              {/* Breakdown List */}
              <div className="space-y-2 text-xs font-mono border-t border-b border-white/10 py-3">
                <div className="flex justify-between text-slate-400">
                  <span>Selected Platforms:</span>
                  <span className="text-white">{selectedPlatforms.length}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Concurrency Tier:</span>
                  <span className="text-amber-400">{currentScale.name.split(' ')[0]}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Active Add-ons:</span>
                  <span className="text-emerald-400">{selectedAddons.length}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Founder Oversight:</span>
                  <span className="text-white">Included</span>
                </div>
              </div>

              {/* Founder SLA Assurance */}
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-xs text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="text-[11px]">
                  All projects signed at IH Creative Studio include <strong>Ihtisham Hussain Raja's</strong> 99.8% zero-defect SLA guarantee.
                </span>
              </div>

              {/* Transfer to Brief CTA */}
              <button
                onClick={handleApply}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-black font-extrabold text-xs shadow-xl shadow-amber-500/25 hover:opacity-95 transition-all cursor-pointer"
              >
                <span>Transfer to AI Scope Brief</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-[11px] text-center text-slate-400 font-mono">
                Questions? WhatsApp: <a href="https://wa.me/923109328042" target="_blank" rel="noreferrer" className="text-emerald-400 underline">+92 310 9328042</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
