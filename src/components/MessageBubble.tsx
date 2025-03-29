
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

export type Sentiment = 'positive' | 'neutral' | 'negative';

interface MessageBubbleProps {
  message: string;
  isOwn: boolean;
  timestamp: string;
  sentiment: Sentiment;
  mediaUrl?: string;
  className?: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwn,
  timestamp,
  sentiment,
  mediaUrl,
  className,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [startX, setStartX] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    
    // If swiped right (for own messages) or left (for others' messages)
    if ((isOwn && diff > 50) || (!isOwn && diff < -50)) {
      setIsCollapsed(!isCollapsed);
    }
  };

  const sentimentClass = `sentiment-${sentiment}`;

  return (
    <div
      className={cn(
        "group mb-2 max-w-[80%] transition-all duration-300 ease-in-out",
        isOwn ? "ml-auto" : "mr-auto",
        isCollapsed ? "max-w-[30%] opacity-60" : "",
        className
      )}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className={cn(
          "nebula-glass rounded-2xl p-3 backdrop-blur transition-all",
          isOwn ? "rounded-tr-sm" : "rounded-tl-sm",
          sentimentClass
        )}
      >
        {mediaUrl && !isCollapsed && (
          <div className="mb-2 overflow-hidden rounded-lg">
            <img 
              src={mediaUrl} 
              alt="Shared media" 
              className="w-full object-cover transition-transform duration-200 hover:scale-105" 
            />
          </div>
        )}
        
        <p className={cn(
          "text-sm transition-all",
          isCollapsed ? "line-clamp-1" : ""
        )}>
          {message}
        </p>
        
        <div className="mt-1 text-right">
          <span className="text-xs text-white/50">{timestamp}</span>
        </div>
      </div>
      
      <div className={cn(
        "mt-1 opacity-0 transition-opacity group-hover:opacity-100",
        isCollapsed ? "opacity-100" : ""
      )}>
        <span className="text-xs text-white/50">
          {isCollapsed ? "Swipe to expand" : "Swipe to collapse"}
        </span>
      </div>
    </div>
  );
};

export default MessageBubble;
