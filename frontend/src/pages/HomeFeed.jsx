import React, { useState, useEffect, useContext, useCallback } from 'react';
import Layout from '../components/Layout';
import PostComposer from '../components/PostComposer';
import PostCard from '../components/PostCard';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { 
  Box, 
  Container, 
  InputBase, 
  Paper, 
  IconButton, 
  Typography, 
  Button,
  CircularProgress,
  Fab,
  Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

const SearchBarSection = ({ onLogout, onSearch }) => {
  const { mode, toggleTheme } = useContext(ThemeContext);
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchInput);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 }, my: { xs: 2, sm: 3 } }}>
      <Paper
        component="form"
        onSubmit={handleSearchSubmit}
        elevation={0}
        sx={{
          p: '2px 10px',
          display: 'flex',
          alignItems: 'center',
          flex: 1,
          borderRadius: 20,
          bgcolor: 'background.default',
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1, fontSize: '0.9rem' }}
          placeholder="Search promotions, users..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          inputProps={{ 'aria-label': 'search' }}
        />
        <IconButton type="submit" sx={{ p: '5px', bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' }, borderRadius: '50%' }} aria-label="search">
          <SearchIcon fontSize="small" />
        </IconButton>
      </Paper>
      <IconButton onClick={toggleTheme} sx={{ p: '8px', bgcolor: 'background.default', border: '1px solid', borderColor: 'divider' }}>
        {mode === 'dark' ? <LightModeOutlinedIcon fontSize="small" /> : <DarkModeOutlinedIcon fontSize="small" />}
      </IconButton>
      <IconButton onClick={onLogout} sx={{ p: '8px', bgcolor: '#FFB74D', title: 'Logout' }}>
        <PersonOutlineIcon fontSize="small" sx={{ color: 'white' }} />
      </IconButton>
    </Box>
  );
};

