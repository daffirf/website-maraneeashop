const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');

// Route untuk membuat admin user (hanya untuk development/setup awal)
// HAPUS atau proteksi route ini setelah admin dibuat!
router.get('/setup-admin', async (req, res) => {
    try {
        // Check MongoDB connection
        if (mongoose.connection.readyState !== 1) {
            // Try to connect if not connected
            const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/maraneea-shop';
            try {
                await mongoose.connect(mongoURI, {
                    serverSelectionTimeoutMS: 10000, // 10 seconds
                    socketTimeoutMS: 45000,
                });
            } catch (connectError) {
                return res.send(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>Admin Setup Error - Maraneea Shop</title>
                        <style>
                            body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
                            .error { background: #f8d7da; color: #721c24; padding: 15px; border-radius: 5px; }
                            .info { background: #d1ecf1; color: #0c5460; padding: 15px; border-radius: 5px; margin-top: 20px; }
                            code { background: #f4f4f4; padding: 2px 6px; border-radius: 3px; }
                            ul { margin: 10px 0; padding-left: 20px; }
                        </style>
                    </head>
                    <body>
                        <h1>Admin Setup Error</h1>
                        <div class="error">
                            <strong>❌ MongoDB Connection Error:</strong><br>
                            ${connectError.message}
                        </div>
                        <div class="info">
                            <h3>🔧 Troubleshooting:</h3>
                            <ul>
                                <li><strong>Pastikan IP sudah di-whitelist:</strong><br>
                                    Di MongoDB Atlas → Network Access → Pastikan ada IP <code>0.0.0.0/0</code> atau IP Anda saat ini</li>
                                <li><strong>Cek username dan password:</strong><br>
                                    Pastikan username dan password di connection string benar</li>
                                <li><strong>Cek connection string di .env:</strong><br>
                                    File: <code>user/.env</code><br>
                                    Pastikan format: <code>mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/maraneea-shop?retryWrites=true&w=majority</code></li>
                                <li><strong>Restart server:</strong><br>
                                    Setelah update .env, restart server</li>
                            </ul>
                        </div>
                        <div class="info">
                            <p><strong>Connection String saat ini:</strong></p>
                            <code style="word-break: break-all;">${mongoURI.replace(/:[^:@]+@/, ':****@')}</code>
                        </div>
                    </body>
                    </html>
                `);
            }
        }
        // Default admin credentials
        const adminEmail = 'admin@maraneeashop.com';
        const adminPassword = 'admin123';
        const adminName = 'Admin Maraneea Shop';
        const adminPhone = '081234567890';

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminEmail });
        if (existingAdmin) {
            if (existingAdmin.role === 'admin') {
                return res.send(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>Admin Setup - Maraneea Shop</title>
                        <style>
                            body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
                            .success { background: #d4edda; color: #155724; padding: 15px; border-radius: 5px; }
                            .info { background: #d1ecf1; color: #0c5460; padding: 15px; border-radius: 5px; margin-top: 20px; }
                            .credentials { background: #fff3cd; color: #856404; padding: 15px; border-radius: 5px; margin-top: 20px; }
                            code { background: #f4f4f4; padding: 2px 6px; border-radius: 3px; }
                        </style>
                    </head>
                    <body>
                        <h1>Admin Setup - Maraneea Shop</h1>
                        <div class="success">
                            <strong>✅ Admin user already exists!</strong>
                        </div>
                        <div class="info">
                            <p><strong>Email:</strong> ${adminEmail}</p>
                            <p><strong>Role:</strong> ${existingAdmin.role}</p>
                        </div>
                        <div class="info">
                            <p><a href="/auth/login">Go to Login Page</a></p>
                            <p><a href="/admin">Go to Admin Panel</a></p>
                        </div>
                    </body>
                    </html>
                `);
            } else {
                // Update existing user to admin
                existingAdmin.role = 'admin';
                existingAdmin.password = adminPassword;
                await existingAdmin.save();
                
                return res.send(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>Admin Setup - Maraneea Shop</title>
                        <style>
                            body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
                            .success { background: #d4edda; color: #155724; padding: 15px; border-radius: 5px; }
                            .credentials { background: #fff3cd; color: #856404; padding: 15px; border-radius: 5px; margin-top: 20px; }
                            .warning { background: #f8d7da; color: #721c24; padding: 15px; border-radius: 5px; margin-top: 20px; }
                            code { background: #f4f4f4; padding: 2px 6px; border-radius: 3px; }
                        </style>
                    </head>
                    <body>
                        <h1>Admin Setup - Maraneea Shop</h1>
                        <div class="success">
                            <strong>✅ Existing user updated to admin!</strong>
                        </div>
                        <div class="credentials">
                            <h3>Login Credentials:</h3>
                            <p><strong>Email:</strong> <code>${adminEmail}</code></p>
                            <p><strong>Password:</strong> <code>${adminPassword}</code></p>
                        </div>
                        <div class="warning">
                            <strong>⚠️ IMPORTANT:</strong> Please change the password after first login!
                        </div>
                        <div style="margin-top: 20px;">
                            <p><a href="/auth/login">Go to Login Page</a></p>
                            <p><a href="/admin">Go to Admin Panel</a></p>
                        </div>
                    </body>
                    </html>
                `);
            }
        }

        // Create new admin user
        const admin = new User({
            name: adminName,
            email: adminEmail,
            password: adminPassword,
            phone: adminPhone,
            role: 'admin',
            isActive: true
        });

        await admin.save();

        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Admin Setup - Maraneea Shop</title>
                <style>
                    body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
                    .success { background: #d4edda; color: #155724; padding: 15px; border-radius: 5px; }
                    .credentials { background: #fff3cd; color: #856404; padding: 15px; border-radius: 5px; margin-top: 20px; }
                    .warning { background: #f8d7da; color: #721c24; padding: 15px; border-radius: 5px; margin-top: 20px; }
                    code { background: #f4f4f4; padding: 2px 6px; border-radius: 3px; }
                    a { color: #007bff; text-decoration: none; }
                    a:hover { text-decoration: underline; }
                </style>
            </head>
            <body>
                <h1>Admin Setup - Maraneea Shop</h1>
                <div class="success">
                    <strong>✅ Admin user created successfully!</strong>
                </div>
                <div class="credentials">
                    <h3>📋 Login Credentials:</h3>
                    <p><strong>Email:</strong> <code>${adminEmail}</code></p>
                    <p><strong>Password:</strong> <code>${adminPassword}</code></p>
                </div>
                <div class="warning">
                    <strong>⚠️ IMPORTANT:</strong> Please change the password after first login!
                </div>
                <div style="margin-top: 20px;">
                    <p><a href="/auth/login">→ Go to Login Page</a></p>
                    <p><a href="/admin">→ Go to Admin Panel</a></p>
                </div>
            </body>
            </html>
        `);
    } catch (error) {
        console.error('Error creating admin:', error);
        res.status(500).send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Admin Setup Error - Maraneea Shop</title>
                <style>
                    body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
                    .error { background: #f8d7da; color: #721c24; padding: 15px; border-radius: 5px; }
                </style>
            </head>
            <body>
                <h1>Admin Setup Error</h1>
                <div class="error">
                    <strong>❌ Error:</strong> ${error.message}
                </div>
                <p>Make sure MongoDB is running and try again.</p>
            </body>
            </html>
        `);
    }
});

module.exports = router;

