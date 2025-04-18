import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { readFileSync } from 'fs';
import path, { resolve } from 'path';
import os from 'os';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';

  return {
    base: '/',
    plugins: [
      tailwindcss(),
      // Allows using React dev server along with building a React application with Vite.
      react(),
      // Allows using the compilerOptions.paths property in tsconfig.json.
      tsconfigPaths(),
      // Only use mkcert in development mode, if needed
      // process.env.HTTPS && !isProd && mkcert(),
    ],
    publicDir: './public',
    server: {
      https: {
        cert: readFileSync(resolve(os.homedir(), 'tma.internal.pem')),
        key: readFileSync(resolve(os.homedir(), 'tma.internal-key.pem')),
      },
      allowedHosts: ["pleasing-louse-dynamic.ngrok-free.app", "alesanrad1.loca.lt"],

      // Development-only settings
      host: true,
      // Remove HTTPS configuration for Vercel deployment
    },
    build: {
      // Recommended for better production builds
      sourcemap: false,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: isProd,
          drop_debugger: isProd,
        },
      },
    },
  };
});
