@echo off
echo ========================================
echo    Maraneea Shop - Seed Database
echo ========================================
echo.
echo Mengisi database dengan data sample...
echo.
cd user && node scripts/seed-database.js
echo.
echo [DONE] Database seeding selesai.
echo.
pause

