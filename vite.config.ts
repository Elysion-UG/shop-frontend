import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';  // Tailwind Vite-Plugin importieren

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      crypto: 'crypto-browserify', // Use the crypto-browserify polyfill
      stream: 'stream-browserify',  // Use stream-browserify polyfill
    },
  },
  plugins: [
    react(),
    tailwindcss(),  // Tailwind Vite-Plugin einbinden
  ]
})
