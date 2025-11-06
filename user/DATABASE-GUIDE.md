# 📊 Panduan Manajemen Database - Maraneea Shop

Panduan lengkap untuk mengelola database dengan mudah melalui Admin Panel.

## 🚀 Quick Start

### Cara 1: Via Admin Panel (Paling Mudah) ⭐

1. **Login ke Admin Panel**
   - Buka: `http://localhost:3000/auth/login`
   - Email: `admin@maraneeashop.com`
   - Password: `admin123`

2. **Akses Halaman Database**
   - Setelah login, klik menu **"Database"** di sidebar
   - Atau langsung buka: `http://localhost:3000/admin/database`

3. **Seed Database dengan Data Sample**
   - Klik tombol **"Seed Database"** (hijau)
   - Konfirmasi dengan klik "OK"
   - Tunggu beberapa detik
   - Database akan otomatis terisi dengan 10 produk sample

### Cara 2: Via Command Line

```bash
# Masuk ke folder user
cd user

# Jalankan script seed
npm run seed

# Atau langsung dengan node
node scripts/seed-database.js
```

### Cara 3: Via Batch File (Windows)

Double-click file `SEED-DATABASE.bat` di folder `user/`

---

## 📋 Fitur Halaman Database

### 1. **Database Statistics**
Menampilkan informasi database:
- Ukuran database
- Total collections
- Total documents
- Total indexes

### 2. **Collection Details**
Menampilkan detail setiap collection:
- **users**: Data pengguna
- **products**: Data produk
- **orders**: Data pesanan
- **carts**: Data keranjang

### 3. **Tools Management**

#### ✅ Seed Database
- Mengisi database dengan 10 produk sample
- Kategori: Baju Muslimah, Hampers, Kue, Ramadhan & Lebaran, Aksesoris
- **PERINGATAN**: Produk yang sudah ada akan dihapus dan diganti

#### 🗑️ Hapus Semua Produk
- Menghapus semua produk dari database
- **PERINGATAN**: Tindakan ini tidak dapat dibatalkan!
- Akan ada konfirmasi ganda untuk keamanan

#### 🔄 Refresh
- Memperbarui statistik database
- Menampilkan data terbaru

#### 📥 Export Data
- Mengekspor data database (coming soon)

---

## 📦 Data Sample yang Akan Ditambahkan

Setelah seed database, akan ada **10 produk** dengan kategori:

### Baju Muslimah (2 produk)
1. Baju Muslimah Modern Set - Rp 299.000
2. Gamis Syar'i Premium - Rp 450.000

### Hampers (2 produk)
3. Hampers Lebaran Premium - Rp 599.000
4. Hampers Ramadhan Special - Rp 450.000

### Kue (2 produk)
5. Kue Nastar Premium - Rp 89.000
6. Kue Kastengel Keju - Rp 75.000

### Ramadhan & Lebaran (2 produk)
7. Paket Ramadhan Lengkap - Rp 1.299.000
8. Paket Lebaran Spesial - Rp 899.000

### Aksesoris (2 produk)
9. Kerudung Instan Premium - Rp 125.000
10. Tas Muslimah Elegan - Rp 350.000

---

## ⚠️ Catatan Penting

1. **Backup Database Sebelum Seed**
   - Jika ada data penting, backup dulu sebelum seed
   - Seed akan menghapus semua produk yang ada

2. **Admin User**
   - Script seed akan otomatis membuat admin user jika belum ada
   - Email: `admin@maraneeashop.com`
   - Password: `admin123`

3. **MongoDB Connection**
   - Pastikan MongoDB sudah terhubung
   - Cek connection string di file `.env`

---

## 🔧 Troubleshooting

### Error: "MongoDB tidak terhubung"
- Pastikan MongoDB sudah running (local atau Atlas)
- Cek connection string di file `.env`
- Restart server setelah update `.env`

### Error: "Authentication failed"
- Pastikan username dan password MongoDB Atlas benar
- Cek IP sudah di-whitelist di MongoDB Atlas

### Produk tidak muncul setelah seed
- Refresh halaman database
- Cek di halaman produk: `http://localhost:3000/products`
- Cek console server untuk error messages

---

## 📝 Langkah Selanjutnya

Setelah database terisi:

1. **Cek Produk**
   - Buka: `http://localhost:3000/products`
   - Semua produk sample sudah bisa dilihat

2. **Edit Produk**
   - Login admin → Menu "Produk"
   - Edit atau tambah produk sesuai kebutuhan

3. **Hapus Produk**
   - Via admin panel → Menu "Produk"
   - Atau gunakan tombol "Hapus Semua Produk" di halaman Database

---

## 🎯 Tips

- **Gunakan Seed Database** untuk development dan testing
- **Jangan seed di production** tanpa backup
- **Edit produk** via admin panel setelah seed untuk menyesuaikan dengan kebutuhan
- **Backup database** secara berkala

---

**Selamat menggunakan!** 🎉

Jika ada pertanyaan atau masalah, silakan cek dokumentasi lainnya atau hubungi support.

