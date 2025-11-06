@echo off
echo ========================================
echo   Start MongoDB - Maraneea Shop
echo ========================================
echo.

REM Cek apakah MongoDB sudah terinstall
where mongod >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] MongoDB tidak ditemukan!
    echo.
    echo Silakan install MongoDB terlebih dahulu:
    echo 1. Download dari: https://www.mongodb.com/try/download/community
    echo 2. Install MongoDB Community Edition
    echo 3. Atau gunakan MongoDB Atlas (cloud) - GRATIS
    echo.
    pause
    exit /b 1
)

echo [1/2] Menjalankan MongoDB...
echo.

REM Cek apakah MongoDB sudah berjalan
netstat -ano | findstr :27017 >nul 2>&1
if %errorlevel% equ 0 (
    echo [INFO] MongoDB sudah berjalan di port 27017
    echo.
    echo MongoDB siap digunakan!
    pause
    exit /b 0
)

REM Coba start MongoDB sebagai service
net start MongoDB >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] MongoDB service started!
    echo.
    echo MongoDB siap digunakan!
    pause
    exit /b 0
)

REM Jika service tidak ada, coba jalankan langsung
echo [INFO] Mencoba menjalankan MongoDB secara manual...
echo.

REM Cek lokasi default MongoDB
set MONGODB_PATH=""
if exist "C:\Program Files\MongoDB\Server\*\bin\mongod.exe" (
    for /f "delims=" %%i in ('dir /b /s "C:\Program Files\MongoDB\Server\*\bin\mongod.exe"') do set MONGODB_PATH=%%i
)

if "%MONGODB_PATH%"=="" (
    echo [ERROR] MongoDB executable tidak ditemukan!
    echo.
    echo Silakan install MongoDB atau gunakan MongoDB Atlas (cloud)
    echo Download: https://www.mongodb.com/try/download/community
    echo.
    pause
    exit /b 1
)

echo [INFO] Menjalankan MongoDB dari: %MONGODB_PATH%
echo.
echo MongoDB akan berjalan di background...
echo Tekan Ctrl+C untuk stop MongoDB
echo.

start "MongoDB Server" /MIN "%MONGODB_PATH%" --dbpath "C:\data\db"

timeout /t 3 /nobreak >nul

netstat -ano | findstr :27017 >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] MongoDB berhasil dijalankan!
    echo.
    echo MongoDB siap digunakan di port 27017
) else (
    echo [WARNING] MongoDB mungkin belum siap, tunggu beberapa detik...
    echo.
    echo Jika masih error, pastikan folder C:\data\db sudah ada
    echo atau buat folder tersebut secara manual
)

echo.
pause

