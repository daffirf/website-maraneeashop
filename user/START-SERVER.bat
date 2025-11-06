@echo off
echo ========================================
echo    Maraneea Shop - Start Server
echo ========================================
echo.
echo Starting server...
echo.
cd /d "%~dp0"
node server.js
echo.
echo Server stopped.
pause

