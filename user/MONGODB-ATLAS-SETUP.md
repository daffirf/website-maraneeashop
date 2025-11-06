# 🗄️ Setup MongoDB Atlas - Langkah Demi Langkah

## ✅ Langkah 1: Tunggu Cluster Selesai (SEDANG BERLANGSUNG)
- Tunggu sampai proses "Loading sample dataset" selesai
- Status cluster akan berubah menjadi "Active" (hijau)
- Biasanya memakan waktu 1-3 menit

---

## 📝 Langkah 2: Setup Database User

1. **Klik "Security" di sidebar kiri** → **"Database Access"**
2. **Klik tombol "Add New Database User"** (atau "Create Database User")
3. **Isi form:**
   - **Authentication Method**: Password
   - **Username**: `maraneea-admin` (atau username yang Anda inginkan)
   - **Password**: Buat password yang kuat (simpan password ini!)
   - **Database User Privileges**: Pilih **"Atlas admin"** (memberikan akses penuh)
4. **Klik "Add User"**

---

## 🌐 Langkah 3: Whitelist IP Address

1. **Klik "Security" di sidebar kiri** → **"Network Access"**
2. **Klik "Add IP Address"**
3. **Pilih salah satu:**
   - **Opsi A (Development)**: Klik **"Allow Access from Anywhere"**
     - IP Address: `0.0.0.0/0`
     - Comment: "Development - Allow all IPs"
   - **Opsi B (Lebih Aman)**: Tambahkan IP Anda saat ini
     - Klik "Add Current IP Address"
4. **Klik "Confirm"**

---

## 🔗 Langkah 4: Dapatkan Connection String

1. **Kembali ke "Database"** → **"Clusters"**
2. **Klik tombol "Connect"** pada cluster Anda (Cluster0)
3. **Pilih "Connect your application"**
4. **Driver**: Pilih **"Node.js"** dan versi **"5.5 or later"**
5. **Copy connection string** yang muncul
   - Format: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
6. **Ganti `<username>` dan `<password>`** dengan:
   - Username: username yang Anda buat di Langkah 2
   - Password: password yang Anda buat di Langkah 2
7. **Tambahkan nama database** di akhir:
   - Tambahkan `/maraneea-shop` sebelum `?retryWrites`
   - Contoh final: `mongodb+srv://maraneea-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/maraneea-shop?retryWrites=true&w=majority`

---

## ⚙️ Langkah 5: Update File .env

1. **Buka file `.env`** di folder `user/`
2. **Cari atau tambahkan baris:**
   ```env
   MONGODB_URI=mongodb+srv://maraneea-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/maraneea-shop?retryWrites=true&w=majority
   ```
3. **Ganti:**
   - `maraneea-admin` → username yang Anda buat
   - `YOUR_PASSWORD` → password yang Anda buat
   - `cluster0.xxxxx.mongodb.net` → connection string dari Atlas
4. **Simpan file**

---

## 🔄 Langkah 6: Restart Server

1. **Stop server** (jika sedang berjalan):
   - Tekan `Ctrl+C` di terminal server
   - Atau kill process: `taskkill /F /IM node.exe`

2. **Start server lagi:**
   ```bash
   cd user
   npm start
   ```
   Atau gunakan: `npm run dev` untuk development mode

---

## 👤 Langkah 7: Buat Admin User

1. **Buka browser** dan kunjungi:
   ```
   http://localhost:3000/setup/setup-admin
   ```

2. **Halaman akan otomatis membuat admin user**

3. **Login dengan credentials:**
   - **Email**: `admin@maraneeashop.com`
   - **Password**: `admin123`

4. **Setelah login**, akses admin panel:
   ```
   http://localhost:3000/admin
   ```

---

## ✅ Checklist

- [ ] Cluster MongoDB Atlas sudah aktif (hijau)
- [ ] Database user sudah dibuat
- [ ] IP address sudah di-whitelist
- [ ] Connection string sudah di-copy
- [ ] File `.env` sudah di-update dengan connection string
- [ ] Server sudah di-restart
- [ ] Admin user sudah dibuat via `/setup/setup-admin`
- [ ] Bisa login ke admin panel

---

## 🆘 Troubleshooting

### Error: "Authentication failed"
- Pastikan username dan password di connection string benar
- Pastikan user sudah dibuat dengan role "Atlas admin"

### Error: "IP not whitelisted"
- Pastikan IP sudah di-whitelist di Network Access
- Gunakan `0.0.0.0/0` untuk development

### Error: "Connection timeout"
- Pastikan cluster sudah aktif (hijau)
- Cek koneksi internet
- Coba connection string lagi

---

**Selamat! MongoDB Atlas sudah siap digunakan!** 🎉

