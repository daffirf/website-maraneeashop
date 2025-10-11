const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');
const multer = require('multer');
const path = require('path');

// Middleware untuk check admin authentication
const requireAdmin = (req, res, next) => {
    if (req.session.userId && req.session.userRole === 'admin') {
        return next();
    }
    res.redirect('/auth/login');
};

// Multer configuration untuk upload gambar
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/products/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Hanya file gambar yang diperbolehkan (JPEG, JPG, PNG, GIF, WebP)'));
        }
    }
});

// Admin Dashboard
router.get('/', requireAdmin, async (req, res) => {
    try {
        // Get statistics
        const totalProducts = await Product.countDocuments({ isActive: true });
        const totalUsers = await User.countDocuments({ role: 'customer' });
        const totalOrders = await Order.countDocuments();
        const pendingOrders = await Order.countDocuments({ status: 'pending' });

        // Get recent orders
        const recentOrders = await Order.find()
            .populate('customer', 'name email')
            .sort({ createdAt: -1 })
            .limit(5);

        // Get low stock products
        const lowStockProducts = await Product.find({
            stock: { $lt: 10 },
            isActive: true
        }).limit(5);

        // Get sales data for chart (last 7 days)
        const salesData = await Order.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                    },
                    status: { $in: ['delivered', 'shipped'] }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    totalSales: { $sum: "$pricing.total" },
                    orderCount: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.render('admin/dashboard', {
            title: 'Admin Dashboard - Maraneea Shop',
            currentPage: 'admin',
            user: req.user,
            stats: {
                totalProducts,
                totalUsers,
                totalOrders,
                pendingOrders
            },
            recentOrders,
            lowStockProducts,
            salesData
        });
    } catch (error) {
        console.error('Error loading admin dashboard:', error);
        res.status(500).render('error', {
            title: 'Error - Admin Panel',
            error: 'Terjadi kesalahan saat memuat dashboard'
        });
    }
});

// Products Management
router.get('/products', requireAdmin, async (req, res) => {
    try {
        const { page = 1, category, search, sort = 'newest' } = req.query;
        const limit = 10;
        const skip = (page - 1) * limit;

        // Build query
        let query = {};
        if (category) query.category = category;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Sort options
        let sortOptions = {};
        switch (sort) {
            case 'name':
                sortOptions.name = 1;
                break;
            case 'price-low':
                sortOptions.price = 1;
                break;
            case 'price-high':
                sortOptions.price = -1;
                break;
            case 'stock-low':
                sortOptions.stock = 1;
                break;
            case 'newest':
            default:
                sortOptions.createdAt = -1;
        }

        const products = await Product.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(limit)
            .populate('createdBy', 'name');

        const totalProducts = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalProducts / limit);

        const categories = await Product.distinct('category');

        res.render('admin/products', {
            title: 'Manajemen Produk - Admin Panel',
            currentPage: 'admin-products',
            user: req.user,
            products,
            categories,
            filters: { category, search, sort },
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        });
    } catch (error) {
        console.error('Error loading products management:', error);
        res.status(500).render('error', {
            title: 'Error - Admin Panel',
            error: 'Terjadi kesalahan saat memuat produk'
        });
    }
});

// Add Product Page
router.get('/products/add', requireAdmin, (req, res) => {
    res.render('admin/product-form', {
        title: 'Tambah Produk - Admin Panel',
        currentPage: 'admin-products',
        user: req.user,
        product: null,
        isEdit: false
    });
});

// Edit Product Page
router.get('/products/edit/:id', requireAdmin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).render('error', {
                title: 'Produk Tidak Ditemukan - Admin Panel',
                error: 'Produk tidak ditemukan'
            });
        }

        res.render('admin/product-form', {
            title: 'Edit Produk - Admin Panel',
            currentPage: 'admin-products',
            user: req.user,
            product: product,
            isEdit: true
        });
    } catch (error) {
        console.error('Error loading product edit:', error);
        res.status(500).render('error', {
            title: 'Error - Admin Panel',
            error: 'Terjadi kesalahan saat memuat produk'
        });
    }
});

