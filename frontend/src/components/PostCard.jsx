import React, { useState } from 'react';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  Avatar, 
  Typography, 
  Button,
  IconButton,
  Box,
  Divider,
  TextField,
  Menu,
  MenuItem
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import { formatDistanceToNow } from 'date-fns';

const PostCard = ({ post, onLike, onComment, onDelete, currentUserId }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  
  // Optimistic UI state
  const isLikedByMe = post.likes.includes(currentUserId);
  const likesCount = post.likes.length;

  const handleLike = () => onLike(post._id);

  const submitComment = () => {
    if (!commentText.trim()) return;
    onComment(post._id, commentText);
    setCommentText('');
  };

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  
  const handleDeletePost = () => {
    handleMenuClose();
    if (window.confirm('Are you sure you want to delete this post?')) {
      onDelete(post._id);
    }
  };

  return (
    <Card sx={{ mb: 2, borderRadius: 3, boxShadow: 'none' }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: 'primary.main', width: 45, height: 45 }}>
            {post.user.username?.charAt(0).toUpperCase() || '?'}
          </Avatar>
        }
        action={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button 
              variant="contained" 
              size="small" 
              sx={{ borderRadius: 20, textTransform: 'none', mt: 1, mr: 1, fontWeight: 'bold' }}
            >
              Follow
            </Button>
            {post.user._id === currentUserId && (
              <>
                <IconButton onClick={handleMenuClick} sx={{ mt: 1 }}>
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={handleDeletePost} sx={{ color: 'error.main' }}>
                    <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete Post
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>
        }
        title={
          <Typography variant="subtitle2" fontWeight="bold">
            {post.user.username}
          </Typography>
        }
        subheader={
          <Box>
            <Typography variant="caption" color="text.secondary" display="block">
              @{post.user.username ? post.user.username.toLowerCase() : 'user'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </Typography>
          </Box>
        }
      />
      
      <CardContent sx={{ pt: 0, pb: 1 }}>
        {post.text && (
          <Typography variant="body1" sx={{ mb: post.image ? 2 : 0, whiteSpace: 'pre-wrap' }}>
            {post.text}
          </Typography>
        )}
        
        {post.image && (
          <Box 
            component="img" 
            src={post.image} 
            alt="Post content" 
            sx={{ width: '100%', borderRadius: 2, maxHeight: 400, objectFit: 'cover' }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        )}
      </CardContent>

      <Box sx={{ px: 2, py: 1, display: 'flex', alignItems: 'center', gap: 3, color: 'text.secondary' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }} onClick={handleLike}>
          <IconButton size="small" color={isLikedByMe ? "error" : "default"} sx={{ p: 0.5 }}>
            {isLikedByMe ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
          </IconButton>
          <Typography variant="body2">{likesCount} Likes</Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }} onClick={() => setShowComments(!showComments)}>
          <IconButton size="small" sx={{ p: 0.5 }}>
            <ChatBubbleOutlineIcon fontSize="small" />
          </IconButton>
          <Typography variant="body2">{post.comments?.length || 0} Comments</Typography>
        </Box>
      </Box>

      {showComments && (
        <Box sx={{ px: 2, pb: 2, bgcolor: 'background.default' }}>
          <Divider sx={{ mb: 2 }} />
          
          <Box sx={{ maxHeight: 200, overflowY: 'auto', mb: 2 }}>
            {post.comments && post.comments.map((c, i) => (
              <Box key={i} sx={{ mb: 1.5, display: 'flex', gap: 1 }}>
                <Avatar sx={{ width: 24, height: 24, fontSize: '0.8rem' }}>
                  {c.user?.username?.charAt(0).toUpperCase() || '?'}
                </Avatar>
                <Box sx={{ bgcolor: 'background.paper', p: 1, borderRadius: 2, border: '1px solid', borderColor: 'divider', flexGrow: 1 }}>
                  <Typography variant="caption" fontWeight="bold" display="block">
                    {c.user?.username || 'Unknown'} <Typography component="span" variant="caption" color="text.secondary"> • {formatDistanceToNow(new Date(c.createdAt))} ago</Typography>
                  </Typography>
                  <Typography variant="body2">{c.text}</Typography>
                </Box>
              </Box>
            ))}
            {post.comments?.length === 0 && (
              <Typography variant="body2" color="text.secondary" align="center">No comments yet.</Typography>
            )}
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField 
              size="small" 
              fullWidth 
              placeholder="Write a comment..." 
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              sx={{ bgcolor: 'background.paper', borderRadius: 1 }}
            />
            <Button 
              variant="contained" 
              onClick={submitComment}
              disabled={!commentText.trim()}
              sx={{ minWidth: '40px', px: 0 }}
            >
              <SendIcon fontSize="small" />
            </Button>
          </Box>
        </Box>
      )}
    </Card>
  );
};

export default PostCard;
