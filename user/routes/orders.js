const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const { requireAuth } = require('../middleware/auth');

// Checkout page
router.get('/checkout', requireAuth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.session.userId }).populate('items.product');
    
    if (!cart || cart.items.length === 0) {
      req.flash('error', 'Your cart is empty');
      return res.redirect('/cart');
    }

    res.render('orders/checkout', { 
      cart,
      title: 'Checkout - Maraneea Shop'
    });
  } catch (error) {
    console.error('Error loading checkout:', error);
    res.status(500).render('error', { 
      message: 'Error loading checkout',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
});

// Process checkout
router.post('/checkout', requireAuth, async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;
    const cart = await Cart.findOne({ user: req.session.userId }).populate('items.product');
    
    if (!cart || cart.items.length === 0) {
      req.flash('error', 'Your cart is empty');
      return res.redirect('/cart');
    }

    // Calculate total
    let total = 0;
    cart.items.forEach(item => {
      total += item.product.price * item.quantity;
    });
    total += 15000; // Shipping cost

    // Create order
    const order = new Order({
      user: req.session.userId,
      items: cart.items.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price
      })),
      total,
      shippingAddress,
      paymentMethod,
      status: 'pending'
    });

    await order.save();

    // Clear cart
    await Cart.findOneAndDelete({ user: req.session.userId });

    req.flash('success', 'Order placed successfully!');
    res.redirect(`/orders/${order._id}`);
  } catch (error) {
    console.error('Error processing checkout:', error);
    req.flash('error', 'Error processing order');
    res.redirect('/cart');
  }
});

// Order confirmation
router.get('/:id', requireAuth, async (req, res) => {
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

    res.render('orders/confirmation', { 
      order,
      title: `Order Confirmation - Maraneea Shop`
    });
  } catch (error) {
    console.error('Error loading order:', error);
    res.status(500).render('error', { 
      message: 'Error loading order',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
});

module.exports = router;

