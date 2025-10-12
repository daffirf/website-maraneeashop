const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nama produk harus diisi'],
    trim: true,
    maxlength: [100, 'Nama produk maksimal 100 karakter']
  },
  description: {
    type: String,
    required: [true, 'Deskripsi produk harus diisi'],
    maxlength: [1000, 'Deskripsi maksimal 1000 karakter']
  },
  shortDescription: {
    type: String,
    maxlength: [200, 'Deskripsi singkat maksimal 200 karakter']
  },
  price: {
    type: Number,
    required: [true, 'Harga harus diisi'],
    min: [0, 'Harga tidak boleh negatif']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Harga asli tidak boleh negatif']
  },
  category: {
    type: String,
    required: [true, 'Kategori harus diisi'],
    enum: ['baju-muslimah', 'hampers', 'kue', 'ramadhan-lebaran', 'aksesoris', 'lainnya']
  },
  subcategory: {
    type: String,
    trim: true
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: String,
    isPrimary: { type: Boolean, default: false }
  }],
  variants: [{
    name: String, // e.g., "Ukuran", "Warna", "Rasa"
    options: [String] // e.g., ["S", "M", "L"], ["Merah", "Biru"]
  }],
  stock: {
    type: Number,
    required: [true, 'Stok harus diisi'],
    min: [0, 'Stok tidak boleh negatif'],
    default: 0
  },
  sku: {
    type: String,
    unique: true,
    sparse: true
  },
  weight: {
    type: Number, // dalam gram
    min: [0, 'Berat tidak boleh negatif']
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isNew: {
    type: Boolean,
    default: true
  },
  isOnSale: {
    type: Boolean,
    default: false
  },
  discountPercentage: {
    type: Number,
    min: [0, 'Diskon tidak boleh negatif'],
    max: [100, 'Diskon maksimal 100%']
  },
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0, min: 0 }
  },
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    images: [String],
    createdAt: { type: Date, default: Date.now }
  }],
  marketplaceLinks: {
    shopee: String,
    tokopedia: String,
    bukalapak: String,
    lazada: String
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    slug: {
      type: String,
      unique: true,
      lowercase: true
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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

// Generate SKU otomatis
productSchema.pre('save', function(next) {
  if (!this.sku) {
    const categoryPrefix = {
      'baju-muslimah': 'BM',
      'hampers': 'HP',
      'kue': 'KU',
      'ramadhan-lebaran': 'RL',
      'aksesoris': 'AK',
      'lainnya': 'LN'
    };
    const prefix = categoryPrefix[this.category] || 'PR';
    this.sku = `${prefix}-${Date.now().toString().slice(-6)}`;
  }
  next();
});

// Generate slug otomatis
productSchema.pre('save', function(next) {
  if (!this.seo.slug) {
    this.seo.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
  next();
});

// Update timestamp
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index untuk pencarian
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ price: 1 });
productSchema.index({ 'rating.average': -1 });

module.exports = mongoose.model('Product', productSchema);

