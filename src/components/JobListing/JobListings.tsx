import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Stack, 
  MenuItem, 
  Select, 
  FormControl, 
  Pagination,
  SelectChangeEvent,
  useTheme,
  useMediaQuery,
  Paper,
  IconButton,
  Switch,
  FormControlLabel
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MenuIcon from '@mui/icons-material/Menu';
import JobCard from './JobCard';
import { useDispatch } from 'react-redux';
import { toggleSidebar } from '../../redux/slices/uiSlice';

const mockJobs = [
  {
    id: '1',
    title: 'Gaming UI designer',
    company: 'Rockstar Games',
    companyColor: '#4285F4',
    location: 'ElMansoura, Egypt',
    postedTime: '10 days ago',
    experience: '0 - 3y of exp',
    jobType: ['Full time', 'Remote'],
    categories: ['Creative / Design', 'IT / Software development', 'Gaming'],
    logo: ''
  },
  {
    id: '2',
    title: 'Senior UX UI Designer',
    company: 'Egabi',
    companyColor: '#34A853',
    location: 'Cairo, Egypt',
    postedTime: '1 month ago',
    experience: '0 - 3y of exp',
    jobType: ['Full time', 'Hybrid'],
    categories: ['Creative / Design', 'IT / Software development'],
    logo: ''
  },
  {
    id: '3',
    title: 'React Frontend developer',
    company: 'Magara',
    companyColor: '#EA4335',
    location: 'Cairo, Egypt',
    postedTime: '1 month ago',
    experience: '5 - 7y of exp',
    jobType: ['Freelance', 'Remote'],
    categories: ['Creative / Design', 'IT / Software development'],
    logo: ''
  },
  {
    id: '4',
    title: 'Gaming UI designer',
    company: 'Rockstar Games',
    companyColor: '#4285F4',
    location: 'ElMansoura, Egypt',
    postedTime: '10 days ago',
    experience: '0 - 3y of exp',
    jobType: ['Full time', 'Remote'],
    categories: ['Creative / Design', 'IT / Software development', 'Gaming'],
    logo: ''
  },
  {
    id: '5',
    title: 'Senior UX UI Designer',
    company: 'Egabi',
    companyColor: '#34A853',
    location: 'Cairo, Egypt',
    postedTime: '1 month ago',
    experience: '0 - 3y of exp',
    jobType: ['Full time', 'Hybrid'],
    categories: ['Creative / Design', 'IT / Software development'],
    logo: ''
  },
  {
    id: '6',
    title: 'React Frontend developer',
    company: 'Magara',
    companyColor: '#EA4335',
    location: 'Cairo, Egypt',
    postedTime: '1 month ago',
    experience: '5 - 7y of exp',
    jobType: ['Freelance', 'Remote'],
    categories: ['Creative / Design', 'IT / Software development'],
    logo: ''
  }
];

const JobListings: React.FC = () => {
  const [sortBy, setSortBy] = useState('match');
  const [alertEnabled, setAlertEnabled] = useState(false);
  const [page, setPage] = useState(1);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch();
  const itemsPerPage = 3;

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleAlertToggle = () => {
    setAlertEnabled(!alertEnabled);
  };

  const indexOfLastJob = page * itemsPerPage;
  const indexOfFirstJob = indexOfLastJob - itemsPerPage;
  const currentJobs = mockJobs.slice(indexOfFirstJob, indexOfLastJob);

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Paper 
          elevation={0} 
          sx={{ 
            bgcolor: '#4CAF50', 
            color: 'white', 
            p: 2, 
            borderRadius: 1,
            flex: 1
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 500 }}>
              UI Designer in Egypt
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
              <Typography variant="body2" sx={{ mr: 1 }}>
                70 job positions
              </Typography>
              <FormControlLabel
                control={
                  <Switch 
                    size="small"
                    checked={alertEnabled}
                    onChange={handleAlertToggle}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: 'white',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                      },
                      '& .MuiSwitch-track': {
                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      },
                      '& .MuiSwitch-thumb': {
                        backgroundColor: 'white',
                      }
                    }}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ color: 'white', fontSize: '0.75rem' }}>
                    Set alert
                  </Typography>
                }
                sx={{ m: 0 }}
              />
            </Box>
          </Box>
        </Paper>
        
        {isMobile && (
          <IconButton
            onClick={() => dispatch(toggleSidebar())}
            sx={{
              ml: 2,
              bgcolor: 'white',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              '&:hover': {
                bgcolor: 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }
            }}
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
        )}
      </Box>

      <Stack direction="row" justifyContent="flex-end" mb={2}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' }}}>
            Sorting by:
          </Typography>
          <FormControl size="small" variant="standard" sx={{ minWidth: 80 }}>
            <Select
              value={sortBy}
              onChange={handleSortChange}
              IconComponent={KeyboardArrowDownIcon}
              sx={{ 
                '.MuiSelect-select': { 
                  color: '#48A74C',
                  fontWeight: 500,
                  py: 0,
                  fontSize: { xs: '0.875rem', md: '1rem' }
                }
              }}
              disableUnderline
            >
              <MenuItem value="match">Top match</MenuItem>
              <MenuItem value="recent">Most recent</MenuItem>
              <MenuItem value="salary">Highest salary</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Stack>

      <Box>
        {currentJobs.map(job => (
          <JobCard 
            key={job.id} 
            title={job.title}
            company={job.company}
            companyColor={job.companyColor}
            location={job.location}
            postedTime={job.postedTime}
            experience={job.experience}
            jobType={job.jobType}
            categories={job.categories}
            logo={job.logo}
          />
        ))}
      </Box>

      <Stack direction="row" justifyContent="center" my={4}>
        <Pagination 
          count={Math.ceil(mockJobs.length / itemsPerPage)} 
          page={page} 
          onChange={handlePageChange}
          shape="rounded"
          size={isMobile ? "small" : "medium"}
          sx={{
            '& .MuiPaginationItem-root.Mui-selected': {
              bgcolor: '#48A74C',
              color: 'white'
            }
          }}
        />
      </Stack>
    </Box>
  );
};

export default JobListings; 