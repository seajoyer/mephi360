// A simple script to check if all dependencies needed for Vercel deployment are properly configured
// Save this as check-deps.js and run with: node check-deps.js

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Checking project configuration for Vercel deployment...\n');

// Check if package.json exists
try {
  const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  console.log('✅ package.json found');

  // Check build script
  if (packageJson.scripts && packageJson.scripts.build) {
    console.log(`✅ Build script found: "${packageJson.scripts.build}"`);
  } else {
    console.log('⚠️ WARNING: No build script found in package.json. Add a "build" script.');
  }

  // Check dependencies
  const deps = {...packageJson.dependencies, ...packageJson.devDependencies};

  if (deps.vite) {
    console.log(`✅ Vite found: version ${deps.vite}`);
  } else {
    console.log('⚠️ WARNING: Vite not found in dependencies. It may be necessary for the build process.');
  }

  if (deps.react && deps['react-dom']) {
    console.log(`✅ React found: version ${deps.react}`);
  } else {
    console.log('⚠️ WARNING: React or react-dom not found in dependencies.');
  }

  if (deps.typescript) {
    console.log(`✅ TypeScript found: version ${deps.typescript}`);
  } else {
    console.log('⚠️ WARNING: TypeScript not found in dependencies. It may be needed for type checking during build.');
  }

  // Check for potential issues
  if (deps['react-router-dom']) {
    console.log(`✅ React Router found: version ${deps['react-router-dom']}`);
    console.log('   Make sure vercel.json has proper rewrites for client-side routing.');
  }

} catch (error) {
  console.log('❌ ERROR: package.json not found or invalid');
  console.log(error.message);
}

// Check for index.html
try {
  if (fs.existsSync('./index.html')) {
    console.log('✅ index.html found in root directory');
  } else if (fs.existsSync('./public/index.html')) {
    console.log('✅ index.html found in public directory');
  } else {
    console.log('⚠️ WARNING: index.html not found in expected locations');
  }
} catch (error) {
  console.log('❌ ERROR: Error checking for index.html');
  console.log(error.message);
}

// Check for vercel.json
try {
  if (fs.existsSync('./vercel.json')) {
    console.log('✅ vercel.json found');
    const vercelConfig = JSON.parse(fs.readFileSync('./vercel.json', 'utf8'));

    // Check for rewrites for SPA
    if (vercelConfig.rewrites && vercelConfig.rewrites.length > 0) {
      console.log('✅ Rewrites configuration found in vercel.json');
    } else {
      console.log('⚠️ WARNING: No rewrites found in vercel.json. Client-side routing may not work.');
    }
  } else {
    console.log('⚠️ WARNING: vercel.json not found. This file is recommended for proper configuration.');
  }
} catch (error) {
  console.log('❌ ERROR: Error checking for vercel.json');
  console.log(error.message);
}

// Check for vite.config.js or vite.config.ts
try {
  if (fs.existsSync('./vite.config.js') || fs.existsSync('./vite.config.ts')) {
    console.log('✅ Vite configuration file found');
  } else {
    console.log('⚠️ WARNING: vite.config.js or vite.config.ts not found');
  }
} catch (error) {
  console.log('❌ ERROR: Error checking for Vite configuration');
  console.log(error.message);
}

// Check for environment variables
try {
  const envFiles = ['.env', '.env.production', '.env.local'];
  const foundEnvFiles = envFiles.filter(file => fs.existsSync(`./${file}`));

  if (foundEnvFiles.length > 0) {
    console.log(`✅ Environment files found: ${foundEnvFiles.join(', ')}`);
    console.log('   Remember to add these environment variables in Vercel project settings');
  } else {
    console.log('ℹ️ INFO: No environment files found. If your app needs environment variables, add them in Vercel.');
  }
} catch (error) {
  console.log('❌ ERROR: Error checking for environment files');
  console.log(error.message);
}

// Try to run a local build
console.log('\n📦 Attempting a dry-run build (this may take a minute)...');
try {
  execSync('npm run build --dry-run', { stdio: 'ignore' });
  console.log('✅ Build command executed successfully');
} catch (error) {
  console.log('⚠️ WARNING: Build command failed with the following error:');
  console.log(error.message);
}

console.log('\n🚀 Deployment Readiness Summary:');
console.log('- Make sure your repository is pushed to GitHub, GitLab, or Bitbucket');
console.log('- Sign up or log in to Vercel (https://vercel.com)');
console.log('- Import your repository and configure the deployment settings');
console.log('- If you have environment variables, add them in the Vercel project settings');
console.log('- Deploy your application');
console.log('\nRefer to the deployment guide for detailed instructions.');
