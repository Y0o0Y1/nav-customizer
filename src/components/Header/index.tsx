import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  InputBase,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Typography,
  Divider,
  ListItemIcon,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  Stack
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useDispatch } from 'react-redux';
import { setMenuOpen } from '../../redux/slices/uiSlice';

interface HeaderProps {
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    dispatch(setMenuOpen(true));
  };

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchorEl(event.currentTarget);
    setProfileMenuOpen(!profileMenuOpen);
  };

  const handleProfileClose = () => {
    setProfileAnchorEl(null);
    setProfileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: '#1a1a1a',
        color: 'white',
        boxShadow: 'none',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      <Toolbar sx={{
        justifyContent: 'space-between',
        minHeight: { xs: '56px', sm: '56px' },
        px: { xs: 1, sm: 2 },
        gap: 1
      }}>
        {(isMobile || isTablet) ? (
          <>
            <Stack
              direction="row"
              alignItems="center"
              sx={{
                cursor: 'pointer'
              }}
              onClick={toggleMobileMenu}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  mr: 0.5
                }}
                src="/assets/profile-photo.jpg"
              />
            </Stack>

            <Stack
              component="a"
              href="/"
              direction="row"
              alignItems="center"
              sx={{
                textDecoration: 'none',
                color: 'inherit',
                cursor: 'pointer',
                '&:hover': { opacity: 0.9 }
              }}
              onClick={(e: React.MouseEvent<HTMLElement>) => {
                e.preventDefault();
                handleMenuToggle();
              }}
            >
              <Typography
                variant={isMobile ? "subtitle1" : "h6"}
                sx={{
                  fontWeight: 'bold',
                  letterSpacing: '0.5px',
                  color: '#fff'
                }}
              >
                i<span style={{ color: '#4CAF50' }}>Z</span>AM
              </Typography>
            </Stack>
          </>
        ) : (
          <>
            <Stack
              direction="row"
              alignItems="center"
              spacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Stack
                component="a"
                href="/"
                direction="row"
                alignItems="center"
                sx={{
                  textDecoration: 'none',
                  color: 'inherit',
                  cursor: 'pointer',
                  '&:hover': { opacity: 0.9 }
                }}
                onClick={(e: React.MouseEvent<HTMLElement>) => {
                  e.preventDefault();
                  handleMenuToggle();
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 'bold',
                    letterSpacing: '0.5px',
                    color: '#fff'
                  }}
                >
                  i<span style={{ color: '#4CAF50' }}>Z</span>AM
                </Typography>
              </Stack>

              <Stack
                direction="row"
                alignItems="center"
                sx={{
                  borderRadius: '50px',
                  bgcolor: 'white',
                  width: { sm: '200px', md: '300px' },
                  height: "40px",
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <InputBase
                  placeholder="Search by name, job title..."
                  startAdornment={
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="center"
                      sx={{
                        height: '100%',
                        width: '38px',
                        borderRadius: '50%',
                        bgcolor: '#4CAF50',
                        mr: 0.8,
                        marginY:1
                      }}
                    >
                      <SearchIcon sx={{ color: 'white', fontSize: '1.1rem' }} />
                    </Stack>
                  }
                  sx={{
                    color: '#555',
                    pl: 1,
                    pr: 2,
                    height: '34px',
                    width: '100%',
                    fontSize: '0.85rem',
                    '& input::placeholder': {
                      color: '#aaa',
                      opacity: 1,
                      display: 'flex',
                      alignItems: 'center',
                    },
                    '& .MuiInputBase-input': {
                      height: '34px',
                      py: 0,
                      display: 'flex',
                      alignItems: 'center'
                    }
                  }}
                />
              </Stack>
            </Stack>

            <Stack
              direction="row"
              alignItems="center"
              sx={{
                height: '100%'
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="center"
                sx={{
                  height: '100%',
                  position: 'relative'
                }}
              >
                <IconButton
                  color="inherit"
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 0.3,
                    p: 0,
                    mx: { xs: 1, md: 1.2 },
                    minWidth: { xs: '40px', md: '40px' },
                    height: '56px',
                    borderRadius: 0
                  }}
                >
                  <HomeOutlinedIcon sx={{ fontSize: '1.2rem' }} />
                  <Box sx={{ fontSize: '0.65rem', lineHeight: 1, mt: 0.3 }}>Home</Box>
                </IconButton>

                <IconButton
                  color="inherit"
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 0.3,
                    p: 0,
                    mx: { xs: 1, md: 1.2 },
                    minWidth: { xs: '40px', md: '40px' },
                    height: '56px',
                    borderRadius: 0,
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      height: '2px',
                      backgroundColor: '#4CAF50'
                    }
                  }}
                >
                  <WorkOutlineOutlinedIcon sx={{ fontSize: '1.2rem' }} />
                  <Box sx={{ fontSize: '0.65rem', lineHeight: 1, mt: 0.3 }}>Jobs</Box>
                </IconButton>

                <IconButton
                  color="inherit"
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 0.3,
                    p: 0,
                    mx: { xs: 1, md: 1.2 },
                    minWidth: { xs: '40px', md: '40px' },
                    height: '56px',
                    borderRadius: 0
                  }}
                >
                  <PeopleAltOutlinedIcon sx={{ fontSize: '1.2rem' }} />
                  <Box sx={{ fontSize: '0.65rem', lineHeight: 1, mt: 0.3 }}>Employers</Box>
                </IconButton>

                <Box sx={{
                  width: '1px',
                  height: '24px',
                  bgcolor: 'rgba(255,255,255,0.2)',
                  mx: { xs: 0.5, md: 1 }
                }} />

                <IconButton
                  color="inherit"
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 0.3,
                    p: 0,
                    mx: { xs: 1, md: 1.2 },
                    minWidth: { xs: '40px', md: '40px' },
                    height: '56px',
                    borderRadius: 0
                  }}
                >
                  <Badge
                    badgeContent={1}
                    color="error"
                    sx={{
                      '& .MuiBadge-badge': {
                        top: -1,
                        right: -1,
                        backgroundColor: '#E34234',
                        fontSize: '0.6rem',
                        minWidth: '14px',
                        height: '14px',
                        padding: 0
                      }
                    }}
                  >
                    <NotificationsNoneOutlinedIcon sx={{ fontSize: '1.2rem' }} />
                  </Badge>
                  <Box sx={{ fontSize: '0.65rem', lineHeight: 1, mt: 0.3 }}>Notifications</Box>
                </IconButton>

                <IconButton
                  color="inherit"
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 0.3,
                    p: 0,
                    mx: { xs: 1, md: 1.2 },
                    minWidth: { xs: '40px', md: '40px' },
                    height: '56px',
                    borderRadius: 0
                  }}
                >
                  <Badge
                    badgeContent={3}
                    color="error"
                    sx={{
                      '& .MuiBadge-badge': {
                        top: -1,
                        right: -1,
                        backgroundColor: '#E34234',
                        fontSize: '0.6rem',
                        minWidth: '14px',
                        height: '14px',
                        padding: 0
                      }
                    }}
                  >
                    <ChatOutlinedIcon sx={{ fontSize: '1.2rem' }} />
                  </Badge>
                  <Box sx={{ fontSize: '0.65rem', lineHeight: 1, mt: 0.3 }}>Messaging</Box>
                </IconButton>
              </Stack>

              <Stack
                direction="row"
                alignItems="center"
                sx={{
                  ml: { xs: 0.5, sm: 1, md: 1.5 },
                  pl: 0.5,
                  height: '100%',
                  position: 'relative',
                  cursor: 'pointer'
                }}
                onClick={handleProfileClick}
              >
                <Avatar
                  sx={{
                    width: 26,
                    height: 26,
                    bgcolor: '#fff',
                    fontSize: '0.8rem',
                    color: '#1a1a1a',
                    fontWeight: 'bold'
                  }}
                  src="/assets/profile-photo.jpg"
                />
                {profileMenuOpen ?
                  <KeyboardArrowUpIcon sx={{ fontSize: '1rem', ml: 0.3, color: 'rgba(255, 255, 255, 0.7)' }} /> :
                  <KeyboardArrowDownIcon sx={{ fontSize: '1rem', ml: 0.3, color: 'rgba(255, 255, 255, 0.7)' }} />
                }

                <Menu
                  anchorEl={profileAnchorEl}
                  open={profileMenuOpen}
                  onClose={handleProfileClose}
                  PaperProps={{
                    elevation: 3,
                    sx: {
                      mt: 1.5,
                      minWidth: 220,
                      borderRadius: 1,
                      '& .MuiList-root': {
                        p: 0
                      }
                    }
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={2}
                    sx={{ p: 2 }}
                  >
                    <Avatar
                      sx={{
                        width: 48,
                        height: 48
                      }}
                      src="/assets/profile-photo.jpg"
                    />
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        Ahmed Amaar
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                        UX UI designer
                      </Typography>
                    </Box>
                    <ChevronRightIcon sx={{ ml: 'auto', color: 'rgba(0, 0, 0, 0.3)' }} />
                  </Stack>

                  <Divider />

                  <MenuItem sx={{ py: 1.5 }}>
                    <ListItemIcon>
                      <SettingsOutlinedIcon fontSize="small" />
                    </ListItemIcon>
                    Setting and privacy
                  </MenuItem>

                  <MenuItem sx={{ py: 1.5 }}>
                    <ListItemIcon>
                      <LanguageOutlinedIcon fontSize="small" />
                    </ListItemIcon>
                    Language
                  </MenuItem>

                  <MenuItem sx={{ py: 1.5 }}>
                    <ListItemIcon>
                      <HelpOutlineOutlinedIcon fontSize="small" />
                    </ListItemIcon>
                    Help
                  </MenuItem>

                  <Divider />

                  <MenuItem sx={{ py: 1.5, color: '#E34234' }}>
                    <ListItemIcon>
                      <LogoutOutlinedIcon fontSize="small" sx={{ color: '#E34234' }} />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </Stack>
            </Stack>
          </>
        )}
      </Toolbar>

      {/* Mobile Menu Drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={toggleMobileMenu}
        variant="temporary"
        ModalProps={{
          keepMounted: true
        }}
        PaperProps={{
          sx: {
            width: '100%',
            height: '100%',
            maxWidth: '100%',
            bgcolor: 'white',
            color: '#333'
          }
        }}
        SlideProps={{
          direction: "right",
          timeout: 400
        }}
        sx={{
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.4)'
          },
          '& .MuiPaper-root': {
            boxShadow: 'none'
          }
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          sx={{
            p: 2,
            borderBottom: '1px solid rgba(0,0,0,0.1)',
            pb: 2,
            opacity: 1,
            transition: 'opacity 0.3s ease-in-out 0.1s'
          }}
        >
          <Avatar
            sx={{
              width: 50,
              height: 50
            }}
            src="/assets/profile-photo.jpg"
          />
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 500,
                color: '#333',
                fontSize: '1rem'
              }}
            >
              Ahmed Amaar
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#666',
                fontSize: '0.875rem'
              }}
            >
              UX UI designer
            </Typography>
          </Box>
          <ChevronRightIcon
            sx={{ color: '#999', cursor: 'pointer' }}
            onClick={toggleMobileMenu}
          />
        </Stack>

        <List sx={{
          py: 0,
          opacity: 1,
          transition: 'opacity 0.4s ease-in-out 0.2s, transform 0.4s ease-out 0.2s',
          transform: 'translateX(0)'
        }}>
          <ListItem
            component="div"
            sx={{ py: 1.5, px: 2 }}
          >
            <HomeOutlinedIcon sx={{ color: '#666', mr: 3 }} />
            <ListItemText
              primary="Home"
              primaryTypographyProps={{
                fontWeight: 400,
                color: '#333'
              }}
            />
          </ListItem>
          <ListItem
            component="div"
            sx={{ py: 1.5, px: 2 }}
          >
            <WorkOutlineOutlinedIcon sx={{ color: '#666', mr: 3 }} />
            <ListItemText
              primary="Jobs"
              primaryTypographyProps={{
                color: '#333',
                fontWeight: 400
              }}
            />
          </ListItem>
          <ListItem
            component="div"
            sx={{ py: 1.5, px: 2 }}
          >
            <PeopleAltOutlinedIcon sx={{ color: '#666', mr: 3 }} />
            <ListItemText
              primary="Employers"
              primaryTypographyProps={{
                color: '#333',
                fontWeight: 400
              }}
            />
          </ListItem>
          <ListItem
            component="div"
            sx={{ py: 1.5, px: 2 }}
          >
            <NotificationsNoneOutlinedIcon sx={{ color: '#666', mr: 3 }} />
            <ListItemText
              primary="Notifications"
              primaryTypographyProps={{
                color: '#333',
                fontWeight: 400
              }}
            />
          </ListItem>
          <ListItem
            component="div"
            sx={{ py: 1.5, px: 2 }}
          >
            <Badge
              badgeContent={1}
              color="error"
              sx={{
                '& .MuiBadge-badge': {
                  backgroundColor: '#E34234',
                  fontSize: '0.6rem',
                  minWidth: '16px',
                  height: '16px'
                }
              }}
            >
              <ChatOutlinedIcon sx={{ color: '#666', mr: 3 }} />
            </Badge>
            <ListItemText
              primary="Messaging"
              primaryTypographyProps={{
                color: '#333',
                fontWeight: 400
              }}
            />
          </ListItem>
        </List>

        <List sx={{
          py: 0,
          mt: 4,
          opacity: 1,
          transition: 'opacity 0.4s ease-in-out 0.3s, transform 0.4s ease-out 0.3s',
          transform: 'translateX(0)'
        }}>
          <ListItem
            component="div"
            sx={{ py: 1.5, px: 2 }}
          >
            <ListItemText
              primary="Setting and privacy"
              primaryTypographyProps={{
                color: '#666',
                fontWeight: 400,
                fontSize: '0.9rem'
              }}
            />
          </ListItem>
          <ListItem
            component="div"
            sx={{ py: 1.5, px: 2 }}
          >
            <ListItemText
              primary="Language"
              primaryTypographyProps={{
                color: '#666',
                fontWeight: 400,
                fontSize: '0.9rem'
              }}
            />
          </ListItem>
          <ListItem
            component="div"
            sx={{ py: 1.5, px: 2 }}
          >
            <ListItemText
              primary="Help"
              primaryTypographyProps={{
                color: '#666',
                fontWeight: 400,
                fontSize: '0.9rem'
              }}
            />
          </ListItem>
          <ListItem
            component="div"
            sx={{ py: 1.5, px: 2 }}
          >
            <ListItemText
              primary="Logout"
              primaryTypographyProps={{
                color: '#E34234',
                fontWeight: 400,
                fontSize: '0.9rem'
              }}
            />
          </ListItem>
        </List>
      </Drawer>
    </AppBar>
  );
};

export default Header;
