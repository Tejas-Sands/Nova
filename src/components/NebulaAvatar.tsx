
import React from 'react';
import { cn } from '@/lib/utils';

type Sentiment = 'positive' | 'neutral' | 'negative';

interface NebulaAvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  sentiment?: Sentiment;
  isGroup?: boolean;
  className?: string;
}

const NebulaAvatar: React.FC<NebulaAvatarProps> = ({
  name,
  size = 'md',
  sentiment = 'neutral',
  isGroup = false,
  className,
}) => {
  const initials = name
    .split(' ')
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  const sentimentClasses = {
    positive: 'bg-nebula-positive/10 text-nebula-positive border-nebula-positive/30',
    neutral: 'bg-nebula-neutral/10 text-nebula-neutral border-nebula-neutral/30',
    negative: 'bg-nebula-negative/10 text-nebula-negative border-nebula-negative/30',
  };

  const shapeClasses = isGroup 
    ? 'rounded-lg' 
    : 'rounded-full';

  const animationClasses = isGroup 
    ? 'animate-float' 
    : 'transform hover:scale-110 transition-transform duration-300';

  return (
    <div
      className={cn(
        'flex items-center justify-center border',
        sizeClasses[size],
        sentimentClasses[sentiment],
        shapeClasses,
        animationClasses,
        'font-medium',
        className
      )}
    >
      {initials}
    </div>
  );
};

export default NebulaAvatar;
