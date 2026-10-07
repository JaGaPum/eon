// Piezas de las unidades por paradas con juegos: Descubre, Xoga y Proba. Las usan las unidades de Olivia (en galego,
// con Estrela de guía) y las de idiomas de Mateo (en castellano, con un cohete de guía). Los textos de la interfaz
// salen de TEXTOS según el idioma del contexto; el contenido lo pone cada unidad.
import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useAvance } from '../lib/progreso'
import { estrellas } from '../componentes/Prueba'

export function barallar<T>(xs: readonly T[]): T[] {
  const a = [...xs]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ——— Idioma de la interfaz ———

const TEXTOS = {
  gl: {
    modos: { descubre: 'Descubre', xoga: 'Xoga', proba: '★ Proba' },
    mapa: '← Mapa da unidade',
    atras: '← Atrás',
    seguinte: 'Seguinte →',
    aXogar: 'A xogar! →',
    tarxeta: 'Tarxeta',
    outrosXogos: '← Outros xogos',
    deNovo: '↻ Comezar de novo',
    xogasteTodo: 'Xogaches a todo! Agora podes facer a proba e gañar estrelas.',
    escolleXogo: 'Escolle un xogo. Podes xogar as veces que queiras.',
    irProba: 'Ir á proba ★',
    si: (n: string) => `Si! Iso é ${n}.`,
    iso: (n: string, busca: string) => `Iso é ${n}. Busca ${busca}.`,
    aiNon: (busca: string) => `Aí non. Busca ${busca}.`,
    toca: 'Toca',
    escoitaToca: 'Escoita e toca o que oes.',
    atopado: (fallos: number) => (fallos === 0 ? 'Perfecto! Atopáchelo todo á primeira.' : `Moi ben! Atopáchelo todo. Equivocácheste ${fallos} ${fallos === 1 ? 'vez' : 'veces'}.`),
    primeiroPalabra: 'Primeiro toca unha palabra de arriba.',
    benEn: (t: string, c: string) => `Ben! ${t}: ${c}.`,
    nonVai: (t: string, c: string) => `${t} non vai en «${c}». Pensa outra vez.`,
    clasificado: 'Moi ben! Clasificaches todo.',
    clasificaAxuda: 'Toca unha palabra e despois a caixa onde vai.',
    primeiroEsquerda: 'Primeiro toca unha palabra da esquerda.',
    ben: 'Ben! ',
    non: 'Non. ',
    nonE: (w: string) => `Iso non é «${w}». Le outra vez.`,
    unido: 'Moi ben! Uniches todas.',
    uneAxuda: 'Toca unha palabra e despois o que significa.',
    verdadeiro: '✓ Verdadeiro',
    falso: '✗ Falso',
    vfFin: (a: number, n: number) => (a === n ? 'Perfecto! Acertaches todas.' : `Moi ben! Acertaches ${a} de ${n}. Podes xogar outra vez.`),
    comoMeFoi: 'Ver como me foi',
    probaIntro: (n: number) => `Na proba hai ${n} preguntas e só tes unha oportunidade en cada unha. Se acertas todas, gañas tres estrelas!`,
    mellor: (m: number, n: number) => `A túa mellor marca: ${m} de ${n}`,
    comezarProba: 'Comezar a proba',
    benDe: (a: number, n: number) => `${a} de ${n} ben`,
    probaFin: (e: number) => (e === 3 ? 'Perfecto! Tres estrelas!' : e > 0 ? 'Moi ben! Repasa o que fallaches e volve intentalo para gañar máis estrelas.' : 'Aínda non. Volve a Descubre e a Xoga, e logo téntao outra vez.'),
    practicaFin: (a: number, n: number) => (a === n ? 'Perfecto! Todas ben.' : `Acertaches ${a} de ${n}. Xoga outra vez para practicar máis.`),
    outraProba: 'Facer outra proba',
    exameIntro: (n: number) => `No exame hai ${n} preguntas de todas as paradas. Ao final tes a nota sobre 10.`,
    nota: (x: string) => `Nota: ${x}`,
    mellorNota: (x: string) => `A túa mellor nota: ${x}`,
    comezarExame: 'Comezar o exame',
    exameFin: (x: number) => (x >= 9 ? 'Excelente! Estás preparado.' : x >= 5 ? 'Aprobado. Repasa o que fallaches e volve facelo.' : 'Aínda non. Repasa as paradas e téntao outra vez.'),
    outroExame: 'Facer outro exame',
    outraVez: 'Xogar outra vez',
    pregunta: (k: number, n: number) => `Pregunta ${k} de ${n}`,
    tocaches: (n?: string) => `Non: tocaches ${n ?? 'outro sitio'}. `,
    verResultado: 'Ver o resultado',
    seguintePregunta: 'Seguinte pregunta →',
    comprobar: 'Comprobar',
    escribeAqui: 'Escribe aquí',
    acentos: (b: string) => `Case! Coidado cos acentos: escríbese «${b}».`,
    solucion: (b: string) => `Escríbese «${b}».`,
    ordenaAxuda: 'Toca as palabras na orde correcta.',
    ordenado: 'Moi ben! Ordenaches todas.',
    borrar: '⌫ Borrar',
    oir: 'Escoitar',
    estrelas: (n: number) => `${n} de 3 estrelas`,
  },
  es: {
    modos: { descubre: 'Aprende', xoga: 'Practica', proba: '★ Prueba' },
    mapa: '← Mapa de la unidad',
    atras: '← Atrás',
    seguinte: 'Siguiente →',
    aXogar: '¡A practicar! →',
    tarxeta: 'Tarjeta',
    outrosXogos: '← Otros juegos',
    deNovo: '↻ Empezar de nuevo',
    xogasteTodo: '¡Has hecho todos los juegos! Ya puedes hacer la prueba y ganar estrellas.',
    escolleXogo: 'Elige un juego. Puedes repetirlos las veces que quieras.',
    irProba: 'Ir a la prueba ★',
    si: (n: string) => `¡Sí! Es ${n}.`,
    iso: (n: string, busca: string) => `Eso es ${n}. Busca ${busca}.`,
    aiNon: (busca: string) => `Ahí no. Busca ${busca}.`,
    toca: 'Toca',
    escoitaToca: 'Escucha y toca lo que oyes.',
    atopado: (fallos: number) => (fallos === 0 ? '¡Perfecto! Todo a la primera.' : `¡Muy bien! Lo has encontrado todo. Fallos: ${fallos}.`),
    primeiroPalabra: 'Primero toca una palabra de arriba.',
    benEn: (t: string, c: string) => `¡Bien! ${t}: ${c}.`,
    nonVai: (t: string, c: string) => `${t} no va en «${c}». Piénsalo otra vez.`,
    clasificado: '¡Muy bien! Lo has clasificado todo.',
    clasificaAxuda: 'Toca una palabra y después la caja donde va.',
    primeiroEsquerda: 'Primero toca una palabra de la izquierda.',
    ben: '¡Bien! ',
    non: 'No. ',
    nonE: (w: string) => `Eso no es «${w}». Léelo otra vez.`,
    unido: '¡Muy bien! Las has unido todas.',
    uneAxuda: 'Toca una palabra y después lo que significa.',
    verdadeiro: '✓ Verdadero',
    falso: '✗ Falso',
    vfFin: (a: number, n: number) => (a === n ? '¡Perfecto! Todas bien.' : `¡Muy bien! Has acertado ${a} de ${n}. Puedes jugar otra vez.`),
    comoMeFoi: 'Ver cómo me ha ido',
    probaIntro: (n: number) => `En la prueba hay ${n} preguntas y solo tienes un intento en cada una. Si las aciertas todas, ganas tres estrellas.`,
    mellor: (m: number, n: number) => `Tu mejor marca: ${m} de ${n}`,
    comezarProba: 'Empezar la prueba',
    benDe: (a: number, n: number) => `${a} de ${n} bien`,
    probaFin: (e: number) => (e === 3 ? '¡Perfecto! ¡Tres estrellas!' : e > 0 ? '¡Muy bien! Repasa lo que has fallado y vuelve a intentarlo para ganar más estrellas.' : 'Todavía no. Vuelve a Aprende y a Practica, y luego inténtalo otra vez.'),
    practicaFin: (a: number, n: number) => (a === n ? '¡Perfecto! Todas bien.' : `Has acertado ${a} de ${n}. Juega otra vez para practicar más.`),
    outraProba: 'Hacer otra prueba',
    exameIntro: (n: number) => `En el examen hay ${n} preguntas de todas las paradas. Al final tienes la nota sobre 10.`,
    nota: (x: string) => `Nota: ${x}`,
    mellorNota: (x: string) => `Tu mejor nota: ${x}`,
    comezarExame: 'Empezar el examen',
    exameFin: (x: number) => (x >= 9 ? '¡Sobresaliente! Estás preparado.' : x >= 5 ? 'Aprobado. Repasa lo que has fallado y vuelve a hacerlo.' : 'Todavía no. Repasa las paradas y vuelve a intentarlo.'),
    outroExame: 'Hacer otro examen',
    outraVez: 'Jugar otra vez',
    pregunta: (k: number, n: number) => `Pregunta ${k} de ${n}`,
    tocaches: (n?: string) => `No: has tocado ${n ?? 'otro sitio'}. `,
    verResultado: 'Ver el resultado',
    seguintePregunta: 'Siguiente pregunta →',
    comprobar: 'Comprobar',
    escribeAqui: 'Escribe aquí',
    acentos: (b: string) => `¡Casi! Cuidado con los acentos: se escribe «${b}».`,
    solucion: (b: string) => `Se escribe «${b}».`,
    ordenaAxuda: 'Toca las palabras en el orden correcto.',
    ordenado: '¡Muy bien! Las has ordenado todas.',
    borrar: '⌫ Borrar',
    oir: 'Escuchar',
    estrelas: (n: number) => `${n} de 3 estrellas`,
  },
}

type Idioma = keyof typeof TEXTOS
const ContextoIdioma = createContext<{ idioma: Idioma; falar?: string }>({ idioma: 'gl' })

/**
 * Idioma de la interfaz y, para las unidades de idiomas, la lengua en que se leen en voz alta las palabras
 * (por ejemplo «fr-FR»).
 */
export function IdiomaUnidade({ idioma, falar, children }: { idioma: Idioma; falar?: string; children: ReactNode }) {
  return <ContextoIdioma.Provider value={{ idioma, falar }}>{children}</ContextoIdioma.Provider>
}

const useT = () => TEXTOS[useContext(ContextoIdioma).idioma]

// ——— Voz ———

/** Lee un texto en voz alta con la voz del dispositivo para esa lengua. Si no hay voz, no hace nada. */
export function fala(texto: string, lingua = 'fr-FR') {
  const s = typeof window !== 'undefined' ? window.speechSynthesis : undefined
  if (!s) return
  s.cancel()
  const u = new SpeechSynthesisUtterance(texto)
  u.lang = lingua
  const voz = s.getVoices().find((v) => v.lang.replace('_', '-').startsWith(lingua.slice(0, 2)))
  if (voz) u.voice = voz
  u.rate = 0.85
  s.speak(u)
}

/** La lengua de lectura de la unidad, o nada si la unidad no lee en voz alta. */
export const useFalar = () => useContext(ContextoIdioma).falar

/** Botón 🔊 que lee el texto en la lengua de la unidad. */
export function Son({ texto, grande }: { texto: string; grande?: boolean }) {
  const lingua = useFalar()
  const t = useT()
  if (!lingua) return null
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        fala(texto, lingua)
      }}
      className={`inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full bg-violet-100 align-middle text-violet-700 hover:bg-violet-200 ${grande ? 'h-12 w-12 text-2xl' : 'mx-1 h-8 w-8 text-base'}`}
      aria-label={`${t.oir}: ${texto}`}
      title={t.oir}
    >
      🔊
    </button>
  )
}

