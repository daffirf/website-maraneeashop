const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const flash = require('connect-flash');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'maraneea-shop-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Flash messages
app.use(flash());

// Make flash messages available to all views
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.user = req.session.userId ? { id: req.session.userId, role: req.session.role } : null;
  next();
});

// Database connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/maraneea-shop';
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
    });
    
    console.log('✅ Database connected successfully');
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected successfully');
    });
    
  } catch (err) {
    console.error('❌ Database connection error:', err.message);
    
    // Provide helpful error messages
    if (err.message.includes('authentication failed') || err.message.includes('bad auth')) {
      console.error('\n🔧 SOLUSI:');
      console.error('   1. Cek username dan password di connection string');
      console.error('   2. Pastikan user sudah dibuat di MongoDB Atlas');
      console.error('   3. Pastikan role user adalah "Atlas admin"');
      console.error('   4. Update file .env dengan connection string yang benar\n');
    } else if (err.message.includes('timeout') || err.message.includes('buffering')) {
      console.error('\n🔧 SOLUSI:');
      console.error('   1. Pastikan IP sudah di-whitelist di MongoDB Atlas');
      console.error('   2. Cek koneksi internet Anda');
      console.error('   3. Pastikan cluster MongoDB Atlas sudah aktif\n');
    } else if (err.message.includes('ENOTFOUND') || err.message.includes('getaddrinfo')) {
      console.error('\n🔧 SOLUSI:');
      console.error('   1. Cek connection string di file .env');
      console.error('   2. Pastikan cluster name benar');
      console.error('   3. Cek koneksi internet Anda\n');
    }
    
    console.log('⚠️  Running without database - some features may not work');
    console.log('💡 Untuk memperbaiki, ikuti panduan di: user/MONGODB-ATLAS-SETUP.md\n');
  }
};

// Connect to database
connectDB();

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/products', require('./routes/products'));
app.use('/cart', require('./routes/cart'));
app.use('/orders', require('./routes/orders'));
app.use('/profile', require('./routes/profile'));
app.use('/marketplace', require('./routes/marketplace'));
// Setup route untuk membuat admin (HAPUS setelah admin dibuat!)
app.use('/setup', require('./routes/setup'));
app.use('/admin', require('./routes/admin'));
app.use('/api', require('./routes/api'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { 
    title: 'Error - Maraneea Shop',
    error: process.env.NODE_ENV === 'production' ? 'Something went wrong!' : err.message 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('error', { 
    title: '404 - Page Not Found - Maraneea Shop',
    error: 'Halaman yang Anda cari tidak ditemukan' 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Maraneea Shop server running on http://localhost:${PORT}`);
  console.log(`📱 Admin panel: http://localhost:${PORT}/admin`);
});
