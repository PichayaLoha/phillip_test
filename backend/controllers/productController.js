const db = require('../database/database');

// GET ALL PRODUCTS
exports.getAllProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Default to page 1
        const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
        const offset = (page - 1) * limit;

        // Query for paginated products
        const [productsResult] = await db.query('SELECT * FROM products LIMIT ? OFFSET ?', [limit, offset]);

        // Query for total number of products
        const [totalResult] = await db.query('SELECT COUNT(*) as total FROM products');
        const totalItems = totalResult[0].total;
        const totalPages = Math.ceil(totalItems / limit);

        const results = productsResult;

        const products = results.map(product => {
            const amount = parseFloat(product.amount) || 0;
            const unit = parseFloat(product.unit) || 0;
            const total = amount * unit;
    
            return { ...product, total };
        });

        res.json({
            products,
            currentPage: page,
            totalPages,
            totalItems,
        });
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).send('Server error');
    }
};

// CREATE PRODUCT
exports.createProduct = async (req, res) => {
    const { product_name, color, amount, unit } = req.body;
    const date = new Date();

    try {
        const [result] = await db.query(
            'INSERT INTO products (product_name, color, amount, unit, date) VALUES (?, ?, ?, ?, ?)',
            [product_name, color, amount, unit, date]
        );

        res.status(201).json({
            id: result.insertId,
            product_name,
            color,
            amount,
            unit,
            date
        });
    } catch (err) {
        console.error('Error inserting product:', err);
        res.status(500).send('Server error');
    }
};

// UPDATE PRODUCT
exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { product_name, color, amount, unit } = req.body;
    const date = new Date();

    try {
        const [result] = await db.query(
            'UPDATE products SET product_name = ?, color = ?, amount = ?, unit = ?, updated_at = ? WHERE id = ?',
            [product_name, color, amount, unit, date, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({
            id,
            product_name,
            color,
            amount,
            unit,
            updated_at: date
        });
    } catch (err) {
        console.error('Error updating product:', err);
        res.status(500).send('Server error');
    }
};

// DELETE PRODUCT
exports.deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query('DELETE FROM products WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Deleted successfully' });
    } catch (err) {
        console.error('Error deleting product:', err);
        res.status(500).send('Server error');
    }
};
