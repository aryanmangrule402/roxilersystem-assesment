// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc'; // Or @vitejs/plugin-react if you chose Babel

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // THIS SECTION IS CRITICAL FOR .js FILES CONTAINING JSX
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx', // <--- MAKE SURE THIS LINE IS PRESENT AND CORRECT
      },
    },
  },
});