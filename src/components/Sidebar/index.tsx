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
  Collapse,
  TextField
} from '@mui/material';
import React, { useState, useRef, useEffect } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import SettingsIcon from '@mui/icons-material/Settings';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
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
  parentId: string | number | null;
}

interface NavItemProps {
  item: NavItemType;
  parentId: string | number | null;
  onMove: (dragId: string | number, hoverId: string | number) => void;
  isEditMode: boolean;
  longPressTimeout: number;
  onLongPress: (itemId: string | number) => void;
  toggleVisibility?: (itemId: string | number) => void;
  onTitleChange?: (itemId: string | number, newTitle: string) => void;
}

interface ChildNavItemProps {
  item: NavItemType;
  parentId: string | number;
  onMove: (dragId: string | number, hoverId: string | number) => void;
  isEditMode: boolean;
  onTitleChange?: (itemId: string | number, newTitle: string) => void;
}

const ChildNavItem: React.FC<ChildNavItemProps> = ({
  item, parentId, onMove, isEditMode, onTitleChange
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(item.title);
  
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.NAV_ITEM,
    item: () => ({ id: item.id, parentId, type: ItemTypes.NAV_ITEM }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: isEditMode,
  });
  
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ItemTypes.NAV_ITEM,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
    canDrop: (draggedItem: DragItem) => {
      return isEditMode && draggedItem.parentId === parentId && draggedItem.id !== item.id;
    },
    drop: (draggedItem: DragItem) => {
      if (draggedItem.id !== item.id) {
        onMove(draggedItem.id, item.id);
      }
    },
  });
  
  const isActive = isOver && canDrop;
  
  drag(drop(ref));
  
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isEditMode) {
      setNewTitle(item.title);
      setIsEditing(true);
      
      // Focus input after a short delay
      setTimeout(() => {
        const inputElement = document.querySelector(`[data-child-item-id="${item.id}"] input`);
        if (inputElement instanceof HTMLInputElement) {
          inputElement.focus();
          inputElement.select();
        }
      }, 50);
    }
  };

  const handleSaveTitle = () => {
    if (newTitle.trim() && newTitle !== item.title && onTitleChange) {
      onTitleChange(item.id, newTitle.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setNewTitle(item.title);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveTitle();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };
  
  return (
    <Box
      ref={ref}
      sx={{
        pl: 4,
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: isActive ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
        transition: 'background-color 0.2s ease',
      }}
    >
      <ListItem 
        disablePadding
        sx={{ 
          borderRadius: 1,
        }}
      >
        {isEditing ? (
          <Box 
            data-child-item-id={item.id}
            sx={{ 
              px: 2, 
              py: 1,
              display: 'flex',
              alignItems: 'center',
              width: '100%' 
            }}
            onClick={(e) => e.stopPropagation()}
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
            <TextField
              fullWidth
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              variant="standard"
              autoFocus
              placeholder="Enter title"
              size="small"
              onBlur={handleSaveTitle}
              onKeyDown={handleKeyDown}
              sx={{ ml: 1 }}
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
            />
          </Box>
        ) : (
          <ListItemButton
            sx={{ 
              borderRadius: 1,
              py: 1.25,
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.04)',
              }
            }}
          >
            {isEditMode && (
              <DragIndicatorIcon 
                sx={{ 
                  mr: 1, 
                  color: 'text.secondary',
                  fontSize: '0.875rem'
                }}
              />
            )}
            
            <ListItemText
              primary={item.title}
              primaryTypographyProps={{ 
                sx: { 
                  fontWeight: 400,
                  fontSize: '0.875rem',
                  color: item.hidden ? 'text.disabled' : 'text.primary',
                  textDecoration: item.hidden ? 'line-through' : 'none',
                }
              }}
            />
            
            {isEditMode && (
              <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
                <IconButton size="small" sx={{ mr: 1 }} onClick={handleEdit}>
                  <EditIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
          </ListItemButton>
        )}
      </ListItem>
    </Box>
  );
};

const NavItemComponent: React.FC<NavItemProps> = ({ 
  item, parentId, onMove, isEditMode, longPressTimeout, onLongPress, toggleVisibility, onTitleChange
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [longPressTimer, setLongPressTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [open, setOpen] = useState(item.id === 'job-application');
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(item.title);
  
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.NAV_ITEM,
    item: () => ({ id: item.id, parentId, type: ItemTypes.NAV_ITEM }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: isEditMode,
  });
  
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ItemTypes.NAV_ITEM,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
    canDrop: (draggedItem: DragItem) => {
      return isEditMode && draggedItem.parentId === parentId && draggedItem.id !== item.id;
    },
    drop: (draggedItem: DragItem) => {
      if (draggedItem.id !== item.id) {
        onMove(draggedItem.id, item.id);
      }
    },
  });
  
  const isActive = isOver && canDrop;
  
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
    if (!isEditMode && item.children && item.children.length > 0) {
      setOpen(!open);
    }
  };

  const handleVisibilityToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isEditMode && toggleVisibility) {
      toggleVisibility(item.id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isEditMode) {
      setNewTitle(item.title);
      setIsEditing(true);
      
      // Focus input after a short delay
      setTimeout(() => {
        const inputElement = document.querySelector(`[data-item-id="${item.id}"] input`);
        if (inputElement instanceof HTMLInputElement) {
          inputElement.focus();
          inputElement.select();
        }
      }, 50);
    }
  };

  const handleSaveTitle = () => {
    if (newTitle.trim() && newTitle !== item.title && onTitleChange) {
      onTitleChange(item.id, newTitle.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setNewTitle(item.title);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveTitle();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <Box
      ref={ref}
      sx={{
        opacity: isDragging ? 0.5 : 1,
        cursor: isEditMode ? 'grab' : 'pointer',
        backgroundColor: isActive ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
        transition: 'background-color 0.2s ease',
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
        {isEditing ? (
          <Box 
            data-item-id={item.id}
            sx={{ 
              px: 2, 
              py: 1,
              display: 'flex',
              alignItems: 'center',
              width: '100%' 
            }}
            onClick={(e) => e.stopPropagation()}
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
            <TextField
              fullWidth
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              variant="standard"
              autoFocus
              placeholder="Enter title"
              size="small"
              onBlur={handleSaveTitle}
              onKeyDown={handleKeyDown}
              sx={{ ml: 1 }}
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
            />
          </Box>
        ) : (
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
                  color: item.hidden ? 'text.disabled' : 'text.primary',
                  textDecoration: item.hidden ? 'line-through' : 'none',
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
                <IconButton size="small" sx={{ mr: 1 }} onClick={handleEdit}>
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={handleVisibilityToggle}>
                  {item.hidden ? (
                    <VisibilityOffIcon fontSize="small" />
                  ) : (
                    <VisibilityIcon fontSize="small" />
                  )}
                </IconButton>
              </Box>
            )}
          </ListItemButton>
        )}
      </ListItem>

      {item.children && item.children.length > 0 && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {item.children.map((childItem) => (
              <ChildNavItem
                key={childItem.id}
                item={childItem}
                parentId={item.id}
                onMove={onMove}
                isEditMode={isEditMode}
                onTitleChange={onTitleChange}
              />
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
  onLongPress: (itemId: string | number) => void,
  onSettingsClick: () => void,
  showHeader?: boolean
}> = ({ isEditMode, onCancel, onSave, onLongPress, onSettingsClick, showHeader = true }) => {
  const { data: navItems = [], isLoading, error } = useGetNavigationQuery();
  const [saveNavigation] = useSaveNavigationMutation();
  const [trackNavItemMove] = useTrackNavItemMoveMutation();
  
  const [navState, setNavState] = useState<NavItemType[]>([]);
  
  useEffect(() => {
    if (navItems && navItems.length > 0) {
      setNavState(JSON.parse(JSON.stringify(navItems)));
    }
  }, [navItems]);
  
  const moveItem = (dragId: string | number, hoverId: string | number) => {
    if (dragId === hoverId) return;

    setNavState(prevItems => {
      const items = JSON.parse(JSON.stringify(prevItems));
      
      // These functions find items by ID and their positions
      const findItem = (items: NavItemType[], id: string | number): {
        item: NavItemType | null;
        index: number;
        parent: NavItemType | null;
        parentIndex: number;
      } => {
        // Check top level
        for (let i = 0; i < items.length; i++) {
          if (items[i].id === id) {
            return { item: items[i], index: i, parent: null, parentIndex: -1 };
          }
        }
        
        // Check children
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          if (item.children) {
            for (let j = 0; j < item.children.length; j++) {
              if (item.children[j].id === id) {
                return { item: item.children[j], index: j, parent: item, parentIndex: i };
              }
            }
          }
        }
        
        return { item: null, index: -1, parent: null, parentIndex: -1 };
      };
      
      // Find source and target
      const source = findItem(items, dragId);
      const target = findItem(items, hoverId);
      
      // If either not found, or not at same level, do nothing
      if (!source.item || !target.item) {
        return items;
      }
      
      const isSameLevel = 
        (source.parent === null && target.parent === null) || 
        (source.parent !== null && target.parent !== null && source.parentIndex === target.parentIndex);
      
      if (!isSameLevel) {
        return items;
      }
      
      // Record position for analytics
      const fromIndex = source.index;
      const toIndex = target.index;
      
      // Perform the move
      if (source.parent === null) {
        // Top level items
        const [removed] = items.splice(source.index, 1);
        items.splice(target.index > source.index ? target.index - 1 : target.index, 0, removed);
      } else {
        // Child items
        const parentChildren = source.parent.children!;
        const [removed] = parentChildren.splice(source.index, 1);
        parentChildren.splice(target.index > source.index ? target.index - 1 : target.index, 0, removed);
      }
      
      // Track the move
      trackNavItemMove({
        id: dragId,
        from: fromIndex,
        to: toIndex,
        parentId: source.parent?.id || null
      });
      
      return items;
    });
  };

  const toggleItemVisibility = (itemId: string | number) => {
    setNavState(prevItems => {
      const items = JSON.parse(JSON.stringify(prevItems));
      
      // Find item in top level
      const topLevelIndex = items.findIndex((item: NavItemType) => item.id === itemId);
      if (topLevelIndex !== -1) {
        items[topLevelIndex].hidden = !items[topLevelIndex].hidden;
        return items;
      }
      
      // Find item in children
      for (let i = 0; i < items.length; i++) {
        const parent = items[i];
        if (parent.children) {
          const childIndex = parent.children.findIndex(child => child.id === itemId);
          if (childIndex !== -1) {
            parent.children[childIndex].hidden = !parent.children[childIndex].hidden;
            return items;
          }
        }
      }
      
      return items;
    });
  };

  const handleTitleChange = (itemId: string | number, newTitle: string) => {
    setNavState(prevItems => {
      const items = JSON.parse(JSON.stringify(prevItems));
      
      // Find item in top level
      const topLevelIndex = items.findIndex((item: NavItemType) => item.id === itemId);
      if (topLevelIndex !== -1) {
        items[topLevelIndex].title = newTitle;
        return items;
      }
      
      // Find item in children
      for (let i = 0; i < items.length; i++) {
        const parent = items[i];
        if (parent.children) {
          const childIndex = parent.children.findIndex(child => child.id === itemId);
          if (childIndex !== -1) {
            parent.children[childIndex].title = newTitle;
            return items;
          }
        }
      }
      
      return items;
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
      {showHeader && (
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
            <IconButton size="small" onClick={onSettingsClick}>
              <SettingsIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      )}
      
      <List sx={{ width: '100%', p: 0 }}>
        {navState.map((item) => (
          <NavItemComponent 
            key={item.id}
            item={item}
            parentId={null}
            onMove={moveItem}
            isEditMode={isEditMode}
            longPressTimeout={600}
            onLongPress={onLongPress}
            toggleVisibility={toggleItemVisibility}
            onTitleChange={handleTitleChange}
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

  const handleItemLongPress = (_itemId: string | number) => {
    setIsEditMode(true);
  };
  
  const handleSettingsClick = () => {
    setIsEditMode(true);
  };
  
  // Custom DnD provider with proper backend selection
  const CustomDndProvider = ({ children }: { children: React.ReactNode }) => {
    const isTouch = useMediaQuery('(pointer: coarse)');
    
    const touchBackendOptions = {
      enableMouseEvents: true,
      enableKeyboardEvents: true,
      delayTouchStart: 500, // Delay for long press
    };
    
    return (
      <DndProvider 
        backend={isTouch ? TouchBackend : HTML5Backend} 
        options={isTouch ? touchBackendOptions : undefined}
      >
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
      <CustomDndProvider>
        <NavigationMenu 
          isEditMode={isEditMode}
          onCancel={handleCancel}
          onSave={handleSave}
          onLongPress={handleItemLongPress}
          onSettingsClick={handleSettingsClick}
          showHeader={true}
        />
      </CustomDndProvider>
    </Box>
  );

  if (showMobileView) {
    return (
      <Drawer
        anchor="left"
        open={isOpen}
        onClose={onClose}
        variant="temporary"
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: '100%',
            overflow: 'hidden',
            borderRight: '1px solid rgba(0, 0, 0, 0.08)',
            boxShadow: 'none',
            zIndex: (theme) => theme.zIndex.drawer,
            transition: (theme) => theme.transitions.create(['transform', 'width'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          },
        }}
        transitionDuration={{
          enter: 300,
          exit: 200,
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
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton 
              onClick={onClose} 
              sx={{ 
                mr: 1,
                color: 'text.secondary',
              }}
            >
              <ArrowBackIcon fontSize="small" />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>Menu</Typography>
          </Box>
          
          {isEditMode ? (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton size="small" onClick={handleCancel}>
                <CancelIcon sx={{ color: '#e53935' }} />
              </IconButton>
              <IconButton size="small" onClick={handleSave}>
                <CheckCircleIcon sx={{ color: '#43a047' }} />
              </IconButton>
            </Box>
          ) : (
            <IconButton size="small" onClick={handleSettingsClick}>
              <SettingsIcon fontSize="small" />
            </IconButton>
          )}
        </Box>

        <Box sx={{ overflow: 'auto', height: 'calc(100% - 64px)', p: 0 }}>
          <CustomDndProvider>
            <NavigationMenu 
              isEditMode={isEditMode} 
              onCancel={handleCancel} 
              onSave={handleSave}
              onLongPress={handleItemLongPress}
              onSettingsClick={handleSettingsClick}
              showHeader={false}
            />
          </CustomDndProvider>
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
