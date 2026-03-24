const express = require('express');
const { getPosts, createPost, likePost, commentPost, deletePost } = require('../controllers/postController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/feed', getPosts);
router.post('/create', protect, createPost);
router.post('/:id/like', protect, likePost);
router.post('/:id/comment', protect, commentPost);
router.delete('/:id', protect, deletePost);

module.exports = router;
