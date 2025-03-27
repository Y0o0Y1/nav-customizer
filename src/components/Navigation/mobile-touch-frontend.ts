'use client';

import { TouchBackend, TouchBackendOptions } from 'react-dnd-touch-backend';
import { DragDropManager, BackendFactory } from 'dnd-core';

/**
 * TouchBackend with optimized settings for mobile interactions
 * These options improve the touch experience with react-dnd
 */
export const MobileTouchBackend = TouchBackend;

/**
 * Optimized settings for mobile touch devices
 */
export const mobileTouchBackendOptions = {
  // Enable mouse events along with touch
  enableMouseEvents: true,
  
  // Shorter delay for more responsive interactions
  // A small delay helps distinguish between scrolling and dragging
  delayTouchStart: 50,
  
  // Ignore right-clicks which can interfere with mobile web
  ignoreContextMenu: true,
  
  // Capture touch events to prevent scrolling while dragging
  // This ensures the page doesn't scroll while dragging items
  enableTouchEvents: true,
  
  // Always show a preview of the dragged item
  enableHoverOutsideTarget: false
};

export function createMobileTouchBackend(options: TouchBackendOptions = {}): BackendFactory {
  const defaultOptions: TouchBackendOptions = {
    enableMouseEvents: true,
    delayTouchStart: 150,
    delayMouseStart: 150,
  };

  return function mobileTouchBackendFactory(manager: DragDropManager): ReturnType<BackendFactory> {
    const optionsWithDefaults = { ...defaultOptions, ...options };
    const backend = TouchBackend(optionsWithDefaults)(manager);

    const originalSetupEvents = backend.setup;
    backend.setup = function setupEvents() {
      originalSetupEvents.call(this);
      
      document.addEventListener('contextmenu', preventRightClick);
      
      const originalHandleTouchStart = backend.handleTouchStart;
      backend.handleTouchStart = function handleTouchStart(e: TouchEvent) {
        preventScrolling(e);
        return originalHandleTouchStart.call(this, e);
      };
      
      backend.previewEnabled = true;
    };

    function preventRightClick(e: MouseEvent) {
      if (e.button === 2) {
        e.preventDefault();
      }
    }

    function preventScrolling(e: TouchEvent) {
      const target = e.target as HTMLElement;
      
      if (target && target.classList && target.classList.contains('drag-handle')) {
        e.preventDefault();
      }
    }

    return backend;
  };
} 