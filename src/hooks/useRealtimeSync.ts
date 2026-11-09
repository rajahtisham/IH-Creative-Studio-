import { useState, useEffect, useRef, useCallback } from 'react';
import { ProjectState, Task, FeedbackAnnotation, ActivePeer, ChatMessage } from '../types';

const defaultTasksInitial: Task[] = [
  {
    id: 'TASK-101',
    title: 'Implement 256-Bit SSL WAF & Rate Limiter Gateway',
    module: 'Cyber Security & Infra',
    status: 'in_progress',
    priority: 'critical',
    assignee: 'Ihtisham Hussain Raja (Founder/Arch)',
    notes: 'Enforce zero-trust JWT verification with Redis token bucket rate limiting on /api/*',
    estimatedHours: 8,
    checklist: [
      { id: 'c-1', text: 'Configure Cloudflare WAF enterprise rule-set', completed: true, updatedAt: new Date().toISOString() },
      { id: 'c-2', text: 'Implement sliding window counter in Redis', completed: true, updatedAt: new Date().toISOString() },
      { id: 'c-3', text: 'Conduct OWASP Top 10 automated penetration fuzzing', completed: false, updatedAt: new Date().toISOString() },
      { id: 'c-4', text: 'Generate ISO 27001 cyber verification manifest', completed: false, updatedAt: new Date().toISOString() },
    ],
  },
  {
    id: 'TASK-102',
    title: 'High-Fi Glassmorphism Mobile & Web Component Architecture',
    module: 'Enterprise UI/UX',
    status: 'in_progress',
    priority: 'high',
    assignee: 'Ayesha Khan (Lead UI/UX Designer)',
    notes: 'Apply Cyberpunk gold & cyan neon accents, backdrop-blur-md, and 60 FPS motion tokens',
    estimatedHours: 12,
    checklist: [
      { id: 'c-5', text: 'Finalize Figma design tokens for gold #F59E0B & cyan #06B6D4', completed: true, updatedAt: new Date().toISOString() },
      { id: 'c-6', text: 'Build interactive milestone roadmap stepper', completed: true, updatedAt: new Date().toISOString() },
      { id: 'c-7', text: 'Optimize SVG icons for zero-latency asset rendering', completed: false, updatedAt: new Date().toISOString() },
    ],
  },
  {
    id: 'TASK-103',
    title: 'Real-Time WebSocket State Sync Engine & Presence Hub',
    module: 'Real-Time Backend Engine',
    status: 'review',
    priority: 'high',
    assignee: 'Hamza Tariq (Lead Full-Stack Eng)',
    notes: 'Broadcast task checklist modifications, sprint markdown sync, and client deliverable tasks',
    estimatedHours: 14,
    checklist: [
      { id: 'c-8', text: 'Mount ws WebSocketServer on Node.js HTTP server', completed: true, updatedAt: new Date().toISOString() },
      { id: 'c-9', text: 'Add heartbeat ping/pong to prevent stale socket drop', completed: true, updatedAt: new Date().toISOString() },
      { id: 'c-10', text: 'Broadcast cursor presence and live collaborative edits', completed: true, updatedAt: new Date().toISOString() },
    ],
  },
  {
    id: 'TASK-104',
    title: 'Client Granular Feedback to Actionable Sprint Task Converter',
    module: 'Client Experience Portal',
    status: 'completed',
    priority: 'medium',
    assignee: 'Zain Ul Abideen (Senior QA & Systems)',
    notes: 'Automatically ingest design pins, code line comments, and video stamps into active sprint tasks',
    estimatedHours: 6,
    checklist: [
      { id: 'c-11', text: 'Interactive canvas pin-drop on design screenshots', completed: true, updatedAt: new Date().toISOString() },
      { id: 'c-12', text: 'Line-by-line annotation panel on source code review', completed: true, updatedAt: new Date().toISOString() },
      { id: 'c-13', text: 'Video segment timestamp tagging', completed: true, updatedAt: new Date().toISOString() },
      { id: 'c-14', text: 'Automated 1-click sprint task transformation', completed: true, updatedAt: new Date().toISOString() },
    ],
  },
];

