import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import NebulaBrand from '@/components/NebulaBrand';
import NebulaAvatar from '@/components/NebulaAvatar';
import MessageBubble from '@/components/MessageBubble';
import ThreadSculpture from '@/components/ThreadSculpture';
import MediaDock from '@/components/MediaDock';
import MoodBoard from '@/components/MoodBoard';
import { 
  getCurrentUser, 
  getThread, 
  getUsers, 
  analyzeSentiment, 
  getMoodBoardItems,
  saveThread,
  Thread as ThreadType,
  Message
} from '@/data/mockData'; // Added saveThread import
import type { Sentiment } from '@/components/MessageBubble';

const Thread = () => {
  const { threadId } = useParams<{ threadId: string }>();
  const navigate = useNavigate();
  
  const [thread, setThread] = useState<ThreadType | undefined>(undefined);
  const [message, setMessage] = useState('');
  const [lastSentiment, setLastSentiment] = useState<Sentiment>('neutral');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  
  const currentUser = getCurrentUser();
  const users = getUsers();
  const moodBoardItems = getMoodBoardItems();

  useEffect(() => {
    if (threadId) {
      const fetchedThread = getThread(threadId);
      if (fetchedThread) {
        setThread(fetchedThread);
        setLastSentiment(fetchedThread.sentiment);
      } else if (threadId !== 'new') {
        navigate('/');
      }
    }
  }, [threadId, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread?.messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    const sentiment = analyzeSentiment(message);
    setLastSentiment(sentiment);
    
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      threadId: thread?.id || 'new-thread',
      senderId: currentUser.id,
      content: message,
      timestamp: new Date(),
      sentiment,
    };
    
    if (thread) {
      const updatedMessages = [...thread.messages, newMessage];
      const updatedThread = {
        ...thread,
        messages: updatedMessages,
        lastActivity: new Date(),
        sentiment: calculateThreadSentiment(updatedMessages),
      };
      
      setThread(updatedThread);
      saveThread(updatedThread); // Added persistence
    } else {
      const newThread: ThreadType = {
        id: `thread-${Date.now()}`,
        participants: [currentUser.id, '2'],
        messages: [newMessage],
        lastActivity: new Date(),
        sentiment,
      };
      
      setThread(newThread);
      saveThread(newThread); // Added persistence
      navigate(`/thread/${newThread.id}`, { replace: true });
    }
    
    setMessage('');
  };
  const handleMediaSelect = (type: 'image' | 'video' | 'audio') => {
    let mediaUrl = '';
    let content = '';
    
    if (type === 'image') {
      mediaUrl = 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fG5lYnVsYXxlbnwwfHwwfHx8MA%3D%3D';
      content = 'Shared an image';
    } else if (type === 'video') {
      mediaUrl = 'https://images.unsplash.com/photo-1506703719100-a0b3a3bebc1c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
      content = 'Shared a video';
    } else {
      mediaUrl = '';
      content = 'Shared audio';
    }
    
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      threadId: thread?.id || 'new-thread',
      senderId: currentUser.id,
      content,
      timestamp: new Date(),
      sentiment: 'neutral',
      mediaUrl,
    };
    
    if (thread) {
      const updatedMessages = [...thread.messages, newMessage];
      const updatedThread = {
        ...thread,
        messages: updatedMessages,
        lastActivity: new Date(),
      };
      
      setThread(updatedThread);
      saveThread(updatedThread);
    } else {
      const newThread: ThreadType = {
        id: `thread-${Date.now()}`,
        participants: [currentUser.id, '2'],
        messages: [newMessage],
        lastActivity: new Date(),
        sentiment: 'neutral',
      };
      
      setThread(newThread);
      saveThread(newThread);
      navigate(`/thread/${newThread.id}`, { replace: true });
    }
  };
  
  const calculateThreadSentiment = (messages: Message[]): Sentiment => {
    const recentMessages = messages.slice(-5);
    const sentiments = recentMessages.map(msg => msg.sentiment);
    
    const positiveCount = sentiments.filter(s => s === 'positive').length;
    const negativeCount = sentiments.filter(s => s === 'negative').length;
    const neutralCount = sentiments.filter(s => s === 'neutral').length;
    
    if (positiveCount > negativeCount && positiveCount > neutralCount) return 'positive';
    if (negativeCount > positiveCount && negativeCount > neutralCount) return 'negative';
    return 'neutral';
  };
  
  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{
        background: `radial-gradient(circle at 50% 50%, 
          ${lastSentiment === 'positive' ? 'rgba(34,211,238,0.15)' : 
            lastSentiment === 'negative' ? 'rgba(244,114,182,0.15)' : 
            'rgba(129,140,248,0.15)'} 0%, 
          rgba(15,23,42,1) 70%)`,
        transition: 'background 1s ease-in-out'
      }}
    >
      <div className="flex items-center p-4 nebula-glass">
        <Link to="/" className="mr-4 text-white/70 hover:text-white">
          ←
        </Link>
        
        <div className="flex-1">
          <NebulaBrand />
        </div>
        
        {thread && (
          <div className="flex items-center space-x-2">
            {thread.participants
              .filter(id => id !== currentUser.id)
              .slice(0, 2)
              .map(participantId => {
                const participant = users.find(u => u.id === participantId);
                return participant ? (
                  <NebulaAvatar 
                    key={participantId}
                    name={participant.name}
                    size="sm"
                    sentiment={thread.sentiment}
                    isGroup={thread.participants.length > 2}
                  />
                ) : null;
              })}
              
            {thread.participants.length - 1 > 2 && (
              <div className="h-8 w-8 flex items-center justify-center rounded-full bg-nebula-light/50 text-xs text-white/70">
                +{thread.participants.length - 3}
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="flex-1 px-4 py-6 overflow-y-auto">
        {thread && thread.messages.length > 0 ? (
          <>
            {thread.messages.length > 5 && (
              <ThreadSculpture
                summary={thread.summary || "An ongoing conversation about cosmic matters."}
                sentiment={thread.sentiment}
                participantCount={thread.participants.length}
                messageCount={thread.messages.length}
                className="mb-6"
              />
            )}
            
            <div className="space-y-4">
              {thread.messages.map(msg => {
                const sender = users.find(u => u.id === msg.senderId);
                const isOwn = msg.senderId === currentUser.id;
                
                const formattedTime = new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                });
                
                return (
                  <div key={msg.id} className="flex items-end gap-2">
                    {!isOwn && (
                      <NebulaAvatar
                        name={sender?.name || 'Unknown'}
                        size="sm"
                        sentiment={msg.sentiment}
                      />
                    )}
                    
                    <MessageBubble
                      message={msg.content}
                      isOwn={isOwn}
                      timestamp={formattedTime}
                      sentiment={msg.sentiment}
                      mediaUrl={msg.mediaUrl}
                    />
                  </div>
                );
              })}
            </div>
            <div ref={messagesEndRef} />
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="animate-float">
              <div className="h-20 w-20 rounded-full bg-nebula-accent/20 flex items-center justify-center mb-4 mx-auto">
                <span className="text-3xl font-light">N</span>
              </div>
              <p className="text-white/70">Begin your telepathic connection...</p>
              <p className="text-xs text-white/50 mt-2">Type a message below to start</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <textarea
            ref={messageInputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Share your thoughts..."
            className="flex-1 bg-white/5 border border-white/10 rounded-lg p-3 text-white resize-none h-12 focus:outline-none focus:border-nebula-accent/50"
            style={{
              transition: 'border-color 0.3s ease-in-out',
              borderColor: message ? 
                lastSentiment === 'positive' ? 'rgba(34,211,238,0.3)' : 
                lastSentiment === 'negative' ? 'rgba(244,114,182,0.3)' : 
                'rgba(129,140,248,0.3)' : 'rgba(255,255,255,0.1)'
            }}
          />
          
          <button
            type="submit"
            className="bg-nebula-accent/20 border border-nebula-accent/30 rounded-lg px-4 text-white hover:bg-nebula-accent/30 transition-colors"
          >
            →
          </button>
        </form>
      </div>
      
      <MediaDock onMediaSelect={handleMediaSelect} />
      <MoodBoard items={moodBoardItems} />
    </div>
  );
};

export default Thread;
