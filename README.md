# Maraneea Shop - E-Commerce Website

Website e-commerce modern untuk menjual baju muslimah, hampers, aneka kue, dan produk Ramadhan & Lebaran dengan integrasi marketplace Indonesia.

## 🚀 Fitur Utama

### 🛍️ E-Commerce
- **Landing Page Modern** - Desain responsif dengan UI/UX yang menarik
- **Katalog Produk** - Kategori baju muslimah, hampers, kue, dan produk Ramadhan
- **Sistem Keranjang** - Add to cart, update quantity, remove items
- **Checkout Lengkap** - Form alamat pengiriman dan metode pembayaran
- **Manajemen Order** - Tracking status pesanan dan riwayat pembelian

### 👤 User Experience
- **Registrasi & Login** - Sistem autentikasi yang aman
- **Profile Management** - Edit profil dan informasi akun
- **Order History** - Riwayat pesanan dengan detail lengkap
- **Flash Messages** - Notifikasi sukses dan error

### 🛒 Admin Panel
- **Dashboard** - Overview penjualan dan statistik
- **Product Management** - CRUD produk dengan upload gambar
- **Order Management** - Kelola pesanan dan status pengiriman
- **User Management** - Kelola data pengguna

### 🏪 Marketplace Integration
- **Shopee API** - Integrasi dengan Shopee Indonesia
- **Tokopedia API** - Integrasi dengan Tokopedia
- **Bukalapak API** - Integrasi dengan Bukalapak
- **Unified Search** - Pencarian produk dari semua marketplace

## 🛠️ Teknologi yang Digunakan

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Web framework
- **MongoDB** - Database NoSQL
- **Mongoose** - ODM untuk MongoDB
- **EJS** - Template engine

### Frontend
- **Tailwind CSS** - Utility-first CSS framework
- **Font Awesome** - Icons
- **Responsive Design** - Mobile-first approach

### Security & Performance
- **bcryptjs** - Password hashing
- **express-session** - Session management
- **helmet** - Security headers
- **express-rate-limit** - Rate limiting
- **CORS** - Cross-origin resource sharing

### Integrations
- **Stripe** - Payment gateway
- **Nodemailer** - Email service
- **Axios** - HTTP client untuk API calls
- **Multer** - File upload handling

## 📦 Instalasi

### Prerequisites
- Node.js (v14 atau lebih baru)
- MongoDB (local atau cloud)
- Git

### Quick Start

1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd website-maraneeashop
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Setup Environment**
   ```bash
   copy env.example .env
   ```
   Edit file `.env` dengan konfigurasi Anda:
   ```env
   MONGODB_URI=mongodb://localhost:27017/maraneea-shop
   SESSION_SECRET=your-secret-key
   PORT=3000
   ```

4. **Build CSS**
   ```bash
   npm run build:css
   ```

5. **Start Application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

### Windows Users
Gunakan file batch yang sudah disediakan:
```bash
# Install dependencies
install.bat

# Start development server
dev.bat

# Start production server
start-app.bat
```

## 🚀 Cara Menjalankan

### Development Mode
```bash
npm run dev
```
Server akan berjalan di `http://localhost:3000` dengan auto-reload.

### Production Mode
```bash
npm start
```
Server akan berjalan di `http://localhost:3000`.

### Build CSS
```bash
npm run build:css
```
Compile Tailwind CSS ke file production.

## 📁 Struktur Project

```
website-maraneeashop/
├── public/                 # Static files
│   ├── css/               # Compiled CSS
│   ├── js/                # Client-side JavaScript
│   └── images/            # Images dan assets
├── views/                 # EJS templates
│   ├── admin/             # Admin panel views
│   ├── auth/              # Authentication views
│   ├── products/          # Product views
│   ├── profile/           # User profile views
│   └── orders/            # Order views
├── routes/                # Express routes
├── models/                # Mongoose models
├── middleware/            # Custom middleware
├── server.js              # Main application file
├── package.json           # Dependencies
└── tailwind.config.js     # Tailwind configuration
```

