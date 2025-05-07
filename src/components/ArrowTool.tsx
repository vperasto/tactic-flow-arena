
import React, { useState, useRef } from 'react';

interface ArrowToolProps {
  onArrowCreated: (startX: number, startY: number, endX: number, endY: number) => void;
  isActive: boolean;
}

const ArrowTool: React.FC<ArrowToolProps> = ({ onArrowCreated, isActive }) => {
  const [drawing, setDrawing] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });
  const [end, setEnd] = useState({ x: 0, y: 0 });
  const courtRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isActive || !courtRef.current) return;
    
    const courtRect = courtRef.current.getBoundingClientRect();
    const startX = e.clientX - courtRect.left;
    const startY = e.clientY - courtRect.top;
    
    setStart({ x: startX, y: startY });
    setEnd({ x: startX, y: startY });
    setDrawing(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!drawing || !isActive || !courtRef.current) return;
    
    const courtRect = courtRef.current.getBoundingClientRect();
    const endX = e.clientX - courtRect.left;
    const endY = e.clientY - courtRect.top;
    
    setEnd({ x: endX, y: endY });
  };

  const handleMouseUp = () => {
    if (!drawing || !isActive) return;
    
    setDrawing(false);
    // Only create an arrow if there was significant movement
    const distance = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
    if (distance > 10) {
      onArrowCreated(start.x, start.y, end.x, end.y);
    }
  };

  return (
    <div
      ref={courtRef}
      className="absolute top-0 left-0 w-full h-full"
      style={{ 
        pointerEvents: isActive ? 'auto' : 'none',
        cursor: isActive ? 'crosshair' : 'default'
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {drawing && (
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="0"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#FF4D4D" />
            </marker>
          </defs>
          <line
            x1={start.x}
            y1={start.y}
            x2={end.x}
            y2={end.y}
            stroke="#FF4D4D"
            strokeWidth="2"
            markerEnd="url(#arrowhead)"
          />
        </svg>
      )}
    </div>
  );
};

export default ArrowTool;
