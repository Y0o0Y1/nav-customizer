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

interface NavigationItemProps {
  id: string;
  title: string;
  url: string;
  visible: boolean;
  index: number;
  level: number;
  isEditMode: boolean;
  hasChildren?: boolean;
  isExpanded: boolean;
  onDrop: (id: string, from: number, to: number, level: number) => void;
  onVisibilityToggle: (id: string) => void;
  onTitleChange: (id: string, newTitle: string) => void;
  onToggleExpand: (id: string) => void;
  moveItem: (dragIndex: number, hoverIndex: number, level: number) => void;
  onEditModeToggle?: (id: string) => void;
}

interface DragItem {
  id: string;
  index: number;
  level: number;
  type: string;
}

const NavigationItem: React.FC<NavigationItemProps> = ({
  id,
  title,
  url,
  visible,
  index,
  level,
  isEditMode,
  hasChildren,
  isExpanded,
  onDrop,
  onVisibilityToggle,
  onTitleChange,
  onToggleExpand,
  moveItem,
  onEditModeToggle
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [touchStartTime, setTouchStartTime] = useState<number | null>(null);
  const [touchPos, setTouchPos] = useState({ x: 0, y: 0 });
  const [isDraggingTouch, setIsDraggingTouch] = useState(false);
  const [dropPosition, setDropPosition] = useState<'top' | 'bottom' | null>(null);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [longPressProgress, setLongPressProgress] = useState(0);
  const [isLongPressing, setIsLongPressing] = useState(false);
  const longPressAnimationRef = useRef<number | null>(null);
  const longPressStartTimeRef = useRef<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const isActive = pathname === url;

  const [{ isDragging }, drag] = useDrag<DragItem, unknown, { isDragging: boolean }>({
    type: 'NAV_ITEM',
    item: { id, index, level, type: 'NAV_ITEM' },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    }),
    canDrag: () => isEditMode
  });

  const [{ isOver }, drop] = useDrop<DragItem, unknown, { isOver: boolean }>({
    accept: 'NAV_ITEM',
    collect: (monitor) => ({
      isOver: monitor.isOver()
    }),
    hover: (item, monitor) => {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      const dragLevel = item.level;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Only allow items at the same level
      if (dragLevel !== level) {
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

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveItem(dragIndex, hoverIndex, level);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
    canDrop: (item) => {
      return item.level === level && item.id !== id;
    },
    drop: (item) => {
      if (item.id !== id) {
        onDrop(item.id, item.index, index, level);
      }
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
    drag(drop(ref.current));
  }, [drag, drop]);

  // Handle long press to enter edit mode
  const handleLongPress = () => {
    if (onEditModeToggle) {
      onEditModeToggle(id);
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
    } else if (visible) { // Only initiate long press on visible items
      // Try to prevent default to help with iOS Safari
      try {
        e.preventDefault();
      } catch (err) {
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
    if (!isEditMode && visible) { // Only initiate long press on visible items
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
    setIsEditing(true);
  };

  const handleSaveTitle = () => {
    console.log("Saving title:", newTitle);
    onTitleChange(id, newTitle);
    setIsEditing(false);
    console.log("isEditing set to false");
  };

  const handleCancelEdit = () => {
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

  const handleClick = () => {
    if (isEditMode) return;
    if (hasChildren) {
      onToggleExpand(id);
    } else if (url && visible) {
      router.push(url);
    }
  };

  // Function to handle title tap in edit mode
  const handleTitleClick = (e: React.MouseEvent) => {
    if (isEditMode) {
      e.stopPropagation();
      handleEdit();
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
        opacity: isDraggingAny ? 0.7 : (visible || isEditMode ? 1 : 0.6),
        cursor: isEditMode ? 'move' : (visible ? 'pointer' : 'default'),
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
                onClick={handleEdit} 
                size="small"
                sx={{ 
                  p: 0.75,
                  color: 'rgba(0, 0, 0, 0.54)',
                  '&:hover': {
                    color: '#1976d2'
                  }
                }}
              >
                <EditIcon sx={{ fontSize: 20 }} />
              </IconButton>
              <IconButton 
                edge="end" 
                onClick={() => onVisibilityToggle(id)} 
                size="small"
                sx={{ 
                  p: 0.75,
                  color: visible ? 'rgba(0, 0, 0, 0.54)' : 'rgba(0, 0, 0, 0.26)',
                  '&:hover': {
                    color: visible ? '#1976d2' : 'rgba(0, 0, 0, 0.54)'
                  }
                }}
              >
                {visible ? <VisibilityIcon sx={{ fontSize: 20 }} /> : <VisibilityOffIcon sx={{ fontSize: 20 }} />}
              </IconButton>
            </Stack>
          )
        }
      >
        <ListItemButton
          onClick={handleClick}
          disableRipple={isEditMode}
          sx={{
            pl: 1,
            py: 1.5,
            opacity: visible ? 1 : 0.5,
            '&:hover': {
              backgroundColor: isEditMode || !visible ? 'transparent' : 'rgba(0, 0, 0, 0.04)',
            },
            cursor: visible ? (isEditMode ? 'move' : 'pointer') : 'default',
            textDecoration: 'none',
            position: 'relative'
          }}
        >
          {isEditMode && (
            <ListItemIcon 
              className="drag-handle"
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
            </ListItemIcon>
          )}
          
          {isEditing ? (
            <TextField
              fullWidth
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              variant="standard"
              autoFocus
              onClick={(e) => e.stopPropagation()}
              onBlur={handleSaveTitle}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSaveTitle();
                } else if (e.key === 'Escape') {
                  handleCancelEdit();
                }
              }}
              sx={{ ml: !isEditMode && hasChildren ? 0 : 2, '& .MuiInputBase-root': { textDecoration: 'none' } }}
            />
          ) : (
            <Typography
              sx={{
                ml: !isEditMode && hasChildren ? 0 : 2,
                fontWeight: 400,
                fontSize: '0.875rem',
                color: visible ? 'rgba(0, 0, 0, 0.87)' : 'rgba(0, 0, 0, 0.38)',
                lineHeight: 1.5,
                cursor: isEditMode ? 'default' : (visible ? 'pointer' : 'not-allowed'),
                textDecoration: (!visible && !isEditMode) ? 'line-through' : 'none',
                textDecorationColor: 'rgba(0, 0, 0, 0.2)',
                textDecorationThickness: '1px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: isEditMode ? 'calc(100% - 100px)' : '100%' // Account for action buttons
              }}
              onClick={isEditMode ? undefined : handleClick}
            >
              {title}
            </Typography>
          )}
          
          {!isEditMode && hasChildren && (
            <ListItemIcon sx={{ minWidth: 'auto', ml: 1 }}>
              {isExpanded ? (
                <ExpandLessIcon sx={{ fontSize: 20, color: 'rgba(0, 0, 0, 0.54)' }} />
              ) : (
                <ExpandMoreIcon sx={{ fontSize: 20, color: 'rgba(0, 0, 0, 0.54)' }} />
              )}
            </ListItemIcon>
          )}
        </ListItemButton>
      </ListItem>
      {hasChildren && (
        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
          <Box sx={{ pl: 2 }}>
            {/* Children will be rendered here by the parent component */}
          </Box>
        </Collapse>
      )}
    </Box>
  );
};

export default NavigationItem; 