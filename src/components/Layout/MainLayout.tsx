import React, { ReactNode } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import Header from '../Header/index';
import Sidebar from '../Sidebar/index';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { setMenuOpen } from '../../redux/slices/uiSlice';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch();
  const { isMenuOpen } = useSelector((state: RootState) => state.ui);

  const handleCloseSidebar = () => {
    dispatch(setMenuOpen(false));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        {!isMobile && <Sidebar />}
        {isMobile && (
          <Sidebar 
            isMobile={true} 
            isOpen={isMenuOpen}
            onClose={handleCloseSidebar}
          />
        )}
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            p: { xs: 2, md: 3 },
            backgroundColor: '#f5f5f5',
            minHeight: 'calc(100vh - 64px)', // Adjust for the header height
            width: '100%'
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout; 