const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');

// Middleware untuk check authentication
const requireAuth = (req, res, next) => {
    if (req.session.userId) {
        return next();
    }
    res.status(401).json({ success: false, message: 'Anda harus login terlebih dahulu' });
};

// Get cart page
router.get('/', requireAuth, async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.session.userId })
            .populate('items.product');

        if (!cart) {
            cart = new Cart({ user: req.session.userId, items: [] });
            await cart.save();
        }

        const cartTotal = await cart.calculateTotal();

        res.render('cart/index', {
            title: 'Keranjang Belanja - Maraneea Shop',
            description: 'Lihat dan kelola produk di keranjang belanja Anda',
            currentPage: 'cart',
            user: req.user,
            cart: cart,
            cartTotal: cartTotal
        });
    } catch (error) {
        console.error('Error loading cart:', error);
        res.status(500).render('error', {
            title: 'Error - Maraneea Shop',
            error: 'Terjadi kesalahan saat memuat keranjang'
        });
    }
});

// Add item to cart
router.post('/add', requireAuth, async (req, res) => {
    try {
        const { productId, quantity = 1, variant = null } = req.body;

        if (!productId) {
            return res.json({ success: false, message: 'Product ID diperlukan' });
        }

        // Check if product exists and is active
        const product = await Product.findById(productId);
        if (!product || !product.isActive) {
            return res.json({ success: false, message: 'Produk tidak ditemukan atau tidak tersedia' });
        }

        // Check stock availability
        if (product.stock < quantity) {
            return res.json({ 
                success: false, 
                message: `Stok tidak mencukupi. Tersedia: ${product.stock} item` 
            });
        }

        // Get or create cart
        let cart = await Cart.findOne({ user: req.session.userId });
        if (!cart) {
            cart = new Cart({ user: req.session.userId, items: [] });
        }

        // Add item to cart
        await cart.addItem(productId, parseInt(quantity), variant);

        // Calculate new cart total
        const cartTotal = await cart.calculateTotal();

        res.json({ 
            success: true, 
            message: 'Produk berhasil ditambahkan ke keranjang',
            cartCount: cartTotal.itemCount
        });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.json({ 
            success: false, 
            message: 'Terjadi kesalahan saat menambahkan produk ke keranjang' 
        });
    }
});

// Update cart item quantity
router.put('/update', requireAuth, async (req, res) => {
    try {
        const { productId, quantity, variant = null } = req.body;

        if (!productId || !quantity) {
            return res.json({ success: false, message: 'Product ID dan quantity diperlukan' });
        }

        const cart = await Cart.findOne({ user: req.session.userId });
        if (!cart) {
            return res.json({ success: false, message: 'Keranjang tidak ditemukan' });
        }

        // Check stock availability
        const product = await Product.findById(productId);
        if (product && product.stock < quantity) {
            return res.json({ 
                success: false, 
                message: `Stok tidak mencukupi. Tersedia: ${product.stock} item` 
            });
        }

        await cart.updateQuantity(productId, parseInt(quantity), variant);

        const cartTotal = await cart.calculateTotal();

        res.json({ 
            success: true, 
            message: 'Keranjang berhasil diperbarui',
            cartCount: cartTotal.itemCount,
            cartTotal: cartTotal
        });
    } catch (error) {
        console.error('Error updating cart:', error);
        res.json({ 
            success: false, 
            message: 'Terjadi kesalahan saat memperbarui keranjang' 
        });
    }
});

// Remove item from cart
router.delete('/remove', requireAuth, async (req, res) => {
    try {
        const { productId, variant = null } = req.body;

        if (!productId) {
            return res.json({ success: false, message: 'Product ID diperlukan' });
        }

        const cart = await Cart.findOne({ user: req.session.userId });
        if (!cart) {
            return res.json({ success: false, message: 'Keranjang tidak ditemukan' });
        }

        await cart.removeItem(productId, variant);

        const cartTotal = await cart.calculateTotal();

        res.json({ 
            success: true, 
            message: 'Produk berhasil dihapus dari keranjang',
            cartCount: cartTotal.itemCount,
            cartTotal: cartTotal
        });
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.json({ 
            success: false, 
            message: 'Terjadi kesalahan saat menghapus produk dari keranjang' 
        });
    }
});

// Clear cart
router.delete('/clear', requireAuth, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.session.userId });
        if (!cart) {
            return res.json({ success: false, message: 'Keranjang tidak ditemukan' });
        }

        await cart.clear();

        res.json({ 
            success: true, 
            message: 'Keranjang berhasil dikosongkan',
            cartCount: 0
        });
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.json({ 
            success: false, 
            message: 'Terjadi kesalahan saat mengosongkan keranjang' 
        });
    }
});

// Get cart count (for header)
router.get('/count', requireAuth, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.session.userId });
        if (!cart) {
            return res.json({ cartCount: 0 });
        }

        const cartTotal = await cart.calculateTotal();
        res.json({ cartCount: cartTotal.itemCount });
    } catch (error) {
        console.error('Error getting cart count:', error);
        res.json({ cartCount: 0 });
    }
});

// Get cart data (for AJAX)
router.get('/data', requireAuth, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.session.userId })
            .populate('items.product');

        if (!cart) {
            return res.json({ 
                success: true, 
                cart: { items: [] }, 
                cartTotal: { subtotal: 0, itemCount: 0, uniqueItems: 0 } 
            });
        }

        const cartTotal = await cart.calculateTotal();

        res.json({ 
            success: true, 
            cart: cart, 
            cartTotal: cartTotal 
        });
    } catch (error) {
        console.error('Error getting cart data:', error);
        res.json({ 
            success: false, 
            message: 'Terjadi kesalahan saat mengambil data keranjang' 
        });
    }
});

module.exports = router;

