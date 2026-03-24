import React from 'react';
import { Box } from '@mui/material';
import Header from './Header';
import BottomNav from './BottomNav';

const Layout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', pb: '70px', bgcolor: 'background.default' }}>
      <Header />
      <Box sx={{ flexGrow: 1 }}>
        {children}
      </Box>
      <BottomNav />
    </Box>
  );
};

export default Layout;
