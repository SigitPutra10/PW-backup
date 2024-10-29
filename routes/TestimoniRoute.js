const express = require('express');
const {
    getTestimoni,
    createTestimoni,
    updateTestimoni,
    deleteTestimoni
} = require('../controllers/TestimoniController')
const { verifyUser } = require('../middleware/AuthUser')

const router = express.Router();

router.get('/', verifyUser, getTestimoni);
router.post('/add', verifyUser, createTestimoni);
router.patch('/:id', verifyUser, updateTestimoni);
router.delete('/:id', verifyUser, deleteTestimoni);

module.exports = router;