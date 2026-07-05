#!/bin/bash
set -e

echo "Installing root dependencies..."
npm install --legacy-peer-deps

echo "Building React app..."
cd react-app
npm install --legacy-peer-deps
npm run build
cd ..

echo "Build complete!"