// Save Product (Add/Edit)
router.post('/products/save', requireAdmin, upload.array('images', 5), async (req, res) => {
    try {
        const {
            name, description, shortDescription, price, originalPrice,
            category, subcategory, stock, weight, tags,
            isActive, isFeatured, isNew, isOnSale, discountPercentage
        } = req.body;

        const productData = {
            name: name.trim(),
            description: description.trim(),
            shortDescription: shortDescription?.trim(),
            price: parseFloat(price),
            originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
            category: category,
            subcategory: subcategory?.trim(),
            stock: parseInt(stock),
            weight: weight ? parseFloat(weight) : undefined,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            isActive: isActive === 'on',
            isFeatured: isFeatured === 'on',
            isNew: isNew === 'on',
            isOnSale: isOnSale === 'on',
            discountPercentage: isOnSale === 'on' ? parseFloat(discountPercentage) : 0,
            createdBy: req.session.userId
        };

        // Handle images
        if (req.files && req.files.length > 0) {
            productData.images = req.files.map((file, index) => ({
                url: `/images/products/${file.filename}`,
                alt: `${name} - Image ${index + 1}`,
                isPrimary: index === 0
            }));
        }

        let product;
        if (req.body.productId) {
            // Edit existing product
            product = await Product.findByIdAndUpdate(
                req.body.productId,
                productData,
                { new: true, runValidators: true }
            );
        } else {
            // Create new product
            product = new Product(productData);
            await product.save();
        }

        res.json({
            success: true,
            message: req.body.productId ? 'Produk berhasil diperbarui' : 'Produk berhasil ditambahkan',
            productId: product._id
        });
    } catch (error) {
        console.error('Error saving product:', error);
        res.json({
            success: false,
            message: 'Terjadi kesalahan saat menyimpan produk'
        });
    }
});

// Delete Product
router.delete('/products/:id', requireAdmin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.json({
                success: false,
                message: 'Produk tidak ditemukan'
            });
        }

        // Soft delete - set isActive to false
        product.isActive = false;
        await product.save();

        res.json({
            success: true,
            message: 'Produk berhasil dihapus'
        });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.json({
            success: false,
            message: 'Terjadi kesalahan saat menghapus produk'
        });
    }
});

// Orders Management
router.get('/orders', requireAdmin, async (req, res) => {
    try {
        const { page = 1, status, search } = req.query;
        const limit = 10;
        const skip = (page - 1) * limit;

        let query = {};
        if (status) query.status = status;
        if (search) {
            query.$or = [
                { orderNumber: { $regex: search, $options: 'i' } },
                { 'customer.name': { $regex: search, $options: 'i' } }
            ];
        }

        const orders = await Order.find(query)
            .populate('customer', 'name email phone')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalOrders = await Order.countDocuments(query);
        const totalPages = Math.ceil(totalOrders / limit);

        res.render('admin/orders', {
            title: 'Manajemen Pesanan - Admin Panel',
            currentPage: 'admin-orders',
            user: req.user,
            orders,
            filters: { status, search },
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        });
    } catch (error) {
        console.error('Error loading orders management:', error);
        res.status(500).render('error', {
            title: 'Error - Admin Panel',
            error: 'Terjadi kesalahan saat memuat pesanan'
        });
    }
});

// Update Order Status
router.put('/orders/:id/status', requireAdmin, async (req, res) => {
    try {
        const { status, notes } = req.body;
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return res.json({
                success: false,
                message: 'Pesanan tidak ditemukan'
            });
        }

        order.status = status;
        if (notes) order.notes.admin = notes;
        
        // Set timestamps based on status
        if (status === 'shipped') {
            order.shipping.shippedAt = new Date();
        } else if (status === 'delivered') {
            order.shipping.deliveredAt = new Date();
        }

        await order.save();

        res.json({
            success: true,
            message: 'Status pesanan berhasil diperbarui'
        });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.json({
            success: false,
            message: 'Terjadi kesalahan saat memperbarui status pesanan'
        });
    }
});

