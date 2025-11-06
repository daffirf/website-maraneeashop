const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/maraneea-shop';
        await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
        });
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        process.exit(1);
    }
};

// Sample products data
const sampleProducts = [
    // Baju Muslimah
    {
        name: 'Baju Muslimah Modern Set',
        description: 'Baju muslimah modern dengan desain elegan dan nyaman dipakai. Terbuat dari bahan katun berkualitas tinggi yang adem dan tidak mudah kusut. Cocok untuk berbagai acara formal maupun casual.',
        shortDescription: 'Baju muslimah modern set dengan desain elegan',
        price: 299000,
        originalPrice: 399000,
        category: 'baju-muslimah',
        subcategory: 'Set',
        images: [
            { url: '/images/products/baju-muslimah-1.jpg', alt: 'Baju Muslimah Modern Set', isPrimary: true }
        ],
        stock: 50,
        weight: 500,
        tags: ['baju muslimah', 'modern', 'set', 'elegan'],
        isActive: true,
        isFeatured: true,
        isNew: true,
        isOnSale: true,
        discountPercentage: 25,
        rating: { average: 4.8, count: 120 },
        createdBy: null
    },
    {
        name: 'Gamis Syar\'i Premium',
        description: 'Gamis syar\'i dengan model long dress yang nyaman dan menutup aurat dengan sempurna. Bahan premium yang tidak transparan dan adem saat dipakai.',
        shortDescription: 'Gamis syar\'i premium dengan model long dress',
        price: 450000,
        originalPrice: 550000,
        category: 'baju-muslimah',
        subcategory: 'Gamis',
        images: [
            { url: '/images/products/baju-muslimah-2.jpg', alt: 'Gamis Syar\'i Premium', isPrimary: true }
        ],
        stock: 30,
        weight: 600,
        tags: ['gamis', 'syar\'i', 'premium', 'long dress'],
        isActive: true,
        isFeatured: true,
        isNew: false,
        isOnSale: true,
        discountPercentage: 18,
        rating: { average: 4.9, count: 85 },
        createdBy: null
    },
    // Hampers
    {
        name: 'Hampers Lebaran Premium',
        description: 'Hampers lebaran dengan isi lengkap dan berkualitas. Berisi aneka kue kering, teh, kopi, dan produk makanan halal lainnya. Dikemas dengan box eksklusif yang cantik.',
        shortDescription: 'Hampers lebaran premium dengan isi lengkap',
        price: 599000,
        originalPrice: 749000,
        category: 'hampers',
        subcategory: 'Lebaran',
        images: [
            { url: '/images/products/hampers-1.jpg', alt: 'Hampers Lebaran Premium', isPrimary: true }
        ],
        stock: 25,
        weight: 2000,
        tags: ['hampers', 'lebaran', 'premium', 'kue kering'],
        isActive: true,
        isFeatured: true,
        isNew: true,
        isOnSale: true,
        discountPercentage: 20,
        rating: { average: 4.9, count: 95 },
        createdBy: null
    },
    {
        name: 'Hampers Ramadhan Special',
        description: 'Hampers khusus Ramadhan dengan isi makanan berbuka puasa, kurma premium, dan produk Ramadhan lainnya. Perfect untuk hadiah buka puasa bersama.',
        shortDescription: 'Hampers Ramadhan dengan isi makanan berbuka',
        price: 450000,
        category: 'hampers',
        subcategory: 'Ramadhan',
        images: [
            { url: '/images/products/hampers-2.jpg', alt: 'Hampers Ramadhan Special', isPrimary: true }
        ],
        stock: 40,
        weight: 1800,
        tags: ['hampers', 'ramadhan', 'buka puasa', 'kurma'],
        isActive: true,
        isFeatured: false,
        isNew: true,
        isOnSale: false,
        rating: { average: 4.7, count: 65 },
        createdBy: null
    },
    // Kue
    {
        name: 'Kue Nastar Premium',
        description: 'Kue nastar dengan isian nanas yang manis dan legit. Tekstur kue yang lembut dan renyah. Dibuat dengan bahan premium dan tanpa pengawet.',
        shortDescription: 'Kue nastar premium dengan isian nanas manis',
        price: 89000,
        category: 'kue',
        subcategory: 'Kue Kering',
        images: [
            { url: '/images/products/kue-1.jpg', alt: 'Kue Nastar Premium', isPrimary: true }
        ],
        stock: 100,
        weight: 500,
        tags: ['nastar', 'kue kering', 'lebaran', 'premium'],
        isActive: true,
        isFeatured: true,
        isNew: false,
        isOnSale: false,
        rating: { average: 4.7, count: 150 },
        createdBy: null
    },
    {
        name: 'Kue Kastengel Keju',
        description: 'Kue kastengel dengan taburan keju yang melimpah. Renyah dan gurih, cocok untuk teman minum teh atau kopi. Tersedia dalam berbagai ukuran.',
        shortDescription: 'Kue kastengel keju yang renyah dan gurih',
        price: 75000,
        category: 'kue',
        subcategory: 'Kue Kering',
        images: [
            { url: '/images/products/kue-2.jpg', alt: 'Kue Kastengel Keju', isPrimary: true }
        ],
        stock: 80,
        weight: 400,
        tags: ['kastengel', 'keju', 'kue kering', 'renyah'],
        isActive: true,
        isFeatured: false,
        isNew: false,
        isOnSale: false,
        rating: { average: 4.6, count: 110 },
        createdBy: null
    },
    // Ramadhan & Lebaran
    {
        name: 'Paket Ramadhan Lengkap',
        description: 'Paket lengkap untuk kebutuhan Ramadhan. Berisi kurma premium, sirup, makanan berbuka, dan produk Ramadhan lainnya. Perfect untuk persiapan Ramadhan.',
        shortDescription: 'Paket lengkap kebutuhan Ramadhan',
        price: 1299000,
        category: 'ramadhan-lebaran',
        subcategory: 'Paket Ramadhan',
        images: [
            { url: '/images/products/ramadhan-1.jpg', alt: 'Paket Ramadhan Lengkap', isPrimary: true }
        ],
        stock: 20,
        weight: 3000,
        tags: ['ramadhan', 'paket', 'kurma', 'buka puasa'],
        isActive: true,
        isFeatured: true,
        isNew: true,
        isOnSale: false,
        rating: { average: 4.9, count: 45 },
        createdBy: null
    },
    {
        name: 'Paket Lebaran Spesial',
        description: 'Paket spesial untuk hari raya. Berisi aneka kue kering, makanan ringan, dan produk lebaran lainnya. Dikemas dengan box eksklusif.',
        shortDescription: 'Paket spesial untuk hari raya lebaran',
        price: 899000,
        originalPrice: 1099000,
        category: 'ramadhan-lebaran',
        subcategory: 'Paket Lebaran',
        images: [
            { url: '/images/products/ramadhan-2.jpg', alt: 'Paket Lebaran Spesial', isPrimary: true }
        ],
        stock: 35,
        weight: 2500,
        tags: ['lebaran', 'paket', 'kue kering', 'spesial'],
        isActive: true,
        isFeatured: true,
        isNew: true,
        isOnSale: true,
        discountPercentage: 18,
        rating: { average: 4.8, count: 75 },
        createdBy: null
    },
    // Aksesoris
    {
        name: 'Kerudung Instan Premium',
        description: 'Kerudung instan dengan bahan yang adem dan tidak mudah kusut. Desain modern dan praktis, cocok untuk berbagai aktivitas.',
        shortDescription: 'Kerudung instan premium yang adem dan praktis',
        price: 125000,
        originalPrice: 150000,
        category: 'aksesoris',
        subcategory: 'Kerudung',
        images: [
            { url: '/images/products/aksesoris-1.jpg', alt: 'Kerudung Instan Premium', isPrimary: true }
        ],
        stock: 60,
        weight: 100,
        tags: ['kerudung', 'instan', 'premium', 'adem'],
        isActive: true,
        isFeatured: false,
        isNew: true,
        isOnSale: true,
        discountPercentage: 17,
        rating: { average: 4.5, count: 90 },
        createdBy: null
    },
    {
        name: 'Tas Muslimah Elegan',
        description: 'Tas muslimah dengan desain elegan dan modern. Bahan berkualitas dengan jahitan yang rapi. Cocok untuk berbagai acara.',
        shortDescription: 'Tas muslimah elegan dengan desain modern',
        price: 350000,
        originalPrice: 450000,
        category: 'aksesoris',
        subcategory: 'Tas',
        images: [
            { url: '/images/products/aksesoris-2.jpg', alt: 'Tas Muslimah Elegan', isPrimary: true }
        ],
        stock: 25,
        weight: 800,
        tags: ['tas', 'muslimah', 'elegan', 'modern'],
        isActive: true,
        isFeatured: true,
        isNew: false,
        isOnSale: true,
        discountPercentage: 22,
        rating: { average: 4.6, count: 55 },
        createdBy: null
    }
];

