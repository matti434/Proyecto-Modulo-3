import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/estilos/variables.css";`
      }
    }
  },
  build: {
    rollupOptions: {
      input: './index.html'
    }
  },
  server: {
    historyApiFallback: true
  }
})