/** Una palabra o frase en la lengua que se estudia, con su botón para oírla. */
export function Fr({ children }: { children: string }) {
  return (
    <span className="whitespace-nowrap">
      <b className="text-violet-800" lang="fr">
        {children}
      </b>
      <Son texto={children} />
    </span>
  )
}

// ——— Guías ———

/** Estrela, a unicornia astronauta que guía as unidades de Olivia. */
export function Estrela({ tam = 56 }: { tam?: number }) {
  return (
    <svg viewBox="0 0 64 64" width={tam} height={tam} aria-hidden="true" className="shrink-0">
      <circle cx="32" cy="32" r="31" fill="#ede9fe" stroke="#c4b5fd" strokeWidth="2" />
      <path d="M20 62 C19 52 21 44 24 38 C22 28 28 18 40 17 C48 16 53 21 55 28 L59 39 C60 45 56 49 50 48 L44 46 C41 46 39 48 38 52 L37 62 Z" fill="#fff" stroke="#a78bfa" strokeWidth="1.5" strokeLinejoin="round" />
      <ellipse cx="53" cy="42" rx="6.5" ry="5.5" fill="#fbcfe8" />
      <circle cx="56" cy="41" r="1.3" fill="#9d174d" />
      <path d="M46 46 q4 2 8 0" stroke="#9d174d" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <path d="M33 21 L31 10 L39 18 Z" fill="#fff" stroke="#a78bfa" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M41 18 L50 2 L46 20 Z" fill="#fde68a" stroke="#f59e0b" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M43 14 l5 1 M44 10 l4 0.5" stroke="#f59e0b" strokeWidth="1" />
      <path d="M32 18 C22 18 16 26 18 34 C13 38 14 46 18 50 C14 54 16 60 20 62 C19 52 21 44 24 38 C22 30 26 22 34 19 Z" fill="#f472b6" />
      <path d="M34 18 C27 22 25 28 27 33 C29 27 33 24 38 22 Z" fill="#c084fc" />
      <circle cx="44" cy="30" r="3.4" fill="#1e1b4b" />
      <circle cx="45.2" cy="28.8" r="1.2" fill="#fff" />
      <path d="M41.5 27 l-2 -2 M43 26.3 l-1 -2.6" stroke="#1e1b4b" strokeWidth="1" strokeLinecap="round" />
      <circle cx="47" cy="37" r="2.5" fill="#f9a8d4" opacity="0.6" />
      <path d="M10 14 l1.5 3.5 3.5 1.5 -3.5 1.5 -1.5 3.5 -1.5 -3.5 -3.5 -1.5 3.5 -1.5z" fill="#fbbf24" />
    </svg>
  )
}

