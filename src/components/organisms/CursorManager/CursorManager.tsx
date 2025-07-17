import React, { useEffect, useState } from 'react';
import { CollaboratorCursor } from '../../atoms/CollaboratorCursor';
import type { CursorManagerProps } from './CursorManager.types';
import type { CursorPosition, ParticipantInfo } from '../../../hooks/useRealtimeCollaboration';

export const CursorManager: React.FC<CursorManagerProps> = ({
  cursors,
  participants,
  canvasRef
}) => {
  const [canvasBounds, setCanvasBounds] = useState<DOMRect | null>(null);

  useEffect(() => {
    const updateBounds = () => {
      if (canvasRef.current) {
        setCanvasBounds(canvasRef.current.getBoundingClientRect());
      }
    };

    updateBounds();
    window.addEventListener('resize', updateBounds);
    window.addEventListener('scroll', updateBounds);
    
    return () => {
      window.removeEventListener('resize', updateBounds);
      window.removeEventListener('scroll', updateBounds);
    };
  }, [canvasRef]);

  if (!canvasBounds) return null;

  return (
    <>
      {Object.entries(cursors).map(([userId, cursor]) => {
        const participant = participants[userId];
        if (!participant) return null;

        // Convert canvas-relative coordinates to screen coordinates
        const screenX = canvasBounds.left + cursor.x;
        const screenY = canvasBounds.top + cursor.y;

        // Hide if cursor is outside canvas bounds
        const isVisible = 
          screenX >= canvasBounds.left &&
          screenX <= canvasBounds.right &&
          screenY >= canvasBounds.top &&
          screenY <= canvasBounds.bottom;

        return (
          <CollaboratorCursor
            key={userId}
            x={screenX}
            y={screenY}
            color={participant.color}
            name={participant.name}
            avatar={participant.avatar_url}
            isVisible={isVisible}
          />
        );
      })}
    </>
  );
}; 