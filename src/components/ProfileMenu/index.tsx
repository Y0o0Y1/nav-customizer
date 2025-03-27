import React from 'react';
import { 
  Box, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText, 
  Typography, 
  IconButton,
  Drawer,
  useMediaQuery,
  useTheme,
  Divider,
  Avatar,
  ListItemIcon
} from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import Link from 'next/link';

interface ProfileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ isOpen, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const profileMenuContent = (
    <>
      {/* Profile Header */}
      <Box 
        sx={{ 
          p: 2, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            alt="User profile" 
            src="/profile-img.jpg" 
            sx={{ width: 50, height: 50, mr: 2 }}
          />
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
              Ahmed Amaar
            </Typography>
            <Typography variant="body2" color="text.secondary">
              UX UI designer
            </Typography>
          </Box>
        </Box>
        <IconButton edge="end" onClick={onClose}>
          <ChevronRightIcon />
        </IconButton>
      </Box>

      {/* Main Menu */}
      <List component="nav" disablePadding>
        <ListItem disablePadding>
          <ListItemButton component={Link} href="/home">
            <ListItemIcon sx={{ minWidth: 40 }}>
              <HomeOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>
        
        <ListItem disablePadding>
          <ListItemButton component={Link} href="/jobs">
            <ListItemIcon sx={{ minWidth: 40 }}>
              <WorkOutlineOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Jobs" />
          </ListItemButton>
        </ListItem>
        
        <ListItem disablePadding>
          <ListItemButton component={Link} href="/employers">
            <ListItemIcon sx={{ minWidth: 40 }}>
              <PeopleAltOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Employers" />
          </ListItemButton>
        </ListItem>
        
        <ListItem disablePadding>
          <ListItemButton component={Link} href="/notifications">
            <ListItemIcon sx={{ minWidth: 40 }}>
              <NotificationsNoneOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Notifications" />
          </ListItemButton>
        </ListItem>
        
        <ListItem disablePadding>
          <ListItemButton component={Link} href="/messaging">
            <ListItemIcon sx={{ minWidth: 40 }}>
              <EmailOutlinedIcon />
              <Box 
                component="span"
                sx={{
                  position: 'absolute',
                  top: 14,
                  left: 14,
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  bgcolor: 'error.main',
                  color: 'white',
                  fontSize: '0.75rem',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                1
              </Box>
            </ListItemIcon>
            <ListItemText primary="Messaging" />
          </ListItemButton>
        </ListItem>
      </List>

      <Divider sx={{ my: 1 }} />

      {/* Settings Menu (no icons as per design) */}
      <List disablePadding>
        <ListItem disablePadding>
          <ListItemButton component={Link} href="/settings">
            <ListItemText 
              primary="Setting and privacy" 
              sx={{ ml: 1.5 }}
            />
          </ListItemButton>
        </ListItem>
        
        <ListItem disablePadding>
          <ListItemButton component={Link} href="/language">
            <ListItemText 
              primary="Language" 
              sx={{ ml: 1.5 }}
            />
          </ListItemButton>
        </ListItem>
        
        <ListItem disablePadding>
          <ListItemButton component={Link} href="/help">
            <ListItemText 
              primary="Help" 
              sx={{ ml: 1.5 }}
            />
          </ListItemButton>
        </ListItem>
      </List>

      <Divider sx={{ my: 1 }} />

      {/* Logout Button */}
      <List disablePadding>
        <ListItem disablePadding>
          <ListItemButton component={Link} href="/logout">
            <ListItemText 
              primary="Logout" 
              primaryTypographyProps={{ 
                color: 'error.main', 
                fontWeight: 500 
              }}
              sx={{ ml: 1.5 }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </>
  );

  if (isMobile) {
    return (
      <Drawer
        anchor="left"
        open={isOpen}
        onClose={onClose}
        sx={{
          '& .MuiDrawer-paper': {
            width: '100%',
            boxSizing: 'border-box',
            bgcolor: '#ffffff',
            animation: isOpen ? 'slideIn 0.3s forwards' : 'none',
          },
          '@keyframes slideIn': {
            '0%': {
              transform: 'translateX(-100%)'
            },
            '100%': {
              transform: 'translateX(0)'
            }
          }
        }}
      >
        {profileMenuContent}
      </Drawer>
    );
  }

  return null;
};

export default ProfileMenu; 