const defaultSprintDocInitial = `# Sprint #14 Architecture & Execution Manifest
**Project**: Apex Omni-Channel FinTech & AI Automation Suite  
**Engineering Lead**: Ihtisham Hussain Raja (Managing Director)  
**Standard**: ISO 27001 Certified • Zero-Trust Glassmorphism Standard  

---
### 1. Architectural Scope
- Seamless real-time state synchronization across Mobile (Expo/React Native) and Web (Next.js/React).
- Integrated Gemini 3.8 Flash automated scope synthesis for client proposals.
- Strict 60 FPS micro-animations and zero-latency WebSocket dispatch.

### 2. Live Engineering Directives
1. **Security Policy**: Every API endpoint handling financial transactions or deliverable approval requires 256-bit SSL validation.
2. **Quality Benchmark**: No UI component may render with raw layout shifts; use skeleton loaders and optimistic cache states.
3. **Collaboration Protocol**: Active team members must log working sprint hours using the built-in precision time logger.
`;

const defaultAnnotationsInitial: FeedbackAnnotation[] = [
  {
    id: 'FB-201',
    deliverableId: 'DELIV-01',
    type: 'design_pin',
    author: 'Elena Rostova (Client VIP)',
    authorRole: 'Chief Product Officer, Apex Capital',
    targetRef: 'X: 74%, Y: 32%',
    comment: 'The CTA button on the trading card needs higher contrast gold glow #F59E0B so it stands out against the dark obsidian backdrop.',
    status: 'converted',
    convertedTaskId: 'TASK-102',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'FB-202',
    deliverableId: 'DELIV-02',
    type: 'code_line',
    author: 'Elena Rostova (Client VIP)',
    authorRole: 'Chief Product Officer, Apex Capital',
    targetRef: 'Line 42 (RateLimiter.ts)',
    comment: 'Verify if 5,000 requests/sec peak traffic will trigger any false positive 429 drops for VIP accounts.',
    status: 'converted',
    convertedTaskId: 'TASK-101',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'FB-203',
    deliverableId: 'DELIV-03',
    type: 'video_timestamp',
    author: 'Elena Rostova (Client VIP)',
    authorRole: 'Chief Product Officer, Apex Capital',
    targetRef: '00:14 (Logo Rotation)',
    comment: 'Ease the 3D cyber holographic rotation curve slightly slower at the apex moment.',
    status: 'open',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
];

const defaultInitialChat: ChatMessage[] = [
  {
    id: 'm1',
    sender: 'Ihtisham Hussain Raja',
    role: 'Managing Director & Founder',
    color: '#F59E0B',
    text: 'Welcome team. The client has uploaded preliminary feedback on Sprint #14 deliverables. Review annotations in the portal and verify task allocations.',
    timestamp: '09:15 AM',
  },
  {
    id: 'm2',
    sender: 'Ayesha Khan',
    role: 'Lead UI/UX Designer',
    color: '#06B6D4',
    text: 'On it Ihtisham. I am updating the design tokens to match the gold glow on the hero trading module.',
    timestamp: '09:22 AM',
  },
  {
    id: 'm3',
    sender: 'Hamza Tariq',
    role: 'Lead Full-Stack Eng',
    color: '#10B981',
    text: 'WebSocket state sync engine is live. All checklist changes propagate across clients in real-time under 20ms.',
    timestamp: '09:28 AM',
  },
];

export function useRealtimeSync(
  projectId: string = 'proj-apex',
  currentUser: { name: string; role: string; color: string }
) {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [tasks, setTasks] = useState<Task[]>(defaultTasksInitial);
  const [sprintDocumentation, setSprintDocumentation] = useState<string>(defaultSprintDocInitial);
  const [feedbackAnnotations, setFeedbackAnnotations] = useState<FeedbackAnnotation[]>(defaultAnnotationsInitial);
  const [activePeers, setActivePeers] = useState<ActivePeer[]>([
    { id: 'founder', name: 'Ihtisham Hussain Raja', role: 'Founder & Arch', color: '#F59E0B' },
    { id: 'engineer', name: 'Hamza Tariq', role: 'Full-Stack Lead', color: '#10B981' },
    { id: 'designer', name: 'Ayesha Khan', role: 'UI/UX Lead', color: '#06B6D4' },
  ]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(defaultInitialChat);
  const [lastNotification, setLastNotification] = useState<string | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<any>(null);

  const connectSocket = useCallback(() => {
    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        setIsConnected(true);
        // Handshake: Join project with user details
        ws.send(
          JSON.stringify({
            type: 'JOIN_PROJECT',
            payload: {
              projectId,
              userName: currentUser.name,
              userRole: currentUser.role,
              color: currentUser.color,
            },
          })
        );
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          switch (data.type) {
            case 'CONNECTED':
            case 'PROJECT_STATE_SYNC': {
              const state: ProjectState = data.payload.projectState;
              if (state) {
                if (state.tasks) setTasks(state.tasks);
                if (state.sprintDocumentation) setSprintDocumentation(state.sprintDocumentation);
                if (state.feedbackAnnotations) setFeedbackAnnotations(state.feedbackAnnotations);
              }
              if (data.payload.activePeers && data.payload.activePeers.length > 0) {
                setActivePeers(data.payload.activePeers);
              }
              break;
            }

            case 'PEER_JOINED': {
              if (data.payload.activePeers) {
                setActivePeers(data.payload.activePeers);
              }
              break;
            }

            case 'PEER_LEFT': {
              if (data.payload.activePeers) {
                setActivePeers(data.payload.activePeers);
              }
              break;
            }

            case 'CHECKLIST_UPDATED': {
              const { taskId, checklistId, completed, updatedBy } = data.payload;
              setTasks((prevTasks) =>
                prevTasks.map((task) => {
                  if (task.id === taskId) {
                    return {
                      ...task,
                      checklist: task.checklist.map((item) =>
                        item.id === checklistId
                          ? { ...item, completed, updatedBy, updatedAt: new Date().toISOString() }
                          : item
                      ),
                    };
                  }
                  return task;
                })
              );
              setLastNotification(`Task checklist updated by ${updatedBy}`);
              break;
            }

            case 'DOC_UPDATED': {
              const { content, updatedBy } = data.payload;
              setSprintDocumentation(content);
              setLastNotification(`Sprint documentation synced by ${updatedBy}`);
              break;
            }

            case 'TASK_ADDED': {
              const { task, addedBy } = data.payload;
              setTasks((prev) => [task, ...prev.filter((t) => t.id !== task.id)]);
              setLastNotification(`New task created by ${addedBy}: ${task.title}`);
              break;
            }

            case 'FEEDBACK_CONVERTED': {
              const { taskId, task, feedbackId, convertedBy } = data.payload;
              setFeedbackAnnotations((prev) =>
                prev.map((fb) => (fb.id === feedbackId ? { ...fb, status: 'converted', convertedTaskId: taskId } : fb))
              );
              setTasks((prev) => [task, ...prev.filter((t) => t.id !== task.id)]);
              setLastNotification(`Client feedback converted into ${taskId} by ${convertedBy}!`);
              break;
            }

            case 'FEEDBACK_ADDED': {
              const { feedback } = data.payload;
              setFeedbackAnnotations((prev) => [feedback, ...prev.filter((f) => f.id !== feedback.id)]);
              setLastNotification(`New client feedback pinned on deliverable!`);
              break;
            }

            case 'CHAT_MESSAGE': {
              setChatMessages((prev) => [...prev, data.payload]);
              break;
            }

            case 'PEER_PRESENCE_UPDATED': {
              const { peerId, activeField } = data.payload;
              setActivePeers((prev) =>
                prev.map((p) => (p.id === peerId ? { ...p, activeField } : p))
              );
              break;
            }
          }
        } catch (err) {
          console.error('Error parsing WS message:', err);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        // Try reconnecting after 3 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          connectSocket();
        }, 3000);
      };

      ws.onerror = (err) => {
        console.warn('WebSocket connection warning:', err);
        ws.close();
      };

      socketRef.current = ws;
    } catch (e) {
      console.warn('WebSocket initial setup error:', e);
      setIsConnected(false);
    }
  }, [projectId, currentUser.name, currentUser.role, currentUser.color]);

  useEffect(() => {
    connectSocket();
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [connectSocket]);

  // Collaborative Action: Update Checklist Item
  const updateChecklist = (taskId: string, checklistId: string, completed: boolean) => {
    // Optimistic local update
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            checklist: task.checklist.map((item) =>
              item.id === checklistId
                ? { ...item, completed, updatedBy: currentUser.name, updatedAt: new Date().toISOString() }
                : item
            ),
          };
        }
        return task;
      })
    );

    // Send over WebSocket
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          type: 'UPDATE_CHECKLIST',
          payload: {
            taskId,
            checklistId,
            completed,
            updatedBy: currentUser.name,
          },
        })
      );
    }
  };

  // Collaborative Action: Update Sprint Documentation
  const updateDocumentation = (content: string) => {
    setSprintDocumentation(content);
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          type: 'UPDATE_DOC',
          payload: {
            content,
            updatedBy: currentUser.name,
          },
        })
      );
    }
  };

  // Collaborative Action: Add Task
  const addTask = (taskData: Partial<Task>) => {
    const newTask: Task = {
      id: 'TASK-' + Math.floor(100 + Math.random() * 900),
      title: taskData.title || 'Untitled Sprint Task',
      module: taskData.module || 'Sprint Deliverables',
      status: taskData.status || 'in_progress',
      priority: taskData.priority || 'medium',
      assignee: taskData.assignee || currentUser.name,
      notes: taskData.notes || '',
      estimatedHours: taskData.estimatedHours || 4,
      checklist: taskData.checklist || [
        {
          id: 'c-' + Math.random().toString(36).substring(2, 6),
          text: 'Technical review & implementation',
          completed: false,
          updatedAt: new Date().toISOString(),
        },
      ],
    };

    setTasks((prev) => [newTask, ...prev]);

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          type: 'ADD_TASK',
          payload: newTask,
        })
      );
    }
  };

  // Collaborative Action: Add Client Feedback
  const addFeedback = (feedbackData: Partial<FeedbackAnnotation>) => {
    const newFeedback: FeedbackAnnotation = {
      id: 'FB-' + Math.floor(200 + Math.random() * 800),
      deliverableId: feedbackData.deliverableId || 'DELIV-01',
      type: feedbackData.type || 'design_pin',
      author: feedbackData.author || currentUser.name,
      authorRole: feedbackData.authorRole || currentUser.role,
      targetRef: feedbackData.targetRef || 'Element Marker',
      comment: feedbackData.comment || 'Revision requested',
      status: 'open',
      createdAt: new Date().toISOString(),
    };

    setFeedbackAnnotations((prev) => [newFeedback, ...prev]);

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          type: 'ADD_FEEDBACK',
          payload: newFeedback,
        })
      );
    }
  };

  // Collaborative Action: Convert Granular Feedback directly into actionable Sprint Task
  const convertFeedbackToTask = (feedbackId: string) => {
    const feedback = feedbackAnnotations.find((f) => f.id === feedbackId);
    if (!feedback) return;

    const taskId = 'TASK-' + Math.floor(100 + Math.random() * 900);
    const newTask: Task = {
      id: taskId,
      title: `Address Client Feedback: ${feedback.comment.slice(0, 45)}...`,
      module: feedback.type === 'design_pin' ? 'UI/UX Polish' : feedback.type === 'code_line' ? 'Code Hardening' : 'Motion/Video Review',
      status: 'in_progress',
      priority: 'high',
      assignee: 'Team Member',
      originFeedbackId: feedback.id,
      notes: `Client Feedback on ${feedback.targetRef}: "${feedback.comment}" by ${feedback.author}`,
      estimatedHours: 3,
      checklist: [
        { id: 'c-fb1', text: `Review deliverable at ${feedback.targetRef}`, completed: false, updatedAt: new Date().toISOString() },
        { id: 'c-fb2', text: 'Implement requested revision and verify compliance', completed: false, updatedAt: new Date().toISOString() },
        { id: 'c-fb3', text: 'Notify client for final sign-off', completed: false, updatedAt: new Date().toISOString() },
      ],
    };

    // Optimistic local update
    setFeedbackAnnotations((prev) =>
      prev.map((fb) => (fb.id === feedbackId ? { ...fb, status: 'converted', convertedTaskId: taskId } : fb))
    );
    setTasks((prev) => [newTask, ...prev]);

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          type: 'CONVERT_FEEDBACK_TO_TASK',
          payload: { feedbackId },
        })
      );
    }
  };

  // Collaborative Action: Send Chat Message
  const sendChatMessage = (text: string, attachment?: { name: string; size: string; type: string }) => {
    const newMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: currentUser.name,
      role: currentUser.role,
      color: currentUser.color,
      text,
      attachment,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, newMsg]);

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          type: 'CHAT_MESSAGE',
          payload: { text, attachment },
        })
      );
    }
  };

  // Broadcast cursor presence
  const broadcastCursorPresence = (activeField?: string) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          type: 'CURSOR_PRESENCE',
          payload: { activeField },
        })
      );
    }
  };

  return {
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
  };
}
