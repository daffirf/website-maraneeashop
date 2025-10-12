# Admin Panel - Maraneea Shop

## Overview
Admin Panel adalah sistem manajemen lengkap untuk toko online Maraneea Shop yang memungkinkan administrator untuk mengelola semua aspek bisnis dari satu tempat.

## Fitur Utama

### 1. Dashboard Admin
- **Lokasi**: `/admin`
- **Fitur**:
  - Statistik real-time (total produk, pengguna, pesanan)
  - Grafik penjualan 7 hari terakhir
  - Daftar pesanan terbaru
  - Produk dengan stok rendah
  - Notifikasi sistem

### 2. Manajemen Produk
- **Lokasi**: `/admin/products`
- **Fitur**:
  - Daftar semua produk dengan filter dan pencarian
  - Tambah produk baru (`/admin/products/add`)
  - Edit produk existing (`/admin/products/edit/:id`)
  - Hapus produk (soft delete)
  - Upload gambar produk (maksimal 5 gambar)
  - Pengaturan SEO untuk setiap produk
  - Status produk (aktif/nonaktif, unggulan, baru, diskon)

### 3. Manajemen Pesanan
- **Lokasi**: `/admin/orders`
- **Fitur**:
  - Daftar semua pesanan dengan filter status
  - Update status pesanan (pending, confirmed, shipped, delivered, cancelled)
  - Lihat detail pesanan lengkap
  - Print invoice pesanan
  - Kirim notifikasi ke pelanggan
  - Export data pesanan

### 4. Manajemen Pengguna
- **Lokasi**: `/admin/users`
- **Fitur**:
  - Daftar semua pengguna (customer & admin)
  - Tambah pengguna baru
  - Edit informasi pengguna
  - Aktifkan/nonaktifkan akun
  - Hapus pengguna
  - Filter berdasarkan role dan status

### 5. Manajemen Database
- **Lokasi**: `/admin/database`
- **Fitur**:
  - Monitoring status database
  - Statistik ukuran dan performa
  - Operasi database (backup, optimize, clean logs)
  - Rebuild indexes
  - Check integrity
  - Reset database (hati-hati!)
  - Export data database

### 6. Analitik & Laporan
- **Lokasi**: `/admin/analytics`
- **Fitur**:
  - Metrik penjualan (pendapatan, pesanan, AOV)
  - Grafik tren penjualan dan pesanan
  - Produk terlaris
  - Performa kategori
  - Analitik pelanggan (CLV, repeat rate)
  - Export laporan Excel

### 7. Pengaturan Sistem
- **Lokasi**: `/admin/settings`
- **Fitur**:
  - Pengaturan umum aplikasi
  - Konfigurasi toko
  - Pengaturan pembayaran
  - Konfigurasi pengiriman
  - Setup email SMTP
  - Pengaturan keamanan
  - Konfigurasi backup otomatis

## Struktur File

```
user/
├── views/admin/
│   ├── dashboard.ejs          # Dashboard utama
│   ├── products.ejs           # Daftar produk
│   ├── product-form.ejs       # Form tambah/edit produk
│   ├── orders.ejs             # Daftar pesanan
│   ├── users.ejs              # Daftar pengguna
│   ├── database.ejs           # Manajemen database
│   ├── analytics.ejs          # Analitik & laporan
│   └── settings.ejs           # Pengaturan sistem
├── routes/
│   └── admin.js               # Routes admin
├── public/css/
│   └── admin.css              # Styling admin panel
└── ADMIN_README.md            # Dokumentasi ini
```

## Autentikasi Admin

### Middleware `requireAdmin`
```javascript
const requireAdmin = (req, res, next) => {
    if (req.session.userId && req.session.userRole === 'admin') {
        return next();
    }
    res.redirect('/auth/login');
};
```

### Cara Menggunakan
1. Login sebagai admin dengan role 'admin'
2. Akses semua halaman admin akan otomatis terproteksi
3. Jika bukan admin, akan diarahkan ke halaman login

## API Endpoints

### Produk
- `GET /admin/products` - Daftar produk
- `GET /admin/products/add` - Form tambah produk
- `GET /admin/products/edit/:id` - Form edit produk
- `POST /admin/products/save` - Simpan produk
- `DELETE /admin/products/:id` - Hapus produk

