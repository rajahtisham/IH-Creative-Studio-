import React from 'react';
import { ShieldCheck, MessageSquare, Mail, Zap, PhoneCall, Globe, ArrowUpRight } from 'lucide-react';
import { AppRole } from '../../types';

interface FooterProps {
  onSelectRole: (role: AppRole) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectRole }) => {
  return (
    <footer className="bg-[#06090e] border-t border-white/10 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Brand & Slogan */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-cyan-500 to-emerald-500 p-[1.5px] shadow-lg">
                <div className="w-full h-full bg-[#0B0F17] rounded-[10px] flex items-center justify-center font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-cyan-300 to-emerald-400 text-lg">
                  IH
                </div>
              </div>
              <div>
                <span className="font-extrabold text-base tracking-tight text-white block leading-none">
                  IH CREATIVE STUDIO
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5 block">
                  Enterprise Digital Engineering & Autonomous AI
                </span>
              </div>
            </div>

            <p className="text-slate-300 italic text-sm font-medium leading-relaxed max-w-md">
              “We engineer digital masterpieces that scale businesses.”
            </p>

            <div className="space-y-1 font-mono text-[11px] text-slate-400 pt-1">
              <div>
                Founder & Managing Director:{' '}
                <strong className="text-white">Ihtisham Hussain Raja</strong>
              </div>
              <div className="flex items-center gap-2">
                <span>WhatsApp Direct:</span>
                <a
                  href="https://wa.me/923109328042"
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 underline font-bold"
                >
                  +92 310 9328042
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span>Email Desk:</span>
                <a
                  href="mailto:ih.creativestudio.pk@gmail.com"
                  className="text-cyan-400 hover:text-cyan-300 underline font-bold"
                >
                  ih.creativestudio.pk@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Core Capabilities */}
          <div className="space-y-3">
            <h4 className="text-white font-bold font-mono text-xs uppercase tracking-wider">
              Core Capabilities
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button onClick={() => onSelectRole('public')} className="hover:text-cyan-300 transition-colors text-left">
                  Web & Mobile App Dev (React Native/Next.js)
                </button>
              </li>
              <li>
                <button onClick={() => onSelectRole('public')} className="hover:text-cyan-300 transition-colors text-left">
                  AI Agents & Gemini 3.8 Automation
                </button>
              </li>
              <li>
                <button onClick={() => onSelectRole('public')} className="hover:text-cyan-300 transition-colors text-left">
                  Enterprise UI/UX (60 FPS Glassmorphism)
                </button>
              </li>
              <li>
                <button onClick={() => onSelectRole('public')} className="hover:text-cyan-300 transition-colors text-left">
                  3D Brand Strategy & Three.js Shaders
                </button>
              </li>
              <li>
                <button onClick={() => onSelectRole('public')} className="hover:text-cyan-300 transition-colors text-left">
                  DevOps Kubernetes & Cloudflare R2
                </button>
              </li>
              <li>
                <button onClick={() => onSelectRole('public')} className="hover:text-cyan-300 transition-colors text-left">
                  Cyber Audits & 256-Bit SSL Hardening
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform Portals */}
          <div className="space-y-3">
            <h4 className="text-white font-bold font-mono text-xs uppercase tracking-wider">
              Experience Portals
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button
                  onClick={() => onSelectRole('public')}
                  className="hover:text-amber-300 transition-colors flex items-center gap-1"
                >
                  <span>Public Agency Showcase</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectRole('founder')}
                  className="hover:text-amber-300 transition-colors flex items-center gap-1"
                >
                  <span>Founder Executive Suite</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectRole('team')}
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1"
                >
                  <span>Team Workspace & Sprints</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectRole('client')}
                  className="hover:text-emerald-300 transition-colors flex items-center gap-1"
                >
                  <span>Client Experience Portal</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </li>
            </ul>

            <div className="pt-2">
              <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-[10px] text-emerald-400 font-mono flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                <span>ISO 27001 Certified • Bank-Grade Zero-Trust Defense</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/5 flex flex-wrap items-center justify-between gap-4 text-[11px] font-mono">
          <div>
            © {new Date().getFullYear()} IH Creative Studio. All Rights Reserved. Founded by Ihtisham Hussain Raja.
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Powered by Gemini 3.8 Flash SDK</span>
            <span>•</span>
            <span>Real-Time WebSockets</span>
            <span>•</span>
            <span>60 FPS Glassmorphism</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
