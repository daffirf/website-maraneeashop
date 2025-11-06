# 🔗 Cara Mendapatkan MongoDB Connection String

## Langkah-langkah:

1. **Di modal "Connect to your application", klik opsi "Drivers"** (ikon kotak hijau dengan kode "1011")

2. **Pilih Driver:**
   - Driver: **Node.js**
   - Version: **5.5 or later** (atau versi terbaru)

3. **Copy Connection String:**
   - Akan muncul connection string seperti ini:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

4. **Edit Connection String:**
   - Ganti `<username>` dengan username database user yang Anda buat (misal: `maraneea-admin`)
   - Ganti `<password>` dengan password database user yang Anda buat
   - **PENTING:** Tambahkan nama database sebelum `?retryWrites`
     - Dari: `...mongodb.net/?retryWrites...`
     - Menjadi: `...mongodb.net/maraneea-shop?retryWrites...`

5. **Contoh Connection String Final:**
   ```
   mongodb+srv://maraneea-admin:password123@cluster0.xxxxx.mongodb.net/maraneea-shop?retryWrites=true&w=majority
   ```

6. **Simpan connection string ini** - akan digunakan untuk update file `.env`

---

## Setelah Mendapatkan Connection String:

1. Kirimkan connection string yang sudah diedit ke saya
2. Saya akan membantu:
   - Membuat/update file `.env`
   - Restart server
   - Membuat admin user

