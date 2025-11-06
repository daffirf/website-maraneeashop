const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/Product');

// Products listing page
router.get('/', async (req, res) => {
    try {
        const { 
            category, 
            subcategory, 
            search, 
            minPrice, 
            maxPrice, 
            sort = 'newest', 
            page = 1,
            limit = 12 
        } = req.query;

        const skip = (page - 1) * limit;

        // Build query
        let query = { isActive: true };
        
        if (category) {
            query.category = category;
        }
        
        if (subcategory) {
            query.subcategory = subcategory;
        }
        
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }
        
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = parseInt(minPrice);
            if (maxPrice) query.price.$lte = parseInt(maxPrice);
        }

        // Sort options
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
            case 'oldest':
                sortOptions.createdAt = 1;
                break;
            case 'popular':
                sortOptions['rating.average'] = -1;
                break;
            case 'name':
                sortOptions.name = 1;
                break;
            default:
                sortOptions.createdAt = -1;
        }

        // Check if mongoose is connected
        if (mongoose.connection.readyState !== 1) {
            // Return empty result if database not connected
            return res.render('products/index', {
                title: 'Semua Produk - Maraneea Shop',
                description: 'Temukan koleksi produk terbaik di Maraneea Shop',
                currentPage: 'products',
                user: req.session.userId ? req.user : null,
                products: [],
                categories: [],
                subcategories: [],
                priceRange: { min: 0, max: 1000000 },
                filters: {
                    category,
                    subcategory,
                    search,
                    minPrice,
                    maxPrice,
                    sort
                },
                categoryDisplayName: category ? (category.replace(/-/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')) : '',
                viewMode: req.query.viewMode || 'grid',
                pagination: {
                    currentPage: 1,
                    totalPages: 0,
                    hasNext: false,
                    hasPrev: false,
                    nextPage: null,
                    prevPage: null,
                    totalProducts: 0
                }
            });
        }

        const products = await Product.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(parseInt(limit))
            .populate('createdBy', 'name')
            .lean();

        const totalProducts = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalProducts / limit);

        // Get categories for filter
        const categories = await Product.distinct('category', { isActive: true }).catch(() => []);
        const subcategories = await Product.distinct('subcategory', { 
            isActive: true,
            subcategory: { $exists: true, $ne: '' }
        }).catch(() => []);

        // Get price range
        const priceRangeResult = await Product.aggregate([
            { $match: { isActive: true } },
            { $group: { _id: null, min: { $min: '$price' }, max: { $max: '$price' } } }
        ]).catch(() => []);
        
        const priceRange = priceRangeResult[0] || { min: 0, max: 1000000 };

        // Format category name for display
        const categoryNames = {
            'baju-muslimah': 'Baju Muslimah',
            'hampers': 'Hampers',
            'kue': 'Kue',
            'ramadhan-lebaran': 'Ramadhan & Lebaran',
            'aksesoris': 'Aksesoris',
            'lainnya': 'Lainnya'
        };
        const categoryDisplayName = category ? (categoryNames[category] || category.replace('-', ' ')) : '';
        
        res.render('products/index', {
            title: category ? `${categoryDisplayName} - Maraneea Shop` : 'Semua Produk - Maraneea Shop',
            description: category ? `Temukan koleksi ${categoryDisplayName.toLowerCase()} terbaik di Maraneea Shop. Kualitas premium dengan harga terjangkau.` : 'Temukan koleksi produk terbaik di Maraneea Shop',
            currentPage: 'products',
            user: req.session.userId ? req.user : null,
            products,
            categories,
            subcategories,
            priceRange: priceRange,
            filters: {
                category,
                subcategory,
                search,
                minPrice,
                maxPrice,
                sort
            },
            categoryDisplayName,
            viewMode: req.query.viewMode || 'grid',
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1,
                nextPage: page < totalPages ? parseInt(page) + 1 : null,
                prevPage: page > 1 ? parseInt(page) - 1 : null,
                totalProducts
            }
        });
    } catch (error) {
        console.error('Error loading products:', error);
        console.error('Error stack:', error.stack);
        
        // If database connection error, show friendly message
        if (error.message && error.message.includes('connection')) {
            return res.status(500).render('error', {
                title: 'Error - Maraneea Shop',
                error: 'Database tidak terhubung. Silakan pastikan MongoDB sedang berjalan.'
            });
        }
        
        res.status(500).render('error', {
            title: 'Error - Maraneea Shop',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Terjadi kesalahan saat memuat produk'
        });
    }
});

