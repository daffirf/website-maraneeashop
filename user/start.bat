@echo off
title Maraneea Shop - E-commerce Website

echo.
echo ========================================
echo    Maraneea Shop - E-commerce Website
echo ========================================
echo.
echo Starting Maraneea Shop...
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    echo.
)

REM Check if CSS is built
if not exist "public\css\style.css" (
    echo Building CSS...
    call npm run build:css
    echo.
)

echo Starting server...
echo.
echo Website: http://localhost:3000
echo Admin:   http://localhost:3000/admin
echo.
echo Press Ctrl+C to stop the server
echo.

call npm start

pause

