import React, { useState } from 'react';
import { 
  Paper, 
  InputBase, 
  Box, 
  IconButton, 
  Button,
  Divider,
  CircularProgress
} from '@mui/material';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import SentimentSatisfiedOutlinedIcon from '@mui/icons-material/SentimentSatisfiedOutlined';
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import SendIcon from '@mui/icons-material/Send';

const PostComposer = ({ onPost }) => {
  const [text, setText] = useState('');
  const [image, setImage] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim() && !image.trim()) return;
    setIsSubmitting(true);
    await onPost({ text, image });
    setText('');
    setImage('');
    setShowImageInput(false);
    setIsSubmitting(false);
  };

  const isPostDisabled = (!text.trim() && !image.trim()) || isSubmitting;

  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, mb: 3, borderColor: 'divider', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}>
      <InputBase
        placeholder="What's on your mind?"
        fullWidth
        multiline
        minRows={2}
        value={text}
        onChange={(e) => setText(e.target.value)}
        sx={{ mb: 1, fontSize: '1rem' }}
      />
      
      {showImageInput && (
        <InputBase
          placeholder="Paste Image URL here..."
          fullWidth
          value={image}
          onChange={(e) => setImage(e.target.value)}
          sx={{ mb: 2, fontSize: '0.9rem', bgcolor: 'background.default', p: 1, borderRadius: 1 }}
        />
      )}

      <Divider sx={{ my: 1 }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton size="small" color="primary" onClick={() => setShowImageInput(!showImageInput)}>
            <CameraAltOutlinedIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" color="primary">
            <SentimentSatisfiedOutlinedIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" color="primary">
            <FormatListBulletedOutlinedIcon fontSize="small" />
          </IconButton>
          
          <Button 
            startIcon={<CampaignOutlinedIcon />} 
            size="small" 
            sx={{ ml: 1, textTransform: 'none', fontWeight: 'bold' }}
          >
            Promote
          </Button>
        </Box>

        <Button
          variant="contained"
          disabled={isPostDisabled}
          onClick={handleSubmit}
          endIcon={isSubmitting ? <CircularProgress size={16} /> : <SendIcon fontSize="small" />}
          sx={{ 
            borderRadius: 20, 
            textTransform: 'none',
            bgcolor: isPostDisabled ? '#e0e0e0' : '#b0bec5', // Gray matching reference
            color: 'white',
            px: 3,
            '&:hover': {
              bgcolor: '#90a4ae'
            }
          }}
        >
          Post
        </Button>
      </Box>
    </Paper>
  );
};

export default PostComposer;