const PostComposerHeader = () => {
  const [tabValue, setTabValue] = useState(0);

  return (
    <Box sx={{ my: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6" fontWeight="bold">
          Create Post
        </Typography>
        <Box sx={{ display: 'flex', bgcolor: 'background.default', borderRadius: 20, p: 0.5 }}>
          <Button 
            variant={tabValue === 0 ? "contained" : "text"} 
            size="small"
            sx={{ borderRadius: 20, py: 0.5, px: { xs: 2, sm: 3 }, minWidth: 0, color: tabValue === 0 ? 'white' : 'text.secondary', boxShadow: tabValue === 0 ? 1 : 0 }}
            onClick={() => setTabValue(0)}
          >
            All Posts
          </Button>
          <Button 
            variant={tabValue === 1 ? "contained" : "text"} 
            size="small"
            sx={{ borderRadius: 20, py: 0.5, px: { xs: 2, sm: 3 }, minWidth: 0, color: tabValue === 1 ? 'white' : 'text.secondary', boxShadow: tabValue === 1 ? 1 : 0 }}
            onClick={() => setTabValue(1)}
          >
            Promotions
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

const FeedFilters = ({ onSortChange }) => {
  const filters = [
    { label: 'All Post', value: 'latest' },
    { label: 'For You', value: 'latest' },
    { label: 'Most Liked', value: 'mostLiked' },
    { label: 'Most Commented', value: 'mostCommented' }
  ];
  const [active, setActive] = useState(0);

  const handleClick = (index, value) => {
    setActive(index);
    onSortChange(value);
  };

  return (
    <Box sx={{ display: 'flex', overflowX: 'auto', gap: 1, pb: 1, my: 2, '&::-webkit-scrollbar': { display: 'none' } }}>
      {filters.map((filter, index) => (
        <Button
          key={index}
          variant={active === index ? 'contained' : 'outlined'}
          color={active === index ? 'primary' : 'inherit'}
          size="small"
          onClick={() => handleClick(index, filter.value)}
          sx={{ 
            borderRadius: 20, 
            whiteSpace: 'nowrap',
            borderColor: active === index ? 'transparent' : 'divider',
            color: active === index ? 'white' : 'text.secondary',
            textTransform: 'none',
            px: { xs: 2, sm: 3 }
          }}
        >
          {filter.label}
        </Button>
      ))}
    </Box>
  );
};

const HomeFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortQuery, setSortQuery] = useState('latest');
  
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchPosts = useCallback(async (pageNum = 1, append = false, currentSearch = searchQuery, currentSort = sortQuery) => {
    try {
      setLoading(true);
      const res = await api.get(`/posts/feed?page=${pageNum}&limit=10&search=${encodeURIComponent(currentSearch)}&sort=${currentSort}`);
      if (append) {
        setPosts((prev) => [...prev, ...res.data.data]);
      } else {
        setPosts(res.data.data);
      }
      setHasMore(res.data.data.length === 10);
    } catch (err) {
      setError('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, sortQuery]);

  useEffect(() => {
    fetchPosts(1, false, searchQuery, sortQuery);
  }, [searchQuery, sortQuery, fetchPosts]);

  const handlePost = async (postData) => {
    try {
      const res = await api.post('/posts/create', postData);
      setPosts([res.data.data, ...posts]);
    } catch (err) {
      setError('Failed to create post');
    }
  };

  const handleLike = async (postId) => {
    const originalPosts = [...posts];
    setPosts(posts.map(post => {
      if (post._id === postId) {
        const isLiked = post.likes.includes(user.id);
        const newLikes = isLiked 
          ? post.likes.filter(id => id !== user.id) 
          : [...post.likes, user.id];
        return { ...post, likes: newLikes };
      }
      return post;
    }));

    try {
      await api.post(`/posts/${postId}/like`);
    } catch (err) {
      setPosts(originalPosts);
      setError('Failed to like post');
    }
  };

  const handleComment = async (postId, text) => {
    try {
      const res = await api.post(`/posts/${postId}/comment`, { text });
      setPosts(posts.map(post => {
        if (post._id === postId) {
          return { ...post, comments: res.data.comments };
        }
        return post;
      }));
    } catch (err) {
      setError('Failed to comment');
    }
  };

  const handleDelete = async (postId) => {
    try {
      await api.delete(`/posts/${postId}`);
      setPosts(posts.filter(post => post._id !== postId));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete post');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Layout>
      <Container maxWidth="md" sx={{ py: 2, display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ width: '100%', maxWidth: '800px', bgcolor: 'background.paper', borderRadius: { sm: 3 }, p: { xs: 2, sm: 4 }, boxShadow: { sm: 1 } }}>
          <SearchBarSection onLogout={handleLogout} onSearch={(text) => { setPage(1); setSearchQuery(text); }} />
          <PostComposerHeader />
          <PostComposer onPost={handlePost} />
          
          <FeedFilters onSortChange={(newSort) => { setPage(1); setSortQuery(newSort); }} />

          {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}

          <Box sx={{ pb: 8 }}>
            {!loading && posts.length === 0 && (
              <Typography variant="body1" color="text.secondary" align="center" sx={{ mt: 4 }}>
                No posts match your criteria.
              </Typography>
            )}

            {posts.map((post) => (
              <PostCard 
                key={post._id} 
                post={post} 
                onLike={handleLike} 
                onComment={handleComment} 
                onDelete={handleDelete}
                currentUserId={user?.id}
              />
            ))}
            
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                <CircularProgress size={24} />
              </Box>
            )}

            {!loading && hasMore && posts.length > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                <Button onClick={() => { setPage(p => p + 1); fetchPosts(page + 1, true); }}>
                  Load More
                </Button>
              </Box>
            )}

            {!loading && !hasMore && posts.length > 0 && (
              <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
                No more posts to show.
              </Typography>
            )}
          </Box>
        </Box>
      </Container>

      <Fab 
        color="primary" 
        aria-label="add" 
        sx={{ position: 'fixed', bottom: 80, right: 20, display: { sm: 'none' } }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <AddIcon />
      </Fab>
    </Layout>
  );
};

export default HomeFeed;