### Pesanan
- `GET /admin/orders` - Daftar pesanan
- `PUT /admin/orders/:id/status` - Update status pesanan
- `GET /admin/orders/:id/details` - Detail pesanan
- `POST /admin/orders/:id/notify` - Kirim notifikasi
- `GET /admin/orders/:id/print` - Print pesanan

### Pengguna
- `GET /admin/users` - Daftar pengguna
- `GET /admin/users/add-form` - Form tambah pengguna
- `GET /admin/users/:id/edit-form` - Form edit pengguna
- `POST /admin/users/save` - Simpan pengguna
- `PUT /admin/users/:id/toggle-status` - Toggle status pengguna
- `DELETE /admin/users/:id` - Hapus pengguna

### Database
- `GET /admin/database` - Halaman database
- `POST /admin/database/refresh` - Refresh statistik
- `POST /admin/database/backup` - Buat backup
- `POST /admin/database/optimize` - Optimasi database
- `POST /admin/database/clean-logs` - Bersihkan logs
- `POST /admin/database/rebuild-indexes` - Rebuild indexes
- `POST /admin/database/check-integrity` - Check integrity
- `POST /admin/database/reset` - Reset database
- `POST /admin/database/export` - Export database

### Analitik
- `GET /admin/analytics` - Halaman analitik
- `POST /admin/analytics/export` - Export laporan

### Pengaturan
- `GET /admin/settings` - Halaman pengaturan
- `POST /admin/settings/save` - Simpan pengaturan
- `POST /admin/settings/reset` - Reset pengaturan
- `POST /admin/settings/backup` - Buat backup pengaturan
- `POST /admin/settings/restore` - Restore pengaturan

## Styling & UI

### CSS Framework
- **Tailwind CSS** untuk utility classes
- **Custom admin.css** untuk styling khusus admin
- **Font Awesome** untuk icons
- **Chart.js** untuk grafik

### Responsive Design
- Mobile-first approach
- Sidebar collapsible di mobile
- Tables responsive dengan horizontal scroll
- Cards layout yang adaptif

### Color Scheme
- Primary: Amber/Gold (#D4AF37)
- Secondary: Dark Brown (#2C1810)
- Success: Green (#10B981)
- Error: Red (#EF4444)
- Warning: Yellow (#F59E0B)
- Info: Blue (#3B82F6)

## Keamanan

### Autentikasi
- Session-based authentication
- Role-based access control (RBAC)
- Password hashing dengan bcrypt
- Session timeout konfigurasi

### Validasi
- Server-side validation untuk semua input
- File upload validation (type, size)
- XSS protection
- CSRF protection

### Rate Limiting
- API rate limiting
- Login attempt limiting
- Request throttling

## Monitoring & Logging

### Database Monitoring
- Real-time database stats
- Collection size tracking
- Index performance monitoring
- Query performance logging

### User Activity Logging
- Login/logout tracking
- Action logging (CRUD operations)
- Error logging
- Security event logging

## Backup & Recovery

### Automatic Backup
- Configurable backup frequency
- Local backup storage
- Backup retention policy
- Backup integrity checking

### Manual Operations
- On-demand backup creation
- Database restore functionality
- Settings backup/restore
- Data export capabilities

## Troubleshooting

### Common Issues

1. **Admin tidak bisa login**
   - Pastikan role user adalah 'admin'
   - Check session configuration
   - Verify database connection

2. **Upload gambar gagal**
   - Check file size limit (5MB)
   - Verify file type (JPG, PNG, WebP)
   - Check directory permissions

3. **Database operations gagal**
   - Check MongoDB connection
   - Verify database permissions
   - Check disk space

4. **Email tidak terkirim**
   - Verify SMTP configuration
   - Check email credentials
   - Test SMTP connection

### Debug Mode
Set environment variable `DEBUG=true` untuk enable detailed logging.

## Development

### Menambah Fitur Baru
1. Buat route di `routes/admin.js`
2. Buat view di `views/admin/`
3. Update navigation di sidebar
4. Add styling jika diperlukan
5. Update dokumentasi

### Custom Styling
Edit `public/css/admin.css` untuk custom styling admin panel.

## Support

Untuk pertanyaan atau masalah dengan admin panel, silakan:
1. Check dokumentasi ini
2. Review error logs
3. Contact developer team

---

**Version**: 1.0.0  
**Last Updated**: <%= new Date().toLocaleDateString('id-ID') %>  
**Author**: Maraneea Shop Development Team
