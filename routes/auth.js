const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Middleware untuk check authentication
const requireAuth = (req, res, next) => {
    if (req.session.userId) {
        return next();
    }
    res.redirect('/auth/login');
};

const requireGuest = (req, res, next) => {
    if (req.session.userId) {
        return res.redirect('/');
    }
    next();
};

// Login page
router.get('/login', requireGuest, (req, res) => {
    res.render('auth/login', {
        title: 'Login - Maraneea Shop',
        description: 'Masuk ke akun Anda untuk melanjutkan berbelanja',
        currentPage: 'auth',
        user: null
    });
});

// Register page
router.get('/register', requireGuest, (req, res) => {
    res.render('auth/register', {
        title: 'Daftar - Maraneea Shop',
        description: 'Daftar akun baru untuk mulai berbelanja di Maraneea Shop',
        currentPage: 'auth',
        user: null
    });
});

// Login process
router.post('/login', requireGuest, async (req, res) => {
    try {
        const { email, password, remember } = req.body;

        // Validation
        if (!email || !password) {
            return res.json({ 
                success: false, 
                message: 'Email dan password harus diisi' 
            });
        }

        // Find user
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.json({ 
                success: false, 
                message: 'Email atau password salah' 
            });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.json({ 
                success: false, 
                message: 'Akun Anda telah dinonaktifkan. Hubungi customer service untuk bantuan.' 
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.json({ 
                success: false, 
                message: 'Email atau password salah' 
            });
        }

        // Set session
        req.session.userId = user._id;
        req.session.userRole = user.role;
        
        // Set cookie expiration
        if (remember) {
            req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
        }

        res.json({ 
            success: true, 
            message: 'Login berhasil!',
            redirect: req.session.returnTo || '/'
        });
    } catch (error) {
        console.error('Login error:', error);
        res.json({ 
            success: false, 
            message: 'Terjadi kesalahan saat login. Silakan coba lagi.' 
        });
    }
});

// Register process
router.post('/register', requireGuest, async (req, res) => {
    try {
        const { name, email, password, confirmPassword, phone, agreeTerms } = req.body;

        // Validation
        if (!name || !email || !password || !confirmPassword || !phone) {
            return res.json({ 
                success: false, 
                message: 'Semua field harus diisi' 
            });
        }

        if (password !== confirmPassword) {
            return res.json({ 
                success: false, 
                message: 'Password dan konfirmasi password tidak sama' 
            });
        }

        if (password.length < 6) {
            return res.json({ 
                success: false, 
                message: 'Password minimal 6 karakter' 
            });
        }

        if (!agreeTerms) {
            return res.json({ 
                success: false, 
                message: 'Anda harus menyetujui syarat dan ketentuan' 
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.json({ 
                success: false, 
                message: 'Email sudah terdaftar. Gunakan email lain atau lakukan login.' 
            });
        }

        // Create new user
        const user = new User({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: password,
            phone: phone.trim()
        });

        await user.save();

        // Auto login after registration
        req.session.userId = user._id;
        req.session.userRole = user.role;

        res.json({ 
            success: true, 
            message: 'Registrasi berhasil! Selamat datang di Maraneea Shop.',
            redirect: '/'
        });
    } catch (error) {
        console.error('Registration error:', error);
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.json({ 
                success: false, 
                message: messages.join(', ') 
            });
        }

        res.json({ 
            success: false, 
            message: 'Terjadi kesalahan saat registrasi. Silakan coba lagi.' 
        });
    }
});

// Logout
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.json({ 
                success: false, 
                message: 'Terjadi kesalahan saat logout' 
            });
        }
        
        res.clearCookie('connect.sid');
        res.json({ 
            success: true, 
            message: 'Logout berhasil',
            redirect: '/'
        });
    });
});

// Profile page
router.get('/profile', requireAuth, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.redirect('/auth/login');
        }

        res.render('auth/profile', {
            title: 'Profile - Maraneea Shop',
            description: 'Kelola informasi profile dan akun Anda',
            currentPage: 'profile',
            user: user
        });
    } catch (error) {
        console.error('Error loading profile:', error);
        res.status(500).render('error', {
            title: 'Error - Maraneea Shop',
            error: 'Terjadi kesalahan saat memuat profile'
        });
    }
});

// Update profile
router.put('/profile', requireAuth, async (req, res) => {
    try {
        const { name, phone, address } = req.body;
        const userId = req.session.userId;

        const user = await User.findById(userId);
        if (!user) {
            return res.json({ 
                success: false, 
                message: 'User tidak ditemukan' 
            });
        }

        // Update fields
        if (name) user.name = name.trim();
        if (phone) user.phone = phone.trim();
        if (address) {
            user.address = {
                street: address.street || user.address.street,
                city: address.city || user.address.city,
                province: address.province || user.address.province,
                postalCode: address.postalCode || user.address.postalCode,
                country: address.country || user.address.country || 'Indonesia'
            };
        }

        await user.save();

        res.json({ 
            success: true, 
            message: 'Profile berhasil diperbarui' 
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.json({ 
            success: false, 
            message: 'Terjadi kesalahan saat memperbarui profile' 
        });
    }
});

// Change password
router.put('/change-password', requireAuth, async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;
        const userId = req.session.userId;

        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.json({ 
                success: false, 
                message: 'Semua field harus diisi' 
            });
        }

        if (newPassword !== confirmPassword) {
            return res.json({ 
                success: false, 
                message: 'Password baru dan konfirmasi password tidak sama' 
            });
        }

        if (newPassword.length < 6) {
            return res.json({ 
                success: false, 
                message: 'Password baru minimal 6 karakter' 
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.json({ 
                success: false, 
                message: 'User tidak ditemukan' 
            });
        }

        // Check current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.json({ 
                success: false, 
                message: 'Password lama salah' 
            });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.json({ 
            success: true, 
            message: 'Password berhasil diubah' 
        });
    } catch (error) {
        console.error('Error changing password:', error);
        res.json({ 
            success: false, 
            message: 'Terjadi kesalahan saat mengubah password' 
        });
    }
});

// Forgot password page
router.get('/forgot-password', requireGuest, (req, res) => {
    res.render('auth/forgot-password', {
        title: 'Lupa Password - Maraneea Shop',
        description: 'Reset password akun Anda',
        currentPage: 'auth',
        user: null
    });
});

// Forgot password process
router.post('/forgot-password', requireGuest, async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.json({ 
                success: false, 
                message: 'Email harus diisi' 
            });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.json({ 
                success: false, 
                message: 'Email tidak terdaftar' 
            });
        }

        // Here you would typically send a password reset email
        // For now, just return success
        res.json({ 
            success: true, 
            message: 'Instruksi reset password telah dikirim ke email Anda' 
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.json({ 
            success: false, 
            message: 'Terjadi kesalahan. Silakan coba lagi.' 
        });
    }
});

module.exports = router;













