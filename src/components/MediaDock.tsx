
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface MediaDockProps {
  onMediaSelect: (type: 'image' | 'video' | 'audio') => void;
  className?: string;
}

const MediaDock: React.FC<MediaDockProps> = ({ onMediaSelect, className }) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleDockToggle = () => {
    setIsVisible(!isVisible);
  };

  const handleMediaSelect = (type: 'image' | 'video' | 'audio') => {
    onMediaSelect(type);
    setIsVisible(false);
  };

  return (
    <div 
      className={cn(
        "media-dock group",
        isVisible ? "opacity-100" : "",
        className
      )}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onClick={handleDockToggle}
    >
      <div 
        className={cn(
          "flex gap-4 transition-all duration-300",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        )}
      >
        <button 
          className="nebula-icon"
          onClick={() => handleMediaSelect('image')}
        >
          I
        </button>
        <button 
          className="nebula-icon"
          onClick={() => handleMediaSelect('video')}
        >
          V
        </button>
        <button 
          className="nebula-icon"
          onClick={() => handleMediaSelect('audio')}
        >
          A
        </button>
      </div>
      
      <div 
        className={cn(
          "absolute h-12 w-12 flex items-center justify-center rounded-full bg-nebula-accent/20 border border-nebula-accent/30",
          "transition-all duration-300",
          isVisible ? "scale-0" : "scale-100"
        )}
      >
        <span className="text-white font-light">M</span>
      </div>
    </div>
  );
};

export default MediaDock;
