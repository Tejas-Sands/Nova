
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <div
        className="absolute inset-0 bg-nebula-dark opacity-50"
        style={{
          backgroundImage: `radial-gradient(
            circle at ${cursorPosition.x}px ${cursorPosition.y}px,
            rgba(129, 140, 248, 0.4) 0%,
            transparent 60%
          )`
        }}
      />
      
      <div className="absolute w-64 h-64 bg-nebula-glow/5 rounded-full animate-float blur-3xl -top-20 -left-20" />
      <div className="absolute w-96 h-96 bg-nebula-negative/5 rounded-full animate-float blur-3xl -bottom-40 -right-20" />
      
      <div className="text-center z-10">
        <h1 className="text-9xl font-thin text-nebula-accent/80 animate-pulse-glow">404</h1>
        <div className="h-px w-40 mx-auto my-6 bg-gradient-to-r from-transparent via-nebula-accent/50 to-transparent" />
        <p className="text-2xl font-light text-white mb-6">Signal lost in the void</p>
        <p className="text-white/60 max-w-md mb-10">
          The thread you're seeking has drifted beyond our reach, possibly collapsed into a cosmic anomaly or simply misplaced in the nebula.
        </p>
        
        <Link
          to="/"
          className="nebula-glass px-8 py-3 rounded-full text-white hover:bg-white/10 transition-colors"
        >
          Return to reality
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
