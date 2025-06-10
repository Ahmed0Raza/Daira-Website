import React from 'react';
import { Outlet } from 'react-router-dom';
import { useTheme } from '@emotion/react';
import { Box, Grid } from '@mui/material';
import AdminSidebar from '../../../components/admin/sidebar/sidebar';

export default function AdminLayout() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        height: '100%',
        width: '100%',
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Grid container>
        <Grid item md={2} sm={0}>
          <AdminSidebar />
        </Grid>
        <Grid item md={10}>
          <Outlet />
        </Grid>
      </Grid>
    </Box>
  );
}
