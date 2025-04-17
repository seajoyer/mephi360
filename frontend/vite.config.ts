import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

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