/** Un cohete, guía de las unidades de Mateo. */
export function Cohete({ tam = 56 }: { tam?: number }) {
  return (
    <svg viewBox="0 0 64 64" width={tam} height={tam} aria-hidden="true" className="shrink-0">
      <circle cx="32" cy="32" r="31" fill="#e0e7ff" stroke="#a5b4fc" strokeWidth="2" />
      <g transform="rotate(35 32 32)">
        <path d="M32 8 C40 16 42 28 40 42 L24 42 C22 28 24 16 32 8 Z" fill="#f8fafc" stroke="#6366f1" strokeWidth="1.8" strokeLinejoin="round" />
        <circle cx="32" cy="24" r="5" fill="#38bdf8" stroke="#6366f1" strokeWidth="1.5" />
        <path d="M24 34 L16 46 L25 42 Z M40 34 L48 46 L39 42 Z" fill="#f43f5e" stroke="#be123c" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M27 42 L32 56 L37 42 Z" fill="#fbbf24" />
        <path d="M29.5 42 L32 50 L34.5 42 Z" fill="#f97316" />
      </g>
      <circle cx="12" cy="14" r="1.5" fill="#6366f1" />
      <circle cx="52" cy="50" r="1.5" fill="#6366f1" />
    </svg>
  )
}

/** Lo que dice la guía, en un bocadillo. */
export function Burbulla({ children, ton = 'normal' }: { children: ReactNode; ton?: 'normal' | 'ben' | 'mal' }) {
  const { idioma } = useContext(ContextoIdioma)
  const cor = ton === 'ben' ? 'border-emerald-300 bg-emerald-50 text-emerald-900' : ton === 'mal' ? 'border-amber-300 bg-amber-50 text-amber-900' : 'border-violet-200 bg-violet-50 text-violet-950'
  return (
    <div className="flex items-start gap-2">
      {idioma === 'gl' ? <Estrela /> : <Cohete />}
      <motion.div
        key={String(children)}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`relative flex-1 rounded-2xl border-2 px-4 py-3 text-lg leading-snug font-semibold ${cor}`}
        role="status"
      >
        {children}
      </motion.div>
    </div>
  )
}

// ——— Armazón ———

export const MODOS_PRIMARIA = ['descubre', 'xoga', 'proba'] as const

/** Armazón de una parada: volver al mapa, título y los tres modos, que siguen montados al cambiar. */
export function ParadaPrimaria({ ruta, titulo, modo, paneis }: { ruta: string; titulo: ReactNode; modo?: string; paneis: Record<(typeof MODOS_PRIMARIA)[number], ReactNode> }) {
  const t = useT()
  const activo = MODOS_PRIMARIA.find((m) => m === modo) ?? 'descubre'
  const mapa = ruta.slice(0, ruta.lastIndexOf('/'))
  return (
    <>
      <a href={mapa} className="text-lg font-semibold text-violet-700">
        {t.mapa}
      </a>
      <h1 className="mt-2 text-3xl font-black text-slate-800 sm:text-4xl">{titulo}</h1>
      <nav className="mt-4 grid grid-cols-3 gap-1 rounded-2xl bg-violet-100 p-1">
        {MODOS_PRIMARIA.map((m) => (
          <a
            key={m}
            href={`${ruta}/${m}`}
            className={`rounded-xl px-2 py-3 text-center text-base font-bold sm:text-lg ${m === activo ? 'bg-white text-violet-700 shadow-sm' : 'text-violet-900/70'}`}
          >
            {t.modos[m]}
          </a>
        ))}
      </nav>
      <div className="mt-5">
        {MODOS_PRIMARIA.map((m) => (
          <div key={m} hidden={m !== activo}>
            {paneis[m]}
          </div>
        ))}
      </div>
    </>
  )
}

export interface Tarxeta {
  titulo: ReactNode
  texto: ReactNode
  visual?: ReactNode
  /** O debuxo vai debaixo do texto, a todo o ancho (para os mapas). */
  ancho?: boolean
}

