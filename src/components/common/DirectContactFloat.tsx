import React, { useState } from 'react';
import { MessageSquare, Mail, Phone, X, Send, Sparkles, CheckCircle2 } from 'lucide-react';

export const DirectContactFloat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientContact, setClientContact] = useState('');
  const [projectTopic, setProjectTopic] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTopic) return;

    // Prefill direct WhatsApp link
    const text = encodeURIComponent(
      `Hello Ihtisham Hussain Raja,\n\nName: ${clientName || 'Prospective Client'}\nContact: ${clientContact || 'N/A'}\nProject Inquiry: ${projectTopic}\n\nSent via IH Creative Studio Executive Portal.`
    );
    window.open(`https://wa.me/923109328042?text=${text}`, '_blank');
    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      setIsOpen(false);
    }, 2500);
  };

  return (
    <>
      {/* Floating Trigger Dock */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2.5">
        {/* WhatsApp Quick Bubble */}
        <a
          href="https://wa.me/923109328042?text=Hello%20Ihtisham%20Hussain%20Raja,%20I%20am%20inquirying%20about%20an%20enterprise%20project%20with%20IH%20Creative%20Studio."
          target="_blank"
          rel="noreferrer"
          className="group flex items-center gap-2 px-3 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 transition-all text-xs font-semibold cursor-pointer"
          title="Direct WhatsApp: +92 310 9328042"
        >
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          <MessageSquare className="w-4 h-4" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-out whitespace-nowrap">
            WhatsApp Direct (+92 310 9328042)
          </span>
        </a>

        {/* Founder Desk Main Floating Action Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-black font-bold shadow-xl shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-amber-300/40"
        >
          <div className="relative">
            <Phone className="w-4 h-4 text-black" />
          </div>
          <span className="text-xs tracking-wide">FOUNDER DIRECT DESK</span>
        </button>
      </div>

      {/* Founder Desk Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg bg-[#0B0F17] border border-amber-500/40 rounded-2xl shadow-2xl p-6 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
                  IH
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Direct Line to Founder</h3>
                  <p className="text-xs text-slate-400">
                    Ihtisham Hussain Raja • Managing Director
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {sentSuccess ? (
              <div className="py-8 text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3 animate-bounce" />
                <h4 className="text-lg font-bold text-white">Connecting Directly...</h4>
                <p className="text-xs text-slate-300 mt-1">
                  Opening WhatsApp chat with Ihtisham Hussain Raja (+92 310 9328042).
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs">
                    <div className="text-emerald-400 font-semibold flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Desk
                    </div>
                    <div className="text-slate-300 font-mono mt-1">+92 310 9328042</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Average reply &lt; 15 mins</div>
                  </div>

                  <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs">
                    <div className="text-cyan-400 font-semibold flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5" /> Email Desk
                    </div>
                    <div className="text-slate-300 font-mono mt-1 text-[11px] truncate">
                      ih.creativestudio.pk@gmail.com
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Executive proposals & NDAs</div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Your Name / Company
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Alex Morgan, Apex Capital"
                    className="w-full px-3 py-2 rounded-lg bg-[#070A0F] border border-white/10 text-white text-xs focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Phone / Email
                  </label>
                  <input
                    type="text"
                    value={clientContact}
                    onChange={(e) => setClientContact(e.target.value)}
                    placeholder="e.g. +1 (555) 019-2834 or alex@company.com"
                    className="w-full px-3 py-2 rounded-lg bg-[#070A0F] border border-white/10 text-white text-xs focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Project Scope / Question
                  </label>
                  <textarea
                    rows={3}
                    value={projectTopic}
                    onChange={(e) => setProjectTopic(e.target.value)}
                    placeholder="Describe what you want to build (e.g., Cross-Platform FinTech App with Gemini AI automation & ISO security)..."
                    className="w-full px-3 py-2 rounded-lg bg-[#070A0F] border border-white/10 text-white text-xs focus:border-amber-400 focus:outline-none"
                    required
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <a
                    href="mailto:ih.creativestudio.pk@gmail.com?subject=Enterprise%20Project%20Inquiry%20-%20IH%20Creative%20Studio"
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    <Mail className="w-3.5 h-3.5" /> Send via Email instead
                  </a>

                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-xs hover:opacity-95 shadow-lg shadow-amber-500/25 transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Launch Priority Chat</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};