## 🔧 Konfigurasi

### Environment Variables
Buat file `.env` berdasarkan `env.example`:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/maraneea-shop

# Session
SESSION_SECRET=your-secret-key

# Server
PORT=3000
NODE_ENV=development

# Email (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Payment (Optional)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# Marketplace APIs (Optional)
SHOPEE_API_KEY=your-shopee-api-key
TOKOPEDIA_API_KEY=your-tokopedia-api-key
BUKALAPAK_API_KEY=your-bukalapak-api-key
```

### Database Setup
1. Install MongoDB
2. Start MongoDB service
3. Database akan dibuat otomatis saat aplikasi pertama kali dijalankan

## 🎨 Customization

### Styling
- Edit `tailwind.config.js` untuk custom theme
- Modifikasi `public/css/style.css` untuk custom styles
- Gunakan Tailwind classes di EJS templates

### Adding New Features
1. Buat route baru di folder `routes/`
2. Buat view baru di folder `views/`
3. Update `server.js` untuk register route baru
4. Tambahkan model baru di folder `models/` jika diperlukan

## 📱 API Endpoints

### Authentication
- `POST /auth/register` - Register user baru
- `POST /auth/login` - Login user
- `GET /auth/logout` - Logout user

### Products
- `GET /products` - List semua produk
- `GET /products/:id` - Detail produk
- `POST /products` - Tambah produk (admin)

### Cart
- `GET /cart` - View cart
- `POST /cart/add` - Add to cart
- `PUT /cart/update` - Update cart item
- `DELETE /cart/remove` - Remove from cart

### Orders
- `GET /orders/checkout` - Checkout page
- `POST /orders/checkout` - Process checkout
- `GET /orders/:id` - Order details

### Profile
- `GET /profile` - User profile
- `GET /profile/edit` - Edit profile page
- `POST /profile/edit` - Update profile
- `GET /profile/orders` - Order history

### Admin
- `GET /admin` - Admin dashboard
- `GET /admin/products` - Manage products
- `POST /admin/products` - Create product
- `PUT /admin/products/:id` - Update product
- `DELETE /admin/products/:id` - Delete product

### Marketplace
- `GET /marketplace` - Marketplace products
- `GET /api/shopee/products` - Shopee products API
- `GET /api/tokopedia/products` - Tokopedia products API
- `GET /api/bukalapak/products` - Bukalapak products API

## 🔒 Security Features

- Password hashing dengan bcryptjs
- Session management yang aman
- Rate limiting untuk mencegah abuse
- CORS protection
- Security headers dengan Helmet
- Input validation dan sanitization

## 🚀 Deployment

### Heroku
1. Install Heroku CLI
2. Login ke Heroku
3. Create app: `heroku create maraneea-shop`
4. Set environment variables
5. Deploy: `git push heroku main`

### Vercel
1. Install Vercel CLI
2. Login: `vercel login`
3. Deploy: `vercel`

### DigitalOcean
1. Setup droplet dengan Ubuntu
2. Install Node.js dan MongoDB
3. Clone repository
4. Install dependencies
5. Setup PM2 untuk process management
6. Configure Nginx sebagai reverse proxy

## 🤝 Contributing

1. Fork repository
2. Buat feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push ke branch: `git push origin feature/amazing-feature`
5. Buat Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Support

- Email: support@maraneeashop.com
- WhatsApp: +62 812 3456 7890
- Instagram: @maraneeashop

## 🙏 Acknowledgments

- Tailwind CSS untuk styling framework
- Express.js untuk web framework
- MongoDB untuk database
- Font Awesome untuk icons
- Semua contributors yang telah membantu

---

**Maraneea Shop** - Toko online terpercaya untuk baju muslimah, hampers, dan produk Ramadhan & Lebaran terbaik! 🛍️✨