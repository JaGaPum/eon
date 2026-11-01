// Sons de verdade para oír o que explican os apuntes: agudo e grave, forte e débil, o timbre, o tempo… Fanse co propio
// navegador, sen arquivos de audio.
import type { ReactNode } from 'react'

export interface Golpe {
  /** Cando soa, en segundos desde o principio. */
  t: number
  freq: number
  dur: number
  vol?: number
  /** Volume ao rematar, para crescendo e decrescendo. */
  volFin?: number
  onda?: OscillatorType
}

let ctx: AudioContext | null = null
let abertos: OscillatorNode[] = []

export function soar(golpes: Golpe[]) {
  const C = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!C) return
  ctx ??= new C()
  void ctx.resume()
  for (const o of abertos) {
    try {
      o.stop()
    } catch {
      // Xa rematou.
    }
  }
  abertos = []
  const ini = ctx.currentTime + 0.03
  for (const g of golpes) {
    const o = ctx.createOscillator()
    const v = ctx.createGain()
    o.type = g.onda ?? 'sine'
    o.frequency.value = g.freq
    const a = ini + g.t
    const vol = g.vol ?? 0.3
    v.gain.setValueAtTime(0.0001, a)
    v.gain.linearRampToValueAtTime(vol, a + 0.015)
    v.gain.linearRampToValueAtTime(g.volFin ?? vol, a + g.dur - 0.02)
    v.gain.linearRampToValueAtTime(0.0001, a + g.dur)
    o.connect(v).connect(ctx.destination)
    o.start(a)
    o.stop(a + g.dur + 0.02)
    abertos.push(o)
  }
}

const clics = (bpm: number, n: number, acentos = 1): Golpe[] => Array.from({ length: n }, (_, i) => ({ t: (i * 60) / bpm, freq: i % acentos === 0 ? 1200 : 800, dur: 0.07, vol: i % acentos === 0 ? 0.5 : 0.2 }))
const son = (freq: number, dur = 1, vol = 0.3, onda?: OscillatorType): Golpe[] => [{ t: 0, freq, dur, vol, onda }]

export const SONS: Record<string, Golpe[]> = {
  agudo: son(1320),
  grave: son(165),
  longo: son(440, 2),
  curto: son(440, 0.2),
  forte: son(440, 1, 0.6),
  debil: son(440, 1, 0.05),
  flauta: son(440, 1.2, 0.3, 'sine'),
  frauta2: son(440, 1.2, 0.18, 'triangle'),
  clarinete: son(440, 1.2, 0.14, 'square'),
  violin: son(440, 1.2, 0.14, 'sawtooth'),
  diapason: son(440, 2),
  eco: [0, 0.45, 0.9].map((t, i) => ({ t, freq: 660, dur: 0.15, vol: 0.5 / 2 ** (i * 1.2) })),
  reverberacion: [0, 0.08, 0.16, 0.24, 0.32, 0.4, 0.5, 0.6].map((t, i) => ({ t, freq: 660, dur: 0.12, vol: 0.45 * 0.68 ** i })),
  largo: clics(50, 5),
  allegro: clics(140, 12),
  prestissimo: clics(205, 18),
  binario: clics(110, 8, 2),
  ternario: clics(110, 9, 3),
  cuaternario: clics(110, 12, 4),
  accelerando: [0, 0.8, 1.5, 2.1, 2.6, 3, 3.3, 3.55, 3.75, 3.92].map((t) => ({ t, freq: 900, dur: 0.07, vol: 0.4 })),
  ritardando: [0, 0.17, 0.37, 0.62, 0.92, 1.32, 1.82, 2.42, 3.12, 3.92].map((t) => ({ t, freq: 900, dur: 0.07, vol: 0.4 })),
  crescendo: [{ t: 0, freq: 440, dur: 3, vol: 0.02, volFin: 0.6 }],
  decrescendo: [{ t: 0, freq: 440, dur: 3, vol: 0.6, volFin: 0.02 }],
  // Ton (Do-Re) e semitón (Mi-Fa).
  ton: [
    { t: 0, freq: 261.6, dur: 0.6 },
    { t: 0.65, freq: 293.7, dur: 0.6 },
  ],
  semiton: [
    { t: 0, freq: 329.6, dur: 0.6 },
    { t: 0.65, freq: 349.2, dur: 0.6 },
  ],
  escala: [261.6, 293.7, 329.6, 349.2, 392, 440, 493.9, 523.3].map((freq, i) => ({ t: i * 0.35, freq, dur: 0.33 })),
  escalaBaixa: [523.3, 493.9, 440, 392, 349.2, 329.6, 293.7, 261.6].map((freq, i) => ({ t: i * 0.35, freq, dur: 0.33 })),
  picado: [0, 0.3, 0.6, 0.9].map((t, i) => ({ t, freq: 392 + i * 50, dur: 0.08 })),
  legato: [0, 0.3, 0.6, 0.9].map((t, i) => ({ t, freq: 392 + i * 50, dur: 0.31 })),
}

/** Botón para oír un dos sons. */
export function Soar({ son, children }: { son: string; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        soar(SONS[son])
      }}
      className="inline-flex min-h-11 cursor-pointer items-center gap-1 rounded-full border-2 border-violet-300 bg-violet-100 px-3 py-1 text-base font-bold text-violet-800 hover:bg-violet-200"
    >
      <span aria-hidden="true">🔊</span> {children}
    </button>
  )
}
