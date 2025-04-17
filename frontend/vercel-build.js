#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Log build environment
console.log('Starting Vercel build process...');
console.log(`Node version: ${process.version}`);
console.log(`Current directory: ${process.cwd()}`);

try {
  // Skip TypeScript checking for production builds on Vercel
  console.log('Running Vite build without TypeScript checking...');
  execSync('vite build', { stdio: 'inherit' });

  console.log('Build completed successfully!');
  process.exit(0);
} catch (error) {
  console.error('Build failed with error:', error);
  process.exit(1);
}
