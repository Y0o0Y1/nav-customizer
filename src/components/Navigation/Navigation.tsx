import React, { useState, useEffect, useCallback } from 'react';
import { Box, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import { useGetNavigationQuery, useSaveNavigationMutation, useTrackNavItemMoveMutation } from '@/api/services/navigationApi';
import { NavItem as NavItemType } from '@/api/DTO/navigation';
import NavigationItem from './NavigationItem';
import { findItemById, moveItem } from './navigationUtils';
import { useNoSsr } from '@/hooks/useNoSsr';
import dynamic from 'next/dynamic';

export interface NavItemUI extends NavItemType {
  isExpanded?: boolean;
}

const DndProviderWithBackend = dynamic(() => import('./DndProviderWithBackend'), {
  ssr: false,
});

const mapApiToUiModel = (items: NavItemType[]): NavItemUI[] => {
  return items.map(item => ({
    ...item,
    isExpanded: true, // Default to expanded
    children: item.children ? mapApiToUiModel(item.children) : undefined
  }));
};

const mapUiToApiModel = (items: NavItemUI[]): NavItemType[] => {
  return items.map(item => {
    // Create a new object without isExpanded property
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { isExpanded, children, ...apiItem } = item;
    
    return {
      ...apiItem,
      children: children ? mapUiToApiModel(children) : undefined
    };
  });
};

export interface NavigationProps {
  container?: React.ReactNode;
  className?: string;
  sx?: React.CSSProperties;
}

export default function Navigation({ container, className, sx }: NavigationProps) {
  const [navItems, setNavItems] = useState<NavItemUI[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const { data, isLoading } = useGetNavigationQuery();
  const [saveNavigation] = useSaveNavigationMutation();
  const [trackNavItemMove] = useTrackNavItemMoveMutation();
  const { isClient } = useNoSsr();

  useEffect(() => {
    if (data) {
      setNavItems(mapApiToUiModel(data));
    }
  }, [data]);

  const handleEditToggle = () => {
    setIsEditMode(!isEditMode);
  };

  const handleCancelEdit = () => {
    if (data) {
      // Create a map of item IDs to their current expanded state
      const expandedStatesMap = new Map<string | number, boolean>();
      
      // Function to collect expanded states from current items
      const collectExpandedStates = (items: NavItemUI[]) => {
        items.forEach(item => {
          // Store the expanded state (or true if it's undefined)
          expandedStatesMap.set(item.id, item.isExpanded !== false);
          
          // Process children recursively
          if (item.children && item.children.length > 0) {
            collectExpandedStates(item.children);
          }
        });
      };
      
      // Collect current expanded states
      collectExpandedStates(navItems);
      
      // Function to apply the saved expanded states to refreshed items
      const applyExpandedStates = (items: NavItemUI[]): NavItemUI[] => {
        return items.map(item => {
          // Create a new item with the saved expanded state
          const newItem = {...item};
          
          // Apply the expanded state if available
          if (expandedStatesMap.has(item.id)) {
            newItem.isExpanded = expandedStatesMap.get(item.id);
          }
          
          // Process children recursively
          if (newItem.children && newItem.children.length > 0) {
            newItem.children = applyExpandedStates(newItem.children);
          }
          
          return newItem;
        });
      };
      
      // Map API data to UI model and apply saved expanded states
      const refreshedItems = applyExpandedStates(mapApiToUiModel(data));
      setNavItems(refreshedItems);
    }
    
    setIsEditMode(false);
  };

  const handleEditModeToggle = () => {
    setIsEditMode(true);
  };

  const handleSave = async () => {
    try {
      const apiModel = mapUiToApiModel(navItems);
      await saveNavigation(apiModel);
      
      setIsEditMode(false);
    } catch (error) {
      console.error('Failed to save navigation:', error);
    }
  };

  const handleToggleVisibility = useCallback((itemId: number | string) => {
    setNavItems(prevItems => {
      const newItems = [...prevItems];
      const item = findItemById(newItems, itemId);
      
      if (item) {
        // Toggle visibility (handle both visible and hidden properties)
        if (item.visible !== undefined) {
          item.visible = !item.visible;
        } else if (item.hidden !== undefined) {
          item.hidden = !item.hidden;
        } else {
          // If neither property exists, set visible to false
          item.visible = false;
        }
      }
      
      return newItems;
    });
  }, []);

  const handleTitleChange = useCallback((itemId: number | string, newTitle: string) => {
    setNavItems(prevItems => {
      const newItems = [...prevItems];
      const item = findItemById(newItems, itemId);
      
      if (item) {
        item.title = newTitle;
      }
      
      return newItems;
    });
  }, []);

  const moveNavItem = useCallback((dragId: number | string, hoverId: number | string, position: 'before' | 'after') => {
    setNavItems(prevItems => {
      return moveItem(prevItems, dragId, hoverId, position) as NavItemUI[];
    });
  }, []);

  const handleItemMove = useCallback(async (itemId: number | string, fromIndex: number, toIndex: number) => {
    if (!trackNavItemMove) return true;
    
    try {
      await trackNavItemMove({
        id: itemId,
        from: fromIndex, 
        to: toIndex
      }).unwrap();
      
      return true;
    } catch (error) {
      console.error('Failed to track item movement:', error);
      
      // Revert the move if tracking fails
      setNavItems(prevItems => {
        const revertedItems = moveItem(
          prevItems,
          itemId,
          itemId,
          toIndex > fromIndex ? 'before' : 'after'
        ) as NavItemUI[];
        return revertedItems;
      });
      
      return false;
    }
  }, [trackNavItemMove]);

  const handleToggleExpand = useCallback((itemId: number | string) => {
    setNavItems(prevItems => {
      const newItems = [...prevItems];
      const item = findItemById(newItems, itemId);
      
      if (item) {
        (item as NavItemUI).isExpanded = !(item as NavItemUI).isExpanded;
      }
      
      return newItems;
    });
  }, []);

  const renderNavItems = (items: NavItemUI[], level = 0) => {
    return items.map((item, index) => (
      <NavigationItem
        key={item.id}
        item={item}
        level={level}
        isEditMode={isEditMode}
        onToggleVisibility={handleToggleVisibility}
        onTitleChange={handleTitleChange}
        moveNavItem={moveNavItem}
        onTrackItemMove={handleItemMove}
        onEditModeToggle={handleEditModeToggle}
        isExpanded={item.isExpanded !== false}
        onToggleExpand={handleToggleExpand}
        index={index}
        items={items}
      >
        {item.children && item.children.length > 0 && (
          renderNavItems(item.children, level + 1)
        )}
      </NavigationItem>
    ));
  };

  if (isLoading) {
    return <Box>Loading navigation...</Box>;
  }

  const content = (
    <Box
      className={className}
      sx={{
        width: '100%',
        maxWidth: 360,
        bgcolor: 'background.paper',
        ...sx,
        touchAction: isEditMode ? 'none' : 'auto'
      }}
      role="navigation"
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
        {isEditMode ? (
          <>
            <IconButton
              color="primary"
              onClick={handleSave}
              size="small"
              sx={{ mr: 1 }}
            >
              <SaveIcon />
            </IconButton>
            <IconButton
              color="default"
              onClick={handleCancelEdit}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </>
        ) : (
          <IconButton
            color="primary"
            onClick={handleEditToggle}
            size="small"
          >
            <EditIcon />
          </IconButton>
        )}
      </Box>
      
      {isClient && navItems.length > 0 ? (
        <DndProviderWithBackend>
          <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
            {renderNavItems(navItems)}
          </Box>
        </DndProviderWithBackend>
      ) : (
        <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
          {renderNavItems(navItems)}
        </Box>
      )}
    </Box>
  );

  return container ? React.cloneElement(container as React.ReactElement, {}, content) : content;
} 