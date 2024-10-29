const express = require('express');
const { 
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/Products');
const { adminOnly, verifyUser } = require('../middleware/AuthUser');
const upload = require('../middleware/uploadMiddleware'); // Middleware untuk upload gambar

const router = express.Router();

router.get('', getProducts);
router.get('/:id', verifyUser, getProductById);
router.post('/create', verifyUser, adminOnly, upload.single('image'), createProduct); // Upload gambar saat create
router.patch('/:id', verifyUser, adminOnly, upload.single('image'), updateProduct); // Upload gambar saat update
router.delete('/:id', verifyUser, adminOnly, deleteProduct);

module.exports = router;