// Seed database
const seedDatabase = async () => {
    try {
        await connectDB();

        console.log('\n🌱 Starting database seeding...\n');

        // Get or create admin user for createdBy field
        let adminUser = await User.findOne({ role: 'admin' });
        if (!adminUser) {
            console.log('⚠️  No admin user found. Creating admin user first...');
            adminUser = new User({
                name: 'Admin Maraneea Shop',
                email: 'admin@maraneeashop.com',
                password: 'admin123',
                phone: '081234567890',
                role: 'admin',
                isActive: true
            });
            await adminUser.save();
            console.log('✅ Admin user created');
        }

        // Update createdBy for all products
        sampleProducts.forEach(product => {
            product.createdBy = adminUser._id;
        });

        // Clear existing products (optional - comment out if you want to keep existing)
        const deleteResult = await Product.deleteMany({});
        console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing products`);

        // Insert sample products
        const products = await Product.insertMany(sampleProducts);
        console.log(`✅ Inserted ${products.length} products\n`);

        // Display summary
        console.log('📊 Database Summary:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        const categories = await Product.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);
        categories.forEach(cat => {
            console.log(`   ${cat._id}: ${cat.count} products`);
        });
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        console.log('✅ Database seeding completed successfully!');
        console.log('\n🌐 You can now:');
        console.log('   1. View products at: http://localhost:3000/products');
        console.log('   2. Access admin panel: http://localhost:3000/admin');
        console.log('   3. Login with: admin@maraneeashop.com / admin123\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

// Run seeding
seedDatabase();

