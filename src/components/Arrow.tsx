
import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface ArrowProps {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  type: string;
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
  type = 'arrow',
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
  const arrowRef = useRef<SVGElement>(null);
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

  const renderArrow = () => {
    const commonProps = {
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation();
        onSelect(id);
      },
      onMouseDown: (e: React.MouseEvent) => handleMouseDown(e, 'whole'),
      className: cn(
        "cursor-pointer",
        selected ? "stroke-brand-orange stroke-[3px]" : "stroke-brand-red stroke-[2px]"
      )
    };

    switch (type) {
      case 'dotted-arrow':
        return (
          <line
            ref={arrowRef as React.RefObject<SVGLineElement>}
            x1={position.startX}
            y1={position.startY}
            x2={position.endX}
            y2={position.endY}
            strokeDasharray="5,5"
            markerEnd="url(#arrowhead)"
            {...commonProps}
          />
        );
      case 'bidirectional-arrow':
        return (
          <line
            ref={arrowRef as React.RefObject<SVGLineElement>}
            x1={position.startX}
            y1={position.startY}
            x2={position.endX}
            y2={position.endY}
            markerEnd="url(#arrowhead)"
            markerStart="url(#arrowhead-start)"
            {...commonProps}
          />
        );
      case 'curved-arrow':
        // Calculate control point for the curve
        const dx = position.endX - position.startX;
        const dy = position.endY - position.startY;
        const midX = (position.startX + position.endX) / 2;
        const midY = (position.startY + position.endY) / 2;
        const perpX = -dy * 0.5;
        const perpY = dx * 0.5;
        
        return (
          <path
            ref={arrowRef as React.RefObject<SVGPathElement>}
            d={`M ${position.startX} ${position.startY} Q ${midX + perpX} ${midY + perpY} ${position.endX} ${position.endY}`}
            fill="none"
            markerEnd="url(#arrowhead)"
            {...commonProps}
          />
        );
      default: // Regular arrow
        return (
          <line
            ref={arrowRef as React.RefObject<SVGLineElement>}
            x1={position.startX}
            y1={position.startY}
            x2={position.endX}
            y2={position.endY}
            markerEnd="url(#arrowhead)"
            {...commonProps}
          />
        );
    }
  };

  return (
    <>
      {renderArrow()}
      
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
