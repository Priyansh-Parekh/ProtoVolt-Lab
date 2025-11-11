import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  css: {
    // 👇 Force Vite to use PostCSS instead of LightningCSS (fixes build on Vercel)
    transformer: 'postcss',
  },
})
