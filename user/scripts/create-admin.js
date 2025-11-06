const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/maraneea-shop';
        await mongoose.connect(mongoURI);
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

// Create admin user
const createAdmin = async () => {
    try {
        await connectDB();

        // Default admin credentials
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@maraneeashop.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
        const adminName = process.env.ADMIN_NAME || 'Admin Maraneea Shop';
        const adminPhone = process.env.ADMIN_PHONE || '081234567890';

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminEmail });
        if (existingAdmin) {
            if (existingAdmin.role === 'admin') {
                console.log('ℹ️  Admin user already exists!');
                console.log(`   Email: ${adminEmail}`);
                console.log(`   Role: ${existingAdmin.role}`);
                console.log('\n💡 To change password, update the user in database or use this script with different email.');
                process.exit(0);
            } else {
                // Update existing user to admin
                existingAdmin.role = 'admin';
                existingAdmin.password = adminPassword; // Will be hashed by pre-save hook
                await existingAdmin.save();
                console.log('✅ Existing user updated to admin!');
                console.log(`   Email: ${adminEmail}`);
                console.log(`   Password: ${adminPassword}`);
                process.exit(0);
            }
        }

        // Create new admin user
        const admin = new User({
            name: adminName,
            email: adminEmail,
            password: adminPassword, // Will be hashed by pre-save hook
            phone: adminPhone,
            role: 'admin',
            isActive: true
        });

        await admin.save();

        console.log('\n✅ Admin user created successfully!');
        console.log('\n📋 Login Credentials:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`   Email    : ${adminEmail}`);
        console.log(`   Password : ${adminPassword}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('\n⚠️  IMPORTANT: Please change the password after first login!');
        console.log('\n🌐 Access admin panel at: http://localhost:3000/admin\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin:', error);
        process.exit(1);
    }
};

// Run the script
createAdmin();

