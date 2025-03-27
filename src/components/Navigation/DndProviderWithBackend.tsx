import React from 'react';
import { TouchBackend } from 'react-dnd-touch-backend';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { DndBackend } from 'react-dnd';
import { MultiBackend, createTransition } from 'react-dnd-multi-backend';

type DndProviderWithBackendProps = {
  children: React.ReactNode;
};

const TouchTransition = createTransition('touchstart', (event) => {
  return event.touches != null;
});

const HTML5toTouch = {
  backends: [
    {
      id: 'html5',
      backend: HTML5Backend,
      transition: TouchTransition,
    },
    {
      id: 'touch',
      backend: TouchBackend,
      options: {
        enableMouseEvents: true
      },
      preview: true,
    },
  ],
};

const DndProviderWithBackend: React.FC<DndProviderWithBackendProps> = ({ children }) => {
  return (
    <DndProvider backend={MultiBackend as unknown as DndBackend} options={HTML5toTouch}>
      {children}
    </DndProvider>
  );
};

export default DndProviderWithBackend; 