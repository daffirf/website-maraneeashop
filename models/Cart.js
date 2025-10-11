const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
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
      min: [1, 'Jumlah minimal 1'],
      max: [99, 'Jumlah maksimal 99']
    },
    variant: {
      name: String,
      value: String
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp
cartSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method untuk menambah item ke cart
cartSchema.methods.addItem = function(productId, quantity = 1, variant = null) {
  const existingItem = this.items.find(item => 
    item.product.toString() === productId.toString() && 
    JSON.stringify(item.variant) === JSON.stringify(variant)
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    this.items.push({
      product: productId,
      quantity: quantity,
      variant: variant
    });
  }
  
  return this.save();
};

// Method untuk menghapus item dari cart
cartSchema.methods.removeItem = function(productId, variant = null) {
  this.items = this.items.filter(item => 
    !(item.product.toString() === productId.toString() && 
      JSON.stringify(item.variant) === JSON.stringify(variant))
  );
  
  return this.save();
};

// Method untuk update quantity
cartSchema.methods.updateQuantity = function(productId, quantity, variant = null) {
  const item = this.items.find(item => 
    item.product.toString() === productId.toString() && 
    JSON.stringify(item.variant) === JSON.stringify(variant)
  );

  if (item) {
    if (quantity <= 0) {
      return this.removeItem(productId, variant);
    } else {
      item.quantity = quantity;
    }
  }
  
  return this.save();
};

// Method untuk menghitung total
cartSchema.methods.calculateTotal = async function() {
  await this.populate('items.product');
  
  let subtotal = 0;
  this.items.forEach(item => {
    const price = item.product.isOnSale && item.product.discountPercentage > 0
      ? item.product.price * (1 - item.product.discountPercentage / 100)
      : item.product.price;
    subtotal += price * item.quantity;
  });
  
  return {
    subtotal: subtotal,
    itemCount: this.items.reduce((total, item) => total + item.quantity, 0),
    uniqueItems: this.items.length
  };
};

// Method untuk clear cart
cartSchema.methods.clear = function() {
  this.items = [];
  return this.save();
};

module.exports = mongoose.model('Cart', cartSchema);

