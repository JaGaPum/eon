// Genera src/primaria/mundo.ts: continentes (equirectangular) y globo desde Natural Earth 1:110m, dominio público.
// Uso, desde esta carpeta:
//   curl -L -o paises.geojson https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson
//   node generar-mundo.mjs   (y se copia mundo.ts a src/primaria/)
import { readFileSync, writeFileSync } from 'node:fs'
const g = JSON.parse(readFileSync('paises.geojson', 'utf8'))
const ANCHO = 1000, NORTE = 90, SUR = -86
const k = ANCHO / 360
const px = (lon) => (lon + 180) * k
const py = (lat) => (NORTE - lat) * k
const ALTO = Math.round((NORTE - SUR) * k)
const NOMBRE = { Asia: 'asia', Europe: 'europa', Africa: 'africa', 'North America': 'america', 'South America': 'america', Oceania: 'oceania', Antarctica: 'antartida' }

// Recorta un anillo por la recta lon = x0, quedándose con el lado lon >= x0 (lado=1) o lon < x0 (lado=-1).
function recortar(anillo, x0, lado) {
  const dentro = (p) => (lado > 0 ? p[0] >= x0 : p[0] < x0)
  const sal = []
  for (let i = 0; i < anillo.length; i++) {
    const a = anillo[i], b = anillo[(i + 1) % anillo.length]
    if (dentro(a)) sal.push(a)
    if (dentro(a) !== dentro(b)) {
      const t = (x0 - a[0]) / (b[0] - a[0])
      sal.push([x0, a[1] + t * (b[1] - a[1])])
    }
  }
  return sal
}

const trazos = {}
let puntos = 0
for (const f of g.features) {
  const cont = NOMBRE[f.properties.CONTINENT]
  if (!cont) continue
  const polis = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates
  for (const poli of polis) {
    const anillo = poli[0]
    // Rusia: lo que queda al este de los Urales (unos 60° E) es Asia; Turquía y el Cáucaso ya vienen como Asia.
    const chukotka = anillo.every(([lon]) => lon < 0)
    const partes = f.properties.ADM0_A3 === 'RUS' && !chukotka ? [[recortar(anillo, 60, -1), 'europa'], [recortar(anillo, 60, 1), 'asia']] : [[anillo, chukotka && f.properties.ADM0_A3 === 'RUS' ? 'asia' : cont]]
    for (const [r, c] of partes) {
      if (r.length < 3) continue
      let d = '', prev = ''
      for (const [lon, lat] of r) {
        const s = `${Math.round(px(lon))} ${Math.round(py(Math.max(lat, SUR)))}`
        if (s === prev) continue
        d += (d ? 'L' : 'M') + s
        prev = s
        puntos++
      }
      trazos[c] = (trazos[c] ?? '') + d + 'Z'
    }
  }
}
// Globo: ortográfica centrada en 15° E, 20° N, radio 100. Lo que queda detrás se pega al borde.
const L0 = (15 * Math.PI) / 180, P0 = (20 * Math.PI) / 180, R = 100
function orto(lon, lat) {
  const l = (lon * Math.PI) / 180 - L0, p = (lat * Math.PI) / 180
  let x = R * Math.cos(p) * Math.sin(l)
  let y = -R * (Math.cos(P0) * Math.sin(p) - Math.sin(P0) * Math.cos(p) * Math.cos(l))
  const vis = Math.sin(P0) * Math.sin(p) + Math.cos(P0) * Math.cos(p) * Math.cos(l)
  if (vis < 0) {
    const n = Math.hypot(x, y) || 1
    x = (x / n) * R
    y = (y / n) * R
  }
  return [x, y, vis >= 0]
}
let globo = ''
for (const f of g.features) {
  if (!NOMBRE[f.properties.CONTINENT]) continue
  const polis = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates
  for (const poli of polis) {
    const pts = poli[0].map(([lon, lat]) => orto(lon, lat))
    if (!pts.some((p) => p[2])) continue
    let d = '', prev = ''
    for (const [x, y] of pts) {
      const s = `${Math.round(x + R)} ${Math.round(y + R)}`
      if (s === prev) continue
      d += (d ? 'L' : 'M') + s
      prev = s
    }
    globo += d + 'Z'
  }
}

const ts = `// Contornos de los continentes, generados desde Natural Earth 1:110m (dominio público, naturalearthdata.com).
// Proyección equirectangular de ${NORTE}° N a ${-SUR}° S en una caja de ${ANCHO} × ${ALTO}. No se edita a mano.
export const ANCHO_MAPA = ${ANCHO}
export const ALTO_MAPA = ${ALTO}
const ESCALA = ${k.toFixed(6)}
/** Pasa longitud y latitud a coordenadas del mapa. */
export const punto = (lon: number, lat: number) => [Math.round((lon + 180) * ESCALA), Math.round((${NORTE} - lat) * ESCALA)] as const
/** Lo contrario: de coordenadas del mapa a longitud y latitud. */
export const lonLat = (x: number, y: number) => [x / ESCALA - 180, ${NORTE} - y / ESCALA] as const
/** Tierra firme vista en un globo de 200 × 200 centrado en Europa y África. */
export const GLOBO_SVG = ${JSON.stringify(globo)}
export const CONTINENTES_SVG: Record<string, string> = ${JSON.stringify(trazos, null, 2)}
`
writeFileSync('mundo.ts', ts)
console.log('puntos', puntos, 'bytes', ts.length, 'alto', ALTO, Object.keys(trazos))
