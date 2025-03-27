'use client';

import React from 'react';
import { Box } from '@mui/material';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import JobListings from '../components/JobListings';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { setMenuOpen } from '../redux/slices/uiSlice';

export default function Home() {
  const { isMenuOpen } = useSelector((state: RootState) => state.ui);
  const dispatch = useDispatch();
  
  const handleCloseSidebar = () => {
    dispatch(setMenuOpen(false));
  };
  
  const handleOpenSidebar = () => {
    dispatch(setMenuOpen(true));
  };
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header />
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar for desktop and mobile */}
        <Sidebar isOpen={isMenuOpen} onClose={handleCloseSidebar} />
        
        {/* Main content */}
        <Box 
          sx={{ 
            flex: 1, 
            overflow: 'auto', 
            bgcolor: '#f8f8f8', 
            display: 'flex', 
            flexDirection: 'column',
            position: 'relative',
            width: '100%'
          }}
        >
          <JobListings onMenuOpen={handleOpenSidebar} />
        </Box>
      </Box>
    </Box>
  );
}
