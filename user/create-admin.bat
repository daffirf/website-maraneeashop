@echo off
echo ========================================
echo   Create Admin User - Maraneea Shop
echo ========================================
echo.

cd /d "%~dp0"

if not exist "scripts\create-admin.js" (
    echo Error: Script create-admin.js not found!
    pause
    exit /b 1
)

echo Creating admin user...
echo.
node scripts/create-admin.js

echo.
pause

