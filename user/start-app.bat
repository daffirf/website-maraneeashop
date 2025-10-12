@echo off
echo ========================================
echo    MARANEEA SHOP - E-COMMERCE WEBSITE
echo ========================================
echo.
echo Starting the application...
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    echo.
)

REM Check if .env file exists
if not exist ".env" (
    echo Creating .env file from template...
    copy "env.example" ".env"
    echo.
    echo Please edit .env file with your configuration before running again.
    pause
    exit /b 1
)

REM Build CSS
echo Building CSS...
call npm run build:css

REM Start the application
echo Starting server...
echo.
echo Server will be available at: http://localhost:3000
echo Press Ctrl+C to stop the server
echo.
call npm start

pause