/** Modo Descubre: unha idea por tarxeta, con texto curto e un debuxo grande. */
export function Tarxetas({ tarxetas, xoga }: { tarxetas: Tarxeta[]; xoga: string }) {
  const t = useT()
  const [i, setI] = useState(0)
  const x = tarxetas[i]
  return (
    <section>
      <AnimatePresence mode="wait">
        <motion.div key={i} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.18 }}>
          <h2 className="mb-3 text-2xl font-black text-violet-800">{x.titulo}</h2>
          <div className={`grid items-start gap-4 ${x.ancho || !x.visual ? '' : 'md:grid-cols-[2fr_3fr]'}`}>
            <div className="space-y-3 text-xl leading-relaxed">{x.texto}</div>
            {x.visual && <div className="overflow-hidden rounded-2xl border-2 border-violet-100 bg-white p-2">{x.visual}</div>}
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="mt-5 flex items-center justify-between gap-2">
        <button className="btn min-h-12 text-lg" disabled={i === 0} onClick={() => setI(i - 1)}>
          {t.atras}
        </button>
        <span className="flex flex-wrap justify-center gap-1.5" aria-label={`${i + 1} / ${tarxetas.length}`}>
          {tarxetas.map((_, k) => (
            <button key={k} onClick={() => setI(k)} aria-label={`${t.tarxeta} ${k + 1}`} className={`h-3.5 w-3.5 cursor-pointer rounded-full ${k === i ? 'scale-125 bg-violet-600' : k < i ? 'bg-violet-300' : 'bg-slate-300'}`} />
          ))}
        </span>
        {i < tarxetas.length - 1 ? (
          <button className="btn btn-primario min-h-12 border-violet-600 bg-violet-600 text-lg hover:bg-violet-700" onClick={() => setI(i + 1)}>
            {t.seguinte}
          </button>
        ) : (
          <a className="btn btn-primario min-h-12 border-violet-600 bg-violet-600 text-lg hover:bg-violet-700" href={xoga}>
            {t.aXogar}
          </a>
        )}
      </div>
    </section>
  )
}

/** Resalte de algo tocado en un dibujo: acertado o no. */
export type Marca = 'ben' | 'mal'

/** Un dibujo en el que se puede tocar cada elemento por su identificador. */
export type Debuxo = (p: { onToca?: (id: string) => void; marcas?: Record<string, Marca>; etiquetas?: boolean }) => ReactNode

export interface Xogo {
  id: string
  titulo: string
  icono: string
  explica: string
  /** Se crea de nuevo en cada partida para que cambie el orden. */
  crear: (acabar: () => void) => ReactNode
}

