@echo off
title Maraneea Shop - All-in-One Launcher
color 0E

echo.
echo ========================================
echo    MARANEEA SHOP - ALL IN ONE
echo ========================================
echo.
echo Menjalankan semua proses otomatis...
echo.

REM Step 1: Kill Port
echo [1/4] Membunuh process di port 3000...
taskkill /F /IM node.exe 2>nul
if %errorlevel% equ 0 (
    echo       [OK] Port 3000 berhasil dibersihkan
) else (
    echo       [OK] Port 3000 sudah bersih
)
echo.

REM Step 2: Build CSS
echo [2/4] Building Tailwind CSS...
npx tailwindcss -i ./src/css/input.css -o ./public/css/style.css 2>nul
if %errorlevel% equ 0 (
    echo       [OK] CSS berhasil di-build
) else (
    echo       [WARNING] Build CSS gagal, coba manual
)
echo.

REM Step 3: Start Server
echo [3/4] Starting server...
start /MIN cmd /k "title Maraneea Shop Server && color 0A && npm start"
echo       [OK] Server started di background
echo.

REM Step 4: Wait & Open Browser
echo [4/4] Menunggu server siap (5 detik)...
timeout /t 5 /nobreak >nul
echo       [OK] Membuka Chrome...
echo.

REM Cari Chrome
set CHROME=""
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    set CHROME="C:\Program Files\Google\Chrome\Application\chrome.exe"
)
if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
    set CHROME="C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
)
if exist "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe" (
    set CHROME="%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"
)

REM Buka browser
if %CHROME%=="" (
    start http://localhost:3000
) else (
    start %CHROME% http://localhost:3000
)

echo ========================================
echo.
echo   [SELESAI] Maraneea Shop Siap!
echo.
echo   URL: http://localhost:3000
echo.
echo   Server berjalan di background
echo   Tekan Ctrl+C di window server untuk stop
echo.
echo ========================================
echo.
pause

