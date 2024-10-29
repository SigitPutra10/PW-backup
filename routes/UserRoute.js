const express = require('express');
const { verifyUser, adminOnly, authenticateToken } = require('../middleware/AuthUser');
const { getUsers, getUserById, createUser, adminCreateUser, updateUser, deleteUser } = require('../controllers/Users');

const router = express.Router();

router.get('/users', verifyUser, adminOnly, getUsers);
router.get('/users/:id', verifyUser, getUserById);
router.post('/users', createUser);
router.post('/users/admin-regis', verifyUser, adminOnly, adminCreateUser);
router.patch('/users/:id', verifyUser, updateUser);
router.delete('/users/:id', verifyUser, adminOnly, deleteUser);

router.get('/protected-route', authenticateToken, (req, res) => {
    res.json({ message: 'Access granted to protected route' });
});

module.exports = router;