/** Modo Xoga: unha lista de xogos; ao rematar un, vólvese á lista. */
export function Xogos({ xogos, proba }: { xogos: Xogo[]; proba: string }) {
  const t = useT()
  const [actual, setActual] = useState<string | null>(null)
  const [partida, setPartida] = useState(0)
  const [feitos, setFeitos] = useState<Record<string, boolean>>({})
  const x = xogos.find((g) => g.id === actual)
  // Cada partida se crea una sola vez: si se volviera a crear al redibujar, se barajaría a mitad de juego.
  const contido = useMemo(() => x?.crear(() => setFeitos((f) => ({ ...f, [x.id]: true }))), [x, partida])

  if (x)
    return (
      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <button className="btn min-h-12 text-lg" onClick={() => setActual(null)}>
            {t.outrosXogos}
          </button>
          <button className="btn min-h-12 text-lg" onClick={() => setPartida(partida + 1)}>
            {t.deNovo}
          </button>
        </div>
        <h2 className="mb-3 text-2xl font-black text-violet-800">
          <span aria-hidden="true">{x.icono}</span> {x.titulo}
        </h2>
        <div key={partida}>{contido}</div>
      </section>
    )

  const todos = xogos.every((g) => feitos[g.id])
  return (
    <section>
      <Burbulla ton={todos ? 'ben' : 'normal'}>{todos ? t.xogasteTodo : t.escolleXogo}</Burbulla>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {xogos.map((g) => (
          <button
            key={g.id}
            onClick={() => {
              setActual(g.id)
              setPartida(partida + 1)
            }}
            className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 bg-white p-4 text-left hover:bg-violet-50 ${feitos[g.id] ? 'border-emerald-300' : 'border-violet-200'}`}
          >
            <span className="text-4xl" aria-hidden="true">
              {feitos[g.id] ? '✅' : g.icono}
            </span>
            <span>
              <b className="block text-lg text-slate-800">{g.titulo}</b>
              <span className="text-slate-600">{g.explica}</span>
            </span>
          </button>
        ))}
      </div>
      {todos && (
        <a className="btn btn-primario mt-4 min-h-12 w-full border-violet-600 bg-violet-600 text-lg hover:bg-violet-700" href={proba}>
          {t.irProba}
        </a>
      )}
    </section>
  )
}

// ——— Juegos ———

/**
 * Busca no debuxo: pide os elementos un a un. Se toca outro, dille cal tocou. Con `escoita`, en vez de ler o
 * que hai que buscar, escóitase (para as unidades de idiomas).
 */
export function Busca({ Debuxo, nomes, obxectivos, pide, escoita, acabar }: { Debuxo: Debuxo; nomes: Record<string, string>; obxectivos: string[]; pide?: string; escoita?: boolean; acabar: () => void }) {
  const t = useT()
  const lingua = useFalar()
  const orde = useMemo(() => barallar(obxectivos), [obxectivos])
  const [k, setK] = useState(0)
  const [marcas, setMarcas] = useState<Record<string, Marca>>({})
  const [aviso, setAviso] = useState<{ texto: string; ton: 'ben' | 'mal' } | null>(null)
  const [fallos, setFallos] = useState(0)
  const obx = orde[k]
  const rematado = k >= orde.length
  const oculto = escoita && !!lingua

  useEffect(() => {
    if (oculto && obx) fala(nomes[obx], lingua)
  }, [oculto, obx, nomes, lingua])

  function toca(id: string) {
    if (rematado) return
    if (id === obx) {
      const novas = { ...marcas, [id]: 'ben' as Marca }
      for (const m in novas) if (novas[m] === 'mal') delete novas[m]
      setMarcas(novas)
      setAviso({ texto: t.si(nomes[id]), ton: 'ben' })
      if (lingua && !oculto) fala(nomes[id], lingua)
      setK(k + 1)
      if (k + 1 === orde.length) acabar()
    } else {
      setFallos(fallos + 1)
      setMarcas({ ...marcas, [id]: 'mal' })
      const busca = oculto ? '🔊' : nomes[obx]
      setAviso({ texto: nomes[id] ? t.iso(nomes[id], busca) : t.aiNon(busca), ton: 'mal' })
    }
  }

  return (
    <div className="space-y-3">
      {rematado ? (
        <Burbulla ton="ben">{t.atopado(fallos)}</Burbulla>
      ) : (
        <Burbulla ton={aviso?.ton}>
          {aviso && <span className="block text-base font-medium">{aviso.texto}</span>}
          {oculto ? (
            <span className="flex items-center gap-2">
              {t.escoitaToca} <Son texto={nomes[obx]} grande />
            </span>
          ) : (
            <>
              {pide ?? t.toca} <span className="text-violet-700">{nomes[obx]}</span>.{lingua && <Son texto={nomes[obx]} />}
            </>
          )}
        </Burbulla>
      )}
      <p className="text-center text-sm font-semibold text-slate-500">
        {Math.min(k, orde.length)} / {orde.length}
      </p>
      <div className="overflow-hidden rounded-2xl border-2 border-violet-100 bg-white">
        <Debuxo onToca={toca} marcas={marcas} etiquetas={false} />
      </div>
    </div>
  )
}

export interface Caixa {
  id: string
  nome: string
  /** Clases de Tailwind para el fondo y el borde de la caja. */
  cor: string
}

/** Clasifica: tócase unha palabra e despois a caixa onde vai. */
export function Clasifica({ caixas, elementos, acabar }: { caixas: Caixa[]; elementos: { texto: string; caixa: string; pista?: string }[]; acabar: () => void }) {
  const t = useT()
  const lingua = useFalar()
  const orde = useMemo(() => barallar(elementos), [elementos])
  const [colocados, setColocados] = useState<Record<string, string>>({})
  const [elixido, setElixido] = useState<string | null>(null)
  const [aviso, setAviso] = useState<{ texto: string; ton: 'ben' | 'mal' } | null>(null)
  const quedan = orde.filter((e) => !colocados[e.texto])

  function poñer(caixa: string) {
    const e = orde.find((x) => x.texto === elixido)
    if (!e) {
      setAviso({ texto: t.primeiroPalabra, ton: 'mal' })
      return
    }
    const nome = caixas.find((c) => c.id === caixa)?.nome ?? ''
    if (e.caixa === caixa) {
      setColocados({ ...colocados, [e.texto]: caixa })
      setElixido(null)
      setAviso({ texto: t.benEn(e.texto, nome), ton: 'ben' })
      if (quedan.length === 1) acabar()
    } else setAviso({ texto: e.pista ?? t.nonVai(e.texto, nome), ton: 'mal' })
  }

  return (
    <div className="space-y-4">
      {quedan.length === 0 ? <Burbulla ton="ben">{t.clasificado}</Burbulla> : <Burbulla ton={aviso?.ton}>{aviso?.texto ?? t.clasificaAxuda}</Burbulla>}
      <div className="flex min-h-14 flex-wrap justify-center gap-2">
        {quedan.map((e) => (
          <button
            key={e.texto}
            onClick={() => {
              setElixido(e.texto)
              if (lingua) fala(e.texto, lingua)
            }}
            className={`min-h-12 cursor-pointer rounded-full border-2 px-4 text-lg font-bold transition ${elixido === e.texto ? 'scale-105 border-violet-600 bg-violet-600 text-white' : 'border-violet-200 bg-white text-slate-800 hover:bg-violet-50'}`}
          >
            {e.texto}
          </button>
        ))}
      </div>
      <div className={`grid gap-3 ${caixas.length === 3 ? 'sm:grid-cols-3' : 'grid-cols-2'}`}>
        {caixas.map((c) => (
          <button key={c.id} onClick={() => poñer(c.id)} className={`min-h-32 cursor-pointer rounded-2xl border-2 p-3 text-left transition hover:brightness-95 ${c.cor}`}>
            <b className="block text-center text-lg">{c.nome}</b>
            <span className="mt-2 flex flex-wrap justify-center gap-1.5">
              {orde
                .filter((e) => colocados[e.texto] === c.id)
                .map((e) => (
                  <span key={e.texto} className="rounded-full bg-white/80 px-3 py-1 font-semibold text-slate-800">
                    ✓ {e.texto}
                  </span>
                ))}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

/** Une: cada palabra co que significa. Tócase a palabra e despois o seu significado. */
export function Une({ pares, acabar }: { pares: { palabra: string; significado: string }[]; acabar: () => void }) {
  const t = useT()
  const lingua = useFalar()
  const palabras = useMemo(() => barallar(pares.map((p) => p.palabra)), [pares])
  const significados = useMemo(() => barallar(pares), [pares])
  const [elixida, setElixida] = useState<string | null>(null)
  const [unidas, setUnidas] = useState<Record<string, boolean>>({})
  const [aviso, setAviso] = useState<{ texto: string; ton: 'ben' | 'mal' } | null>(null)
  const rematado = pares.every((p) => unidas[p.palabra])

  function significado(p: { palabra: string; significado: string }) {
    if (unidas[p.palabra]) return
    if (!elixida) {
      setAviso({ texto: t.primeiroEsquerda, ton: 'mal' })
      return
    }
    if (p.palabra === elixida) {
      const novas = { ...unidas, [p.palabra]: true }
      setUnidas(novas)
      setElixida(null)
      setAviso({ texto: `${t.ben}${p.palabra}.`, ton: 'ben' })
      if (pares.every((x) => novas[x.palabra])) acabar()
    } else setAviso({ texto: t.nonE(elixida), ton: 'mal' })
  }

  return (
    <div className="space-y-4">
      {rematado ? <Burbulla ton="ben">{t.unido}</Burbulla> : <Burbulla ton={aviso?.ton}>{aviso?.texto ?? t.uneAxuda}</Burbulla>}
      <div className="grid grid-cols-[2fr_5fr] gap-3">
        <div className="flex flex-col gap-2">
          {palabras.map((w) => (
            <button
              key={w}
              disabled={unidas[w]}
              onClick={() => {
                setElixida(w)
                if (lingua) fala(w, lingua)
              }}
              className={`min-h-14 cursor-pointer rounded-xl border-2 px-2 text-lg font-bold transition ${
                unidas[w] ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : elixida === w ? 'border-violet-600 bg-violet-600 text-white' : 'border-violet-200 bg-white text-slate-800 hover:bg-violet-50'
              }`}
            >
              {unidas[w] && '✓ '}
              {w}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {significados.map((p) => (
            <button
              key={p.palabra}
              onClick={() => significado(p)}
              className={`min-h-14 cursor-pointer rounded-xl border-2 px-3 py-2 text-left text-base leading-snug ${unidas[p.palabra] ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : 'border-slate-200 bg-white text-slate-800 hover:bg-violet-50'}`}
            >
              {unidas[p.palabra] && <b>{p.palabra}: </b>}
              {p.significado}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

/** Verdadeiro ou falso: unha frase cada vez. Se falla, explícalle por que. */
export function VerdadeiroFalso({ frases, acabar }: { frases: { texto: string; certa: boolean; explica: string }[]; acabar: () => void }) {
  const t = useT()
  const orde = useMemo(() => barallar(frases), [frases])
  const [k, setK] = useState(0)
  const [resposta, setResposta] = useState<boolean | null>(null)
  const [acertos, setAcertos] = useState(0)
  if (k >= orde.length) return <Burbulla ton="ben">{t.vfFin(acertos, orde.length)}</Burbulla>
  const f = orde[k]
  const ben = resposta === f.certa
  function responder(r: boolean) {
    if (resposta !== null) return
    setResposta(r)
    if (r === f.certa) setAcertos(acertos + 1)
  }
  function seguinte() {
    setResposta(null)
    setK(k + 1)
    if (k + 1 === orde.length) acabar()
  }
  return (
    <div className="space-y-4">
      <p className="text-center text-sm font-semibold text-slate-500">
        {k + 1} / {orde.length}
      </p>
      <p className="rounded-2xl border-2 border-violet-200 bg-white p-5 text-center text-2xl leading-snug font-bold text-slate-800">{f.texto}</p>
      <div className="grid grid-cols-2 gap-3">
        {[true, false].map((v) => (
          <button
            key={String(v)}
            disabled={resposta !== null}
            onClick={() => responder(v)}
            className={`min-h-16 cursor-pointer rounded-2xl border-2 text-xl font-black transition disabled:cursor-default ${
              resposta === null
                ? v
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                  : 'border-rose-300 bg-rose-50 text-rose-800 hover:bg-rose-100'
                : v === f.certa
                  ? 'border-emerald-500 bg-emerald-500 text-white'
                  : 'border-slate-200 bg-white text-slate-400'
            }`}
          >
            {v ? t.verdadeiro : t.falso}
          </button>
        ))}
      </div>
      {resposta !== null && (
        <>
          <Burbulla ton={ben ? 'ben' : 'mal'}>
            {ben ? t.ben : t.non}
            <span className="font-medium">{f.explica}</span>
          </Burbulla>
          <button className="btn btn-primario min-h-14 w-full border-violet-600 bg-violet-600 text-xl hover:bg-violet-700" onClick={seguinte}>
            {k + 1 === orde.length ? t.comoMeFoi : t.seguinte}
          </button>
        </>
      )}
    </div>
  )
}

/** Ordena: as palabras dunha frase, barulladas, hai que tocalas na orde boa. */
export function Ordena({ frases, acabar }: { frases: { palabras: string[]; traducion?: string }[]; acabar: () => void }) {
  const t = useT()
  const lingua = useFalar()
  const orde = useMemo(() => barallar(frases), [frases])
  const [k, setK] = useState(0)
  const [postas, setPostas] = useState<number[]>([])
  const [aviso, setAviso] = useState<{ texto: string; ton: 'ben' | 'mal' } | null>(null)
  const f = orde[k]
  const fichas = useMemo(() => (f ? barallar(f.palabras.map((p, i) => ({ p, i }))) : []), [f])
  if (!f) return <Burbulla ton="ben">{t.ordenado}</Burbulla>
  const frase = f.palabras.join(' ').replace(/ \?/g, ' ?')
  const feita = postas.length === f.palabras.length

  function comprobar() {
    const escrita = postas.map((i) => f.palabras[i]).join(' ')
    if (escrita === f.palabras.join(' ')) {
      if (lingua) fala(frase, lingua)
      setAviso({ texto: `${t.ben}${frase}`, ton: 'ben' })
      setPostas([])
      setK(k + 1)
      if (k + 1 === orde.length) acabar()
    } else setAviso({ texto: `${t.non}${t.ordenaAxuda}`, ton: 'mal' })
  }

  return (
    <div className="space-y-4">
      <Burbulla ton={aviso?.ton}>
        {aviso && <span className="block text-base font-medium">{aviso.texto}</span>}
        {f.traducion ? <>«{f.traducion}»</> : t.ordenaAxuda}
      </Burbulla>
      <p className="text-center text-sm font-semibold text-slate-500">
        {k + 1} / {orde.length}
      </p>
      <div className="flex min-h-16 flex-wrap items-center gap-2 rounded-2xl border-2 border-dashed border-violet-300 bg-white p-3">
        {postas.map((i, n) => (
          <button key={n} onClick={() => setPostas(postas.filter((_, m) => m !== n))} className="min-h-11 cursor-pointer rounded-xl bg-violet-600 px-3 text-lg font-bold text-white" lang="fr">
            {f.palabras[i]}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {fichas.map(({ p, i }) => (
          <button
            key={i}
            disabled={postas.includes(i)}
            onClick={() => setPostas([...postas, i])}
            className="min-h-12 cursor-pointer rounded-xl border-2 border-violet-200 bg-white px-4 text-lg font-bold text-slate-800 hover:bg-violet-50 disabled:opacity-25"
            lang="fr"
          >
            {p}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <button className="btn min-h-12 flex-1 text-lg" disabled={postas.length === 0} onClick={() => setPostas(postas.slice(0, -1))}>
          {t.borrar}
        </button>
        <button className="btn btn-primario min-h-12 flex-2 border-violet-600 bg-violet-600 text-lg hover:bg-violet-700" disabled={!feita} onClick={comprobar}>
          {t.comprobar}
        </button>
      </div>
    </div>
  )
}

// ——— Escribir ———

/** Para comparar respuestas escritas: minúsculas, apóstrofos rectos y espacios normales. */
export const normalizar = (s: string) =>
  s
    .toLowerCase()
    .replace(/[’`´]/g, "'")
    .replace(/\s*'\s*/g, "'")
    .replace(/\s+/g, ' ')
    .replace(/\s*([?!.,])/g, '$1')
    .replace(/[.!]$/, '')
    .trim()
const sinAcentos = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/œ/g, 'oe')

export type Correccion = 'ben' | 'acentos' | 'mal'

/** Compara lo escrito con las respuestas válidas; distingue el fallo que solo es de acentos. */
export function corrixir(escrito: string, respostas: string[]): Correccion {
  const e = normalizar(escrito)
  if (respostas.some((r) => normalizar(r) === e)) return 'ben'
  if (respostas.some((r) => sinAcentos(normalizar(r)) === sinAcentos(e))) return 'acentos'
  return 'mal'
}

const TECLAS = ['é', 'è', 'ê', 'à', 'â', 'ç', 'ô', 'û', 'î', 'œ', "'"]

/** Campo para escribir en francés, con teclas para las letras que no están en el teclado español. */
export function Campo({ onEnviar, desactivado }: { onEnviar: (texto: string) => void; desactivado?: boolean }) {
  const t = useT()
  const [texto, setTexto] = useState('')
  const ref = useRef<HTMLInputElement>(null)
  function tecla(c: string) {
    const el = ref.current
    const ini = el?.selectionStart ?? texto.length
    const fin = el?.selectionEnd ?? texto.length
    const novo = texto.slice(0, ini) + c + texto.slice(fin)
    setTexto(novo)
    requestAnimationFrame(() => {
      el?.focus()
      el?.setSelectionRange(ini + c.length, ini + c.length)
    })
  }
  return (
    <form
      className="space-y-2"
      onSubmit={(e) => {
        e.preventDefault()
        if (texto.trim()) onEnviar(texto)
      }}
    >
      <div className="flex gap-2">
        <input
          ref={ref}
          value={texto}
          disabled={desactivado}
          onChange={(e) => setTexto(e.target.value)}
          placeholder={t.escribeAqui}
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          spellCheck={false}
          lang="fr"
          className="min-h-14 flex-1 rounded-2xl border-2 border-violet-200 bg-white px-4 text-xl font-semibold text-slate-800 outline-none focus:border-violet-500 disabled:bg-slate-50"
        />
        <button className="btn btn-primario min-h-14 border-violet-600 bg-violet-600 px-5 text-lg hover:bg-violet-700" disabled={desactivado || !texto.trim()}>
          {t.comprobar}
        </button>
      </div>
      {!desactivado && (
        <div className="flex flex-wrap gap-1.5">
          {TECLAS.map((c) => (
            <button key={c} type="button" onClick={() => tecla(c)} className="h-10 min-w-10 cursor-pointer rounded-lg border border-slate-300 bg-white px-2 text-lg font-semibold text-slate-700 hover:bg-violet-50">
              {c}
            </button>
          ))}
        </div>
      )}
    </form>
  )
}

// ——— Prueba y series de práctica ———

/** Unha pregunta: escoller unha resposta, tocar no debuxo ou escribir. */
export type Pregunta =
  | { tipo: 'elixe'; texto: ReactNode; correcta: string; outras: string[]; explica: ReactNode; visual?: ReactNode; oir?: string }
  | { tipo: 'toca'; texto: ReactNode; correcta: string; Debuxo: Debuxo; nomes: Record<string, string>; explica: ReactNode; oir?: string }
  | { tipo: 'escribe'; texto: ReactNode; respostas: string[]; explica?: ReactNode; oir?: string }

export const PREGUNTAS_PROBA = 8

/** Nota sobre 10 con un decimal, como en el examen de clase. */
export const notaSobre10 = (acertos: number, total: number) => Math.round((acertos / total) * 100) / 10

/**
 * Proba: preguntas ao chou, unha soa oportunidade en cada unha, e estrelas ao final. Con `practica`, é unha serie
 * de exercicios sen estrelas que se pode repetir (sen pantalla de inicio e sen gardar marca). Con `xerar`, as
 * preguntas sácaas esa función (o exame colle as mesmas de cada parada) e o final dá a nota sobre 10.
 */
export function Proba({
  id,
  preguntas = [],
  cantas = PREGUNTAS_PROBA,
  practica,
  xerar,
  acabar,
}: {
  id?: string
  preguntas?: Pregunta[]
  cantas?: number
  practica?: boolean
  xerar?: () => Pregunta[]
  acabar?: () => void
}) {
  const t = useT()
  const lingua = useFalar()
  const { progreso, marcar } = useAvance()
  const [rolda, setRolda] = useState(0)
  const lista = useMemo(() => (xerar ? xerar() : barallar(preguntas).slice(0, cantas)), [preguntas, rolda, cantas, xerar])
  const exame = !!xerar
  const opcions = useMemo(() => lista.map((p) => (p.tipo === 'elixe' ? barallar([p.correcta, ...p.outras]) : [])), [lista])
  const [k, setK] = useState(0)
  const [resposta, setResposta] = useState<string | null>(null)
  const [correccion, setCorreccion] = useState<Correccion | null>(null)
  const [acertos, setAcertos] = useState(0)
  const [empezada, setEmpezada] = useState(!!practica)
  const mellor = id ? progreso.pruebas[id] : undefined
  const p = lista[k]

  // Si la pregunta trae algo que oír, se lee al aparecer.
  useEffect(() => {
    if (empezada && p?.oir && lingua) fala(p.oir, lingua)
  }, [empezada, p, lingua])

  function responder(r: string, c?: Correccion) {
    if (resposta !== null) return
    const nota = c ?? (p.tipo !== 'escribe' && r === p.correcta ? 'ben' : 'mal')
    setResposta(r)
    setCorreccion(nota)
    if (nota === 'ben') setAcertos(acertos + 1)
  }
  function seguinte() {
    if (k + 1 === lista.length) {
      if (id && !practica) marcar(id, acertos)
      acabar?.()
    }
    setK(k + 1)
    setResposta(null)
    setCorreccion(null)
  }
  function outraVez() {
    setRolda(rolda + 1)
    setK(0)
    setResposta(null)
    setCorreccion(null)
    setAcertos(0)
    setEmpezada(true)
  }

  if (!empezada)
    return (
      <section className="space-y-4">
        <Burbulla>{exame ? t.exameIntro(lista.length) : t.probaIntro(lista.length)}</Burbulla>
        {mellor !== undefined && (
          <p className="text-center text-lg font-semibold text-slate-600">
            {exame ? (
              t.mellorNota(String(notaSobre10(mellor, lista.length)).replace('.', ','))
            ) : (
              <>
                {t.mellor(mellor, cantas)} <Estrelas n={estrellas(mellor, cantas)} />
              </>
            )}
          </p>
        )}
        <button className="btn btn-primario min-h-14 w-full border-violet-600 bg-violet-600 text-xl hover:bg-violet-700" onClick={() => setEmpezada(true)}>
          {exame ? t.comezarExame : t.comezarProba}
        </button>
      </section>
    )

  if (k >= lista.length && exame) {
    const nota = notaSobre10(acertos, lista.length)
    return (
      <section className="space-y-4 text-center">
        <motion.p initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`text-6xl font-black ${nota >= 5 ? 'text-emerald-600' : 'text-rose-600'}`}>
          {t.nota(String(nota).replace('.', ','))}
        </motion.p>
        <p className="text-2xl font-black text-slate-800">{t.benDe(acertos, lista.length)}</p>
        <Burbulla ton={nota >= 5 ? 'ben' : 'normal'}>{t.exameFin(nota)}</Burbulla>
        <button className="btn btn-primario min-h-14 w-full border-violet-600 bg-violet-600 text-xl hover:bg-violet-700" onClick={outraVez}>
          {t.outroExame}
        </button>
      </section>
    )
  }

  if (k >= lista.length) {
    const n = estrellas(acertos, lista.length)
    return (
      <section className="space-y-4 text-center">
        {!practica && (
          <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-6xl">
            <Estrelas n={n} />
          </motion.div>
        )}
        <p className="text-2xl font-black text-slate-800">{t.benDe(acertos, lista.length)}</p>
        <Burbulla ton={practica || n > 0 ? 'ben' : 'normal'}>{practica ? t.practicaFin(acertos, lista.length) : t.probaFin(n)}</Burbulla>
        <button className="btn btn-primario min-h-14 w-full border-violet-600 bg-violet-600 text-xl hover:bg-violet-700" onClick={outraVez}>
          {practica ? t.outraVez : t.outraProba}
        </button>
      </section>
    )
  }

  const ben = correccion === 'ben'
  const solucion = p.tipo === 'escribe' ? p.respostas[0] : undefined
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between text-sm font-bold text-slate-500">
        <span>{t.pregunta(k + 1, lista.length)}</span>
        <span className="flex gap-1">
          {lista.map((_, i) => (
            <span key={i} className={`h-2.5 w-4 rounded-full sm:w-6 ${i < k ? 'bg-violet-400' : i === k ? 'bg-violet-700' : 'bg-slate-200'}`} />
          ))}
        </span>
      </div>
      <h2 className="flex flex-wrap items-center gap-2 text-2xl font-black text-slate-800">
        {p.texto}
        {p.oir && <Son texto={p.oir} grande />}
      </h2>
      {p.tipo === 'elixe' && (
        <>
          {p.visual && <div className="overflow-hidden rounded-2xl border-2 border-violet-100 bg-white p-2">{p.visual}</div>}
          <div className="grid gap-2 sm:grid-cols-2">
            {opcions[k].map((o) => (
              <button
                key={o}
                onClick={() => responder(o)}
                disabled={resposta !== null}
                className={`min-h-14 cursor-pointer rounded-2xl border-2 px-4 py-2 text-left text-lg font-semibold transition disabled:cursor-default ${
                  resposta === null
                    ? 'border-violet-200 bg-white hover:bg-violet-50'
                    : o === p.correcta
                      ? 'border-emerald-400 bg-emerald-50 text-emerald-900'
                      : o === resposta
                        ? 'border-rose-300 bg-rose-50 text-rose-900'
                        : 'border-slate-200 bg-white opacity-60'
                }`}
              >
                {resposta !== null && o === p.correcta && '✓ '}
                {resposta === o && o !== p.correcta && '✗ '}
                {o}
              </button>
            ))}
          </div>
        </>
      )}
      {p.tipo === 'toca' && (
        <div className="overflow-hidden rounded-2xl border-2 border-violet-100 bg-white">
          <p.Debuxo
            onToca={(id) => responder(id)}
            marcas={resposta === null ? {} : resposta === p.correcta ? { [p.correcta]: 'ben' } : { [resposta]: 'mal', [p.correcta]: 'ben' }}
            etiquetas={false}
          />
        </div>
      )}
      {p.tipo === 'escribe' && <Campo key={k} desactivado={resposta !== null} onEnviar={(texto) => responder(texto, corrixir(texto, p.respostas))} />}
      {resposta !== null && (
        <>
          <Burbulla ton={ben ? 'ben' : 'mal'}>
            {p.tipo === 'escribe' ? (
              <>
                {ben ? t.ben : correccion === 'acentos' ? t.acentos(solucion!) : `${t.non}${t.solucion(solucion!)}`}
                {solucion && <Son texto={solucion} />}
                {p.explica && <span className="block font-medium">{p.explica}</span>}
              </>
            ) : (
              <>
                {ben ? t.ben : p.tipo === 'toca' ? t.tocaches(p.nomes[resposta]) : t.non}
                <span className="font-medium">{p.explica}</span>
              </>
            )}
          </Burbulla>
          <button className="btn btn-primario min-h-14 w-full border-violet-600 bg-violet-600 text-xl hover:bg-violet-700" onClick={seguinte}>
            {k + 1 === lista.length ? t.verResultado : t.seguintePregunta}
          </button>
        </>
      )}
    </section>
  )
}

export function Estrelas({ n }: { n: number }) {
  const t = useT()
  return (
    <span role="img" aria-label={t.estrelas(n)}>
      <span className="text-amber-400">{'★'.repeat(n)}</span>
      <span className="text-slate-300">{'★'.repeat(3 - n)}</span>
    </span>
  )
}
