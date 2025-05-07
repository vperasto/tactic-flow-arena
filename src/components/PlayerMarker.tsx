import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface PlayerMarkerProps {
  number: number;
  team: 'home' | 'away';
  initialX: number;
  initialY: number;
  onDragEnd?: (id: string, x: number, y: number) => void;
  id: string;
}

const PlayerMarker: React.FC<PlayerMarkerProps> = ({ 
  number, 
  team, 
  initialX,
  initialY,
  onDragEnd,
  id
}) => {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const markerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (markerRef.current) {
      isDragging.current = true;
      const rect = markerRef.current.getBoundingClientRect();
      offset.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging.current && markerRef.current) {
      const courtContainer = markerRef.current.closest('.court-container');
      if (courtContainer) {
        const courtRect = courtContainer.getBoundingClientRect();
        const markerSize = markerRef.current.offsetWidth;
        
        // Calculate new position
        const newX = e.clientX - courtRect.left - offset.current.x;
        const newY = e.clientY - courtRect.top - offset.current.y;
        
        // Keep the marker within court boundaries
        const boundedX = Math.max(0, Math.min(newX, courtRect.width - markerSize));
        const boundedY = Math.max(0, Math.min(newY, courtRect.height - markerSize));
        
        setPosition({ x: boundedX, y: boundedY });
      }
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    if (onDragEnd) {
      onDragEnd(id, position.x, position.y);
    }
  };

  // Handle touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    if (markerRef.current) {
      isDragging.current = true;
      const rect = markerRef.current.getBoundingClientRect();
      const touch = e.touches[0];
      offset.current = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    e.preventDefault(); // Prevent scrolling while dragging
    if (isDragging.current && markerRef.current) {
      const courtContainer = markerRef.current.closest('.court-container');
      if (courtContainer) {
        const courtRect = courtContainer.getBoundingClientRect();
        const touch = e.touches[0];
        const markerSize = markerRef.current.offsetWidth;
        
        // Calculate new position
        const newX = touch.clientX - courtRect.left - offset.current.x;
        const newY = touch.clientY - courtRect.top - offset.current.y;
        
        // Keep the marker within court boundaries
        const boundedX = Math.max(0, Math.min(newX, courtRect.width - markerSize));
        const boundedY = Math.max(0, Math.min(newY, courtRect.height - markerSize));
        
        setPosition({ x: boundedX, y: boundedY });
      }
    }
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
    if (onDragEnd) {
      onDragEnd(id, position.x, position.y);
    }
  };

  return (
    <div
      ref={markerRef}
      className={cn(
        'player-marker',
        team === 'home' ? 'player-marker-home' : 'player-marker-away'
      )}
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)',
        zIndex: 10,
        cursor: isDragging.current ? 'grabbing' : 'grab',
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {number}
    </div>
  );
};

export default PlayerMarker;
