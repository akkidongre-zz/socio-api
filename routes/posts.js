const express = require('express');

const checkAuth = require('../middleware/check-auth');
const postsController = require('../controllers/posts');

const router = express.Router();

router.post('', checkAuth, postsController.createPost);

router.get('', checkAuth, postsController.getMyPosts);

module.exports = router;