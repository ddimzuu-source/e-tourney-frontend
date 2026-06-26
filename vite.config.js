import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Membuat alias '@' mengarah ke folder components agar import file lebih mudah
      '@': path.resolve(__dirname, './components'),
    },
  },
  server: {
    port: 3000, // Menentukan port default lokal jika nanti kamu iseng ingin menyalakannya
  },
});