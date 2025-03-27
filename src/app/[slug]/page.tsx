'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Stack, 
  Skeleton, 
  Divider, 
  Avatar, 
  Chip, 
  Button
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import Navigation from '../../components/Navigation/Navigation';

// Mock data - replace with actual API calls
const mockProfiles = {
  'john-doe': {
    type: 'user',
    name: 'John Doe',
    title: 'Software Engineer',
    avatar: '/profile-avatar.jpg',
    coverImage: '/cover-image.jpg',
    location: 'San Francisco, CA',
    about: 'Experienced software engineer with a passion for building scalable applications.',
    experience: [
      {
        title: 'Senior Software Engineer',
        company: 'Tech Corp',
        duration: 'Jan 2020 - Present',
        description: 'Working on enterprise solutions using React and Node.js'
      },
      {
        title: 'Software Developer',
        company: 'StartUp Inc',
        duration: 'Jun 2018 - Dec 2019',
        description: 'Developed web applications using modern JavaScript frameworks'
      }
    ],
    education: [
      {
        school: 'University of Technology',
        degree: 'BS in Computer Science',
        duration: '2014 - 2018'
      }
    ],
    skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'GraphQL']
  },
  'tech-corp': {
    type: 'employer',
    name: 'Tech Corp',
    logo: '/company-logo.jpg',
    coverImage: '/company-cover.jpg',
    industry: 'Information Technology',
    location: 'San Francisco, CA',
    about: 'Leading technology company focused on enterprise solutions.',
    employees: '500-1000',
    founded: '2010',
    openPositions: 15
  },
  'senior-dev-position': {
    type: 'job',
    title: 'Senior Frontend Developer',
    company: 'Tech Corp',
    logo: '/company-logo.jpg',
    location: 'San Francisco, CA',
    jobType: 'Full-time',
    salary: '$120,000 - $150,000',
    posted: '2 weeks ago',
    description: 'We are looking for an experienced Frontend Developer to join our team...',
    requirements: [
      'At least 5 years of experience with JavaScript and modern frameworks',
      'Experience with React, Redux, and TypeScript',
      'Strong understanding of web performance optimization',
      'Bachelor\'s degree in Computer Science or related field'
    ],
    benefits: [
      'Competitive salary and equity',
      'Health, dental, and vision insurance',
      'Flexible work schedule and remote options',
      '401(k) matching'
    ]
  }
};

const SlugPage = () => {
  const params = useParams();
  const slug = params.slug as string;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In a real app, fetch data from API
    const fetchData = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (mockProfiles[slug]) {
          setData(mockProfiles[slug]);
        } else {
          setError('Content not found');
        }
      } catch (err) {
        setError('Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const renderContent = () => {
    if (loading) {
      return <LoadingSkeleton />;
    }

    if (error || !data) {
      return (
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Typography variant="h4" gutterBottom>
            {error || 'Content not found'}
          </Typography>
          <Button variant="contained" href="/" sx={{ mt: 2 }}>
            Return Home
          </Button>
        </Container>
      );
    }

    // Render content based on type
    switch (data.type) {
      case 'user':
        return <UserProfile data={data} />;
      case 'employer':
        return <EmployerProfile data={data} />;
      case 'job':
        return <JobListing data={data} />;
      default:
        return (
          <Container maxWidth="md" sx={{ py: 8 }}>
            <Typography variant="h4" gutterBottom>
              Unknown content type
            </Typography>
            <Button variant="contained" href="/" sx={{ mt: 2 }}>
              Return Home
            </Button>
          </Container>
        );
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Navigation />
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3,
          pt: { xs: 10, md: 3 } 
        }}
      >
        {renderContent()}
      </Box>
    </Box>
  );
};

const LoadingSkeleton = () => (
  <Container maxWidth="md" sx={{ py: 4 }}>
    <Skeleton variant="rectangular" height={200} sx={{ mb: 2 }} />
    <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
      <Skeleton variant="circular" width={100} height={100} />
      <Box sx={{ width: '100%' }}>
        <Skeleton height={40} sx={{ mb: 1 }} />
        <Skeleton height={30} width="60%" />
      </Box>
    </Stack>
    <Skeleton height={100} sx={{ mb: 2 }} />
    <Stack spacing={2}>
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} height={120} />
      ))}
    </Stack>
  </Container>
);

