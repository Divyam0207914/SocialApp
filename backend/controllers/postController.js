const Post = require('../models/Post');

// @desc    Create new post
// @route   POST /api/posts/create
// @access  Private
exports.createPost = async (req, res) => {
  try {
    const { text, image } = req.body;

    if (!text && !image) {
      return res.status(400).json({ success: false, error: 'Please provide text or an image' });
    }

    const post = await Post.create({
      user: req.user.id,
      text,
      image
    });

    const populatedPost = await Post.findById(post._id).populate('user', 'username email');

    res.status(201).json({
      success: true,
      data: populatedPost
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get all posts (feed) with search and sort
// @route   GET /api/posts/feed?page=1&limit=10&search=keyword&sort=latest
// @access  Public
exports.getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const search = req.query.search;
    const sort = req.query.sort;

    let query = {};

    if (search) {
      // Find users whose username matches the search keyword
      const User = require('../models/User');
      const matchingUsers = await User.find({ username: { $regex: search, $options: 'i' } }).select('_id');
      const userIds = matchingUsers.map(u => u._id);

      query = {
        $or: [
          { text: { $regex: search, $options: 'i' } },
          { user: { $in: userIds } }
        ]
      };
    }

    const total = await Post.countDocuments(query);

    // Using aggregation for sorting by array length for Most Liked / Most Commented
    let pipeline = [];
    
    // 1. Match
    if (Object.keys(query).length > 0) {
      pipeline.push({ $match: query });
    }

    // 2. Add fields for counts
    pipeline.push({
      $addFields: {
        likesCount: { $size: { $ifNull: ["$likes", []] } },
        commentsCount: { $size: { $ifNull: ["$comments", []] } }
      }
    });

    // 3. Sort
    if (sort === 'mostLiked') {
      pipeline.push({ $sort: { likesCount: -1, createdAt: -1 } });
    } else if (sort === 'mostCommented') {
      pipeline.push({ $sort: { commentsCount: -1, createdAt: -1 } });
    } else {
      pipeline.push({ $sort: { createdAt: -1 } });
    }

    // 4. Pagination
    pipeline.push({ $skip: startIndex });
    pipeline.push({ $limit: limit });

    // Execute aggregation
    const results = await Post.aggregate(pipeline);

    // Populate user and comments.user
    const posts = await Post.populate(results, [
      { path: 'user', select: 'username' },
      { path: 'comments.user', select: 'username' }
    ]);

    res.status(200).json({
      success: true,
      count: posts.length,
      total,
      data: posts
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Like or Unlike a post
// @route   POST /api/posts/:id/like
// @access  Private
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    // Check if the post has already been liked by this user
    const isLiked = post.likes.includes(req.user.id);

    if (isLiked) {
      // Unlike
      post.likes = post.likes.filter((likeId) => likeId.toString() !== req.user.id.toString());
    } else {
      // Like
      post.likes.push(req.user.id);
    }

    await post.save();

    res.status(200).json({
      success: true,
      likes: post.likes
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Comment on a post
// @route   POST /api/posts/:id/comment
// @access  Private
exports.commentPost = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ success: false, error: 'Please provide comment text' });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    const newComment = {
      user: req.user.id,
      text
    };

    post.comments.push(newComment);
    await post.save();

    const populatedPost = await Post.findById(post._id).populate('comments.user', 'username');

    res.status(200).json({
      success: true,
      comments: populatedPost.comments
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    // Check ownership
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized to delete this post' });
    }

    await post.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
