
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface MoodBoardItem {
  id: string;
  type: 'image' | 'text';
  content: string;
  position: { x: number; y: number };
}

interface MoodBoardProps {
  items: MoodBoardItem[];
  className?: string;
}

const MoodBoard: React.FC<MoodBoardProps> = ({ items: initialItems, className }) => {
  const [items, setItems] = useState(initialItems);
  const [dragItem, setDragItem] = useState<string | null>(null);
  const [boardVisible, setBoardVisible] = useState(false);

  const handleDragStart = (id: string) => {
    setDragItem(id);
  };

  const handleDragEnd = () => {
    setDragItem(null);
  };

  const handleDragMove = (e: React.MouseEvent, id: string) => {
    if (dragItem === id) {
      const boardElement = document.getElementById('mood-board');
      if (!boardElement) return;

      const rect = boardElement.getBoundingClientRect();

      // Calculate position relative to the board
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      // Update item position
      setItems(items.map(item => 
        item.id === id 
          ? { ...item, position: { x: Math.max(0, Math.min(x, 100)), y: Math.max(0, Math.min(y, 100)) } } 
          : item
      ));
    }
  };

  const toggleBoard = () => {
    setBoardVisible(!boardVisible);
  };

  return (
    <>
      <button 
        className="fixed right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full nebula-glass text-white/80 transition-colors hover:text-white"
        onClick={toggleBoard}
      >
        M
      </button>

      <div 
        id="mood-board"
        className={cn(
          "fixed inset-0 z-50 bg-black/70 backdrop-blur-md transition-all duration-500",
          boardVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
          className
        )}
        onClick={() => setBoardVisible(false)}
      >
        <div 
          className="relative h-full w-full overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {items.map((item) => (
            <div
              key={item.id}
              className={cn(
                "absolute transform transition-all duration-200 cursor-move",
                dragItem === item.id ? "z-10 scale-105" : "z-0"
              )}
              style={{
                left: `${item.position.x}%`,
                top: `${item.position.y}%`,
                transform: `translate(-50%, -50%)`,
              }}
              onMouseDown={() => handleDragStart(item.id)}
              onMouseUp={handleDragEnd}
              onMouseMove={(e) => handleDragMove(e, item.id)}
            >
              {item.type === 'image' ? (
                <img
                  src={item.content}
                  alt="Mood board item"
                  className="max-h-48 max-w-48 rounded-lg nebula-glass p-1"
                />
              ) : (
                <div className="nebula-glass max-w-xs rounded-lg p-3 text-white">
                  {item.content}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MoodBoard;
