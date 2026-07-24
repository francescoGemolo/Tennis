import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false,
      includeAssets: ['icons/apple-touch-icon.png'],
      manifest: {
        name: 'Tennis Salandra',
        short_name: 'Tennis Salandra',
        description: 'Prenota il tuo turno al Circolo Tennis in pochi tocchi.',
        lang: 'it',
        start_url: '/Tennis/',
        scope: '/Tennis/',
        display: 'standalone',
        background_color: '#0E1116',
        theme_color: '#0E1116',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
  ],
  base: '/Tennis/',
  build: {
    chunkSizeWarningLimit: 1000
  }
})