
import React, { useState } from 'react';
import { getUsers, getCurrentUser, User } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import NebulaAvatar from './NebulaAvatar';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

interface StartChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartChat: (userId: string) => void;
}

const StartChatModal = ({ isOpen, onClose, onStartChat }: StartChatModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const users = getUsers();
  const currentUser = getCurrentUser();
  
  const availableUsers = users.filter(user => user.id !== currentUser.id);
  
  const filteredUsers = searchQuery.trim() 
    ? availableUsers.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : availableUsers;
  
  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="bg-nebula-light border-nebula-accent/20 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Start New Conversation
          </DialogTitle>
          <DialogDescription className="text-white/70">
            Connect with a fellow explorer.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name..."
            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white mb-4 focus:outline-none focus:border-nebula-accent/50"
          />
          
          <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
            {filteredUsers.map(user => (
              <div 
                key={user.id}
                onClick={() => onStartChat(user.id)}
                className="flex items-center gap-3 p-3 rounded-lg cursor-pointer bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <NebulaAvatar name={user.name} size="md" sentiment="neutral" />
                <div>
                  <div className="font-medium">{user.name}</div>
                </div>
              </div>
            ))}
            
            {filteredUsers.length === 0 && (
              <div className="text-center py-8 text-white/50">
                No users found matching "{searchQuery}"
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StartChatModal;
