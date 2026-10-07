// Piezas de las unidades de Primaria. Todo lo que lee la alumna va en galego, como su libro: frases cortas,
// botones grandes y una guía, Estrela, que anima y corrige. Se responde tocando, nunca escribiendo.
import { useMemo, useState, type ReactNode } from 'react'
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

/** Estrela, a unicornia astronauta que guía as unidades de Primaria. */
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

/** Lo que dice Estrela, en un bocadillo. */
export function Burbulla({ children, ton = 'normal' }: { children: ReactNode; ton?: 'normal' | 'ben' | 'mal' }) {
  const cor = ton === 'ben' ? 'border-emerald-300 bg-emerald-50 text-emerald-900' : ton === 'mal' ? 'border-amber-300 bg-amber-50 text-amber-900' : 'border-violet-200 bg-violet-50 text-violet-950'
  return (
    <div className="flex items-start gap-2">
      <Estrela />
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

export const MODOS_PRIMARIA = [
  ['descubre', 'Descubre'],
  ['xoga', 'Xoga'],
  ['proba', '★ Proba'],
] as const

/** Armazón de una parada de Primaria: volver al mapa, título y los tres modos, que siguen montados al cambiar. */
export function ParadaPrimaria({ ruta, titulo, modo, paneis }: { ruta: string; titulo: string; modo?: string; paneis: Record<(typeof MODOS_PRIMARIA)[number][0], ReactNode> }) {
  const activo = MODOS_PRIMARIA.find(([m]) => m === modo)?.[0] ?? 'descubre'
  const mapa = ruta.slice(0, ruta.lastIndexOf('/'))
  return (
    <>
      <a href={mapa} className="text-lg font-semibold text-violet-700">
        ← Mapa da unidade
      </a>
      <h1 className="mt-2 text-3xl font-black text-slate-800 sm:text-4xl">{titulo}</h1>
      <nav className="mt-4 grid grid-cols-3 gap-1 rounded-2xl bg-violet-100 p-1">
        {MODOS_PRIMARIA.map(([m, nome]) => (
          <a
            key={m}
            href={`${ruta}/${m}`}
            className={`rounded-xl px-2 py-3 text-center text-base font-bold sm:text-lg ${m === activo ? 'bg-white text-violet-700 shadow-sm' : 'text-violet-900/70'}`}
          >
            {nome}
          </a>
        ))}
      </nav>
      <div className="mt-5">
        {MODOS_PRIMARIA.map(([m]) => (
          <div key={m} hidden={m !== activo}>
            {paneis[m]}
          </div>
        ))}
      </div>
    </>
  )
}

export interface Tarxeta {
  titulo: string
  texto: ReactNode
  visual: ReactNode
  /** O debuxo vai debaixo do texto, a todo o ancho (para os mapas). */
  ancho?: boolean
}

/** Modo Descubre: unha idea por tarxeta, con texto curto e un debuxo grande. */
export function Tarxetas({ tarxetas, xoga }: { tarxetas: Tarxeta[]; xoga: string }) {
  const [i, setI] = useState(0)
  const t = tarxetas[i]
  return (
    <section>
      <AnimatePresence mode="wait">
        <motion.div key={i} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.18 }}>
          <h2 className="mb-3 text-2xl font-black text-violet-800">{t.titulo}</h2>
          <div className={`grid items-start gap-4 ${t.ancho ? '' : 'md:grid-cols-[2fr_3fr]'}`}>
            <div className="space-y-3 text-xl leading-relaxed">{t.texto}</div>
            <div className="overflow-hidden rounded-2xl border-2 border-violet-100 bg-white p-2">{t.visual}</div>
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="mt-5 flex items-center justify-between gap-2">
        <button className="btn min-h-12 text-lg" disabled={i === 0} onClick={() => setI(i - 1)}>
          ← Atrás
        </button>
        <span className="flex gap-1.5" aria-label={`${i + 1} de ${tarxetas.length}`}>
          {tarxetas.map((_, k) => (
            <button key={k} onClick={() => setI(k)} aria-label={`Tarxeta ${k + 1}`} className={`h-3.5 w-3.5 cursor-pointer rounded-full ${k === i ? 'scale-125 bg-violet-600' : k < i ? 'bg-violet-300' : 'bg-slate-300'}`} />
          ))}
        </span>
        {i < tarxetas.length - 1 ? (
          <button className="btn btn-primario min-h-12 border-violet-600 bg-violet-600 text-lg hover:bg-violet-700" onClick={() => setI(i + 1)}>
            Seguinte →
          </button>
        ) : (
          <a className="btn btn-primario min-h-12 border-violet-600 bg-violet-600 text-lg hover:bg-violet-700" href={xoga}>
            A xogar! →
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
  const [actual, setActual] = useState<string | null>(null)
  const [partida, setPartida] = useState(0)
  const [feitos, setFeitos] = useState<Record<string, boolean>>({})
  const x = xogos.find((g) => g.id === actual)
  const acabar = () => x && setFeitos((f) => ({ ...f, [x.id]: true }))

  if (x)
    return (
      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <button className="btn min-h-12 text-lg" onClick={() => setActual(null)}>
            ← Outros xogos
          </button>
          <button className="btn min-h-12 text-lg" onClick={() => setPartida(partida + 1)}>
            ↻ Comezar de novo
          </button>
        </div>
        <h2 className="mb-3 text-2xl font-black text-violet-800">
          <span aria-hidden="true">{x.icono}</span> {x.titulo}
        </h2>
        <div key={partida}>{x.crear(acabar)}</div>
      </section>
    )

  const todos = xogos.every((g) => feitos[g.id])
  return (
    <section>
      <Burbulla ton={todos ? 'ben' : 'normal'}>{todos ? 'Xogaches a todo! Agora podes facer a proba e gañar estrelas.' : 'Escolle un xogo. Podes xogar as veces que queiras.'}</Burbulla>
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
          Ir á proba ★
        </a>
      )}
    </section>
  )
}

/** Busca no debuxo: pide os elementos un a un. Se toca outro, dille cal tocou. */
export function Busca({ Debuxo, nomes, obxectivos, pide = 'Toca', acabar }: { Debuxo: Debuxo; nomes: Record<string, string>; obxectivos: string[]; pide?: string; acabar: () => void }) {
  const orde = useMemo(() => barallar(obxectivos), [obxectivos])
  const [k, setK] = useState(0)
  const [marcas, setMarcas] = useState<Record<string, Marca>>({})
  const [aviso, setAviso] = useState<{ texto: string; ton: 'ben' | 'mal' } | null>(null)
  const [fallos, setFallos] = useState(0)
  const obx = orde[k]
  const rematado = k >= orde.length

  function toca(id: string) {
    if (rematado) return
    if (id === obx) {
      const novas = { ...marcas, [id]: 'ben' as Marca }
      for (const m in novas) if (novas[m] === 'mal') delete novas[m]
      setMarcas(novas)
      setAviso({ texto: `Si! Iso é ${nomes[id]}.`, ton: 'ben' })
      setK(k + 1)
      if (k + 1 === orde.length) acabar()
    } else {
      setFallos(fallos + 1)
      setMarcas({ ...marcas, [id]: 'mal' })
      setAviso({ texto: nomes[id] ? `Iso é ${nomes[id]}. Busca ${nomes[obx]}.` : `Aí non. Busca ${nomes[obx]}.`, ton: 'mal' })
    }
  }

  return (
    <div className="space-y-3">
      {rematado ? (
        <Burbulla ton="ben">{fallos === 0 ? 'Perfecto! Atopáchelo todo á primeira.' : `Moi ben! Atopáchelo todo. Equivocácheste ${fallos} ${fallos === 1 ? 'vez' : 'veces'}.`}</Burbulla>
      ) : (
        <Burbulla ton={aviso?.ton}>
          {aviso && <span className="block text-base font-medium">{aviso.texto}</span>}
          {pide} <span className="text-violet-700">{nomes[obx]}</span>.
        </Burbulla>
      )}
      <p className="text-center text-sm font-semibold text-slate-500">
        {Math.min(k, orde.length)} de {orde.length}
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
  const orde = useMemo(() => barallar(elementos), [elementos])
  const [colocados, setColocados] = useState<Record<string, string>>({})
  const [elixido, setElixido] = useState<string | null>(null)
  const [aviso, setAviso] = useState<{ texto: string; ton: 'ben' | 'mal' } | null>(null)
  const quedan = orde.filter((e) => !colocados[e.texto])

  function poñer(caixa: string) {
    const e = orde.find((x) => x.texto === elixido)
    if (!e) {
      setAviso({ texto: 'Primeiro toca unha palabra de arriba.', ton: 'mal' })
      return
    }
    const nome = caixas.find((c) => c.id === caixa)?.nome
    if (e.caixa === caixa) {
      setColocados({ ...colocados, [e.texto]: caixa })
      setElixido(null)
      setAviso({ texto: `Ben! ${e.texto}: ${nome}.`, ton: 'ben' })
      if (quedan.length === 1) acabar()
    } else setAviso({ texto: e.pista ?? `${e.texto} non vai en «${nome}». Pensa outra vez.`, ton: 'mal' })
  }

  return (
    <div className="space-y-4">
      {quedan.length === 0 ? (
        <Burbulla ton="ben">Moi ben! Clasificaches todo.</Burbulla>
      ) : (
        <Burbulla ton={aviso?.ton}>{aviso?.texto ?? 'Toca unha palabra e despois a caixa onde vai.'}</Burbulla>
      )}
      <div className="flex min-h-14 flex-wrap justify-center gap-2">
        {quedan.map((e) => (
          <button
            key={e.texto}
            onClick={() => setElixido(e.texto)}
            className={`min-h-12 cursor-pointer rounded-full border-2 px-4 text-lg font-bold transition ${elixido === e.texto ? 'scale-105 border-violet-600 bg-violet-600 text-white' : 'border-violet-200 bg-white text-slate-800 hover:bg-violet-50'}`}
          >
            {e.texto}
          </button>
        ))}
      </div>
      <div className={`grid gap-3 ${caixas.length > 2 ? 'grid-cols-2' : 'grid-cols-2'}`}>
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
  const palabras = useMemo(() => barallar(pares.map((p) => p.palabra)), [pares])
  const significados = useMemo(() => barallar(pares), [pares])
  const [elixida, setElixida] = useState<string | null>(null)
  const [unidas, setUnidas] = useState<Record<string, boolean>>({})
  const [aviso, setAviso] = useState<{ texto: string; ton: 'ben' | 'mal' } | null>(null)
  const rematado = pares.every((p) => unidas[p.palabra])

  function significado(p: { palabra: string; significado: string }) {
    if (unidas[p.palabra]) return
    if (!elixida) {
      setAviso({ texto: 'Primeiro toca unha palabra da esquerda.', ton: 'mal' })
      return
    }
    if (p.palabra === elixida) {
      const novas = { ...unidas, [p.palabra]: true }
      setUnidas(novas)
      setElixida(null)
      setAviso({ texto: `Ben! ${p.palabra}.`, ton: 'ben' })
      if (pares.every((x) => novas[x.palabra])) acabar()
    } else setAviso({ texto: `Iso non é «${elixida}». Le outra vez.`, ton: 'mal' })
  }

  return (
    <div className="space-y-4">
      {rematado ? <Burbulla ton="ben">Moi ben! Uniches todas.</Burbulla> : <Burbulla ton={aviso?.ton}>{aviso?.texto ?? 'Toca unha palabra e despois o que significa.'}</Burbulla>}
      <div className="grid grid-cols-[2fr_5fr] gap-3">
        <div className="flex flex-col gap-2">
          {palabras.map((w) => (
            <button
              key={w}
              disabled={unidas[w]}
              onClick={() => setElixida(w)}
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

/** Unha pregunta da proba: escoller unha resposta ou tocar no debuxo. */
export type Pregunta =
  | { tipo: 'elixe'; texto: string; correcta: string; outras: string[]; explica: string; visual?: ReactNode }
  | { tipo: 'toca'; texto: string; correcta: string; Debuxo: Debuxo; nomes: Record<string, string>; explica: string }

export const PREGUNTAS_PROBA = 8

/** Proba: 8 preguntas ao chou, unha soa oportunidade en cada unha, e estrelas ao final. */
export function Proba({ id, preguntas }: { id: string; preguntas: Pregunta[] }) {
  const { progreso, marcar } = useAvance()
  const [rolda, setRolda] = useState(0)
  const lista = useMemo(() => barallar(preguntas).slice(0, PREGUNTAS_PROBA), [preguntas, rolda])
  const opcions = useMemo(() => lista.map((p) => (p.tipo === 'elixe' ? barallar([p.correcta, ...p.outras]) : [])), [lista])
  const [k, setK] = useState(0)
  const [resposta, setResposta] = useState<string | null>(null)
  const [acertos, setAcertos] = useState(0)
  const [empezada, setEmpezada] = useState(false)
  const mellor = progreso.pruebas[id]

  function responder(r: string) {
    if (resposta !== null) return
    setResposta(r)
    if (r === lista[k].correcta) setAcertos(acertos + 1)
  }
  function seguinte() {
    if (k + 1 === lista.length) marcar(id, acertos)
    setK(k + 1)
    setResposta(null)
  }
  function outraVez() {
    setRolda(rolda + 1)
    setK(0)
    setResposta(null)
    setAcertos(0)
    setEmpezada(true)
  }

  if (!empezada)
    return (
      <section className="space-y-4">
        <Burbulla>
          Na proba hai {PREGUNTAS_PROBA} preguntas e só tes unha oportunidade en cada unha. Se acertas todas, gañas tres estrelas!
        </Burbulla>
        {mellor !== undefined && (
          <p className="text-center text-lg font-semibold text-slate-600">
            A túa mellor marca: {mellor} de {PREGUNTAS_PROBA} <Estrelas n={estrellas(mellor, PREGUNTAS_PROBA)} />
          </p>
        )}
        <button className="btn btn-primario min-h-14 w-full border-violet-600 bg-violet-600 text-xl hover:bg-violet-700" onClick={() => setEmpezada(true)}>
          Comezar a proba
        </button>
      </section>
    )

  if (k >= lista.length) {
    const n = estrellas(acertos, PREGUNTAS_PROBA)
    return (
      <section className="space-y-4 text-center">
        <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-6xl">
          <Estrelas n={n} />
        </motion.div>
        <p className="text-2xl font-black text-slate-800">
          {acertos} de {PREGUNTAS_PROBA} ben
        </p>
        <Burbulla ton={n > 0 ? 'ben' : 'normal'}>
          {n === 3 ? 'Perfecto! Tres estrelas!' : n > 0 ? 'Moi ben! Repasa o que fallaches e volve intentalo para gañar máis estrelas.' : 'Aínda non. Volve a Descubre e a Xoga, e logo téntao outra vez.'}
        </Burbulla>
        <button className="btn btn-primario min-h-14 w-full border-violet-600 bg-violet-600 text-xl hover:bg-violet-700" onClick={outraVez}>
          Facer outra proba
        </button>
      </section>
    )
  }

  const p = lista[k]
  const ben = resposta === p.correcta
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between text-sm font-bold text-slate-500">
        <span>
          Pregunta {k + 1} de {lista.length}
        </span>
        <span className="flex gap-1">
          {lista.map((_, i) => (
            <span key={i} className={`h-2.5 w-6 rounded-full ${i < k ? 'bg-violet-400' : i === k ? 'bg-violet-700' : 'bg-slate-200'}`} />
          ))}
        </span>
      </div>
      <h2 className="text-2xl font-black text-slate-800">{p.texto}</h2>
      {p.tipo === 'elixe' ? (
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
      ) : (
        <div className="overflow-hidden rounded-2xl border-2 border-violet-100 bg-white">
          <p.Debuxo
            onToca={(id) => responder(id)}
            marcas={resposta === null ? {} : resposta === p.correcta ? { [p.correcta]: 'ben' } : { [resposta]: 'mal', [p.correcta]: 'ben' }}
            etiquetas={false}
          />
        </div>
      )}
      {resposta !== null && (
        <>
          <Burbulla ton={ben ? 'ben' : 'mal'}>
            {ben ? 'Ben! ' : p.tipo === 'toca' ? `Non: tocaches ${p.nomes[resposta] ?? 'outro sitio'}. ` : 'Non. '}
            <span className="font-medium">{p.explica}</span>
          </Burbulla>
          <button className="btn btn-primario min-h-14 w-full border-violet-600 bg-violet-600 text-xl hover:bg-violet-700" onClick={seguinte}>
            {k + 1 === lista.length ? 'Ver o resultado' : 'Seguinte pregunta →'}
          </button>
        </>
      )}
    </section>
  )
}

export function Estrelas({ n }: { n: number }) {
  return (
    <span role="img" aria-label={`${n} de 3 estrelas`}>
      <span className="text-amber-400">{'★'.repeat(n)}</span>
      <span className="text-slate-300">{'★'.repeat(3 - n)}</span>
    </span>
  )
}
