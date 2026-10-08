import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { browserslistToTargets, transform } from 'lightningcss'
import browserslist from 'browserslist'
import type { Plugin } from 'vite'

// Navegadores en los que debe funcionar: también móviles con unos años (Navegador Mi, Chrome antiguos).
const NAVEGADORES = ['chrome >= 79', 'edge >= 79', 'firefox >= 78', 'safari >= 13', 'ios >= 13', 'samsung >= 12']

/** Quita los bloques @layer dejando su contenido en el mismo orden: antes de Chrome 99 se ignora todo lo que va dentro. */
function sinCapas(css: string): string {
  let sal = ''
  let i = 0
  while (i < css.length) {
    const j = css.indexOf('@layer', i)
    if (j < 0) {
      sal += css.slice(i)
      break
    }
    sal += css.slice(i, j)
    let k = j + 6
    while (k < css.length && css[k] !== '{' && css[k] !== ';') k++
    if (css[k] === ';') {
      // Declaración de orden («@layer a, b;»): sobra.
      i = k + 1
      continue
    }
    // Bloque: se copia su contenido sin la envoltura, buscando su llave de cierre.
    let nivel = 1
    let m = k + 1
    while (m < css.length && nivel > 0) {
      if (css[m] === '{') nivel++
      else if (css[m] === '}') nivel--
      m++
    }
    sal += sinCapas(css.slice(k + 1, m - 1))
    i = m
  }
  return sal
}

/** Pasa el CSS final a algo que entiendan los navegadores antiguos: sin capas, con colores en rgb y sin anidar. */
function cssCompatible(): Plugin {
  const targets = browserslistToTargets(browserslist(NAVEGADORES))
  return {
    name: 'css-compatible',
    apply: 'build',
    enforce: 'post',
    generateBundle(_, bundle) {
      for (const f of Object.values(bundle)) {
        if (f.type !== 'asset' || !f.fileName.endsWith('.css')) continue
        const fuente = typeof f.source === 'string' ? f.source : new TextDecoder().decode(f.source)
        const { code } = transform({ filename: f.fileName, code: new TextEncoder().encode(fuente), minify: true, targets })
        f.source = sinCapas(new TextDecoder().decode(code))
      }
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    cssCompatible(),
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
  build: { target: ['chrome79', 'edge79', 'firefox78', 'safari13'] },
  test: { include: ['src/**/*.test.ts'] },
})
