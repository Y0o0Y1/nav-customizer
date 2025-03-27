'use client';

import { TouchBackend, TouchBackendOptions } from 'react-dnd-touch-backend';

/**
 * TouchBackend with optimized settings for mobile interactions
 * These options improve the touch experience with react-dnd
 */
export const MobileTouchBackend = TouchBackend;

/**
 * Optimized settings for mobile touch devices
 */
export const mobileTouchBackendOptions: Partial<TouchBackendOptions> = {
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
}; 