import React, { useState } from 'react';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { DirectContactFloat } from './components/common/DirectContactFloat';
import { HeroAndShowcase } from './components/public/HeroAndShowcase';
import { ServiceEstimator } from './components/public/ServiceEstimator';
import { AiProposalIntake } from './components/public/AiProposalIntake';
import { FounderDashboard } from './components/founder/FounderDashboard';
import { TeamWorkspace } from './components/team/TeamWorkspace';
import { ClientPortal } from './components/client/ClientPortal';
import { useRealtimeSync } from './hooks/useRealtimeSync';
import { AppRole, CurrencyCode, ProposalResult } from './types';
import { Sparkles, CheckCircle2, Bell, Radio } from 'lucide-react';

export default function App() {
  const [currentRole, setCurrentRole] = useState<AppRole>('public');
  const [currency, setCurrency] = useState<CurrencyCode>('USD');

  // Estimator to Brief transfer configuration
  const [estimatorConfig, setEstimatorConfig] = useState<{
    platforms: string[];
    scale: string;
    addons: string[];
    estimatedTotal: number;
    timelineWeeks: string;
  } | undefined>(undefined);

  // Active User session based on current selected role
  const currentUser = React.useMemo(() => {
    switch (currentRole) {
      case 'founder':
        return { name: 'Ihtisham Hussain Raja', role: 'Managing Director & Founder', color: '#F59E0B' };
      case 'team':
        return { name: 'Hamza Tariq', role: 'Lead Full-Stack Eng', color: '#06B6D4' };
      case 'client':
        return { name: 'Elena Rostova', role: 'Client CPO, Apex Capital', color: '#10B981' };
      default:
        return { name: 'Guest Reviewer', role: 'Enterprise Prospect', color: '#94A3B8' };
    }
  }, [currentRole]);

  // Real-Time Collaborative Synchronization via WebSockets
  const {
    isConnected,
    tasks,
    sprintDocumentation,
    feedbackAnnotations,
    activePeers,
    chatMessages,
    lastNotification,
    updateChecklist,
    updateDocumentation,
    addTask,
    addFeedback,
    convertFeedbackToTask,
    sendChatMessage,
    broadcastCursorPresence,
  } = useRealtimeSync('proj-apex', currentUser);

  const handleApplyEstimatorToBrief = (config: any) => {
    setEstimatorConfig(config);
    // Scroll smoothly to AI Proposal Intake section
    const elem = document.getElementById('proposal-intake-section');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleStartBriefDirectly = () => {
    const elem = document.getElementById('proposal-intake-section');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenEstimator = () => {
    const elem = document.getElementById('estimator-section');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmitProposalToPipeline = (proposal: ProposalResult, projectName: string) => {
    // Automatically convert into a sprint task and add to team & founder pipeline!
    addTask({
      title: `Onboard Enterprise Client: ${projectName}`,
      module: 'Executive Intake',
      priority: 'critical',
      notes: `Target timeline: ${proposal.estimatedInvestment.estimatedWeeks}. Budget: $${proposal.estimatedInvestment.minBudget} - $${proposal.estimatedInvestment.maxBudget} USD.`,
      estimatedHours: 8,
      checklist: [
        { id: 'c-onb1', text: 'Founder Ihtisham Hussain Raja client introductory call', completed: true, updatedAt: new Date().toISOString() },
        { id: 'c-onb2', text: 'Generate formal NDA & ISO 27001 agreement', completed: false, updatedAt: new Date().toISOString() },
        { id: 'c-onb3', text: 'Provision private Git repo and Figma workspace', completed: false, updatedAt: new Date().toISOString() },
      ],
    });
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col selection:bg-amber-500 selection:text-black">
      {/* Navigation Header */}
      <Header
        currentRole={currentRole}
        onSelectRole={setCurrentRole}
        currency={currency}
        onSelectCurrency={setCurrency}
        isWsConnected={isConnected}
        activePeersCount={activePeers.length}
      />

      {/* Floating Live Notification Toast */}
      {lastNotification && (
        <div className="fixed top-20 right-6 z-50 animate-slideIn">
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#0B0F17]/95 border border-cyan-500/50 text-xs text-white shadow-2xl backdrop-blur-md">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="font-mono">{lastNotification}</span>
          </div>
        </div>
      )}

      {/* Main Role Content View */}
      <main className="flex-1">
        {/* Role 1: Public Agency Showcase & Client Intake */}
        {currentRole === 'public' && (
          <div className="space-y-4">
            <HeroAndShowcase
              onStartBrief={handleStartBriefDirectly}
              onOpenEstimator={handleOpenEstimator}
              currency={currency}
            />

            <ServiceEstimator
              currency={currency}
              onApplyToBrief={handleApplyEstimatorToBrief}
            />

            <AiProposalIntake
              currency={currency}
              initialConfig={estimatorConfig}
              onSubmitToPipeline={handleSubmitProposalToPipeline}
            />
          </div>
        )}

        {/* Role 2: Founder / Admin Business Control Suite */}
        {currentRole === 'founder' && (
          <FounderDashboard currency={currency} />
        )}

        {/* Role 3: Team Member Workspace */}
        {currentRole === 'team' && (
          <TeamWorkspace
            tasks={tasks}
            sprintDocumentation={sprintDocumentation}
            activePeers={activePeers}
            chatMessages={chatMessages}
            isWsConnected={isConnected}
            onUpdateChecklist={updateChecklist}
            onUpdateDocumentation={updateDocumentation}
            onAddTask={addTask}
            onSendChatMessage={sendChatMessage}
            onBroadcastCursor={broadcastCursorPresence}
            currency={currency}
          />
        )}

        {/* Role 4: Client Experience Portal */}
        {currentRole === 'client' && (
          <ClientPortal
            feedbackAnnotations={feedbackAnnotations}
            onAddFeedback={addFeedback}
            onConvertFeedbackToTask={convertFeedbackToTask}
            currency={currency}
          />
        )}
      </main>

      {/* Persistent Floating Founder Contact Triggers (WhatsApp + Email) */}
      <DirectContactFloat />

      {/* Luxury Footer */}
      <Footer onSelectRole={setCurrentRole} />
    </div>
  );
}
