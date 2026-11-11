// Ortografía de 3.º de Primaria (castellano): el sonido G suave (g, gu, gü) y el sonido K (c, qu). Las respuestas de
// los ejercicios salen de la palabra bien escrita, con las reglas del libro (Lengua 3.º, unidad 2, página 30).

const E_I = /[eéií]/

export type GrafiaG = 'g' | 'gu' | 'gü'
export type GrupoG = 'ga-go-gu' | 'gue-gui' | 'güe-güi'

/** Dónde está el sonido G suave en la palabra: lo de antes, cómo se escribe y lo de después. */
export interface HuecoG {
  antes: string
  grafia: GrafiaG
  despues: string
}

/**
 * Todos los sonidos G suave de la palabra. Una g delante de e, i suena como la j (gemas, genio) y no cuenta.
 * La u de «gu» delante de e, i no suena: va con la g. La de «gü» sí suena, pero también se escribe con la g.
 */
export function huecosG(palabra: string): HuecoG[] {
  const w = palabra.toLowerCase()
  const r: HuecoG[] = []
  for (let i = 0; i < w.length; i++) {
    if (w[i] !== 'g') continue
    const sig = w[i + 1] ?? ''
    let grafia: GrafiaG | null = null
    if (sig === 'ü') grafia = 'gü'
    else if (sig === 'u' && E_I.test(w[i + 2] ?? '')) grafia = 'gu'
    else if (!E_I.test(sig)) grafia = 'g'
    if (grafia) r.push({ antes: palabra.slice(0, i), grafia, despues: palabra.slice(i + grafia.length) })
  }
  return r
}

/** El primer sonido G suave de la palabra (la que se usa en los ejercicios de completar). */
export function huecoG(palabra: string): HuecoG {
  const h = huecosG(palabra)[0]
  if (!h) throw new Error(`«${palabra}» no tiene sonido G suave`)
  return h
}

export const tieneGSuave = (palabra: string) => huecosG(palabra).length > 0
/** La g delante de e, i suena fuerte, como la j: gemas, genio. */
export const tieneGFuerte = (palabra: string) => /g[eéií]/.test(palabra.toLowerCase())

/** El grupo de la página 30: con ga, go, gu; con gue, gui; o con güe, güi. */
export function grupoG(palabra: string): GrupoG {
  const g = huecoG(palabra).grafia
  return g === 'g' ? 'ga-go-gu' : g === 'gu' ? 'gue-gui' : 'güe-güi'
}

/** La regla del libro que explica cómo se escribe ese sonido. */
export function reglaG(grafia: GrafiaG): string {
  if (grafia === 'g') return 'Delante de a, o, u se escribe g.'
  if (grafia === 'gu') return 'Delante de e, i, cuando la u no suena, se escribe gu.'
  return 'Delante de e, i, cuando la u suena, se escribe gü.'
}

/**
 * Las faltas de G suave que se cometen con esa palabra: poner gu en vez de gü o al revés, quitar la u o ponerle
 * diéresis a una u que va delante de a, o (como «paragüas»).
 */
export function faltasG(palabra: string): string[] {
  const { antes, grafia, despues } = huecoG(palabra)
  const r =
    grafia === 'gu'
      ? [antes + 'g' + despues, antes + 'gü' + despues]
      : grafia === 'gü'
        ? [antes + 'gu' + despues, antes + 'g' + despues]
        : despues.startsWith('u')
          ? [antes + 'gü' + despues.slice(1)]
          : [antes + 'gu' + despues]
  return r.filter((x) => x !== palabra)
}

/** La palabra con el hueco: ci_eña. */
export const conHuecoG = (palabra: string) => {
  const h = huecoG(palabra)
  return `${h.antes}_${h.despues}`
}

// ——— El sonido K: c delante de a, o, u; qu delante de e, i ———

export type GrafiaK = 'c' | 'qu'

/** El primer sonido K de la palabra. */
export function huecoK(palabra: string): { antes: string; grafia: GrafiaK; despues: string } {
  const w = palabra.toLowerCase()
  for (let i = 0; i < w.length; i++) {
    if (w[i] === 'q' && w[i + 1] === 'u') return { antes: palabra.slice(0, i), grafia: 'qu', despues: palabra.slice(i + 2) }
    if (w[i] === 'c' && !E_I.test(w[i + 1] ?? '') && w[i + 1] !== 'h') return { antes: palabra.slice(0, i), grafia: 'c', despues: palabra.slice(i + 1) }
  }
  throw new Error(`«${palabra}» no tiene sonido K`)
}

export const reglaK = (g: GrafiaK) => (g === 'c' ? 'Delante de a, o, u se escribe c.' : 'Delante de e, i se escribe qu.')
