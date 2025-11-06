const mongoose = require('mongoose');
require('dotenv').config();

console.log('\n🔍 Testing MongoDB Connection...\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

// Get connection string
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/maraneea-shop';
console.log('Connection String:', mongoURI.replace(/:[^:@]+@/, ':****@'));
console.log('');

// Test connection
const testConnection = async () => {
    try {
        console.log('⏳ Connecting to MongoDB...');
        
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            connectTimeoutMS: 10000,
        });
        
        console.log('✅ Connection successful!');
        console.log('');
        console.log('📊 Database Info:');
        console.log('   - Database Name:', mongoose.connection.name);
        console.log('   - Host:', mongoose.connection.host);
        console.log('   - Port:', mongoose.connection.port);
        console.log('   - Ready State:', mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected');
        console.log('');
        
        // Test query
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('📁 Collections:', collections.length);
        collections.forEach(col => {
            console.log('   -', col.name);
        });
        
        console.log('');
        console.log('✅ MongoDB connection test PASSED!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Connection failed!');
        console.error('');
        console.error('Error:', error.message);
        console.error('');
        console.error('🔧 Troubleshooting:');
        
        if (error.message.includes('authentication failed') || error.message.includes('bad auth')) {
            console.error('   1. ❌ Username atau password salah');
            console.error('   2. ✅ Cek username dan password di MongoDB Atlas');
            console.error('   3. ✅ Pastikan user sudah dibuat dengan role "Atlas admin"');
            console.error('   4. ✅ Update file .env dengan connection string yang benar');
        } else if (error.message.includes('timeout') || error.message.includes('buffering')) {
            console.error('   1. ❌ Timeout - tidak bisa terhubung ke server');
            console.error('   2. ✅ Pastikan IP sudah di-whitelist di MongoDB Atlas');
            console.error('   3. ✅ Cek koneksi internet Anda');
            console.error('   4. ✅ Pastikan cluster MongoDB Atlas sudah aktif (hijau)');
        } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
            console.error('   1. ❌ Host tidak ditemukan');
            console.error('   2. ✅ Cek connection string di file .env');
            console.error('   3. ✅ Pastikan cluster name benar');
            console.error('   4. ✅ Cek koneksi internet Anda');
        } else {
            console.error('   1. ✅ Cek file .env - pastikan MONGODB_URI sudah diisi');
            console.error('   2. ✅ Pastikan MongoDB Atlas cluster sudah aktif');
            console.error('   3. ✅ Cek dokumentasi: user/MONGODB-ATLAS-SETUP.md');
        }
        
        console.error('');
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        
        process.exit(1);
    }
};

testConnection();