// Users Management
router.get('/users', requireAdmin, async (req, res) => {
    try {
        const { page = 1, role, search } = req.query;
        const limit = 10;
        const skip = (page - 1) * limit;

        let query = {};
        if (role) query.role = role;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const users = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalUsers = await User.countDocuments(query);
        const totalPages = Math.ceil(totalUsers / limit);

        res.render('admin/users', {
            title: 'Manajemen Pengguna - Admin Panel',
            currentPage: 'admin-users',
            user: req.user,
            users,
            filters: { role, search },
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        });
    } catch (error) {
        console.error('Error loading users management:', error);
        res.status(500).render('error', {
            title: 'Error - Admin Panel',
            error: 'Terjadi kesalahan saat memuat pengguna'
        });
    }
});

// Database Management
router.get('/database', requireAdmin, async (req, res) => {
    try {
        // Mock database stats - in real implementation, get from MongoDB
        const dbStats = {
            size: '2.5 MB',
            collections: 5,
            documents: 1250,
            indexes: 12,
            uptime: '7 hari 12 jam',
            version: 'MongoDB 6.0',
            memory: '45 MB'
        };

        const collections = [
            { name: 'users', count: 150, size: '850 KB' },
            { name: 'products', count: 500, size: '1.2 MB' },
            { name: 'orders', count: 300, size: '400 KB' },
            { name: 'carts', count: 200, size: '50 KB' },
            { name: 'sessions', count: 100, size: '25 KB' }
        ];

        const activities = [
            { timestamp: new Date(), operation: 'INSERT', collection: 'orders', status: 'success' },
            { timestamp: new Date(Date.now() - 300000), operation: 'UPDATE', collection: 'products', status: 'success' },
            { timestamp: new Date(Date.now() - 600000), operation: 'DELETE', collection: 'carts', status: 'success' },
            { timestamp: new Date(Date.now() - 900000), operation: 'CREATE_INDEX', collection: 'orders', status: 'success' },
            { timestamp: new Date(Date.now() - 1200000), operation: 'BACKUP', collection: 'all', status: 'success' }
        ];

        res.render('admin/database', {
            title: 'Manajemen Database - Admin Panel',
            currentPage: 'admin-database',
            user: req.user,
            dbStats,
            collections,
            activities
        });
    } catch (error) {
        console.error('Error loading database management:', error);
        res.status(500).render('error', {
            title: 'Error - Admin Panel',
            error: 'Terjadi kesalahan saat memuat database'
        });
    }
});

// Analytics
router.get('/analytics', requireAdmin, async (req, res) => {
    try {
        const { range = 30 } = req.query;
        const days = parseInt(range);

        // Mock analytics data - in real implementation, calculate from actual data
        const analytics = {
            revenue: 15750000,
            revenueGrowth: 12.5,
            orders: 245,
            ordersGrowth: 8.3,
            averageOrderValue: 64285,
            aovGrowth: 5.2,
            conversionRate: 3.2,
            conversionGrowth: 1.8,
            newCustomers: 45,
            newCustomersGrowth: 15.2,
            repeatCustomers: 120,
            repeatRate: 80,
            clv: 125000,
            clvGrowth: 7.5,
            revenueData: generateRevenueData(days),
            ordersData: generateOrdersData(days)
        };

        const topProducts = [
            { name: 'Baju Muslimah Premium', category: 'baju-muslimah', sold: 45, revenue: 2250000 },
            { name: 'Hampers Ramadhan', category: 'hampers', sold: 38, revenue: 1900000 },
            { name: 'Kue Kering Spesial', category: 'kue', sold: 52, revenue: 1560000 },
            { name: 'Aksesoris Cantik', category: 'aksesoris', sold: 67, revenue: 1340000 }
        ];

        const categoryPerformance = [
            { name: 'Baju Muslimah', percentage: 35, revenue: 5500000, color: '#3B82F6' },
            { name: 'Hampers', percentage: 25, revenue: 3900000, color: '#10B981' },
            { name: 'Kue', percentage: 20, revenue: 3100000, color: '#F59E0B' },
            { name: 'Aksesoris', percentage: 15, revenue: 2350000, color: '#8B5CF6' },
            { name: 'Lainnya', percentage: 5, revenue: 1000000, color: '#EF4444' }
        ];

        const recentActivity = [
            { timestamp: new Date(), action: 'Pesanan Baru', user: 'Customer #123', details: 'Order #ORD-001' },
            { timestamp: new Date(Date.now() - 300000), action: 'Produk Ditambahkan', user: 'Admin', details: 'Baju Muslimah Baru' },
            { timestamp: new Date(Date.now() - 600000), action: 'Status Diperbarui', user: 'Admin', details: 'Order #ORD-002' },
            { timestamp: new Date(Date.now() - 900000), action: 'User Baru', user: 'System', details: 'Customer #124' },
            { timestamp: new Date(Date.now() - 1200000), action: 'Pembayaran Dikonfirmasi', user: 'System', details: 'Order #ORD-003' }
        ];

        res.render('admin/analytics', {
            title: 'Analitik & Laporan - Admin Panel',
            currentPage: 'admin-analytics',
            user: req.user,
            analytics,
            topProducts,
            categoryPerformance,
            recentActivity
        });
    } catch (error) {
        console.error('Error loading analytics:', error);
        res.status(500).render('error', {
            title: 'Error - Admin Panel',
            error: 'Terjadi kesalahan saat memuat analitik'
        });
    }
});

