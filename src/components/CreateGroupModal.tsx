
import React, { useState } from 'react';
import { getUsers, getCurrentUser, User } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';
import { X, UserPlus, Users } from 'lucide-react';
import NebulaAvatar from './NebulaAvatar';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGroup: (name: string, participants: string[]) => void;
}

const CreateGroupModal = ({ isOpen, onClose, onCreateGroup }: CreateGroupModalProps) => {
  const [groupName, setGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const users = getUsers();
  const currentUser = getCurrentUser();
  
  const availableUsers = users.filter(user => user.id !== currentUser.id);
  
  const toggleUser = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };
  
  const handleCreateGroup = () => {
    if (groupName.trim() && selectedUsers.length > 0) {
      // Add the current user to the group
      const allParticipants = [currentUser.id, ...selectedUsers];
      onCreateGroup(groupName, allParticipants);
      
      // Reset form
      setGroupName('');
      setSelectedUsers([]);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="bg-nebula-light border-nebula-accent/20 text-white max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg flex items-center gap-2">
            <Users className="w-5 h-5" />
            Create New Group
          </DialogTitle>
          <DialogDescription className="text-white/70">
            Select participants and name your new cosmic collective.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-3">
          <div>
            <label htmlFor="group-name" className="text-sm font-medium text-white/90 block mb-1">
              Group Name
            </label>
            <input
              id="group-name"
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="e.g. Cosmic Explorers"
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-nebula-accent/50"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-white/90 block mb-2">
              Select Participants
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-60 overflow-y-auto pr-1">
              {availableUsers.map(user => (
                <div 
                  key={user.id}
                  onClick={() => toggleUser(user.id)}
                  className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                    selectedUsers.includes(user.id) 
                      ? 'bg-nebula-accent/20 border border-nebula-accent/30' 
                      : 'bg-white/5 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  <NebulaAvatar 
                    name={user.name} 
                    size="sm" 
                    sentiment={selectedUsers.includes(user.id) ? 'positive' : 'neutral'} 
                  />
                  <span className="text-sm truncate">{user.name}</span>
                </div>
              ))}
            </div>
          </div>
          
          {selectedUsers.length > 0 && (
            <div className="text-sm text-white/70">
              {selectedUsers.length} participant{selectedUsers.length !== 1 ? 's' : ''} selected
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-2 mt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-white/70 hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateGroup}
            disabled={!groupName.trim() || selectedUsers.length === 0}
            className="bg-nebula-accent/20 border border-nebula-accent/30 rounded-lg px-4 py-2 text-white hover:bg-nebula-accent/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Group
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupModal;
