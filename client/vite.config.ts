import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: false,
    // Backend (server/index.js, port 4001) ga so'rovlarni olib o'tkazish:
    // shu tufayli brauzerdagi /api/* va /socket.io/* to'g'ridan-to'g'ri
    // ishlaydi — client kodida qo'shimcha o'zgarish talab qilinmaydi.
    proxy: {
      '/api': {
        target: 'http://localhost:4001',
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'http://localhost:4001',
        ws: true,
        changeOrigin: true,
      },
    },
  },
})

