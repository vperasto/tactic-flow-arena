
import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface ArrowProps {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  onDelete: (id: string) => void;
  onUpdate: (id: string, startX: number, startY: number, endX: number, endY: number) => void;
  selected: boolean;
  onSelect: (id: string) => void;
}

const Arrow: React.FC<ArrowProps> = ({
  id,
  startX,
  startY,
  endX,
  endY,
  onDelete,
  onUpdate,
  selected,
  onSelect
}) => {
  const [isMoving, setIsMoving] = useState(false);
  const [moveStart, setMoveStart] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ 
    startX, startY, endX, endY 
  });
  const arrowRef = useRef<SVGLineElement>(null);
  const movingPoint = useRef<'start' | 'end' | 'whole'>(null);

  const handleMouseDown = (e: React.MouseEvent, point: 'start' | 'end' | 'whole') => {
    e.stopPropagation();
    setIsMoving(true);
    movingPoint.current = point;
    setMoveStart({ x: e.clientX, y: e.clientY });
    onSelect(id);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isMoving && arrowRef.current) {
      const courtContainer = arrowRef.current.closest('.court-container');
      if (courtContainer) {
        const courtRect = courtContainer.getBoundingClientRect();
        const dx = e.clientX - moveStart.x;
        const dy = e.clientY - moveStart.y;
        
        if (movingPoint.current === 'start') {
          setPosition(prev => ({
            ...prev,
            startX: Math.max(0, Math.min(prev.startX + dx, courtRect.width)),
            startY: Math.max(0, Math.min(prev.startY + dy, courtRect.height))
          }));
        } else if (movingPoint.current === 'end') {
          setPosition(prev => ({
            ...prev,
            endX: Math.max(0, Math.min(prev.endX + dx, courtRect.width)),
            endY: Math.max(0, Math.min(prev.endY + dy, courtRect.height))
          }));
        } else if (movingPoint.current === 'whole') {
          setPosition(prev => ({
            startX: Math.max(0, Math.min(prev.startX + dx, courtRect.width)),
            startY: Math.max(0, Math.min(prev.startY + dy, courtRect.height)),
            endX: Math.max(0, Math.min(prev.endX + dx, courtRect.width)),
            endY: Math.max(0, Math.min(prev.endY + dy, courtRect.height))
          }));
        }
        
        setMoveStart({ x: e.clientX, y: e.clientY });
      }
    }
  };

  const handleMouseUp = () => {
    setIsMoving(false);
    movingPoint.current = null;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    onUpdate(id, position.startX, position.startY, position.endX, position.endY);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(id);
  };

  // Calculate arrow length for hit detection
  const length = Math.sqrt(
    Math.pow(position.endX - position.startX, 2) + 
    Math.pow(position.endY - position.startY, 2)
  );
  
  // Calculate angle for rotation
  const angle = Math.atan2(
    position.endY - position.startY, 
    position.endX - position.startX
  ) * 180 / Math.PI;

  return (
    <>
      <line
        ref={arrowRef}
        x1={position.startX}
        y1={position.startY}
        x2={position.endX}
        y2={position.endY}
        className={cn(
          "cursor-pointer",
          selected ? "stroke-brand-orange stroke-[3px]" : "stroke-brand-red stroke-[2px]"
        )}
        markerEnd="url(#arrowhead)"
        onClick={(e) => {
          e.stopPropagation();
          onSelect(id);
        }}
        onMouseDown={(e) => handleMouseDown(e, 'whole')}
      />
      
      {selected && (
        <>
          {/* Start point handle */}
          <circle
            cx={position.startX}
            cy={position.startY}
            r={5}
            fill="#FF9F1C"
            stroke="#FFFFFF"
            strokeWidth={2}
            cursor="move"
            onMouseDown={(e) => handleMouseDown(e, 'start')}
          />
          
          {/* End point handle */}
          <circle
            cx={position.endX}
            cy={position.endY}
            r={5}
            fill="#FF4D4D"
            stroke="#FFFFFF"
            strokeWidth={2}
            cursor="move"
            onMouseDown={(e) => handleMouseDown(e, 'end')}
          />
          
          {/* Delete button - positioned near the middle of the arrow */}
          <g
            transform={`translate(
              ${position.startX + (position.endX - position.startX) / 2}, 
              ${position.startY + (position.endY - position.startY) / 2}
            )`}
            onClick={handleDelete}
            style={{ cursor: 'pointer' }}
          >
            <circle
              r={8}
              fill="#F472B6"
              stroke="#FFFFFF"
              strokeWidth={1}
            />
            <text
              x="0"
              y="0"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              fontSize="10px"
              fontWeight="bold"
            >
              ×
            </text>
          </g>
        </>
      )}
    </>
  );
};

export default Arrow;
