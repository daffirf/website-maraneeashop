# 🗄️ Setup MongoDB untuk Maraneea Shop

## Opsi 1: MongoDB Local (Windows)

### Install MongoDB Community Edition

1. **Download MongoDB**
   - Kunjungi: https://www.mongodb.com/try/download/community
   - Pilih Windows x64
   - Download dan install

2. **Setup MongoDB**
   - Install dengan default settings
   - MongoDB akan terinstall sebagai Windows Service

3. **Start MongoDB**
   - Double-click file `START-MONGODB.bat` di folder `user/`
   - Atau jalankan: `net start MongoDB`
   - Atau buka Services (services.msc) dan start "MongoDB"

4. **Verifikasi**
   - MongoDB berjalan di port 27017
   - Cek dengan: `netstat -ano | findstr :27017`

### Manual Start (jika service tidak ada)

```bash
# Buat folder data (jika belum ada)
mkdir C:\data\db

# Jalankan MongoDB
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath C:\data\db
```

---

## Opsi 2: MongoDB Atlas (Cloud - GRATIS) ⭐ RECOMMENDED

### Keuntungan:
- ✅ Tidak perlu install MongoDB
- ✅ Gratis (512MB storage)
- ✅ Otomatis backup
- ✅ Bisa diakses dari mana saja

### Setup MongoDB Atlas:

1. **Buat Akun**
   - Kunjungi: https://www.mongodb.com/cloud/atlas/register
   - Buat akun gratis

2. **Buat Cluster**
   - Pilih "Build a Database" → "Free" (M0)
   - Pilih region terdekat (Singapore/Jakarta)
   - Klik "Create"

3. **Setup Database User**
   - Klik "Database Access" → "Add New Database User"
   - Username: `maraneea-admin`
   - Password: buat password yang kuat
   - Role: "Atlas admin"
   - Klik "Add User"

4. **Whitelist IP**
   - Klik "Network Access" → "Add IP Address"
   - Klik "Allow Access from Anywhere" (untuk development)
   - Atau tambahkan IP Anda: `0.0.0.0/0`
   - Klik "Confirm"

5. **Dapatkan Connection String**
   - Klik "Connect" pada cluster Anda
   - Pilih "Connect your application"
   - Copy connection string
   - Format: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

6. **Update .env File**
   ```env
   MONGODB_URI=mongodb+srv://maraneea-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/maraneea-shop?retryWrites=true&w=majority
   ```

---

## Opsi 3: Docker (Alternatif)

Jika Anda punya Docker:

```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

---

## ✅ Verifikasi MongoDB Berjalan

Setelah MongoDB berjalan, cek dengan:

```bash
# Windows
netstat -ano | findstr :27017

# Atau test connection
mongosh
```

Jika berhasil, akan muncul prompt MongoDB shell.

---

## 🔧 Troubleshooting

### Error: "Port 27017 already in use"
- MongoDB sudah berjalan
- Tidak perlu start lagi

### Error: "Cannot connect to MongoDB"
- Pastikan MongoDB service berjalan
- Cek firewall settings
- Untuk Atlas: pastikan IP sudah di-whitelist

### Error: "Database path not found"
- Buat folder: `C:\data\db`
- Atau gunakan path lain: `mongod --dbpath D:\mongodb\data`

---

## 📝 Setelah MongoDB Berjalan

1. Restart server: `npm start` atau `npm run dev`
2. Buka: `http://localhost:3000/setup/setup-admin`
3. Admin akan dibuat otomatis

**Default Admin Credentials:**
- Email: `admin@maraneeashop.com`
- Password: `admin123`

---

## 🎯 Quick Start (MongoDB Atlas)

1. Buat akun di https://www.mongodb.com/cloud/atlas/register
2. Buat cluster gratis
3. Setup user dan whitelist IP
4. Copy connection string
5. Update `.env` dengan connection string
6. Restart server
7. Buka `http://localhost:3000/setup/setup-admin`

**Selesai!** 🎉

