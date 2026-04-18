import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // This allows Codespaces to expose the port
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true // Better for cloud environments like Codespaces
    }
  }
})