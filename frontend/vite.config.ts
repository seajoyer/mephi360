import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react-swc';
import mkcert from 'vite-plugin-mkcert';
import tailwindcss from '@tailwindcss/vite';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import os from 'os';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/mephi360',
  plugins: [
    tailwindcss(),
    // Allows using React dev server along with building a React application with Vite.
    // https://npmjs.com/package/@vitejs/plugin-react-swc
    react(),
    // Allows using the compilerOptions.paths property in tsconfig.json.
    // https://www.npmjs.com/package/vite-tsconfig-paths
    tsconfigPaths(),
    // Creates a custom SSL certificate valid for the local machine.
    // Using this plugin requires admin rights on the first dev-mode launch.
    // https://www.npmjs.com/package/vite-plugin-mkcert
    process.env.HTTPS && mkcert(),
  ],
  publicDir: './public',
  server: {
    // Exposes your dev server and makes it accessible for the devices in the same network.
    host: true,
    https: {
      cert: readFileSync(resolve(os.homedir(),'tma.internal.pem')),
      key: readFileSync(resolve(os.homedir(), 'tma.internal-key.pem')),
    },
    allowedHosts: ["pleasing-louse-dynamic.ngrok-free.app"]
  },
});

