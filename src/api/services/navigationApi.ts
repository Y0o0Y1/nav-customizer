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
            transformResponse: () => mockNavItems,
            providesTags: ['Navigation'],
        }),
        saveNavigation: builder.mutation<void, NavItem[]>({
            query: (navItems) => ({
                url: '/nav',
                method: 'POST',
                data: navItems,
            }),
            invalidatesTags: ['Navigation'],
        }),
        trackNavItemMove: builder.mutation<void, TrackNavItemRequest>({
            query: (trackData) => ({
                url: '/track',
                method: 'POST',
                data: trackData,
            }),
        }),
    }),
})

export const {
    useGetNavigationQuery,
    useSaveNavigationMutation,
    useTrackNavItemMoveMutation,
} = navigationApi; 