import React from 'react';
import {
  DndContext,
  useDraggable,
  useSensor,
  useSensors,
  PointerSensor,
  DragEndEvent,
} from '@dnd-kit/core';

interface TextAnnotationProps {
  id: string;
  text: string;
  position: { x: number; y: number };
  onDragEnd: (position: { x: number; y: number }) => void;
}

export const TextAnnotation: React.FC<TextAnnotationProps> = ({ id, text, position, onDragEnd }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  const x = transform?.x ?? 0;
  const y = transform?.y ?? 0;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        position: 'absolute',
        left: position.x + x,
        top: position.y + y,
        cursor: 'grab',
        color: 'red',
        fontWeight: 'bold',
      }}
    >
      {text}
    </div>
  );
};
