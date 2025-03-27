import { NavItemUI } from './Navigation';
import { NavItem } from '@/api/DTO/navigation';

// Find an item by its ID in the navigation tree
export const findItemById = (items: NavItemUI[] | NavItem[], id: number | string): NavItemUI | NavItem | undefined => {
  for (const item of items) {
    if (item.id === id) {
      return item;
    }
    
    if (item.children && item.children.length > 0) {
      const foundInChildren = findItemById(item.children, id);
      if (foundInChildren) {
        return foundInChildren;
      }
    }
  }
  
  return undefined;
};

// Find an item by its ID along with its parent and indices
export const findItemWithParent = (
  items: NavItemUI[] | NavItem[], 
  id: number | string,
  parent: NavItemUI | NavItem | null = null,
  parentIndex: number = -1
): {
  item: NavItemUI | NavItem | undefined,
  index: number,
  parent: NavItemUI | NavItem | null,
  parentIndex: number
} => {
  for (let i = 0; i < items.length; i++) {
    if (items[i].id === id) {
      return { item: items[i], index: i, parent, parentIndex };
    }
    
    // Safely access children, accounting for cases where it might be undefined
    const children = items[i].children;
    if (children && children.length > 0) {
      const result = findItemWithParent(children as (NavItemUI[] | NavItem[]), id, items[i], i);
      if (result.item) {
        return result;
      }
    }
  }
  
  return { item: undefined, index: -1, parent: null, parentIndex: -1 };
};

// Move an item in the navigation tree
export const moveItem = (
  items: NavItemUI[] | NavItem[],
  dragId: number | string,
  hoverId: number | string,
  position: 'before' | 'after'
): NavItemUI[] | NavItem[] => {
  // Create a deep copy to avoid mutating the original items
  const newItems = JSON.parse(JSON.stringify(items));
  
  // Find the source item and its parent
  const source = findItemWithParent(newItems, dragId);
  
  // Find the target item and its parent
  const target = findItemWithParent(newItems, hoverId);
  
  // If either source or target is not found, return the original array
  if (!source.item || !target.item) {
    return items;
  }
  
  // Remove the dragged item from its original position
  let sourceList: any[] = source.parent === null 
    ? newItems 
    : (source.parent.children as any[]);
  
  const [draggedItem] = sourceList.splice(source.index, 1);
  
  // Insert the dragged item at the new position
  let targetList: any[] = target.parent === null 
    ? newItems 
    : (target.parent.children as any[]);
  
  // Calculate the insertion index
  // If inserting in the same parent and after the original position,
  // we need to account for the removed item
  let insertIndex = position === 'before' ? target.index : target.index + 1;
  if (source.parent === target.parent && source.index < target.index) {
    insertIndex--;
  }
  
  // Insert the item at the calculated position
  targetList.splice(insertIndex, 0, draggedItem);
  
  return newItems;
}; 