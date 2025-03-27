import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Switch,
  Pagination,
  PaginationItem,
  Chip,
  FormControl,
  Select,
  MenuItem,
  useMediaQuery,
  useTheme,
  Stack
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteFilledIcon from '@mui/icons-material/Favorite';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MenuIcon from '@mui/icons-material/Menu';

interface JobListingsProps {
  onMenuOpen?: () => void;
}

interface Job {
  id: number;
  title: string;
  company: string;
  companyLogo: string;
  logoText: string;
  location: string;
  timePosted: string;
  experience: string;
  jobType: string;
  remoteType: string;
  categories: string[];
}

const JobListings: React.FC<JobListingsProps> = ({ onMenuOpen }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [currentPage, setCurrentPage] = useState(2);
  const [favoriteJobs, setFavoriteJobs] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState('Top match');

  const toggleFavorite = (jobId: number) => {
    if (favoriteJobs.includes(jobId)) {
      setFavoriteJobs(favoriteJobs.filter(id => id !== jobId));
    } else {
      setFavoriteJobs([...favoriteJobs, jobId]);
    }
  };

  const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const handleSortChange = (event: any) => {
    setSortBy(event.target.value);
  };

  const jobData: Job[] = [
    {
      id: 1,
      title: "Gaming UI designer",
      company: "Rockstar Games",
      companyLogo: "#4285F4",
      logoText: "R",
      location: "ElMansoursa, Egypt",
      timePosted: "10 days ago",
      experience: "0 - 3y of exp",
      jobType: "Full time",
      remoteType: "Remote",
      categories: ["Creative / Design", "IT / Software development", "Gaming"]
    },
    {
      id: 2,
      title: "Senior UX UI Designer",
      company: "Egabi",
      companyLogo: "#0FB5EE",
      logoText: "E",
      location: "Cairo, Egypt",
      timePosted: "1 month ago",
      experience: "0 - 3y of exp",
      jobType: "Full time",
      remoteType: "Hybrid",
      categories: ["Creative / Design", "IT / Software development"]
    },
    {
      id: 3,
      title: "React Frontend developer",
      company: "Magara",
      companyLogo: "#7628EE",
      logoText: "M",
      location: "Cairo, Egypt",
      timePosted: "1 month ago",
      experience: "5 - 7y of exp",
      jobType: "Freelance",
      remoteType: "Remote",
      categories: ["Creative / Design", "IT / Software development"]
    }
  ];

  return (
    <Box sx={{ width: '100%', minHeight: '100%', bgcolor: '#f8f8f8', position: 'relative' }}>

      <Stack direction={"row"} alignItems={"center"} gap={1} sx={{width:"100%"}}>

        <Box sx={{
          bgcolor: '#4CAF50',
          color: 'white',
          p: { xs: 2, md: 3 },
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
          mx: { xs: 2, md: 3 },
          my: { xs: 2, md: 3 },
          borderRadius: 1,
          width: !isMobile ? "100%" : "85%"
        }}>

          <Box>
            <Typography
              variant="h6"
              component="h1"
              sx={{
                fontWeight: 500,
                fontSize: { xs: '1rem', md: '1.25rem' }
              }}
            >
              UI Designer in Egypt
            </Typography>
            <Typography
              variant="body2"
              sx={{
                mt: 0.5,
                fontSize: { xs: '0.75rem', md: '0.875rem' },
                opacity: 0.9
              }}
            >
              70 job positions
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              variant="body2"
              sx={{
                display: { xs: 'none', sm: 'block' },
                fontSize: '0.875rem'
              }}
            >
              Set alert
            </Typography>
            <Switch
              size="small"
              color="default"
              sx={{
                '& .MuiSwitch-thumb': {
                  backgroundColor: 'white'
                },
                '& .MuiSwitch-track': {
                  backgroundColor: 'rgba(255, 255, 255, 0.3) !important'
                }
              }}
            />
          </Box>

        </Box>
        {isMobile && (
          <IconButton
            sx={{
              color: '#000',
              border:"1px solid #F0F0F0",
              borderRadius:"3px",
              bgcolor: 'rgba(255, 255, 255, 0.8)',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.9)'
              }
            }}
            onClick={onMenuOpen}
          >
            <MenuIcon sx={{ fontSize: '1.2rem' }} />
          </IconButton>
        )}
      </Stack>

      <Box sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        px: { xs: 2, md: 3 },
        py: 1.5,
        borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
      }}>
        <Typography variant="body2" sx={{ color: 'rgba(0, 0, 0, 0.6)', mr: 1 }}>
          Sorting by:
        </Typography>
        <FormControl
          variant="standard"
          size="small"
          sx={{
            minWidth: 120,
            position: 'relative',
            '& .MuiInput-underline:before': { borderBottom: 'none' },
            '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
            '& .MuiInput-underline:after': { borderBottom: 'none' }
          }}
        >
          <Select
            value={sortBy}
            onChange={handleSortChange}
            IconComponent={KeyboardArrowDownIcon}
            sx={{
              color: '#4CAF50',
              fontWeight: 500,
              fontSize: '0.875rem',
              '& .MuiSelect-select': {
                paddingBottom: 0,
              }
            }}
          >
            <MenuItem value="Top match">Top match</MenuItem>
            <MenuItem value="Newest">Newest</MenuItem>
            <MenuItem value="Latest">Latest</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={{
        p: { xs: 2, md: 3 },
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}>
        {jobData.map((job) => (
          <Box
            key={job.id}
            sx={{
              bgcolor: 'white',
              p: { xs: 2, md: 3 },
              borderRadius: 2,
              boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.05)',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              '&:hover': {
                boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.08)',
              }
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    bgcolor: job.companyLogo,
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '1.25rem'
                  }}
                >
                  {job.logoText}
                </Box>

                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 500, mb: 0.5, fontSize: '1rem' }}>
                    {job.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#4CAF50', fontWeight: 500, fontSize: '0.875rem' }}>
                    {job.company}
                  </Typography>
                </Box>
              </Box>

              <IconButton
                size="small"
                onClick={() => toggleFavorite(job.id)}
                sx={{
                  color: favoriteJobs.includes(job.id) ? '#f44336' : 'rgba(0, 0, 0, 0.3)',
                  p: 0.5,
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                {favoriteJobs.includes(job.id) ? <FavoriteFilledIcon /> : <FavoriteIcon />}
              </IconButton>
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 3,
                mt: 2,
                mb: 1,
                flexWrap: 'wrap',
                fontSize: '0.75rem',
                color: 'rgba(0, 0, 0, 0.6)'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <PlaceOutlinedIcon sx={{ fontSize: '0.875rem' }} />
                <Typography variant="caption">{job.location}</Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <AccessTimeIcon sx={{ fontSize: '0.875rem' }} />
                <Typography variant="caption">{job.timePosted}</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
              <Chip
                label={job.experience}
                size="small"
                sx={{
                  bgcolor: 'rgba(0, 0, 0, 0.05)',
                  color: 'rgba(0, 0, 0, 0.7)',
                  fontSize: '0.75rem',
                  height: '24px'
                }}
              />
              <Chip
                label={job.jobType}
                size="small"
                sx={{
                  bgcolor: 'rgba(0, 0, 0, 0.05)',
                  color: 'rgba(0, 0, 0, 0.7)',
                  fontSize: '0.75rem',
                  height: '24px'
                }}
              />
              <Chip
                label={job.remoteType}
                size="small"
                sx={{
                  bgcolor: 'rgba(0, 0, 0, 0.05)',
                  color: 'rgba(0, 0, 0, 0.7)',
                  fontSize: '0.75rem',
                  height: '24px'
                }}
              />
            </Box>

            <Box sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
              mt: 2,
              pt: 2,
              borderTop: '1px solid rgba(0, 0, 0, 0.06)'
            }}>
              {job.categories.map((category, index) => (
                <Typography
                  key={index}
                  variant="caption"
                  sx={{
                    color: 'rgba(0, 0, 0, 0.5)',
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {category}
                  {index < job.categories.length - 1 && (
                    <Box
                      component="span"
                      sx={{
                        mx: 0.5,
                        bgcolor: 'rgba(0, 0, 0, 0.3)',
                        width: '4px',
                        height: '4px',
                        borderRadius: '50%',
                        display: 'inline-block'
                      }}
                    />
                  )}
                </Typography>
              ))}
            </Box>
          </Box>
        ))}

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 2 }}>
          <Pagination
            count={3}
            page={currentPage}
            onChange={handleChangePage}
            color="primary"
            renderItem={(item) => (
              <PaginationItem
                {...item}
                sx={{
                  '&.Mui-selected': {
                    bgcolor: '#4CAF50',
                    color: 'white',
                    '&:hover': {
                      bgcolor: '#3d8b40',
                    }
                  }
                }}
              />
            )}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default JobListings; 