@echo off
title Maraneea Shop - Quick Start
color 0A

:menu
cls
echo.
echo ========================================
echo    MARANEEA SHOP - QUICK START
echo ========================================
echo.
echo Pilih aksi:
echo.
echo  [1] Kill Port 3000 (Jika port sudah digunakan)
echo  [2] Build CSS Tailwind
echo  [3] Start Server (Production)
echo  [4] Dev Mode (Auto-reload)
echo  [5] Build CSS + Start Server
echo  [6] Install Dependencies
echo  [7] Open Browser (Chrome)
echo  [8] ALL-IN-ONE (Auto Setup + Open)
echo  [0] Exit
echo.
echo ========================================
echo.

set /p choice="Masukkan pilihan (0-8): "

if "%choice%"=="1" goto kill
if "%choice%"=="2" goto build
if "%choice%"=="3" goto start
if "%choice%"=="4" goto dev
if "%choice%"=="5" goto buildstart
if "%choice%"=="6" goto install
if "%choice%"=="7" goto browser
if "%choice%"=="8" goto allinone
if "%choice%"=="0" goto end
goto menu

:kill
cls
echo.
echo Membunuh process di port 3000...
taskkill /F /IM node.exe 2>nul
echo.
echo [DONE] Port 3000 bebas!
timeout /t 2 >nul
goto menu

:build
cls
echo.
echo Building CSS...
npx tailwindcss -i ./src/css/input.css -o ./public/css/style.css
echo.
echo [DONE] CSS berhasil di-build!
timeout /t 2 >nul
goto menu

:start
cls
echo.
echo Starting server...
echo.
start cmd /k "title Maraneea Shop Server && npm start"
timeout /t 2 >nul
goto menu

:dev
cls
echo.
echo Starting development mode...
echo.
start cmd /k "title Maraneea Shop - Dev Mode && npm run dev"
timeout /t 2 >nul
goto menu

:buildstart
cls
echo.
echo Step 1: Building CSS...
npx tailwindcss -i ./src/css/input.css -o ./public/css/style.css
echo.
echo Step 2: Starting server...
timeout /t 1 >nul
start cmd /k "title Maraneea Shop Server && npm start"
echo.
echo [DONE] Server started!
timeout /t 2 >nul
goto menu

:install
cls
echo.
echo Installing dependencies...
npm install
echo.
echo [DONE] Dependencies installed!
timeout /t 2 >nul
goto menu

:browser
cls
echo.
echo Opening Chrome...
set CHROME=""
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" set CHROME="C:\Program Files\Google\Chrome\Application\chrome.exe"
if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" set CHROME="C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
if exist "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe" set CHROME="%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"
if %CHROME%=="" (
    start http://localhost:3000
) else (
    start %CHROME% http://localhost:3000
)
echo [DONE] Browser opened!
timeout /t 2 >nul
goto menu

:allinone
cls
echo.
echo ========================================
echo    ALL-IN-ONE SETUP
echo ========================================
echo.
echo [1/4] Killing port 3000...
taskkill /F /IM node.exe 2>nul
echo.
echo [2/4] Building CSS...
npx tailwindcss -i ./src/css/input.css -o ./public/css/style.css
echo.
echo [3/4] Starting server...
start /MIN cmd /k "title Maraneea Shop Server && npm start"
echo.
echo [4/4] Waiting for server (5 sec)...
timeout /t 5 /nobreak >nul
echo.
echo Opening Chrome...
set CHROME=""
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" set CHROME="C:\Program Files\Google\Chrome\Application\chrome.exe"
if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" set CHROME="C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
if exist "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe" set CHROME="%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"
if %CHROME%=="" (
    start http://localhost:3000
) else (
    start %CHROME% http://localhost:3000
)
echo.
echo ========================================
echo   [DONE] Maraneea Shop Ready!
echo   URL: http://localhost:3000
echo ========================================
timeout /t 3 >nul
goto menu

:end
cls
echo.
echo Terima kasih sudah menggunakan Maraneea Shop!
echo.
timeout /t 2 >nul
exit