const UserProfile = ({ data }: { data: any }) => (
  <Container maxWidth="md" sx={{ py: 4 }}>
    {/* Cover Image */}
    <Card sx={{ mb: 4, position: 'relative' }}>
      <CardMedia
        component="img"
        height="200"
        image={data.coverImage || '/default-cover.jpg'}
        alt="Profile Cover"
      />
      <Avatar
        src={data.avatar}
        sx={{
          width: 120,
          height: 120,
          border: '4px solid white',
          position: 'absolute',
          bottom: -60,
          left: 24
        }}
      />
    </Card>

    <Box sx={{ ml: { xs: 0, sm: 20 }, mt: { xs: 8, sm: 0 }, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        {data.name}
      </Typography>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        {data.title}
      </Typography>
      <Stack direction="row" spacing={1} alignItems="center">
        <LocationOnIcon fontSize="small" color="action" />
        <Typography variant="body2" color="text.secondary">
          {data.location}
        </Typography>
      </Stack>
    </Box>

    <Divider sx={{ mb: 4 }} />

    {/* About */}
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        About
      </Typography>
      <Typography variant="body1">{data.about}</Typography>
    </Box>

    {/* Experience */}
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Experience
      </Typography>
      <Stack spacing={2}>
        {data.experience.map((exp: any, index: number) => (
          <Card key={index} variant="outlined">
            <CardContent>
              <Stack direction="row" spacing={2}>
                <WorkIcon color="action" />
                <Box>
                  <Typography variant="h6">{exp.title}</Typography>
                  <Typography variant="subtitle1">{exp.company}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {exp.duration}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {exp.description}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>

    {/* Education */}
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Education
      </Typography>
      <Stack spacing={2}>
        {data.education.map((edu: any, index: number) => (
          <Card key={index} variant="outlined">
            <CardContent>
              <Stack direction="row" spacing={2}>
                <SchoolIcon color="action" />
                <Box>
                  <Typography variant="h6">{edu.school}</Typography>
                  <Typography variant="body1">{edu.degree}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {edu.duration}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>

    {/* Skills */}
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Skills
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {data.skills.map((skill: string, index: number) => (
          <Chip key={index} label={skill} />
        ))}
      </Box>
    </Box>
  </Container>
);

const EmployerProfile = ({ data }: { data: any }) => (
  <Container maxWidth="md" sx={{ py: 4 }}>
    {/* Cover Image */}
    <Card sx={{ mb: 4, position: 'relative' }}>
      <CardMedia
        component="img"
        height="200"
        image={data.coverImage || '/default-cover.jpg'}
        alt="Company Cover"
      />
      <Avatar
        src={data.logo}
        sx={{
          width: 120,
          height: 120,
          border: '4px solid white',
          position: 'absolute',
          bottom: -60,
          left: 24
        }}
      />
    </Card>

    {/* Basic Info */}
    <Box sx={{ ml: { xs: 0, sm: 20 }, mt: { xs: 8, sm: 0 }, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        {data.name}
      </Typography>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        {data.industry}
      </Typography>
      <Stack direction="row" spacing={3} alignItems="center">
        <Stack direction="row" spacing={1} alignItems="center">
          <LocationOnIcon fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            {data.location}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <BusinessIcon fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            {data.employees} employees
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <CalendarTodayIcon fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            Founded in {data.founded}
          </Typography>
        </Stack>
      </Stack>
    </Box>

    <Divider sx={{ mb: 4 }} />

    {/* About */}
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        About
      </Typography>
      <Typography variant="body1">{data.about}</Typography>
    </Box>

    {/* Open Positions */}
    <Box sx={{ mb: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5">Open Positions</Typography>
        <Typography variant="body2" color="primary">
          {data.openPositions} jobs available
        </Typography>
      </Stack>
      <Button variant="contained" color="primary" fullWidth>
        View All Jobs
      </Button>
    </Box>
  </Container>
);

const JobListing = ({ data }: { data: any }) => (
  <Container maxWidth="md" sx={{ py:2 }}>
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={2}>
            <Avatar
              src={data.logo}
              sx={{ width: 80, height: 80 }}
              variant="square"
            />
          </Grid>
          <Grid item xs={12} sm={10}>
            <Typography variant="h4" gutterBottom>
              {data.title}
            </Typography>
            <Typography variant="h6" gutterBottom>
              {data.company}
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <LocationOnIcon fontSize="small" color="action" />
                <Typography variant="body2">{data.location}</Typography>
              </Stack>
              <Chip label={data.jobType} size="small" />
              <Typography variant="body2">Posted {data.posted}</Typography>
            </Stack>
            <Typography variant="h6" color="primary">
              {data.salary}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>

    {/* Job Description */}
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Job Description
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        {data.description}
      </Typography>
    </Box>

    {/* Requirements */}
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Requirements
      </Typography>
      <ul>
        {data.requirements.map((req: string, index: number) => (
          <li key={index}>
            <Typography variant="body1">{req}</Typography>
          </li>
        ))}
      </ul>
    </Box>

    {/* Benefits */}
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Benefits
      </Typography>
      <ul>
        {data.benefits.map((benefit: string, index: number) => (
          <li key={index}>
            <Typography variant="body1">{benefit}</Typography>
          </li>
        ))}
      </ul>
    </Box>

    <Button variant="contained" color="primary" size="large" fullWidth sx={{ mb: 4 }}>
      Apply Now
    </Button>
  </Container>
);

export default SlugPage;
