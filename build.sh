#!/bin/bash
set -e

echo "Installing root dependencies..."
npm install

echo "Building React app..."
cd react-app
npm install
npm run build
cd ..

echo "Build complete!"
