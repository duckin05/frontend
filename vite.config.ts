import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const blockchainDataPath = path.resolve(__dirname, '../backend/blockchain_data.json')

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Serve blockchain_data.json trực tiếp từ disk để kiểm tra integrity
    {
      name: 'blockchain-data-endpoint',
      configureServer(server) {
        server.middlewares.use('/blockchain-data', (_req, res) => {
          try {
            const data = fs.readFileSync(blockchainDataPath, 'utf-8')
            res.setHeader('Content-Type', 'application/json')
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
            res.setHeader('Pragma', 'no-cache')
            res.end(data)
          } catch {
            res.statusCode = 404
            res.end(JSON.stringify({ error: 'blockchain_data.json not found' }))
          }
        })
      },
    },
  ],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
