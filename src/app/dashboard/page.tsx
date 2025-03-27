'use client';

import React from 'react';
import { Container, Grid, Paper, Typography, Box } from '@mui/material';
import ProfileMenu from '@/components/ProfileMenu';

export default function DashboardPage() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper 
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 240,
            }}
          >
            <Typography variant="h4" component="h1" gutterBottom>
              Dashboard
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography>Welcome to your dashboard</Typography>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4} lg={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 240,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={8} lg={9}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 240,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Statistics
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
} 