import { useState, useEffect, useCallback } from 'react';
import { useGetNavigationQuery, useSaveNavigationMutation, useTrackNavItemMoveMutation } from '@/api/services/navigationApi';
import { NavItem } from '@/api/DTO/navigation';

export const useNavigation = () => {
  const { data, isLoading, refetch } = useGetNavigationQuery();
  const [saveNavigationMutation] = useSaveNavigationMutation();
  const [trackNavItemMove] = useTrackNavItemMoveMutation();
  
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  
  useEffect(() => {
    if (data) {
      setNavItems(data);
    }
  }, [data]);
  
  const saveNavigation = async () => {
    await saveNavigationMutation(navItems);
    setIsEditMode(false);
  };
  
  const handleNavItemMove = useCallback(async (id: number, from: number | null, to: number | null) => {
    if (!trackNavItemMove) return true;
    
    try {
      await trackNavItemMove({ id, from, to }).unwrap();
      return true;
    } catch (error) {
      console.error('Failed to track item movement:', error);
      return false;
    }
  }, [trackNavItemMove]);
  
  return {
    navItems,
    setNavItems,
    isLoading,
    isEditMode,
    setIsEditMode,
    saveNavigation,
    refetch,
    trackItemMovement: handleNavItemMove
  };
}; 