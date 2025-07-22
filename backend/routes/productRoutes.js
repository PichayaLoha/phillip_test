const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/auth'); // Import the auth middleware

router.get('/products', auth, productController.getAllProducts);
router.post('/products', auth, productController.createProduct);
router.put('/products/:id', auth, productController.updateProduct);
router.delete('/products/:id', auth, productController.deleteProduct);

module.exports = router;
