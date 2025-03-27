import React, { useState } from 'react';
import { Box, Button, Typography, Divider } from '@mui/material';
import { useNavigation } from '../hooks/useNavigation';
import { NavItem } from '../api/DTO/navigation';

interface NavigationItem {
  id: number;
  title: string;
  url: string;
  children?: NavigationItem[];
}

export default function NavigationExample() {
  const { 
    navigation, 
    isLoading, 
    error, 
    saveNavigation, 
    trackNavItemMove 
  } = useNavigation();

  const [navItems, setNavItems] = useState<NavigationItem[]>([
    { id: 1, title: 'Home', url: '/' },
    { id: 2, title: 'Products', url: '/products' },
    { id: 3, title: 'About Us', url: '/about' },
    { id: 4, title: 'Contact', url: '/contact' }
  ]);

  const handleDragEnd = (result: any) => {
    const items = Array.from(navItems);
    const result2 = moveItemInArray(items, result.source.index, result.destination.index);
    
    setNavItems(result2);
    
    trackNavItemMove(parseInt(result.draggableId), result.source.index, result.destination.index);
    
    saveNavigation(result2);
  };

  const renderNavItems = (items: NavItem[]) => {
    return items.map((item, index) => (
      <div key={item.id} style={{ padding: '8px', border: '1px solid #ddd', marginBottom: '4px' }}>
        <div className="nav-item-content">
          <span>{item.title}</span>
          {item.target && <span> - {item.target}</span>}
          {item.visible === false && <span> (hidden)</span>}
        </div>
        {item.children && item.children.length > 0 && (
          <div style={{ paddingLeft: '20px', marginTop: '8px' }}>
            {renderNavItems(item.children)}
          </div>
        )}
      </div>
    ));
  };

  if (isLoading) return <div>Loading navigation...</div>;
  if (error) return <div>Error loading navigation</div>;
  if (!navigation.length) return <div>No navigation items found</div>;

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Navigation Example
      </Typography>
      
      <Divider sx={{ my: 2 }} />
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {navItems.map((item, index) => (
          <Box 
            key={item.id} 
            sx={{ 
              p: 2, 
              bgcolor: 'grey.100', 
              borderRadius: 1,
              cursor: 'move'
            }}
          >
            {item.title}
          </Box>
        ))}
      </Box>
      
      <Button 
        variant="contained" 
        sx={{ mt: 2 }}
      >
        Save Changes
      </Button>
    </div>
  );
}

function moveItemInArray(array: any[], fromIndex: number, toIndex: number) {
  const result = Array.from(array);
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  
  return result;
} 