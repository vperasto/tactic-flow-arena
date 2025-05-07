
import React, { useState, useRef } from 'react';

interface ArrowToolProps {
  onArrowCreated: (startX: number, startY: number, endX: number, endY: number, type: string) => void;
  isActive: boolean;
  arrowType: string;
}

const ArrowTool: React.FC<ArrowToolProps> = ({ onArrowCreated, isActive, arrowType }) => {
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
      onArrowCreated(start.x, start.y, end.x, end.y, arrowType);
    }
  };

  // Touch events for mobile/tablet support
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isActive || !courtRef.current) return;
    
    const courtRect = courtRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const startX = touch.clientX - courtRect.left;
    const startY = touch.clientY - courtRect.top;
    
    setStart({ x: startX, y: startY });
    setEnd({ x: startX, y: startY });
    setDrawing(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!drawing || !isActive || !courtRef.current) return;
    e.preventDefault(); // Prevent scrolling while drawing
    
    const courtRect = courtRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const endX = touch.clientX - courtRect.left;
    const endY = touch.clientY - courtRect.top;
    
    setEnd({ x: endX, y: endY });
  };

  const handleTouchEnd = () => {
    if (!drawing || !isActive) return;
    
    setDrawing(false);
    const distance = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
    if (distance > 10) {
      onArrowCreated(start.x, start.y, end.x, end.y, arrowType);
    }
  };

  // Function to render a different preview based on arrow type
  const renderArrowPreview = () => {
    if (!drawing) return null;

    switch (arrowType) {
      case 'dotted-arrow':
        return (
          <line
            x1={start.x}
            y1={start.y}
            x2={end.x}
            y2={end.y}
            stroke="#FF4D4D"
            strokeWidth="2"
            strokeDasharray="5,5"
            markerEnd="url(#arrowhead)"
          />
        );
      case 'bidirectional-arrow':
        return (
          <line
            x1={start.x}
            y1={start.y}
            x2={end.x}
            y2={end.y}
            stroke="#FF4D4D"
            strokeWidth="2"
            markerEnd="url(#arrowhead)"
            markerStart="url(#arrowhead-start)"
          />
        );
      case 'curved-arrow':
        // Calculate control point for the curve (perpendicular to the line)
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const midX = (start.x + end.x) / 2;
        const midY = (start.y + end.y) / 2;
        // Create a perpendicular vector for the control point
        const perpX = -dy * 0.5; // Adjust the multiplier to control the curve
        const perpY = dx * 0.5;  // Adjust the multiplier to control the curve
        
        return (
          <path
            d={`M ${start.x} ${start.y} Q ${midX + perpX} ${midY + perpY} ${end.x} ${end.y}`}
            stroke="#FF4D4D"
            strokeWidth="2"
            fill="none"
            markerEnd="url(#arrowhead)"
          />
        );
      case 'curved-arrow-reverse':
        // Calculate control point for the curve (perpendicular to the line, opposite direction)
        const dxRev = end.x - start.x;
        const dyRev = end.y - start.y;
        const midXRev = (start.x + end.x) / 2;
        const midYRev = (start.y + end.y) / 2;
        // Reverse the perpendicular vector
        const perpXRev = dyRev * 0.5;
        const perpYRev = -dxRev * 0.5;
        
        return (
          <path
            d={`M ${start.x} ${start.y} Q ${midXRev + perpXRev} ${midYRev + perpYRev} ${end.x} ${end.y}`}
            stroke="#FF4D4D"
            strokeWidth="2"
            fill="none"
            markerEnd="url(#arrowhead)"
          />
        );
      default: // Standard arrow
        return (
          <line
            x1={start.x}
            y1={start.y}
            x2={end.x}
            y2={end.y}
            stroke="#FF4D4D"
            strokeWidth="2"
            markerEnd="url(#arrowhead)"
          />
        );
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
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
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
            <marker
              id="arrowhead-start"
              markerWidth="10"
              markerHeight="7"
              refX="10"
              refY="3.5"
              orient="auto-start-reverse"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#FF4D4D" />
            </marker>
          </defs>
          {renderArrowPreview()}
        </svg>
      )}
    </div>
  );
};

export default ArrowTool;
