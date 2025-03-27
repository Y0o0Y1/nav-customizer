import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../axiosBaseQuery';
import { NavItem, TrackNavItemRequest } from '../DTO/navigation';

const mockNavItems: NavItem[] = [
  {
    id: 1,
    title: 'Dashboard',
    target: '/dashboard',
    visible: true,
    level: 0
  },
  {
    id: 2,
    title: 'Job application',
    target: '#',
    visible: true,
    level: 0,
    children: [
      {
        id: 3,
        title: 'John Doe',
        target: '/john-doe',
        visible: true,
        level: 1
      },
      {
        id: 4,
        title: 'James Bond',
        target: '/james-bond',
        visible: true,
        level: 1
      },
      {
        id: 5,
        title: 'Scarlett Johansson',
        target: '/scarlett-johansson',
        visible: false,
        level: 1
      }
    ]
  },
  {
    id: 6,
    title: 'Qualifications',
    target: '#',
    visible: true,
    level: 0,
    children: []
  },
  {
    id: 7,
    title: 'About',
    target: '/about',
    visible: true,
    level: 0
  },
  {
    id: 8,
    title: 'Contact',
    target: '/contact',
    visible: true,
    level: 0
  }
];

// Track changes to the mock data
let currentNavItems = [...mockNavItems];

// Utility function to find and move an item in the current navigation state
const moveItemInArray = (array: NavItem[], fromIndex: number, toIndex: number) => {
  if (fromIndex === toIndex) return array;
  
  const newArray = [...array];
  const [removed] = newArray.splice(fromIndex, 1);
  newArray.splice(toIndex, 0, removed);
  
  return newArray;
};

export const navigationApi = createApi({
    reducerPath: 'navigationApi',
    baseQuery: axiosBaseQuery({ baseUrl: 'http://localhost:8081' }),
    tagTypes: ['Navigation'],
    endpoints: (builder) => ({
        getNavigation: builder.query<NavItem[], void>({
            query: () => ({
                url: '/nav',
                method: 'GET',
            }),
            // Return the current state of the mock data
            transformResponse: () => currentNavItems,
            providesTags: ['Navigation'],
        }),
        saveNavigation: builder.mutation<void, NavItem[]>({
            query: (navItems) => ({
                url: '/nav',
                method: 'POST',
                data: navItems,
            }),
            // Update the mock data
            onQueryStarted: async (navItems, { queryFulfilled }) => {
                try {
                    await queryFulfilled;
                    // Update the mock data
                    currentNavItems = [...navItems];
                } catch (error) {
                    console.error('Failed to save navigation:', error);
                }
            },
            invalidatesTags: ['Navigation'],
        }),
        trackNavItemMove: builder.mutation<void, TrackNavItemRequest>({
            query: (trackData) => ({
                url: '/track',
                method: 'POST',
                data: trackData,
            }),
            // Update the mock data when item is moved
            onQueryStarted: async (trackData, { queryFulfilled, dispatch }) => {
                try {
                    await queryFulfilled;
                    
                    if (trackData.from !== null && trackData.to !== null) {
                        // This is a simplification - in a real app you would need more complex logic
                        // to handle nested structures and correctly identify parent containers
                        const parentId = trackData.parentId;
                        
                        // Update currentNavItems based on the move
                        if (parentId) {
                            // Find the parent item
                            const parent = currentNavItems.find(item => item.id === parentId);
                            if (parent && parent.children) {
                                // Move the item within the parent's children
                                parent.children = moveItemInArray(
                                    parent.children,
                                    trackData.from,
                                    trackData.to
                                );
                            }
                        } else {
                            // Move at the root level
                            currentNavItems = moveItemInArray(
                                currentNavItems,
                                trackData.from,
                                trackData.to
                            );
                        }
                        
                        // Invalidate the cache to refresh the UI
                        dispatch(navigationApi.util.invalidateTags(['Navigation']));
                    }
                } catch (error) {
                    console.error('Failed to track item movement:', error);
                }
            },
        }),
    }),
})

export const {
    useGetNavigationQuery,
    useSaveNavigationMutation,
    useTrackNavItemMoveMutation,
} = navigationApi; 