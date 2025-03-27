'use client';

import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
// eslint-disable-next-line import/no-extraneous-dependencies
import { TouchBackend } from 'react-dnd-touch-backend';

type ClientSideDndProviderProps = {
  children: React.ReactNode;
};

export default function ClientSideDndProvider({ children }: ClientSideDndProviderProps) {
  // Only render the actual content on the client side
  if (typeof window === 'undefined') {
    return <>{children}</>;
  }

  // Check if device has touch capability
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  if (hasTouch) {
    return (
      <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
        {children}
      </DndProvider>
    );
  }
  
  return (
    <DndProvider backend={HTML5Backend}>
      {children}
    </DndProvider>
  );
} 