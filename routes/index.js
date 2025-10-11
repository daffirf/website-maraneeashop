const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Middleware untuk check authentication
const requireAuth = (req, res, next) => {
    if (req.session.userId) {
        return next();
    }
    res.redirect('/auth/login');
};

// Home page
router.get('/', async (req, res) => {
    try {
        // Mock data for when database is not available
        const featuredProducts = [
            {
                _id: '1',
                name: 'Baju Muslimah Elegan',
                price: 150000,
                image: '/images/products/baju-muslimah-1.jpg',
                category: 'baju-muslimah',
                rating: { average: 4.8, count: 120 }
            },
            {
                _id: '2',
                name: 'Hampers Lebaran Premium',
                price: 250000,
                image: '/images/products/hampers-1.jpg',
                category: 'hampers',
                rating: { average: 4.9, count: 89 }
            },
            {
                _id: '3',
                name: 'Kue Kering Spesial',
                price: 75000,
                image: '/images/products/kue-1.jpg',
                category: 'kue',
                rating: { average: 4.7, count: 156 }
            },
            {
                _id: '4',
                name: 'Paket Ramadhan Lengkap',
                price: 180000,
                image: '/images/products/ramadhan-1.jpg',
                category: 'ramadhan-lebaran',
                rating: { average: 4.6, count: 203 }
            }
        ];

        const categoryCounts = [
            { _id: 'baju-muslimah', count: 25 },
            { _id: 'hampers', count: 15 },
            { _id: 'kue', count: 30 },
            { _id: 'ramadhan-lebaran', count: 20 }
        ];

        res.render('index', {
            title: 'Maraneea Shop - Baju Muslimah, Hampers & Kue Terbaik',
            description: 'Toko online terpercaya untuk baju muslimah, hampers, aneka kue, dan produk Ramadhan & Lebaran. Kualitas terbaik dengan harga terjangkau.',
            currentPage: 'home',
            featuredProducts,
            categoryCounts,
            user: req.session.userId ? req.user : null
        });
    } catch (error) {
        console.error('Error loading home page:', error);
        res.status(500).render('error', {
            title: 'Error - Maraneea Shop',
            error: 'Terjadi kesalahan saat memuat halaman'
        });
    }
});

// About page
router.get('/about', (req, res) => {
    res.render('about', {
        title: 'Tentang Kami - Maraneea Shop',
        description: 'Pelajari lebih lanjut tentang Maraneea Shop, toko online terpercaya untuk baju muslimah, hampers, dan produk berkualitas tinggi.',
        currentPage: 'about',
        user: req.session.userId ? req.user : null
    });
});

// Contact page
router.get('/contact', (req, res) => {
    res.render('contact', {
        title: 'Kontak - Maraneea Shop',
        description: 'Hubungi Maraneea Shop untuk pertanyaan, saran, atau bantuan. Tim customer service kami siap membantu Anda.',
        currentPage: 'contact',
        user: req.session.userId ? req.user : null
    });
});

// FAQ page
router.get('/faq', (req, res) => {
    res.render('faq', {
        title: 'FAQ - Maraneea Shop',
        description: 'Pertanyaan yang sering diajukan tentang produk, pengiriman, pembayaran, dan layanan Maraneea Shop.',
        currentPage: 'faq',
        user: req.session.userId ? req.user : null
    });
});

// Privacy Policy page
router.get('/privacy', (req, res) => {
    res.render('privacy', {
        title: 'Kebijakan Privasi - Maraneea Shop',
        description: 'Kebijakan privasi Maraneea Shop tentang pengumpulan, penggunaan, dan perlindungan data pribadi Anda.',
        currentPage: 'privacy',
        user: req.session.userId ? req.user : null
    });
});

// Terms of Service page
router.get('/terms', (req, res) => {
    res.render('terms', {
        title: 'Syarat & Ketentuan - Maraneea Shop',
        description: 'Syarat dan ketentuan penggunaan layanan Maraneea Shop.',
        currentPage: 'terms',
        user: req.session.userId ? req.user : null
    });
});

// Shipping Info page
router.get('/shipping', (req, res) => {
    res.render('shipping', {
        title: 'Info Pengiriman - Maraneea Shop',
        description: 'Informasi lengkap tentang layanan pengiriman Maraneea Shop ke seluruh Indonesia.',
        currentPage: 'shipping',
        user: req.session.userId ? req.user : null
    });
});

// Search page
router.get('/search', async (req, res) => {
    try {
        const { q, category, minPrice, maxPrice, sort, page = 1 } = req.query;
        const limit = 12;
        const skip = (page - 1) * limit;

        // Build search query
        let query = { isActive: true };
        
        if (q) {
            query.$or = [
                { name: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } },
                { tags: { $in: [new RegExp(q, 'i')] } }
            ];
        }
        
        if (category) {
            query.category = category;
        }
        
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = parseInt(minPrice);
            if (maxPrice) query.price.$lte = parseInt(maxPrice);
        }

        // Build sort options
        let sortOptions = {};
        switch (sort) {
            case 'price-low':
                sortOptions.price = 1;
                break;
            case 'price-high':
                sortOptions.price = -1;
                break;
            case 'newest':
                sortOptions.createdAt = -1;
                break;
            case 'popular':
                sortOptions['rating.average'] = -1;
                break;
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

        res.render('search', {
            title: `Hasil Pencarian - Maraneea Shop`,
            description: `Hasil pencarian untuk "${q || 'semua produk'}" di Maraneea Shop`,
            currentPage: 'search',
            user: req.session.userId ? req.user : null,
            products,
            searchQuery: {
                q, category, minPrice, maxPrice, sort
            },
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1,
                nextPage: page < totalPages ? parseInt(page) + 1 : null,
                prevPage: page > 1 ? parseInt(page) - 1 : null
            }
        });
    } catch (error) {
        console.error('Error in search:', error);
        res.status(500).render('error', {
            title: 'Error - Maraneea Shop',
            error: 'Terjadi kesalahan saat melakukan pencarian'
        });
    }
});

// Newsletter subscription
router.post('/newsletter', async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.json({ success: false, message: 'Email harus diisi' });
        }

        // Here you would typically save to database or send to email service
        // For now, just return success
        res.json({ 
            success: true, 
            message: 'Terima kasih! Anda telah berhasil berlangganan newsletter kami.' 
        });
    } catch (error) {
        console.error('Error subscribing to newsletter:', error);
        res.json({ 
            success: false, 
            message: 'Terjadi kesalahan. Silakan coba lagi.' 
        });
    }
});

// Contact form submission
router.post('/contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        
        if (!name || !email || !subject || !message) {
            return res.json({ 
                success: false, 
                message: 'Semua field harus diisi' 
            });
        }

        // Here you would typically save to database or send email
        // For now, just return success
        res.json({ 
            success: true, 
            message: 'Pesan Anda telah terkirim. Terima kasih telah menghubungi kami!' 
        });
    } catch (error) {
        console.error('Error submitting contact form:', error);
        res.json({ 
            success: false, 
            message: 'Terjadi kesalahan. Silakan coba lagi.' 
        });
    }
});

module.exports = router;
