import React, { useState, useRef, useEffect } from 'react';
import { 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  IconButton, 
  TextField, 
  Box,
  Collapse,
  Stack,
  Typography,
  Fade
} from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import EditIcon from '@mui/icons-material/Edit';
import { useDrag, useDrop } from 'react-dnd';
import { useRouter, usePathname } from 'next/navigation';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { NavItemUI } from './Navigation';
import { findItemWithParent } from './navigationUtils';

interface NavigationItemProps {
  item: NavItemUI;
  level: number;
  isEditMode: boolean;
  onToggleVisibility: (id: number | string) => void;
  onTitleChange: (id: number | string, newTitle: string) => void;
  moveNavItem: (dragId: number | string, hoverId: number | string, position: 'before' | 'after') => void;
  onTrackItemMove: (id: number | string, fromIndex: number, toIndex: number) => Promise<boolean>;
  onEditModeToggle: () => void;
  isExpanded: boolean;
  onToggleExpand: (id: number | string) => void;
  children?: React.ReactNode;
  index?: number;
  items?: NavItemUI[];
}

interface DragItem {
  id: number | string;
  index: number;
  level: number;
  type: string;
}

const NavigationItem: React.FC<NavigationItemProps> = ({
  item,
  level,
  isEditMode,
  onToggleVisibility,
  onTitleChange,
  moveNavItem,
  onTrackItemMove,
  onEditModeToggle,
  isExpanded,
  onToggleExpand,
  children,
  index = 0,
  items = []
}) => {
  const { id, title, target, url, visible, hidden } = item;
  const isVisible = visible === undefined ? !hidden : visible;
  
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [touchStartTime, setTouchStartTime] = useState<number | null>(null);
  const [touchPos, setTouchPos] = useState({ x: 0, y: 0 });
  const [isDraggingTouch, setIsDraggingTouch] = useState(false);
  const [dropPosition, setDropPosition] = useState<'top' | 'bottom' | null>(null);
  const [longPressTimer, setLongPressTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [longPressProgress, setLongPressProgress] = useState(0);
  const [isLongPressing, setIsLongPressing] = useState(false);
  const longPressAnimationRef = useRef<number | null>(null);
  const longPressStartTimeRef = useRef<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const hasChildren = item.children && item.children.length > 0;

  const [{ isDragging }, drag] = useDrag<DragItem, unknown, { isDragging: boolean }>({
    type: 'NAV_ITEM',
    item: { id, level, index, type: 'NAV_ITEM' },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    }),
    canDrag: () => isEditMode
  });

  const [{ isOver, canDrop }, drop] = useDrop<DragItem, unknown, { isOver: boolean, canDrop: boolean }>({
    accept: 'NAV_ITEM',
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    }),
    canDrop: (dragItem) => {
      // Only check that we're not dropping onto itself
      return dragItem.id !== id;
    },
    hover: (dragItem, monitor) => {
      if (!ref.current) {
        return;
      }
      
      // Don't replace items with themselves
      if (dragItem.id === id) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      if (!clientOffset) {
        return;
      }

      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // Set drop position indicator
      if (hoverClientY < hoverMiddleY) {
        setDropPosition('top');
      } else {
        setDropPosition('bottom');
      }
    },
    drop: (dragItem) => {
      if (dragItem.id === id) {
        return;
      }
      
      // Calculate position to place the dragged item
      if (dropPosition === 'top') {
        moveNavItem(dragItem.id, id, 'before');
      } else {
        moveNavItem(dragItem.id, id, 'after');
      }

      // Track the move with the server
      const fromIndex = dragItem.index;
      const toIndex = dropPosition === 'top' ? index : index + 1;
      
      onTrackItemMove(dragItem.id, fromIndex, toIndex);
      
      // Reset drop position indicator
      setDropPosition(null);
    }
  });

  // Reset drop position indicator when not hovering
  useEffect(() => {
    if (!isOver) {
      setDropPosition(null);
    }
  }, [isOver]);

  // Initialize the refs
  useEffect(() => {
    // Properly connect drag and drop to handle nested items
    if (ref.current) {
      drag(drop(ref.current));
    }
  }, [drag, drop, ref]);
  
  // Make sure children are correctly expanded in edit mode
  useEffect(() => {
    if (hasChildren && item.isExpanded !== isExpanded) {
      // Sync the internal expanded state with the item's state
      onToggleExpand(id);
    }
  }, [hasChildren, id, isExpanded, item.isExpanded, onToggleExpand]);

  // Handle long press to enter edit mode
  const handleLongPress = () => {
    if (onEditModeToggle) {
      onEditModeToggle();
    }
  };

  // Handle long press animation
  const updateLongPressProgress = () => {
    if (!longPressStartTimeRef.current) return;
    
    const elapsed = Date.now() - longPressStartTimeRef.current;
    const duration = 800; // Match the long press timer duration
    const progress = Math.min(100, (elapsed / duration) * 100);
    
    setLongPressProgress(progress);
    
    if (progress < 100) {
      longPressAnimationRef.current = requestAnimationFrame(updateLongPressProgress);
    }
  };
  
  // Clear long press animation and timer
  const clearLongPress = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
    
    if (longPressAnimationRef.current) {
      cancelAnimationFrame(longPressAnimationRef.current);
      longPressAnimationRef.current = null;
    }
    
    longPressStartTimeRef.current = null;
    setIsLongPressing(false);
    setLongPressProgress(0);
  };

  // Handle touch events for better mobile drag and drop
  const handleTouchStart = (e: React.TouchEvent) => {
    // Always capture the touch position, regardless of edit mode
    if (e.touches[0]) {
      setTouchPos({ 
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      });
    }
    
    if (isEditMode) {
      setTouchStartTime(Date.now());
      
      // Prevent scrolling only on drag handles
      if (e.currentTarget instanceof HTMLElement && 
          (e.target as HTMLElement).closest('.drag-handle')) {
        if (e.currentTarget instanceof HTMLElement) {
          e.currentTarget.style.touchAction = 'none';
        }
        e.stopPropagation();
      }
    } else if (isVisible) { // Only initiate long press on visible items
      // Try to prevent default to help with iOS Safari
      try {
        e.preventDefault();
      } catch (_) {
        // Ignore errors from browsers that don't allow preventDefault
      }
      
      // Start long press timer for edit mode
      longPressStartTimeRef.current = Date.now();
      setIsLongPressing(true);
      longPressAnimationRef.current = requestAnimationFrame(updateLongPressProgress);
      
      const timer = setTimeout(() => {
        handleLongPress();
        clearLongPress();
      }, 800); // 800ms for long press
      setLongPressTimer(timer);
    }
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    // Make sure we have the current touch position
    if (e.touches[0]) {
      const touch = e.touches[0];
      const initialX = touchPos.x;
      const initialY = touchPos.y;
      
      // Clear long press timer if touch moves significantly
      if (longPressTimer && !isEditMode) {
        // Calculate distance moved
        if (Math.abs(touch.clientX - initialX) > 5 || Math.abs(touch.clientY - initialY) > 5) {
          clearLongPress();
        }
      }

      if (isEditMode && touchStartTime) {
        const touchTime = Date.now() - touchStartTime;
        
        // Only start dragging after a short delay to distinguish from scrolling
        if (touchTime > 50) {
          // Calculate distance moved for drag detection
          const deltaY = touch.clientY - initialY;
          
          // If significant vertical movement, consider it a drag
          if (Math.abs(deltaY) > 5) {
            setIsDraggingTouch(true);
            e.preventDefault();
            e.stopPropagation();
          }
        }
      }
    }
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    clearLongPress();
    setTouchStartTime(null);
    setIsDraggingTouch(false);
    
    // Restore scrolling
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.touchAction = 'auto';
    }
  };

  // Mouse events for desktop long press
  const handleMouseDown = () => {
    if (!isEditMode && isVisible) { // Only initiate long press on visible items
      longPressStartTimeRef.current = Date.now();
      setIsLongPressing(true);
      longPressAnimationRef.current = requestAnimationFrame(updateLongPressProgress);
      
      const timer = setTimeout(() => {
        handleLongPress();
        clearLongPress();
      }, 800); // 800ms for long press
      setLongPressTimer(timer);
    }
  };

  const handleMouseUp = () => {
    clearLongPress();
  };

  const handleMouseMove = () => {
    if (longPressTimer) {
      clearLongPress();
    }
  };

  const handleEdit = () => {
    // Only proceed if we're in edit mode
    if (isEditMode) {
      // Reset title to current value when starting to edit
      setNewTitle(title);
      // Enter editing state - force it to true
      setIsEditing(true);
      
      // Use a small timeout to ensure the text field gets focus
      setTimeout(() => {
        const inputElement = document.querySelector(`[data-item-id="${id}"] input`);
        if (inputElement instanceof HTMLInputElement) {
          inputElement.focus();
          inputElement.select();
        }
      }, 50);
    }
  };

  const handleSaveTitle = () => {
    // Only save if the title has actually changed
    if (newTitle !== title && newTitle.trim()) {
      onTitleChange(id, newTitle.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    // Reset to original title
    setNewTitle(title);
    setIsEditing(false);
  };

  // Monitor edit mode changes and exit editing mode if needed
  useEffect(() => {
    if (!isEditMode && isEditing) {
      setIsEditing(false);
    }
  }, [isEditMode, isEditing]);

  // Update newTitle when title prop changes (after saving)
  useEffect(() => {
    // Only update if we're not currently editing
    if (!isEditing) {
      setNewTitle(title);
    }
  }, [title, isEditing]);

  const handleClick = (e: React.MouseEvent) => {
    if (isEditMode) {
      // In edit mode, only allow toggling dropdown when clicking directly on the item
      // (not on the expand icon, as that has its own handler)
      if (hasChildren && !(e.target as HTMLElement).closest('button')) {
        onToggleExpand(id);
      }
      return;
    }
    
    if (hasChildren) {
      onToggleExpand(id);
    } else if ((url || target) && isVisible) {
      if (url) {
        router.push(url);
      } else if (target) {
        router.push(target);
      }
    }
  };

  // Function to handle title tap in edit mode
  const handleTitleClick = (e: React.MouseEvent) => {
    if (isEditMode) {
      e.stopPropagation();
      handleEdit();
    }
  };

  // Function to handle title double click
  const handleTitleDoubleClick = (e: React.MouseEvent) => {
    // Allow double click to edit even in view mode
    if (!isEditMode) {
      // Prevent bubbling to other handlers
      e.stopPropagation();
      // Toggle edit mode first, then enable title editing
      onEditModeToggle();
      // Use setTimeout to ensure edit mode is active before enabling title editing
      setTimeout(() => {
        setIsEditing(true);
      }, 100);
    }
  };

  // Combined indicators
  const isDraggingAny = isDragging || isDraggingTouch;
  const isInteracting = isDraggingAny || isLongPressing;

  // Calculate background color based on long press progress
  const longPressBackgroundColor = isLongPressing && !isEditMode 
    ? `rgba(25, 118, 210, ${longPressProgress * 0.003})` 
    : 'transparent';
  
  // Calculate border for long press effect
  const longPressBorder = isLongPressing && !isEditMode
    ? '1px solid rgba(25, 118, 210, 0.5)'
    : '1px solid transparent';

  return (
    <Box
      ref={ref}
      sx={{
        opacity: isDraggingAny ? 0.7 : (isVisible || isEditMode ? 1 : 0.6),
        cursor: isEditMode ? 'move' : (isVisible ? 'pointer' : 'default'),
        backgroundColor: isOver ? 'rgba(25, 118, 210, 0.08)' : longPressBackgroundColor,
        '& .MuiTypography-root': {
          textDecoration: 'inherit'
        },
        touchAction: isEditMode ? 'none' : 'auto',
        WebkitTouchCallout: 'none', // Disable callout to prevent iOS image saving menu
        WebkitUserSelect: 'none',   // Disable text selection
        userSelect: 'none',         // Disable text selection
        pl: level * 2,
        transition: isInteracting ? 'all 0.05s linear' : 'all 0.2s ease',
        transform: isDraggingAny 
          ? 'scale(1.02)' 
          : (isLongPressing && !isEditMode ? `scale(${1 + longPressProgress * 0.0008})` : 'none'),
        boxShadow: isDraggingAny 
          ? '0 5px 10px rgba(0,0,0,0.15)' 
          : (isOver && isEditMode 
              ? '0 2px 5px rgba(25,118,210,0.2)' 
              : (isLongPressing && !isEditMode 
                  ? `0 2px ${Math.min(10, longPressProgress/12)}px rgba(25,118,210,0.3)` 
                  : 'none')),
        border: isDraggingAny 
          ? '1px dashed #1976d2' 
          : (isOver && isEditMode 
              ? '1px solid rgba(25,118,210,0.5)' 
              : longPressBorder),
        borderRadius: '4px',
        position: 'relative',
        zIndex: isDraggingAny ? 100 : (isOver ? 10 : 1),
        animation: isLongPressing && !isEditMode ? 'pulse-border 1.2s infinite' : 'none',
        '@keyframes pulse-border': {
          '0%': {
            borderColor: 'rgba(25, 118, 210, 0.2)',
          },
          '50%': {
            borderColor: 'rgba(25, 118, 210, 0.6)',
          },
          '100%': {
            borderColor: 'rgba(25, 118, 210, 0.2)',
          }
        },
        '&::before': (isOver && dropPosition === 'top' && isEditMode) ? {
          content: '""',
          position: 'absolute',
          top: -2,
          left: 0,
          right: 0,
          height: '2px',
          backgroundColor: '#1976d2',
          zIndex: 20,
          animation: 'pulse 1.5s infinite',
          '@keyframes pulse': {
            '0%': {
              opacity: 0.6,
              height: '2px'
            },
            '50%': {
              opacity: 1,
              height: '3px'
            },
            '100%': {
              opacity: 0.6,
              height: '2px'
            }
          }
        } : {},
        '&::after': (isOver && dropPosition === 'bottom' && isEditMode) ? {
          content: '""',
          position: 'absolute',
          bottom: -2,
          left: 0,
          right: 0,
          height: '2px',
          backgroundColor: '#1976d2',
          zIndex: 20,
          animation: 'pulse 1.5s infinite',
          '@keyframes pulse': {
            '0%': {
              opacity: 0.6,
              height: '2px'
            },
            '50%': {
              opacity: 1,
              height: '3px'
            },
            '100%': {
              opacity: 0.6,
              height: '2px'
            }
          }
        } : {}
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseUp}
    >
      {isDraggingAny && (
        <Fade in={isDraggingAny} timeout={200}>
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(25, 118, 210, 0.05)',
              zIndex: -1,
              borderRadius: '4px'
            }}
          />
        </Fade>
      )}
      <ListItem
        disablePadding
        secondaryAction={
          isEditMode && (
            <Stack direction="row" spacing={1}>
              <IconButton 
                edge="end" 
                onClick={(e) => {
                  e.stopPropagation(); // Prevent event bubbling
                  handleEdit();
                }} 
                size="small"
                title="Edit title"
                sx={{ 
                  p: 0.75,
                  color: isEditing ? 'primary.main' : 'rgba(0, 0, 0, 0.54)',
                  backgroundColor: isEditing ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                  '&:hover': {
                    color: '#1976d2',
                    backgroundColor: 'rgba(25, 118, 210, 0.12)'
                  }
                }}
              >
                <EditIcon sx={{ fontSize: 20 }} />
              </IconButton>
              <IconButton 
                edge="end" 
                onClick={() => onToggleVisibility(id)} 
                size="small"
                title={isVisible ? "Hide item" : "Show item"}
                sx={{ 
                  p: 0.75,
                  color: isVisible ? 'rgba(0, 0, 0, 0.54)' : 'rgba(0, 0, 0, 0.26)',
                  '&:hover': {
                    color: isVisible ? '#1976d2' : 'rgba(0, 0, 0, 0.54)'
                  }
                }}
              >
                {isVisible ? <VisibilityIcon sx={{ fontSize: 20 }} /> : <VisibilityOffIcon sx={{ fontSize: 20 }} />}
              </IconButton>
            </Stack>
          )
        }
      >
        <ListItemButton
          onClick={handleClick}
          disableRipple={isEditMode && !hasChildren}
          sx={{
            pl: 1,
            py: 1.5,
            opacity: isVisible ? 1 : 0.5,
            '&:hover': {
              backgroundColor: isEditMode && !hasChildren ? 'transparent' : 'rgba(0, 0, 0, 0.04)',
            },
            cursor: isEditMode 
              ? (hasChildren ? 'pointer' : 'move') 
              : (isVisible ? 'pointer' : 'default'),
            textDecoration: 'none',
            position: 'relative'
          }}
        >
          {isEditMode && (
            <Box 
              className="drag-handle"
              component={ListItemIcon}
              sx={{ 
                minWidth: 32,
                color: 'rgba(0, 0, 0, 0.54)',
                display: 'flex',
                alignItems: 'center',
                '& svg': { 
                  transform: 'rotate(90deg)',
                  fontSize: 16 
                },
                '@media (pointer: coarse)': {
                  minWidth: 42,
                  mr: 1,
                  '& svg': {
                    fontSize: 20
                  }
                }
              }}
            >
              <DragIndicatorIcon />
              <DragIndicatorIcon style={{ marginLeft: -16 }} />
            </Box>
          )}
          
          {isEditing ? (
            <Box
              data-item-id={id}
              sx={{
                ml: !isEditMode && hasChildren ? 0 : 2,
                position: 'relative',
                width: '100%',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <TextField
                fullWidth
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                variant="standard"
                autoFocus
                placeholder="Enter title"
                size="small"
                onBlur={handleSaveTitle}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveTitle();
                  } else if (e.key === 'Escape') {
                    handleCancelEdit();
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton 
                        size="small" 
                        onClick={handleSaveTitle}
                        sx={{ 
                          color: 'success.main',
                          p: 0.5,
                          fontSize: '0.75rem'
                        }}
                      >
                        ✓
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={handleCancelEdit}
                        sx={{ 
                          color: 'error.main',
                          p: 0.5,
                          fontSize: '0.75rem'
                        }}
                      >
                        ✕
                      </IconButton>
                    </Box>
                  )
                }}
                sx={{ 
                  '& .MuiInputBase-root': { 
                    fontSize: '0.875rem',
                    textDecoration: 'none',
                    backgroundColor: 'rgba(0, 0, 0, 0.03)',
                    borderRadius: '4px',
                    pl: 1,
                    pr: 0.5,
                    py: 0.5,
                    transition: 'all 0.2s ease'
                  },
                  '& .MuiInput-underline:before': { 
                    borderBottomColor: 'rgba(0, 0, 0, 0.1)' 
                  },
                  '& .MuiInput-underline:hover:not(.Mui-disabled):before': { 
                    borderBottomColor: 'primary.main'
                  }
                }}
              />
            </Box>
          ) : (
            <Typography
              sx={{
                ml: !isEditMode && hasChildren ? 0 : 2,
                fontWeight: 400,
                fontSize: '0.875rem',
                color: isVisible ? 'rgba(0, 0, 0, 0.87)' : 'rgba(0, 0, 0, 0.38)',
                lineHeight: 1.5,
                cursor: isEditMode ? 'text' : (isVisible ? 'pointer' : 'not-allowed'),
                textDecoration: (!isVisible && !isEditMode) ? 'line-through' : 'none',
                textDecorationColor: 'rgba(0, 0, 0, 0.2)',
                textDecorationThickness: '1px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: isEditMode ? 'calc(100% - 100px)' : '100%', // Account for action buttons
                position: 'relative',
                // Add visual indicator for edit mode
                '&:after': isEditMode ? {
                  content: '""',
                  position: 'absolute',
                  bottom: -2,
                  left: 0,
                  right: 0,
                  height: '1px',
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                } : {},
                // Add hover effect in edit mode
                '&:hover': isEditMode ? {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  color: '#1976d2',
                } : {}
              }}
              onClick={handleTitleClick}
              onDoubleClick={handleTitleDoubleClick}
            >
              {title}
              {isEditMode && (
                <Box 
                  component="span" 
                  sx={{ 
                    ml: 0.5, 
                    fontSize: '0.7rem', 
                    color: 'rgba(0, 0, 0, 0.4)',
                    fontStyle: 'italic'
                  }}
                >
                  (click to edit)
                </Box>
              )}
            </Typography>
          )}
          
          {/* Show expand icons in both edit and non-edit mode */}
          {hasChildren && (
            <Box
              component={IconButton}
              onClick={(e) => {
                // Stop propagation to prevent the ListItemButton's click handler from firing
                e.stopPropagation();
                // Toggle expand/collapse
                onToggleExpand(id);
              }}
              sx={{ 
                minWidth: 'auto', 
                ml: 1,
                p: 0.5,
                // Make sure it's clickable in edit mode
                pointerEvents: 'auto',
                // Ensure it stays above other elements
                zIndex: 10,
                cursor: 'pointer',
                borderRadius: '50%',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.04)'
                }
              }}
            >
              {isExpanded ? (
                <ExpandLessIcon 
                  sx={{ 
                    fontSize: 20, 
                    color: 'rgba(0, 0, 0, 0.54)',
                    '&:hover': { color: '#1976d2' }
                  }} 
                />
              ) : (
                <ExpandMoreIcon 
                  sx={{ 
                    fontSize: 20, 
                    color: 'rgba(0, 0, 0, 0.54)',
                    '&:hover': { color: '#1976d2' }
                  }} 
                />
              )}
            </Box>
          )}
        </ListItemButton>
      </ListItem>
      {hasChildren && (
        <Collapse in={isExpanded} timeout="auto">
          <Box sx={{ pl: 2 }}>
            {children}
          </Box>
        </Collapse>
      )}
    </Box>
  );
};

export default NavigationItem; 