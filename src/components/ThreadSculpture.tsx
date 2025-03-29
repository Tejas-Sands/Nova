
import React from 'react';
import { cn } from '@/lib/utils';
import { Sentiment } from './MessageBubble';

interface ThreadSculptureProps {
  summary: string;
  sentiment: Sentiment;
  participantCount: number;
  messageCount: number;
  className?: string;
}

const ThreadSculpture: React.FC<ThreadSculptureProps> = ({
  summary,
  sentiment,
  participantCount,
  messageCount,
  className,
}) => {
  const sentimentColors = {
    positive: 'bg-nebula-positive/10 border-nebula-positive/20 text-nebula-positive',
    neutral: 'bg-nebula-neutral/10 border-nebula-neutral/20 text-nebula-neutral',
    negative: 'bg-nebula-negative/10 border-nebula-negative/20 text-nebula-negative',
  };

  return (
    <div className={cn(
      'nebula-glass p-4 rounded-lg',
      'border',
      sentimentColors[sentiment],
      'animate-pulse-glow',
      className
    )}>
      <div className="flex justify-between mb-2">
        <div className="text-xs uppercase tracking-wider text-white/60">Thread Summary</div>
        <div className="text-xs text-white/60">{participantCount} people · {messageCount} messages</div>
      </div>
      
      <p className="text-sm leading-relaxed">
        {summary}
      </p>
      
      <div className="mt-3 h-1 w-full rounded-full bg-white/10">
        <div 
          className={cn(
            "h-full rounded-full transition-all duration-500",
            sentiment === 'positive' ? 'bg-nebula-positive' : '',
            sentiment === 'neutral' ? 'bg-nebula-neutral' : '',
            sentiment === 'negative' ? 'bg-nebula-negative' : ''
          )} 
          style={{ width: `${(messageCount / 30) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ThreadSculpture;
