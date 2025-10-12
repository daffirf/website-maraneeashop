# 🚀 Quick Start - Maraneea Shop

Panduan cepat untuk menjalankan website Maraneea Shop di komputer Anda.

## 📋 Prerequisites

Pastikan Anda sudah menginstall:
- **Node.js** (versi 14 atau lebih baru) - [Download di sini](https://nodejs.org/)
- **MongoDB** (opsional, bisa menggunakan MongoDB Atlas) - [Download di sini](https://www.mongodb.com/try/download/community)

## ⚡ Cara Cepat (Windows)

1. **Double-click file `install.bat`** untuk menginstall semua dependencies
2. **Double-click file `start.bat`** untuk menjalankan website
3. Buka browser dan kunjungi: **http://localhost:3000**

## 🛠️ Cara Manual

### 1. Install Dependencies
```bash
npm install
```

### 2. Build CSS
```bash
npm run build:css
```

### 3. Setup Environment
```bash
# Copy file environment
copy env.example .env

# Edit file .env dan sesuaikan konfigurasi
```

### 4. Jalankan Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 🌐 Akses Website

- **Website Utama**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **Login Admin**: Buat akun admin melalui database atau registrasi

## 📱 Fitur yang Tersedia

### ✅ Sudah Siap
- ✅ Landing page yang menarik
- ✅ Katalog produk dengan filter
- ✅ Sistem keranjang belanja
- ✅ Halaman login/register
- ✅ Admin panel untuk manajemen produk
- ✅ Responsive design (mobile-friendly)
- ✅ Search dan filter produk

### 🔄 Dalam Pengembangan
- 🔄 Sistem checkout dan pembayaran
- 🔄 Integrasi dengan Shopee/Tokopedia
- 🔄 Halaman user profile
- 🔄 Sistem review produk

## 🎨 Kustomisasi

### Mengubah Warna Theme
Edit file `tailwind.config.js`:
```javascript
colors: {
  primary: {
    500: '#8B5A2B', // Ganti dengan warna yang diinginkan
  }
}
```

### Mengubah Logo
- Ganti file di `public/images/`
- Update referensi di `views/layout.ejs`

## 🐛 Troubleshooting

### Error "Cannot find module"
```bash
npm install
```

### Error "MongoDB connection failed"
- Pastikan MongoDB berjalan
- Atau gunakan MongoDB Atlas (cloud)

### Error "Port 3000 already in use"
- Ganti port di file `.env`
- Atau matikan aplikasi yang menggunakan port 3000

### CSS tidak muncul
```bash
npm run build:css
```

## 📞 Bantuan

Jika mengalami masalah:
1. Cek file `README.md` untuk dokumentasi lengkap
2. Pastikan semua dependencies terinstall
3. Cek log error di terminal

## 🎉 Selamat!

Website Maraneea Shop Anda sudah siap digunakan! 

**Happy Coding! 🛍️✨**

