#!/bin/bash
set -e

echo "Installing root dependencies..."
NODE_ENV=development npm install --legacy-peer-deps

echo "Building React app..."
cd react-app
NODE_ENV=development npm install --legacy-peer-deps
npm run build
cd ..

echo "Build complete!"
