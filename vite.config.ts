import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Permite instalarla en la tablet como una app y usarla sin conexión.
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icono.svg', 'alumnos/*'],
      // La música no se guarda para usar sin conexión (pesa mucho) y sus créditos se abren tal cual.
      workbox: { navigateFallbackDenylist: [/^\/musica\//] },
      manifest: {
        name: 'Eón',
        short_name: 'Eón',
        description: 'Un viaje por el conocimiento, a través del espacio y del tiempo',
        lang: 'es',
        display: 'standalone',
        background_color: '#060918',
        theme_color: '#060918',
        icons: [{ src: 'icono.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }],
      },
    }),
  ],
  test: { include: ['src/**/*.test.ts'] },
})
