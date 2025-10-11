# 🚀 Maraneea Shop - Quick Commands Cheatsheet

## 📦 File Batch (Double-Click untuk Jalankan)

### 🎯 **QUICK-START.bat** ⭐ (RECOMMENDED)
Menu interaktif untuk semua commands. **PALING MUDAH!**

### 1️⃣ **1-KILL-PORT.bat**
Membunuh process yang menggunakan port 3000

### 2️⃣ **2-BUILD-CSS.bat**
Compile Tailwind CSS

### 3️⃣ **3-START-SERVER.bat**
Jalankan server production

### 4️⃣ **4-DEV-MODE.bat**
Jalankan development mode (auto-reload)

---

## 💻 Command Line (PowerShell/CMD)

### 🔴 Kill Port 3000
```powershell
# Kill semua Node.js process
taskkill /F /IM node.exe

# Atau kill spesifik PID
netstat -ano | findstr :3000
taskkill /F /PID <nomor_PID>
```

### 🎨 Build CSS
```bash
# Build sekali
npx tailwindcss -i ./src/css/input.css -o ./public/css/style.css

# Build dengan watch mode (auto-rebuild)
npm run build:css

# Build minified (production)
npx tailwindcss -i ./src/css/input.css -o ./public/css/style.css --minify
```

### 🚀 Start Server
```bash
# Production mode
npm start

# Development mode (auto-reload)
npm run dev
```

### 📦 Install Dependencies
```bash
# Install semua packages
npm install

# Install package tertentu
npm install <package-name>
```

---

## ⚡ One-Liner Commands

### 🔥 Kill Port + Build + Start
```bash
taskkill /F /IM node.exe && npx tailwindcss -i ./src/css/input.css -o ./public/css/style.css && npm start
```

### 🎨 Quick Build
```bash
npx tailwindcss -i ./src/css/input.css -o ./public/css/style.css
```

### 🌐 Open Browser
```bash
start http://localhost:3000
```

---

## 🐛 Troubleshooting Commands

### Port Already in Use
```bash
# Cek port 3000
netstat -ano | findstr :3000

# Kill process
taskkill /F /PID <PID>
```

### CSS Tidak Update
```bash
# Clear cache & rebuild
del public\css\style.css
npx tailwindcss -i ./src/css/input.css -o ./public/css/style.css
```

### Server Error
```bash
# Restart server
Ctrl+C (stop)
npm start (restart)
```

### Clean Install
```bash
# Hapus node_modules
rmdir /s /q node_modules

# Install ulang
npm install
```

---

## 📱 URLs Penting

```
Homepage:    http://localhost:3000
Products:    http://localhost:3000/products
Cart:        http://localhost:3000/cart
Login:       http://localhost:3000/auth/login
Admin:       http://localhost:3000/admin
```

---

## 🎯 Workflow Recommended

### Pertama Kali Setup
```bash
1. npm install
2. npx tailwindcss -i ./src/css/input.css -o ./public/css/style.css
3. npm start
```

### Development Harian
```bash
1. taskkill /F /IM node.exe (jika perlu)
2. npm run dev
```

### Production Deploy
```bash
1. npm install --production
2. npx tailwindcss -i ./src/css/input.css -o ./public/css/style.css --minify
3. npm start
```

---

## 🔧 npm Scripts Available

```json
{
  "start": "node server.js",
  "dev": "nodemon server.js",
  "build": "npm run build:css",
  "build:css": "tailwindcss -i ./src/css/input.css -o ./public/css/style.css --watch"
}
```

---

## 🎨 Tailwind Commands

### Build Modes
```bash
# Normal build
npx tailwindcss -i ./src/css/input.css -o ./public/css/style.css

# Watch mode (auto-rebuild saat ada perubahan)
npx tailwindcss -i ./src/css/input.css -o ./public/css/style.css --watch

# Minified (production)
npx tailwindcss -i ./src/css/input.css -o ./public/css/style.css --minify

# Minified + watch
npx tailwindcss -i ./src/css/input.css -o ./public/css/style.css --watch --minify
```

---

## 🔍 Debug Commands

### Check Node Version
```bash
node --version
npm --version
```

### Check Running Processes
```bash
# Windows
tasklist | findstr node

# Check specific port
netstat -ano | findstr :3000
```

### View Logs
```bash
# Run with verbose logging
DEBUG=* npm start
```

---

## 🎯 Quick Tips

1. **Gunakan QUICK-START.bat** untuk kemudahan
2. **Build CSS dulu** sebelum start server pertama kali
3. **Kill port** jika server error (port sudah digunakan)
4. **Dev mode** untuk development (auto-reload)
5. **Production mode** untuk testing final

---

## 📞 Bantuan Cepat

### Port 3000 Sudah Digunakan?
```bash
taskkill /F /IM node.exe
```

### CSS Tidak Load?
```bash
npx tailwindcss -i ./src/css/input.css -o ./public/css/style.css
```

### Server Crash?
```bash
Ctrl+C
npm start
```

### Dependencies Error?
```bash
rm -rf node_modules
npm install
```

---

**💡 TIP: Bookmark file ini untuk referensi cepat!**

**🎉 Happy Coding!** 🚀

