@echo off
title Maraneea Shop - Install Dependencies

echo.
echo ========================================
echo    Maraneea Shop - Install Dependencies
echo ========================================
echo.

echo Installing Node.js dependencies...
call npm install

echo.
echo Installing Tailwind CSS dependencies...
call npm install -D tailwindcss@latest postcss@latest autoprefixer@latest

echo.
echo Building CSS...
call npm run build:css

echo.
echo ========================================
echo    Installation Complete!
echo ========================================
echo.
echo To start the server, run: start.bat
echo Or manually run: npm start
echo.
echo Website will be available at: http://localhost:3000
echo Admin panel: http://localhost:3000/admin
echo.

pause









