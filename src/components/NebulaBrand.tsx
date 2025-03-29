
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface NebulaBrandProps {
  className?: string;
}

const NebulaBrand: React.FC<NebulaBrandProps> = ({ className }) => {
  const [isDissolving, setIsDissolving] = useState(false);

  const handleLogoClick = () => {
    setIsDissolving(true);
    setTimeout(() => setIsDissolving(false), 1000);
  };

  return (
    <div 
      className={cn(
        "flex items-center justify-center py-2",
        isDissolving ? "animate-dissolve" : "hover:opacity-80 transition-opacity cursor-pointer",
        className
      )}
      onClick={handleLogoClick}
    >
      <div className="relative">
        <span className="text-2xl font-light tracking-wider text-white">Nova</span>
        <span className="ml-1 text-sm font-extralight text-white/70">Threads</span>
        <div className="absolute -bottom-1 h-px w-full bg-gradient-to-r from-transparent via-nebula-glow to-transparent" />
      </div>
    </div>
  );
};

export default NebulaBrand;
