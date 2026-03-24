import React from 'react';
import { Paper, BottomNavigation, BottomNavigationAction, Box } from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import LanguageIcon from '@mui/icons-material/Language';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';

const BottomNav = () => {
  const [value, setValue] = React.useState(2);

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000 }} elevation={3}>
      {/* Container to maintain max-width on desktop, perfectly overlapping #root */}
      <Box sx={{ maxWidth: '600px', margin: '0 auto', position: 'relative' }}>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
          sx={{
            bgcolor: 'primary.main',
            '& .MuiBottomNavigationAction-root': {
              color: 'rgba(255, 255, 255, 0.7)',
            },
            '& .Mui-selected': {
              color: '#ffffff',
            },
            height: 65,
          }}
        >
          <BottomNavigationAction label="Home" icon={<HomeOutlinedIcon />} />
          <BottomNavigationAction label="Tasks" icon={<AssignmentOutlinedIcon />} />
          <BottomNavigationAction 
            label="Social" 
            icon={
              <Box sx={{
                bgcolor: 'background.paper', 
                borderRadius: '50%', 
                p: 1, 
                mt: -3, // Pop out effect
                boxShadow: '0 -2px 5px rgba(0,0,0,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '4px solid',
                borderColor: 'primary.main'
              }}>
                <LanguageIcon color="primary" />
              </Box>
            } 
          />
          <BottomNavigationAction label="Rewards" icon={<EmojiEventsOutlinedIcon />} />
        </BottomNavigation>
      </Box>
    </Paper>
  );
};

export default BottomNav;
