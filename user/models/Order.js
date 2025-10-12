const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Jumlah minimal 1']
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Harga tidak boleh negatif']
    },
    variant: {
      name: String,
      value: String
    }
  }],
  shippingAddress: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    province: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, default: 'Indonesia' },
    notes: String
  },
  billingAddress: {
    name: String,
    phone: String,
    street: String,
    city: String,
    province: String,
    postalCode: String,
    country: { type: String, default: 'Indonesia' }
  },
  pricing: {
    subtotal: { type: Number, required: true, min: 0 },
    shippingCost: { type: Number, required: true, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 }
  },
  payment: {
    method: {
      type: String,
      enum: ['bank_transfer', 'credit_card', 'e_wallet', 'cod'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    paymentProof: String,
    paidAt: Date
  },
  shipping: {
    method: {
      type: String,
      enum: ['jne', 'tiki', 'pos', 'jnt', 'sicepat', 'pickup'],
      required: true
    },
    trackingNumber: String,
    estimatedDelivery: Date,
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    },
    shippedAt: Date,
    deliveredAt: Date
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
    default: 'pending'
  },
  notes: {
    customer: String,
    admin: String
  },
  marketplaceOrder: {
    platform: {
      type: String,
      enum: ['shopee', 'tokopedia', 'bukalapak', 'lazada', 'website']
    },
    orderId: String,
    status: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Generate order number
orderSchema.pre('save', function(next) {
  if (!this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.orderNumber = `MRN${year}${month}${day}${random}`;
  }
  next();
});

// Update timestamp
orderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ customer: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ 'payment.status': 1 });

module.exports = mongoose.model('Order', orderSchema);

