import { Sentiment } from '@/components/MessageBubble';

export interface User {
  id: string;
  name: string;
  avatarUrl?: string;
}

export const users: User[] = [
  { id: '1', name: 'Nova' },
  { id: '2', name: 'Orion' },
  { id: '3', name: 'Luna' },
  { id: '4', name: 'Io' },
  { id: '5', name: 'Celeste' },
  { id: '6', name: 'Andromeda' },
  { id: '7', name: 'Quasar' },
  { id: '8', name: 'Callisto' },
  { id: '9', name: 'Vega' },
  { id: '10', name: 'Sol' },
  { id: '11', name: 'Aurora' },
  { id: '12', name: 'Cygnus' },
  { id: '13', name: 'Nebula' },
  { id: '14', name: 'Lyra' },
  { id: '15', name: 'Rigel' },
  { id: '16', name: 'Zenith' },
  { id: '17', name: 'Hydra' },
  { id: '18', name: 'Polaris' },
  { id: '19', name: 'Phoenix' },
  { id: '20', name: 'Eclipse' },
];

export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  content: string;
  timestamp: Date;
  sentiment: Sentiment;
  mediaUrl?: string;
}

export interface Thread {
  id: string;
  participants: string[];
  name?: string;
  messages: Message[];
  lastActivity: Date;
  summary?: string;
  sentiment: Sentiment;
}

const STORAGE_KEY = 'nebula-threads-v2';
let persistedThreads: Thread[] = [];

if (typeof window !== 'undefined') {
  const storedData = localStorage.getItem(STORAGE_KEY);
  if (storedData) {
    persistedThreads = JSON.parse(storedData).map((t: Thread) => ({
      ...t,
      lastActivity: new Date(t.lastActivity),
      messages: t.messages.map(m => ({
        ...m,
        timestamp: new Date(m.timestamp)
      }))
    }));
  } else {
    persistedThreads = [
      {
        id: 'thread-1',
        participants: ['1', '2', '3', '4'],
        name: 'Cosmic Explorers',
        messages: [
          {
            id: 'msg-1',
            threadId: 'thread-1',
            senderId: '1',
            content: "The nebula expedition was incredible! The cosmic dust patterns were unlike anything we've seen before.",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
            sentiment: 'positive',
            mediaUrl: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fG5lYnVsYXxlbnwwfHwwfHx8MA%3D%3D',
          },
          {
            id: 'msg-2',
            threadId: 'thread-1',
            senderId: '2',
            content: "I agree. The wavelength shifts we recorded might suggest a previously undocumented stellar formation process.",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1),
            sentiment: 'neutral',
          },
          {
            id: 'msg-3',
            threadId: 'thread-1',
            senderId: '3',
            content: "The data looks promising. What concerns me is the gravitational anomaly we detected near the core.",
            timestamp: new Date(Date.now() - 1000 * 60 * 30),
            sentiment: 'negative',
          }
        ],
        lastActivity: new Date(Date.now() - 1000 * 60 * 30),
        summary: "Team discussing nebula expedition findings including cosmic dust patterns, wavelength shifts suggesting new stellar formation processes, and concerns about gravitational anomalies near the core.",
        sentiment: 'neutral',
      },
      {
        id: 'thread-2',
        participants: ['1', '5'],
        messages: [
          {
            id: 'msg-4',
            threadId: 'thread-2',
            senderId: '5',
            content: "Are you joining the quantum resonance workshop tomorrow?",
            timestamp: new Date(Date.now() - 1000 * 60 * 120),
            sentiment: 'neutral',
          },
          {
            id: 'msg-5',
            threadId: 'thread-2',
            senderId: '1',
            content: "Yes! I've been looking forward to it. The new resonance calibration techniques could revolutionize our approach.",
            timestamp: new Date(Date.now() - 1000 * 60 * 100),
            sentiment: 'positive',
          }
        ],
        lastActivity: new Date(Date.now() - 1000 * 60 * 100),
        summary: "Discussion about attending the quantum resonance workshop and excitement about new calibration techniques.",
        sentiment: 'positive',
      }
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persistedThreads));
  }
}

export const getThreads = (): Thread[] => {
  return [...persistedThreads].sort((a, b) => 
    b.lastActivity.getTime() - a.lastActivity.getTime()
  );
};

export const getThread = (threadId: string): Thread | undefined => {
  return persistedThreads.find(t => t.id === threadId);
};

export const saveThread = (thread: Thread): Thread => {
  const index = persistedThreads.findIndex(t => t.id === thread.id);
  if (index >= 0) {
    persistedThreads[index] = thread;
  } else {
    persistedThreads.push(thread);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(persistedThreads));
  return thread;
};

export interface MoodBoardItem {
  id: string;
  type: 'image' | 'text';
  content: string;
  position: { x: number; y: number };
}

export const getMoodBoardItems = (): MoodBoardItem[] => {
  return moodBoardItems;
};
export const moodBoardItems: MoodBoardItem[] = [
  {
    id: 'item-1',
    type: 'image',
    content: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fG5lYnVsYXxlbnwwfHwwfHx8MA%3D%3D',
    position: { x: 25, y: 30 },
  },
  {
    id: 'item-2',
    type: 'text',
    content: "The quantum patterns emerge from chaos, structured yet unpredictable.",
    position: { x: 60, y: 40 },
  },
  {
    id: 'item-3',
    type: 'image',
    content: 'https://images.unsplash.com/photo-1506703719100-a0b3a3bebc1c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    position: { x: 75, y: 70 },
  }
];

export const getCurrentUser = (): User => users[0];
export const getUsers = (): User[] => users;

export const analyzeSentiment = (text: string): Sentiment => {
  if (!text.trim()) return 'neutral';
  
  const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'love', 'happy', 'exciting', 'yes', 'awesome'];
  const negativeWords = ['bad', 'terrible', 'horrible', 'awful', 'sad', 'hate', 'unhappy', 'concerning', 'no', 'problem'];
  
  const cleanText = text.toLowerCase().replace(/[^\w\s]/g, '');
  const words = cleanText.split(/\s+/);
  
  const positiveCount = words.filter(w => positiveWords.includes(w)).length;
  const negativeCount = words.filter(w => negativeWords.includes(w)).length;

  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
};