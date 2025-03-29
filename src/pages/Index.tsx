import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NebulaBrand from '@/components/NebulaBrand';
import NebulaAvatar from '@/components/NebulaAvatar';
import ThreadSculpture from '@/components/ThreadSculpture';
import CreateGroupModal from '@/components/CreateGroupModal';
import StartChatModal from '@/components/StartChatModal';
import { 
  getCurrentUser, 
  getThreads, 
  getUsers, 
  saveThread,
  Thread,
  User
} from '@/data/mockData';
import { MessageCircle, Users, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'threads' | 'contacts'>('threads');
  const [threads, setThreads] = useState<Thread[]>([]);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const currentUser = getCurrentUser();
  const users = getUsers().filter(user => user.id !== currentUser.id);

  useEffect(() => {
    const loadThreads = () => setThreads(getThreads());
    loadThreads();

    const handleStorageChange = () => loadThreads();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleCreateGroup = (name: string, participants: string[]) => {
    const newThread: Thread = {
      id: `thread-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      participants,
      name,
      messages: [],
      lastActivity: new Date(),
      sentiment: 'neutral'
    };
    
    saveThread(newThread);
    setThreads(getThreads());
    navigate(`/thread/${newThread.id}`);
    
    toast({
      title: "Group Created",
      description: `"${name}" group created with ${participants.length} members`,
    });
  };

  const handleStartChat = (userId: string) => {
    const existingThread = threads.find(thread => 
      thread.participants.length === 2 && 
      thread.participants.includes(currentUser.id) && 
      thread.participants.includes(userId)
    );

    if (existingThread) {
      navigate(`/thread/${existingThread.id}`);
    } else {
      const newThread: Thread = {
        id: `thread-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        participants: [currentUser.id, userId],
        messages: [],
        lastActivity: new Date(),
        sentiment: 'neutral'
      };
      
      saveThread(newThread);
      setThreads(getThreads());
      navigate(`/thread/${newThread.id}`);
    }
    setIsChatModalOpen(false);
  };

  const handleQuickAction = () => {
    activeTab === 'threads' ? setIsGroupModalOpen(true) : setIsChatModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-nebula-dark">
      <NebulaBrand className="px-6 py-4" />
      
      <div className="flex justify-center mb-6">
        <div className="bg-white/5 backdrop-blur-lg rounded-full p-1 flex">
          <button 
            className={`px-6 py-2 rounded-full text-sm transition-colors ${
              activeTab === 'threads' 
                ? 'bg-nebula-accent/30 text-white' 
                : 'text-white/60 hover:text-white/80'
            }`}
            onClick={() => setActiveTab('threads')}
          >
            Threads
          </button>
          <button 
            className={`px-6 py-2 rounded-full text-sm transition-colors ${
              activeTab === 'contacts' 
                ? 'bg-nebula-accent/30 text-white' 
                : 'text-white/60 hover:text-white/80'
            }`}
            onClick={() => setActiveTab('contacts')}
          >
            Contacts
          </button>
        </div>
      </div>
      {threads.summary}
<div className="flex-1 px-4 pb-20 overflow-y-auto">
  {activeTab === 'threads' ? (
    <div className="space-y-4">
      {threads.map(thread => (
        <div
          key={thread.id}
          className="bg-white/5 backdrop-blur-lg rounded-xl p-4 transition-all
                   hover:bg-white/10 cursor-pointer"
          onClick={() => navigate(`/thread/${thread.id}`)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="flex -space-x-2 shrink-0">
              <div className="flex -space-x-2">
                      {thread.participants.slice(0, 3).map(userId => {
                        const user = getUsers().find(u => u.id === userId);
                        return (
                          <NebulaAvatar
                            key={userId}
                            name={user?.name || 'Unknown'}
                            size="sm"
                            sentiment={thread.sentiment}
                          />
                        );
                      })}
                    </div>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-medium text-white truncate">
                  {thread.name || thread.participants
                    .map(id => getUsers().find(u => u.id === id)?.name)
                    .filter(Boolean)
                    .join(', ')}
                </h3>
                <p className="text-xs text-white/50 mt-1 truncate">
                  {thread.summary || 'New conversation'}
                </p>
              </div>
            </div>
            <div className="ml-4 shrink-0">
              <p className="text-xs text-white/50 whitespace-nowrap">
                {new Date(thread.lastActivity).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {users.map(user => (
        <div
          key={user.id}
          className="bg-white/5 backdrop-blur-lg rounded-xl p-4 flex flex-col items-center
                   hover:bg-white/10 transition-colors cursor-pointer"
        >
          <NebulaAvatar
            name={user.name}
            size="lg"
            className="mb-2"
          />
          <span className="text-sm text-white/80 text-center px-1 truncate w-full">
            {user.name}
          </span>
        </div>
      ))}
    </div>
  )}
</div>

      <div className="fixed bottom-4 right-4 flex gap-2">
        <button
          className="p-3 rounded-full bg-nebula-accent hover:bg-nebula-accent/90 
                   text-white shadow-xl transition-all"
          onClick={handleQuickAction}
        >
          <Plus size={24} />
        </button>
      </div>

      <CreateGroupModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        onCreateGroup={handleCreateGroup}
      />

      <StartChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        onStartChat={handleStartChat}
      />
    </div>
  );
};

export default Index;

