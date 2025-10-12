@echo off
echo ========================================
echo    Maraneea Shop - E-commerce Website
echo ========================================
echo.

echo Installing dependencies...
call npm install

echo.
echo Building CSS...
call npm run build:css

echo.
echo Starting server...
echo Website will be available at: http://localhost:3000
echo Admin panel: http://localhost:3000/admin
echo.
echo Press Ctrl+C to stop the server
echo.

call npm start

pause