// Single product page
router.get('/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        
        const product = await Product.findOne({ 
            'seo.slug': slug, 
            isActive: true 
        }).populate('createdBy', 'name');

        if (!product) {
            return res.status(404).render('error', {
                title: 'Produk Tidak Ditemukan - Maraneea Shop',
                error: 'Produk yang Anda cari tidak ditemukan'
            });
        }

        // Get related products
        const relatedProducts = await Product.find({
            category: product.category,
            _id: { $ne: product._id },
            isActive: true
        })
        .limit(4)
        .populate('createdBy', 'name');

        res.render('products/detail', {
            title: `${product.name} - Maraneea Shop`,
            description: product.seo.metaDescription || product.shortDescription || product.description,
            currentPage: 'products',
            user: req.session.userId ? req.user : null,
            product,
            relatedProducts
        });
    } catch (error) {
        console.error('Error loading product detail:', error);
        res.status(500).render('error', {
            title: 'Error - Maraneea Shop',
            error: 'Terjadi kesalahan saat memuat detail produk'
        });
    }
});

// Product reviews
router.post('/:id/reviews', async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, comment } = req.body;
        
        if (!req.session.userId) {
            return res.json({ success: false, message: 'Anda harus login untuk memberikan review' });
        }

        if (!rating || rating < 1 || rating > 5) {
            return res.json({ success: false, message: 'Rating harus antara 1-5' });
        }

        const product = await Product.findById(id);
        if (!product) {
            return res.json({ success: false, message: 'Produk tidak ditemukan' });
        }

        // Check if user already reviewed this product
        const existingReview = product.reviews.find(review => 
            review.user.toString() === req.session.userId
        );

        if (existingReview) {
            return res.json({ success: false, message: 'Anda sudah memberikan review untuk produk ini' });
        }

        // Add review
        product.reviews.push({
            user: req.session.userId,
            rating: parseInt(rating),
            comment: comment || ''
        });

        // Update average rating
        const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
        product.rating.average = totalRating / product.reviews.length;
        product.rating.count = product.reviews.length;

        await product.save();

        res.json({ 
            success: true, 
            message: 'Review berhasil ditambahkan',
            rating: product.rating
        });
    } catch (error) {
        console.error('Error adding review:', error);
        res.json({ 
            success: false, 
            message: 'Terjadi kesalahan saat menambahkan review' 
        });
    }
});

// Get product reviews
router.get('/:id/reviews', async (req, res) => {
    try {
        const { id } = req.params;
        const { page = 1, limit = 10 } = req.query;
        
        const product = await Product.findById(id)
            .populate('reviews.user', 'name avatar')
            .select('reviews rating');

        if (!product) {
            return res.json({ success: false, message: 'Produk tidak ditemukan' });
        }

        const skip = (page - 1) * limit;
        const reviews = product.reviews
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(skip, skip + parseInt(limit));

        res.json({
            success: true,
            reviews,
            rating: product.rating,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(product.reviews.length / limit),
                totalReviews: product.reviews.length
            }
        });
    } catch (error) {
        console.error('Error getting reviews:', error);
        res.json({ 
            success: false, 
            message: 'Terjadi kesalahan saat mengambil review' 
        });
    }
});

// Search suggestions
router.get('/search/suggestions', async (req, res) => {
    try {
        const { q } = req.query;
        
        if (!q || q.length < 2) {
            return res.json({ suggestions: [] });
        }

        const suggestions = await Product.find({
            $or: [
                { name: { $regex: q, $options: 'i' } },
                { tags: { $in: [new RegExp(q, 'i')] } }
            ],
            isActive: true
        })
        .select('name category')
        .limit(5);

        res.json({ suggestions });
    } catch (error) {
        console.error('Error getting search suggestions:', error);
        res.json({ suggestions: [] });
    }
});

module.exports = router;

