import { useEffect } from 'react';
import { useGetNavigationQuery, useSaveNavigationMutation, useTrackNavItemMoveMutation } from '@/api/services/navigationApi';
import { NavItem } from '@/api/DTO/navigation';

type NavigationManagerProps = {
  onNavigationLoaded?: (navItems: NavItem[]) => void;
  onLoadingChange?: (isLoading: boolean) => void;
  onError?: (error: any) => void;
  onSaveSuccess?: () => void;
  onSaveError?: (error: any) => void;
  autoLoad?: boolean;
};

export default function NavigationManager({
  onNavigationLoaded,
  onLoadingChange,
  onError,
  onSaveSuccess,
  onSaveError,
  autoLoad = true,
}: NavigationManagerProps) {
  const { 
    data, 
    isLoading, 
    error,
    refetch
  } = useGetNavigationQuery(undefined, {
    skip: !autoLoad
  });
  
  const [saveNavigation, { isLoading: isSaving, error: saveError }] = useSaveNavigationMutation();
  const [trackNavItemMove] = useTrackNavItemMoveMutation();
  
  useEffect(() => {
    if (data && onNavigationLoaded) {
      onNavigationLoaded(data);
    }
  }, [data, onNavigationLoaded]);
  
  useEffect(() => {
    if (onLoadingChange) {
      onLoadingChange(isLoading || isSaving);
    }
  }, [isLoading, isSaving, onLoadingChange]);
  
  useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);
  
  useEffect(() => {
    if (saveError && onSaveError) {
      onSaveError(saveError);
    }
  }, [saveError, onSaveError]);
  
  const handleSaveNavigation = async (items: NavItem[]) => {
    try {
      await saveNavigation(items);
      if (onSaveSuccess) {
        onSaveSuccess();
      }
      return true;
    } catch (err) {
      return false;
    }
  };
  
  const handleTrackItemMove = async (
    itemId: number | string,
    fromIndex: number,
    toIndex: number
  ) => {
    try {
      await trackNavItemMove({ 
        id: itemId, 
        from: fromIndex, 
        to: toIndex 
      });
      return true;
    } catch (err) {
      return false;
    }
  };
  
  return null;
}

// Example usage:
// <NavigationManager 
//   onNavigationLoaded={items => setNavItems(items)}
//   onSaveHandler={saveHandler => setSaveNavigation(saveHandler)}
//   onMoveHandler={moveHandler => setMoveNavItem(moveHandler)}
// /> 