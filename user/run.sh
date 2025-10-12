#!/bin/bash

echo "========================================"
echo "   Maraneea Shop - E-commerce Website"
echo "========================================"
echo

echo "Installing dependencies..."
npm install

echo
echo "Building CSS..."
npm run build:css

echo
echo "Starting server..."
echo "Website will be available at: http://localhost:3000"
echo "Admin panel: http://localhost:3000/admin"
echo
echo "Press Ctrl+C to stop the server"
echo

npm start
