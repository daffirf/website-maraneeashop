const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Order = require('../models/Order');
const { requireAuth } = require('../middleware/auth');

// Profile page
router.get('/', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).select('-password');
    const orders = await Order.find({ user: req.session.userId })
      .sort({ createdAt: -1 })
      .limit(10);
    
    res.render('profile/index', { 
      user, 
      orders,
      title: 'Profile - Maraneea Shop'
    });
  } catch (error) {
    console.error('Error loading profile:', error);
    res.status(500).render('error', { 
      message: 'Error loading profile',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
});

// Edit profile page
router.get('/edit', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).select('-password');
    res.render('profile/edit', { 
      user,
      title: 'Edit Profile - Maraneea Shop'
    });
  } catch (error) {
    console.error('Error loading edit profile:', error);
    res.status(500).render('error', { 
      message: 'Error loading edit profile',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
});

// Update profile
router.post('/edit', requireAuth, async (req, res) => {
  try {
    const { username, email, phone, address } = req.body;
    
    await User.findByIdAndUpdate(req.session.userId, {
      username,
      email,
      phone,
      address
    });
    
    req.flash('success', 'Profile updated successfully');
    res.redirect('/profile');
  } catch (error) {
    console.error('Error updating profile:', error);
    req.flash('error', 'Error updating profile');
    res.redirect('/profile/edit');
  }
});

// Order history page
router.get('/orders', requireAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    
    const orders = await Order.find({ user: req.session.userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const totalOrders = await Order.countDocuments({ user: req.session.userId });
    const totalPages = Math.ceil(totalOrders / limit);
    
    res.render('profile/orders', { 
      orders,
      currentPage: page,
      totalPages,
      title: 'Order History - Maraneea Shop'
    });
  } catch (error) {
    console.error('Error loading orders:', error);
    res.status(500).render('error', { 
      message: 'Error loading orders',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
});

// Order details page
router.get('/orders/:id', requireAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'username email')
      .populate('items.product', 'name price image');
    
    if (!order || order.user._id.toString() !== req.session.userId) {
      return res.status(404).render('error', { 
        message: 'Order not found',
        error: {}
      });
    }
    
    res.render('profile/order-details', { 
      order,
      title: `Order #${order._id} - Maraneea Shop`
    });
  } catch (error) {
    console.error('Error loading order details:', error);
    res.status(500).render('error', { 
      message: 'Error loading order details',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
});

module.exports = router;



