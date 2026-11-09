import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  Clock,
  MessageSquare,
  Play,
  Pause,
  RotateCcw,
  Square,
  Upload,
  Plus,
  FileText,
  Users,
  Send,
  Sparkles,
  Paperclip,
  CheckCircle2,
  AlertTriangle,
  Folder,
  Tag,
  Radio,
  ExternalLink,
} from 'lucide-react';
import { Task, TimeLogEntry, ActivePeer, ChatMessage, CurrencyCode } from '../../types';
import { formatCurrency } from '../../utils/currency';

interface TeamWorkspaceProps {
  tasks: Task[];
  sprintDocumentation: string;
  activePeers: ActivePeer[];
  chatMessages: ChatMessage[];
  isWsConnected: boolean;
  onUpdateChecklist: (taskId: string, checklistId: string, completed: boolean) => void;
  onUpdateDocumentation: (content: string) => void;
  onAddTask: (task: Partial<Task>) => void;
  onSendChatMessage: (text: string, attachment?: any) => void;
  onBroadcastCursor: (field?: string) => void;
  currency: CurrencyCode;
}

export const TeamWorkspace: React.FC<TeamWorkspaceProps> = ({
  tasks,
  sprintDocumentation,
  activePeers,
  chatMessages,
  isWsConnected,
  onUpdateChecklist,
  onUpdateDocumentation,
  onAddTask,
  onSendChatMessage,
  onBroadcastCursor,
  currency,
}) => {
  const [activeTab, setActiveTab] = useState<'sprints' | 'timelogger' | 'chat'>('sprints');

  // Time Logger State
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [selectedModule, setSelectedModule] = useState<string>('Cyber Security & Infra');
  const [timerNotes, setTimerNotes] = useState<string>('');
  const [timeLogs, setTimeLogs] = useState<TimeLogEntry[]>([
    {
      id: 'log-1',
      projectId: 'PRJ-101 (Apex)',
      module: 'Cyber Security & Infra',
      taskNotes: 'Zero-trust WAF sliding window rate limiter and OWASP test harness',
      durationSeconds: 14400, // 4 hours
      loggedAt: '2026-11-09 08:30',
      developer: 'Hamza Tariq',
      billable: true,
    },
    {
      id: 'log-2',
      projectId: 'PRJ-101 (Apex)',
      module: 'Enterprise UI/UX',
      taskNotes: 'Glassmorphism cyberpunk theme tokens and 60 FPS motion transitions',
      durationSeconds: 10800, // 3 hours
      loggedAt: '2026-11-08 15:45',
      developer: 'Ayesha Khan',
      billable: true,
    },
  ]);

  // Task Creation Modal
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskModule, setNewTaskModule] = useState('Full-Stack Core API');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('high');
  const [newTaskNotes, setNewTaskNotes] = useState('');

  // Chat Input
  const [chatInput, setChatInput] = useState('');
  const [isAiAnswering, setIsAiAnswering] = useState(false);

  // Deliverables Upload Simulation State
  const [deliverables, setDeliverables] = useState([
    {
      id: 'd-1',
      name: 'Apex_Mobile_v1.4_ReleaseCandidate.apk',
      size: '42.8 MB',
      uploadedBy: 'Hamza Tariq',
      uploadedAt: 'Today, 09:12 AM',
      type: 'Code Build',
      status: 'In Client Review',
    },
    {
      id: 'd-2',
      name: 'Glassmorphic_TradingView_Figma_Tokens_v2.json',
      size: '1.4 MB',
      uploadedBy: 'Ayesha Khan',
      uploadedAt: 'Today, 08:45 AM',
      type: 'Design System',
      status: 'Approved',
    },
    {
      id: 'd-3',
      name: 'ISO_27001_ZeroTrust_PenTest_Manifest.pdf',
      size: '5.2 MB',
      uploadedBy: 'Ihtisham Hussain Raja',
      uploadedAt: 'Yesterday, 06:30 PM',
      type: 'Security Certificate',
      status: 'Approved',
    },
  ]);

  // Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimer = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleStopAndLogTime = () => {
    if (timerSeconds === 0) return;
    const newEntry: TimeLogEntry = {
      id: 'log-' + Date.now(),
      projectId: 'PRJ-101 (Apex Capital)',
      module: selectedModule,
      taskNotes: timerNotes || 'Active sprint implementation & testing',
      durationSeconds: timerSeconds,
      loggedAt: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      developer: 'Team Engineer',
      billable: true,
    };
    setTimeLogs([newEntry, ...timeLogs]);
    setIsTimerRunning(false);
    setTimerSeconds(0);
    setTimerNotes('');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    onSendChatMessage(chatInput.trim());
    setChatInput('');
  };

  const handleTriggerAiAssistant = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    onSendChatMessage(userMsg);
    setChatInput('');
    setIsAiAnswering(true);

    try {
      const res = await fetch('/api/chat/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();
      if (data.reply) {
        onSendChatMessage(data.reply);
      }
    } catch (err) {
      console.error('Error getting AI chat reply:', err);
    } finally {
      setIsAiAnswering(false);
    }
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle) return;

    onAddTask({
      title: newTaskTitle,
      module: newTaskModule,
      priority: newTaskPriority,
      notes: newTaskNotes,
      assignee: 'Team Engineer',
      checklist: [
        { id: 'c-new1', text: 'Scoping & interface design', completed: false, updatedAt: new Date().toISOString() },
        { id: 'c-new2', text: 'Implementation & unit tests', completed: false, updatedAt: new Date().toISOString() },
        { id: 'c-new3', text: 'Peer review & verification', completed: false, updatedAt: new Date().toISOString() },
      ],
    });

    setShowNewTaskModal(false);
    setNewTaskTitle('');
    setNewTaskNotes('');
  };

  const handleSimulatedFileUpload = () => {
    const mockFile = {
      id: 'd-' + Date.now(),
      name: `Sprint14_Build_v${(Math.random() * 2 + 1).toFixed(1)}.zip`,
      size: `${(Math.random() * 30 + 10).toFixed(1)} MB`,
      uploadedBy: 'Team Engineer',
      uploadedAt: 'Just now',
      type: 'Archive Build',
      status: 'Ready for Review',
    };
    setDeliverables([mockFile, ...deliverables]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      {/* Top Banner & Real-Time Presence Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-[#070A0F] border border-cyan-500/30 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-cyan-950/40 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">Team Member Workspace</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold">
                LIVE WEBSOCKETS ENABLED
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              Collaborative Sprints, Live Task Checklists & Precision Time Logging.
            </div>
          </div>
        </div>

        {/* Live Active Peers Presence */}
        <div className="flex items-center gap-3 bg-[#0B0F17] px-3.5 py-2 rounded-xl border border-white/10 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Active Collaborators:</span>
          </div>

          <div className="flex items-center -space-x-2">
            {activePeers.map((peer, idx) => (
              <div
                key={idx}
                className="w-7 h-7 rounded-full border-2 border-[#0B0F17] flex items-center justify-center text-[10px] font-bold text-black"
                style={{ backgroundColor: peer.color || '#06B6D4' }}
                title={`${peer.name} (${peer.role})`}
              >
                {peer.name.slice(0, 2).toUpperCase()}
              </div>
            ))}
          </div>
          <span className="text-emerald-400 text-[11px] font-bold">
            {isWsConnected ? '● Synchronized' : '○ Standby'}
          </span>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveTab('sprints')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'sprints'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>Sprint & Task Checklists</span>
        </button>

        <button
          onClick={() => setActiveTab('timelogger')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'timelogger'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Built-in Time Logger</span>
        </button>

        <button
          onClick={() => setActiveTab('chat')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'chat'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Client-Team Live Stream</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </button>
      </div>

      {/* Tab 1: Sprint & Task Management with Live Collaborative Editing */}
      {activeTab === 'sprints' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Interactive Synchronized Tasks */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-cyan-400" />
                  <span>Real-Time Collaborative Sprint Tasks</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Checklist toggles broadcast instantly via WebSockets to all team members.
                </p>
              </div>

              <button
                onClick={() => setShowNewTaskModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs shadow-md transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Task</span>
              </button>
            </div>

            {/* Task Cards List */}
            <div className="space-y-4">
              {tasks.map((task) => {
                const totalItems = task.checklist.length;
                const completedItems = task.checklist.filter((c) => c.completed).length;
                const percentDone = totalItems ? Math.round((completedItems / totalItems) * 100) : 0;

                return (
                  <div
                    key={task.id}
                    className="p-5 rounded-2xl bg-[#070A0F] border border-white/10 hover:border-cyan-500/30 transition-all space-y-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-cyan-400 font-bold">
                            {task.id}
                          </span>
                          <span className="text-slate-600">•</span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {task.module}
                          </span>
                          {task.originFeedbackId && (
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              From Client Feedback ({task.originFeedbackId})
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-white mt-1">{task.title}</h4>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span
                          className={`text-[9px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                            task.priority === 'critical'
                              ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                              : task.priority === 'high'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>
                    </div>

                    {task.notes && (
                      <p className="text-xs text-slate-300 bg-[#0B0F17] p-2.5 rounded-lg border border-white/5 font-mono text-[11px]">
                        {task.notes}
                      </p>
                    )}

                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                        <span>Checklist Completion</span>
                        <span className="text-white font-bold">{completedItems} / {totalItems} ({percentDone}%)</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300"
                          style={{ width: `${percentDone}%` }}
                        />
                      </div>
                    </div>

                    {/* Checklists items with real-time toggle */}
                    <div className="space-y-2 pt-1">
                      {task.checklist.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => onUpdateChecklist(task.id, item.id, !item.completed)}
                          className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                            item.completed
                              ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-400'
                              : 'bg-[#0B0F17] border-white/10 hover:border-cyan-500/30 text-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <input
                              type="checkbox"
                              checked={item.completed}
                              readOnly
                              className="w-4 h-4 rounded text-cyan-500 bg-slate-900 border-slate-700 cursor-pointer accent-cyan-400"
                            />
                            <span
                              className={`text-xs ${
                                item.completed ? 'line-through text-slate-400' : 'text-slate-200 font-medium'
                              }`}
                            >
                              {item.text}
                            </span>
                          </div>

                          {item.updatedBy && (
                            <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap">
                              by {item.updatedBy.split(' ')[0]}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-white/5">
                      <span>Assignee: <strong className="text-slate-200">{task.assignee}</strong></span>
                      <span>Est: {task.estimatedHours}h</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Live Synchronized Sprint Documentation & Deliverables Upload */}
          <div className="lg:col-span-5 space-y-6">
            {/* Live Synchronized Documentation */}
            <div className="p-5 rounded-2xl bg-[#070A0F] border border-cyan-500/30 space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-white">
                    Live Sprint Documentation Manifest
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  REAL-TIME SYNC
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Edits to this architecture log synchronize live to all active engineering peers.
              </p>

              <textarea
                rows={12}
                value={sprintDocumentation}
                onChange={(e) => onUpdateDocumentation(e.target.value)}
                onFocus={() => onBroadcastCursor('sprint-doc')}
                onBlur={() => onBroadcastCursor(undefined)}
                placeholder="Live collaborative sprint notes..."
                className="w-full p-3 rounded-xl bg-[#0B0F17] border border-white/10 text-slate-200 text-xs font-mono leading-relaxed focus:border-cyan-400 focus:outline-none resize-none shadow-inner"
              />
              <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
                <span>Standard: ISO 27001 Zero-Trust</span>
                <span>Auto-broadcasting changes</span>
              </div>
            </div>

            {/* Deliverables Upload System */}
            <div className="p-5 rounded-2xl bg-[#070A0F] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Folder className="w-4 h-4 text-amber-400" />
                    <span>Sprint Deliverables & Versioning</span>
                  </h4>
                  <p className="text-[11px] text-slate-400">Upload code builds, designs & audit reports.</p>
                </div>

                <button
                  onClick={handleSimulatedFileUpload}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Build</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {deliverables.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-[#0B0F17] border border-white/10 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-white truncate max-w-xs">{item.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {item.size} • {item.uploadedBy} • {item.uploadedAt}
                      </div>
                    </div>

                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                        item.status === 'Approved'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Built-in Time Logger */}
      {activeTab === 'timelogger' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Active Timer Console */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-[#070A0F] border border-amber-500/40 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
                  ACTIVE SPRINT TIME LOGGER
                </span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                    isTimerRunning
                      ? 'bg-emerald-500/20 text-emerald-300 animate-pulse'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isTimerRunning ? 'RECORDING' : 'PAUSED'}
                </span>
              </div>

              {/* Digital Clock Display */}
              <div className="text-center py-4 bg-[#0B0F17] rounded-2xl border border-white/10 shadow-inner">
                <div className="text-5xl sm:text-6xl font-black font-mono tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-200">
                  {formatTimer(timerSeconds)}
                </div>
                <div className="text-[11px] font-mono text-slate-400 mt-2">
                  HOURS : MINUTES : SECONDS
                </div>
              </div>

              {/* Module & Notes Selector */}
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Select Project Module
                  </label>
                  <select
                    value={selectedModule}
                    onChange={(e) => setSelectedModule(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0B0F17] border border-white/10 text-white focus:border-amber-400 focus:outline-none"
                  >
                    <option value="Cyber Security & Infra">Cyber Security & Infra</option>
                    <option value="Enterprise UI/UX">Enterprise UI/UX</option>
                    <option value="Full-Stack Core API">Full-Stack Core API</option>
                    <option value="Gemini AI Scope Engine">Gemini AI Scope Engine</option>
                    <option value="Client Feedback Resolution">Client Feedback Resolution</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Activity Notes
                  </label>
                  <input
                    type="text"
                    value={timerNotes}
                    onChange={(e) => setTimerNotes(e.target.value)}
                    placeholder="e.g. Implement WebSocket heartbeat and client deliverable pins..."
                    className="w-full px-3 py-2 rounded-lg bg-[#0B0F17] border border-white/10 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center gap-3">
                {!isTimerRunning ? (
                  <button
                    onClick={() => setIsTimerRunning(true)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold text-xs shadow-lg shadow-amber-500/20 hover:opacity-95 transition-all cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Start Timer</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setIsTimerRunning(false)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs transition-colors cursor-pointer"
                  >
                    <Pause className="w-4 h-4" />
                    <span>Pause</span>
                  </button>
                )}

                <button
                  onClick={handleStopAndLogTime}
                  disabled={timerSeconds === 0}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-40"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>Log & Save Hours</span>
                </button>

                <button
                  onClick={() => {
                    setIsTimerRunning(false);
                    setTimerSeconds(0);
                  }}
                  className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors cursor-pointer"
                  title="Reset"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Logged Timesheets Ledger */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>Logged Timesheets & Billable Hours</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Track sprint efficiency and export directly to client invoice settlement.
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-[#070A0F] border border-white/10 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#0B0F17] text-slate-400 border-b border-white/10">
                    <tr>
                      <th className="p-3.5">MODULE</th>
                      <th className="p-3.5">NOTES</th>
                      <th className="p-3.5">ENGINEER</th>
                      <th className="p-3.5">DURATION</th>
                      <th className="p-3.5 text-right">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {timeLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-white/[0.02]">
                        <td className="p-3.5 text-white font-medium">{log.module}</td>
                        <td className="p-3.5 text-slate-300 max-w-xs truncate">{log.taskNotes}</td>
                        <td className="p-3.5 text-slate-400">{log.developer}</td>
                        <td className="p-3.5 font-bold text-amber-400">
                          {formatTimer(log.durationSeconds)}
                        </td>
                        <td className="p-3.5 text-right">
                          <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase font-semibold">
                            Billable
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Client-Team Live Chat Stream */}
      {activeTab === 'chat' && (
        <div className="max-w-4xl mx-auto rounded-2xl bg-[#070A0F] border border-white/10 shadow-2xl overflow-hidden flex flex-col h-[600px]">
          {/* Chat Header */}
          <div className="p-4 bg-[#0B0F17] border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  Client-Team Real-Time Stream
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </h3>
                <div className="text-[11px] text-slate-400 font-mono">
                  Apex Omni-Channel Project • End-to-End 256-bit Encrypted
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-400 font-mono hidden sm:block">
              Founder Line: <strong className="text-white">Ihtisham Hussain Raja</strong>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {chatMessages.map((msg) => (
              <div key={msg.id} className="flex items-start gap-3 text-xs">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-black flex-shrink-0 text-[11px]"
                  style={{ backgroundColor: msg.color || '#06B6D4' }}
                >
                  {msg.sender.slice(0, 2).toUpperCase()}
                </div>
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{msg.sender}</span>
                    <span className="text-[10px] font-mono text-slate-400">{msg.role}</span>
                    <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0B0F17] border border-white/10 text-slate-200 leading-relaxed">
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-[#0B0F17] border-t border-white/10 flex items-center gap-2"
          >
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type message to team & client (or ask Founder Desk)..."
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#070A0F] border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none"
            />

            <button
              type="button"
              onClick={handleTriggerAiAssistant}
              disabled={isAiAnswering || !chatInput.trim()}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/40 text-purple-300 text-xs font-semibold transition-colors disabled:opacity-40 cursor-pointer"
              title="Ask Gemini Concierge"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ask AI Desk</span>
            </button>

            <button
              type="submit"
              disabled={!chatInput.trim()}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs shadow-md transition-colors disabled:opacity-40 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      )}

      {/* New Task Modal */}
      {showNewTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-[#0B0F17] border border-cyan-500/40 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Add Collaborative Sprint Task</h3>

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Task Title</label>
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Optimize Redis Caching for Real-Time Feeds"
                  className="w-full px-3 py-2 rounded-lg bg-[#070A0F] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Module</label>
                  <select
                    value={newTaskModule}
                    onChange={(e) => setNewTaskModule(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#070A0F] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="Cyber Security & Infra">Cyber Security & Infra</option>
                    <option value="Enterprise UI/UX">Enterprise UI/UX</option>
                    <option value="Full-Stack Core API">Full-Stack Core API</option>
                    <option value="Gemini AI Scope Engine">Gemini AI Scope Engine</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-[#070A0F] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Directives / Notes</label>
                <textarea
                  rows={3}
                  value={newTaskNotes}
                  onChange={(e) => setNewTaskNotes(e.target.value)}
                  placeholder="Technical specifications and edge case handling..."
                  className="w-full px-3 py-2 rounded-lg bg-[#070A0F] border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewTaskModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-cyan-500 text-black font-bold"
                >
                  Create & Sync
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