// Settings
router.get('/settings', requireAdmin, async (req, res) => {
    try {
        // Mock settings data - in real implementation, get from database
        const settings = {
            general: {
                appName: 'Maraneea Shop',
                appVersion: '1.0.0',
                timezone: 'Asia/Jakarta',
                language: 'id',
                appDescription: 'Toko online produk muslimah dan kue-kue lezat'
            },
            store: {
                storeName: 'Maraneea Shop',
                storeEmail: 'info@maraneeashop.com',
                storePhone: '+62 812-3456-7890',
                storeWebsite: 'https://maraneeashop.com',
                storeAddress: 'Jl. Raya No. 123, Jakarta Selatan, DKI Jakarta',
                currency: 'IDR',
                storeStatus: 'active'
            },
            payment: {
                methods: ['bank_transfer', 'e_wallet', 'cod'],
                timeout: 24,
                adminFee: 2.5
            },
            shipping: {
                methods: ['jne', 'tiki', 'pos'],
                baseCost: 10000,
                estimatedDays: 3
            },
            email: {
                smtpHost: 'smtp.gmail.com',
                smtpPort: 587,
                fromEmail: 'noreply@maraneeashop.com',
                fromName: 'Maraneea Shop',
                smtpUsername: 'noreply@maraneeashop.com',
                smtpPassword: '********',
                smtpSecure: true
            },
            security: {
                sessionTimeout: 60,
                maxLoginAttempts: 5,
                minPasswordLength: 8,
                passwordExpiry: 90,
                requireTwoFactor: false,
                logUserActivity: true,
                enableRateLimit: true
            },
            backup: {
                autoBackup: true,
                frequency: 'daily',
                time: '02:00',
                localPath: '/backups',
                retention: 30
            }
        };

        res.render('admin/settings', {
            title: 'Pengaturan Sistem - Admin Panel',
            currentPage: 'admin-settings',
            user: req.user,
            settings
        });
    } catch (error) {
        console.error('Error loading settings:', error);
        res.status(500).render('error', {
            title: 'Error - Admin Panel',
            error: 'Terjadi kesalahan saat memuat pengaturan'
        });
    }
});

// Helper functions for analytics
function generateRevenueData(days) {
    const data = [];
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        data.push({
            date: date.toISOString().split('T')[0],
            revenue: Math.floor(Math.random() * 500000) + 200000
        });
    }
    return data;
}

function generateOrdersData(days) {
    const data = [];
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        data.push({
            date: date.toISOString().split('T')[0],
            orders: Math.floor(Math.random() * 15) + 5
        });
    }
    return data;
}

module.exports = router;







