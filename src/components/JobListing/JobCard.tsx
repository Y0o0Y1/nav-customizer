import React from 'react';
import { Box, Typography, Card, CardContent, Stack, Chip, IconButton } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

interface JobCardProps {
  title: string;
  company: string;
  companyColor?: string;
  location: string;
  postedTime: string;
  experience: string;
  jobType: string[];
  categories: string[];
  logo: string;
}

const JobCard: React.FC<JobCardProps> = ({
  title,
  company,
  companyColor,
  location,
  postedTime,
  experience,
  jobType,
  categories,
  logo
}) => {
  return (
    <Card 
      variant="outlined" 
      sx={{ 
        mb: 2, 
        borderRadius: 1, 
        borderColor: 'rgba(0, 0, 0, 0.08)',
        '&:hover': {
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.08)'
        }
      }}
    >
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Stack direction="row" spacing={2}>
            <Box 
              component="div" 
              sx={{ 
                width: { xs: 48, md: 56 }, 
                height: { xs: 48, md: 56 }, 
                borderRadius: 1,
                overflow: 'hidden',
                bgcolor: companyColor || '#4285F4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: { xs: 18, md: 24 },
                fontWeight: 600,
                color: 'white'
              }}
            >
              {logo ? (
                <Box component="img" src={logo} alt={company} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                company.charAt(0)
              )}
            </Box>
            <Stack>
              <Typography variant="h6" fontWeight={500} fontSize={{ xs: '1rem', md: '1.125rem' }}>
                {title}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  mb: 1.5, 
                  color: companyColor || '#4285F4',
                  fontWeight: 500
                }}
              >
                {company}
              </Typography>

              <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 1.5 }}>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <LocationOnIcon fontSize="small" sx={{ color: 'text.secondary', fontSize: 16 }} />
                  <Typography variant="body2" color="text.secondary">
                    {location}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <AccessTimeIcon fontSize="small" sx={{ color: 'text.secondary', fontSize: 16 }} />
                  <Typography variant="body2" color="text.secondary">
                    {postedTime}
                  </Typography>
                </Stack>
              </Stack>

              <Stack direction="row" spacing={1} sx={{ mb: 2 }} flexWrap="wrap">
                <Chip 
                  label={experience} 
                  size="small" 
                  sx={{ 
                    bgcolor: 'rgba(0,0,0,0.06)', 
                    color: 'text.secondary',
                    borderRadius: 1,
                    height: 24,
                    fontSize: '0.75rem',
                    mb: 0.5
                  }} 
                />
                {jobType.map((type, index) => (
                  <Chip 
                    key={index} 
                    label={type} 
                    size="small" 
                    sx={{ 
                      bgcolor: 'rgba(0,0,0,0.06)', 
                      color: 'text.secondary',
                      borderRadius: 1,
                      height: 24,
                      fontSize: '0.75rem',
                      mb: 0.5
                    }} 
                  />
                ))}
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                {categories.map((category, index) => (
                  <React.Fragment key={index}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                      {category}
                    </Typography>
                    {index < categories.length - 1 && (
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                        -
                      </Typography>
                    )}
                  </React.Fragment>
                ))}
              </Stack>
            </Stack>
          </Stack>

          <IconButton sx={{ color: 'rgba(0, 0, 0, 0.54)' }}>
            <FavoriteBorderIcon />
          </IconButton>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default JobCard; 