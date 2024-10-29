const express = require('express');
const { createBlog, getBlogs, getBlogById, updateBlog, deleteBlog } = require('../controllers/BlogController');
const { verifyUser, adminOnly } = require('../middleware/AuthUser');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.post('/add', verifyUser, adminOnly, upload.single('image'), createBlog);
router.get('', verifyUser, getBlogs);
router.get('/:id', verifyUser, getBlogById);
router.put('/:id', verifyUser, upload.single('image'), updateBlog);
router.delete('/:id', verifyUser, deleteBlog);

module.exports = router;
