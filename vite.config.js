import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
const path = require('path')
export default defineConfig({
  resolve: {
    alias: {
      'react': path.posix.resolve('src/react'),
      'react-dom': path.posix.resolve('src/react-dom'),
      'react-reconciler': path.posix.resolve('src/react-reconciler'),
      'scheduler': path.posix.resolve('src/scheduler'),
      'shared': path.posix.resolve('src/shared'),
    }
  },
  // optimizeDeps: {
  //   include: ['src']
  // },
  // server: { hmr: true },
  plugins: [
    react()
  ],

})