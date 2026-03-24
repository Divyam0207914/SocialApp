import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Badge, Avatar, Chip } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import StarIcon from '@mui/icons-material/Star';

const Header = () => {
  return (
    <AppBar position="sticky" sx={{ bgcolor: 'background.paper', color: 'text.primary' }}>
      <Toolbar sx={{ justifyContent: 'space-between', px: 2 }}>
        <Typography variant="h6" fontWeight="bold">
          Social
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {/* Mock Coins/Balance UI */}
          <Chip
            icon={<StarIcon sx={{ color: '#FFD700 !important' }} />}
            label="50"
            size="small"
            sx={{ bgcolor: '#FFF8E1', color: '#B8860B', fontWeight: 'bold', border: '1px solid #FFECB3' }}
          />
          <Chip
            label="₹0.00"
            size="small"
            sx={{ bgcolor: '#E8F5E9', color: '#2E7D32', fontWeight: 'bold', border: '1px solid #C8E6C9' }}
          />

          <IconButton color="inherit" size="small">
            <Badge badgeContent={1} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <Avatar 
            sx={{ width: 32, height: 32, bgcolor: '#FF9800' }} 
            src="https://i.pravatar.cc/150?img=11"
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
