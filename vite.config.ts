import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: '/',
  build: {
    sourcemap: true,
  },
  optimizeDeps: {
    exclude: mode === 'production' ? [] : ['@pomsky-lang/compiler-web'],
  },
}))
