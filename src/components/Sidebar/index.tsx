import {
  Box,
  Drawer,
  useMediaQuery,
  useTheme,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Typography,
  IconButton,
  Collapse
} from '@mui/material';
import React, { useState, useRef, useEffect } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import SettingsIcon from '@mui/icons-material/Settings';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useGetNavigationQuery, useSaveNavigationMutation, useTrackNavItemMoveMutation } from '../../api/services/navigationApi';
import { NavItem as NavItemType } from '../../api/DTO/navigation';

interface SidebarProps {
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

const ItemTypes = {
  NAV_ITEM: 'navItem',
}

interface DragItem {
  id: string | number;
  type: string;
  index: number;
  parentId: string | number | null;
}

interface NavItemProps {
  item: NavItemType;
  index: number;
  parentId: string | number | null;
  handleMove: (dragIndex: number, hoverIndex: number, dragId: string | number, hoverId: string | number) => void;
  isEditMode: boolean;
  longPressTimeout: number;
  onLongPress: (itemId: string | number) => void;
}

const NavItemComponent: React.FC<NavItemProps> = ({ 
  item, index, parentId, handleMove, isEditMode, longPressTimeout, onLongPress
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [longPressTimer, setLongPressTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [open, setOpen] = useState(item.id === 'job-application');
  
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.NAV_ITEM,
    item: { id: item.id, index, parentId, type: ItemTypes.NAV_ITEM },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: isEditMode,
  });
  
  const [, drop] = useDrop({
    accept: ItemTypes.NAV_ITEM,
    hover: (draggedItem: DragItem) => {
      if (!ref.current) {
        return;
      }
      
      const dragIndex = draggedItem.index;
      const hoverIndex = index;
      const dragId = draggedItem.id;
      const hoverId = item.id;
      
      // Don't replace items with themselves
      if (dragIndex === hoverIndex && dragId === hoverId) {
        return;
      }
      
      // Only allow same-level drops (both top-level or both children)
      if (draggedItem.parentId !== parentId) {
        return;
      }
      
      handleMove(dragIndex, hoverIndex, dragId, hoverId);
      
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      draggedItem.index = hoverIndex;
    },
    canDrop: () => isEditMode,
  });
  
  drag(drop(ref));
  
  const handleLongPress = () => {
    if (!isEditMode) {
      onLongPress(item.id);
    }
  };
  
  const handleTouchStart = () => {
    if (!isEditMode) {
      const timer = setTimeout(handleLongPress, longPressTimeout);
      setLongPressTimer(timer);
    }
  };
  
  const handleTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const handleClick = () => {
    if (item.children && item.children.length > 0) {
      setOpen(!open);
    }
  };

  return (
    <Box
      ref={ref}
      sx={{
        opacity: isDragging ? 0.5 : 1,
        cursor: isEditMode ? 'grab' : 'pointer',
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <ListItem 
        disablePadding 
        sx={{ 
          bgcolor: 'transparent',
          borderRadius: 1,
        }}
      >
        <ListItemButton 
          onClick={handleClick}
          sx={{ 
            py: 1.5, 
            px: 2,
            borderRadius: 1,
            '&:hover': {
              bgcolor: 'rgba(0, 0, 0, 0.04)',
            },
          }}
        >
          {isEditMode && (
            <DragIndicatorIcon 
              sx={{ 
                mr: 1, 
                color: 'text.secondary',
                fontSize: '1rem'
              }} 
            />
          )}
          
          <ListItemText 
            primary={item.title} 
            primaryTypographyProps={{ 
              sx: { 
                fontWeight: 500,
                fontSize: '0.875rem',
                color: 'text.primary'
              } 
            }} 
          />
          
          {item.children && item.children.length > 0 && (
            <ExpandMoreIcon 
              sx={{ 
                ml: 'auto', 
                transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s'
              }} 
            />
          )}
          
          {isEditMode && (
            <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
              <IconButton size="small" sx={{ mr: 1 }}>
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton size="small">
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </ListItemButton>
      </ListItem>

      {item.children && item.children.length > 0 && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {item.children && item.children.map((childItem) => (
              <ListItem 
                key={childItem.id}
                disablePadding 
                sx={{ pl: 4 }}
              >
                <ListItemButton
                  sx={{
                    py: 1,
                    borderRadius: 1,
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  <ListItemText
                    primary={childItem.title}
                    primaryTypographyProps={{
                      sx: {
                        fontWeight: 400,
                        fontSize: '0.875rem',
                        color: 'text.primary'
                      }
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Collapse>
      )}
    </Box>
  );
};

const NavigationMenu: React.FC<{ 
  isEditMode: boolean, 
  onCancel: () => void, 
  onSave: () => void,
  onLongPress: (itemId: string | number) => void
}> = ({ isEditMode, onCancel, onSave, onLongPress }) => {
  const { data: navItems = [], isLoading, error } = useGetNavigationQuery();
  const [saveNavigation] = useSaveNavigationMutation();
  const [trackNavItemMove] = useTrackNavItemMoveMutation();
  
  const [navState, setNavState] = useState<NavItemType[]>([]);
  
  useEffect(() => {
    if (navItems && navItems.length > 0) {
      setNavState(JSON.parse(JSON.stringify(navItems)));
    }
  }, [navItems]);
  
  const handleMove = (dragIndex: number, hoverIndex: number, dragId: string | number, hoverId: string | number) => {
    if (dragId === hoverId) return;
    
    setNavState(prevItems => {
      const updatedItems = [...prevItems];
      
      // Find the item being dragged and its parent
      let draggedItem: NavItemType | undefined;
      let draggedItemParentIndex = -1;
      
      // Look through top-level items first
      const topLevelDragIndex = updatedItems.findIndex(item => item.id === dragId);
      if (topLevelDragIndex !== -1) {
        draggedItem = updatedItems[topLevelDragIndex];
      } else {
        // If not found at top level, search in children
        for (let i = 0; i < updatedItems.length; i++) {
          const parent = updatedItems[i];
          if (parent.children) {
            const childIndex = parent.children.findIndex(child => child.id === dragId);
            if (childIndex !== -1) {
              draggedItem = parent.children[childIndex];
              draggedItemParentIndex = i;
              break;
            }
          }
        }
      }
      
      if (!draggedItem) return prevItems;
      
      // Find the target location
      let targetParentIndex = -1;
      
      // Look through top-level items first
      const topLevelHoverIndex = updatedItems.findIndex(item => item.id === hoverId);
      if (topLevelHoverIndex !== -1) {
        // Target is a top-level item
      } else {
        // If not found at top level, search in children
        for (let i = 0; i < updatedItems.length; i++) {
          const parent = updatedItems[i];
          if (parent.children) {
            const childIndex = parent.children.findIndex(child => child.id === hoverId);
            if (childIndex !== -1) {
              targetParentIndex = i;
              break;
            }
          }
        }
      }
      
      // Ensure we're moving items at the same level (both top-level or both in same parent)
      if (draggedItemParentIndex !== targetParentIndex) {
        return prevItems;
      }
      
      // Remove the dragged item from its original position
      if (draggedItemParentIndex === -1) {
        // Top-level item
        updatedItems.splice(dragIndex, 1);
      } else {
        // Child item
        updatedItems[draggedItemParentIndex].children?.splice(dragIndex, 1);
      }
      
      // Insert the dragged item at its new position
      if (targetParentIndex === -1) {
        // Top-level target
        updatedItems.splice(hoverIndex, 0, draggedItem);
      } else {
        // Child target
        updatedItems[targetParentIndex].children?.splice(hoverIndex, 0, draggedItem);
      }
      
      // Track item move to analytics endpoint immediately
      trackNavItemMove({
        id: dragId,
        from: dragIndex,
        to: hoverIndex
      });
      
      return updatedItems;
    });
  };

  const handleSaveClick = async () => {
    try {
      await saveNavigation(navState);
      onSave();
    } catch (error) {
      console.error('Failed to save navigation', error);
    }
  };
  
  if (isLoading) {
    return <Box sx={{ p: 2 }}>Loading...</Box>;
  }
  
  if (error) {
    return <Box sx={{ p: 2 }}>Error loading menu</Box>;
  }
  
  return (
    <Box>
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
      }}>
        <Typography variant="h6" fontWeight={500}>
          Menu
        </Typography>
        
        {isEditMode ? (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton size="small" onClick={onCancel}>
              <CancelIcon sx={{ color: '#e53935' }} />
            </IconButton>
            <IconButton size="small" onClick={handleSaveClick}>
              <CheckCircleIcon sx={{ color: '#43a047' }} />
            </IconButton>
          </Box>
        ) : (
          <IconButton size="small">
            <SettingsIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
      
      <List sx={{ width: '100%', p: 0 }}>
        {navState.map((item, idx) => (
          <NavItemComponent 
            key={item.id}
            item={item} 
            index={idx} 
            parentId={null}
            handleMove={handleMove}
            isEditMode={isEditMode}
            longPressTimeout={600}
            onLongPress={onLongPress}
          />
        ))}
      </List>
    </Box>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isMobile = false, isOpen = false, onClose }) => {
  const theme = useTheme();
  const isMobileDevice = useMediaQuery(theme.breakpoints.down('md'));
  const showMobileView = isMobileDevice || isMobile;
  const [isEditMode, setIsEditMode] = useState(false);
  
  const handleSave = () => {
    setIsEditMode(false);
  };
  
  const handleCancel = () => {
    setIsEditMode(false);
  };

  const handleItemLongPress = () => {
    setIsEditMode(true);
  };
  
  // Use dynamic import for TouchBackend
  const DetectTouchBackend = ({ children }: { children: React.ReactNode }) => {
    const isTouch = useMediaQuery('(pointer: coarse)');
    
    // Using require dynamically to avoid linter complaining about the import
    const TouchBackend = isTouch ? require('react-dnd-touch-backend').TouchBackend : null;
    
    return (
      <DndProvider backend={isTouch ? TouchBackend : HTML5Backend}>
        {children}
      </DndProvider>
    );
  };
  
  const sidebarContent = (
    <Box sx={{ 
      width: '100%', 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: '#ffffff'
    }}>
      <DetectTouchBackend>
        <NavigationMenu 
          isEditMode={isEditMode}
          onCancel={handleCancel}
          onSave={handleSave}
          onLongPress={handleItemLongPress}
        />
      </DetectTouchBackend>
    </Box>
  );

  if (showMobileView) {
    return (
      <Drawer
        anchor="left"
        open={isOpen}
        onClose={onClose}
        variant={isMobile ? "temporary" : "persistent"}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
            overflow: 'hidden',
            borderRight: '1px solid rgba(0, 0, 0, 0.08)',
            boxShadow: 'none',
            zIndex: (theme) => theme.zIndex.drawer,
          },
        }}
      >
        <Box 
          sx={{ 
            p: 2, 
            pt: 2, 
            pb: 2, 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Menu</Typography>
          
          <IconButton 
            onClick={onClose} 
            sx={{ 
              width: 28, 
              height: 28,
              color: 'text.secondary',
              bgcolor: 'background.paper',
              '&:hover': {
                bgcolor: 'background.default'
              }
            }}
          >
            <ArrowBackIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box sx={{ overflow: 'auto', height: 'calc(100% - 64px)', p: 0 }}>
          <DndProvider backend={HTML5Backend}>
            <NavigationMenu 
              isEditMode={isEditMode} 
              onCancel={handleCancel} 
              onSave={handleSave}
              onLongPress={handleItemLongPress}
            />
          </DndProvider>
        </Box>
      </Drawer>
    );
  }

  return (
    <Box 
      sx={{ 
        width: 280,
        flexShrink: 0, 
        borderRight: '1px solid rgba(0, 0, 0, 0.08)',
        backgroundColor: '#fff',
        display: { xs: 'none', md: 'block' }
      }}
    >
      {sidebarContent}
    </Box>
  );
};

export default Sidebar;
