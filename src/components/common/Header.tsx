import React from 'react';
import {
  Globe,
  ShieldCheck,
  Briefcase,
  Users,
  Compass,
  MessageSquare,
  Mail,
  Zap,
  PhoneCall,
} from 'lucide-react';
import { AppRole, CurrencyCode } from '../../types';
import { CURRENCIES } from '../../utils/currency';

interface HeaderProps {
  currentRole: AppRole;
  onSelectRole: (role: AppRole) => void;
  currency: CurrencyCode;
  onSelectCurrency: (currency: CurrencyCode) => void;
  isWsConnected: boolean;
  activePeersCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onSelectRole,
  currency,
  onSelectCurrency,
  isWsConnected,
  activePeersCount,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#0B0F17]/90 backdrop-blur-xl border-b border-white/10 transition-all">
      {/* Top Cyberpunk Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-cyan-500/10 to-emerald-500/10 border-b border-white/5 px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-amber-400 font-mono font-semibold tracking-wide">
              <Zap className="w-3.5 h-3.5" /> IH CREATIVE STUDIO
            </span>
            <span className="hidden sm:inline text-slate-400 text-[11px]">|</span>
            <span className="hidden sm:inline text-slate-300">
              Managing Director: <strong className="text-white">Ihtisham Hussain Raja</strong>
            </span>
            <span className="hidden md:inline text-slate-400 text-[11px]">•</span>
            <span className="hidden md:inline text-emerald-400 font-mono text-[11px] flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> ISO 27001 & 256-Bit SSL Hardened
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Live WebSocket Status */}
            <div className="flex items-center gap-1.5 text-[11px] font-mono">
              <span
                className={`w-2 h-2 rounded-full ${
                  isWsConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
              <span className="text-slate-400 hidden sm:inline">
                {isWsConnected ? `Real-Time Sync (${activePeersCount} peers online)` : 'Sync Ready'}
              </span>
            </div>

            {/* Direct Contact Links */}
            <div className="flex items-center gap-2">
              <a
                href="https://wa.me/923109328042?text=Hello%20Ihtisham%20Hussain%20Raja,%20I%20am%20inquirying%20about%20an%20enterprise%20project%20at%20IH%20Creative%20Studio."
                target="_blank"
                rel="noreferrer"
                className="text-emerald-400 hover:text-emerald-300 font-mono flex items-center gap-1 text-[11px] transition-colors"
                title="WhatsApp Direct: +92 310 9328042"
              >
                <MessageSquare className="w-3 h-3" />
                <span className="hidden sm:inline">+92 310 9328042</span>
              </a>
              <span className="text-slate-600">/</span>
              <a
                href="mailto:ih.creativestudio.pk@gmail.com"
                className="text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1 text-[11px] transition-colors"
                title="Email Desk: ih.creativestudio.pk@gmail.com"
              >
                <Mail className="w-3 h-3" />
                <span className="hidden sm:inline">Email Desk</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand Monogram & Name */}
        <div
          onClick={() => onSelectRole('public')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-cyan-500 to-emerald-500 p-[1.5px] shadow-lg group-hover:shadow-amber-500/25 transition-all">
            <div className="w-full h-full bg-[#0B0F17] rounded-[10px] flex items-center justify-center font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-cyan-300 to-emerald-400 text-lg">
              IH
            </div>
          </div>
          <div>
            <div className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5 leading-none">
              IH CREATIVE STUDIO
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/40">
                PRO
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Enterprise Digital Agency • Founder: <span className="text-slate-300 font-medium">Ihtisham H. Raja</span>
            </div>
          </div>
        </div>

        {/* Role Switcher Pills */}
        <div className="hidden lg:flex items-center bg-[#070A0F] p-1 rounded-xl border border-white/10 shadow-inner">
          <button
            onClick={() => onSelectRole('public')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentRole === 'public'
                ? 'bg-gradient-to-r from-amber-500/20 to-amber-500/10 text-amber-300 border border-amber-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Public Showcase</span>
          </button>

          <button
            onClick={() => onSelectRole('founder')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentRole === 'founder'
                ? 'bg-gradient-to-r from-amber-500/20 to-amber-500/10 text-amber-300 border border-amber-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Founder Suite</span>
          </button>

          <button
            onClick={() => onSelectRole('team')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentRole === 'team'
                ? 'bg-gradient-to-r from-cyan-500/20 to-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Team Workspace</span>
          </button>

          <button
            onClick={() => onSelectRole('client')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentRole === 'client'
                ? 'bg-gradient-to-r from-emerald-500/20 to-emerald-500/10 text-emerald-300 border border-emerald-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Client Portal</span>
          </button>
        </div>

        {/* Currency Switcher & Quick Contact Call CTA */}
        <div className="flex items-center gap-3">
          {/* Multi-Currency Dropdown */}
          <div className="flex items-center bg-[#070A0F] border border-white/10 rounded-lg px-2 py-1 text-xs">
            <span className="text-slate-400 mr-1.5 text-[11px] font-mono">CURRENCY:</span>
            <select
              value={currency}
              onChange={(e) => onSelectCurrency(e.target.value as CurrencyCode)}
              aria-label="Select Currency"
              className="bg-transparent text-amber-400 font-mono font-semibold focus:outline-none cursor-pointer"
            >
              {Object.keys(CURRENCIES).map((cKey) => (
                <option key={cKey} value={cKey} className="bg-[#0B0F17] text-white">
                  {CURRENCIES[cKey as CurrencyCode].label}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Founder Call Button */}
          <a
            href="https://wa.me/923109328042?text=Hello%20Ihtisham%20Hussain%20Raja,%20I%20would%20like%20to%20schedule%20a%20priority%20consultation%20for%20our%20enterprise%20application."
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold text-xs hover:opacity-95 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>VIP Founder Line</span>
          </a>
        </div>
      </div>

      {/* Mobile Role Switcher Bar */}
      <div className="lg:hidden flex overflow-x-auto scrollbar-none px-4 py-2 gap-2 bg-[#070A0F] border-t border-white/5">
        <button
          onClick={() => onSelectRole('public')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs whitespace-nowrap ${
            currentRole === 'public'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'text-slate-400'
          }`}
        >
          <Globe className="w-3 h-3" /> Public
        </button>
        <button
          onClick={() => onSelectRole('founder')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs whitespace-nowrap ${
            currentRole === 'founder'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'text-slate-400'
          }`}
        >
          <Briefcase className="w-3 h-3" /> Founder Suite
        </button>
        <button
          onClick={() => onSelectRole('team')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs whitespace-nowrap ${
            currentRole === 'team'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400'
          }`}
        >
          <Users className="w-3 h-3" /> Team Sprints
        </button>
        <button
          onClick={() => onSelectRole('client')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs whitespace-nowrap ${
            currentRole === 'client'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400'
          }`}
        >
          <Compass className="w-3 h-3" /> Client Portal
        </button>
      </div>
    </header>
  );
};
