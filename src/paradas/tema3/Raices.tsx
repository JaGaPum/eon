// Tema 3 · Parada 5: cuadrados perfectos, raíz cuadrada exacta y entera (con su resto) y raíces de fracciones.
import { useState, type ReactNode } from 'react'
import { motion } from 'motion/react'
import Parada, { Tarjetas, type PropsParada, type Tarjeta } from '../../componentes/Parada'
import Practica from '../../componentes/Practica'
import { Contador } from '../../componentes/piezas'
import { F } from '../../componentes/mat'
import { PasosGuiados, type PasoG } from '../../componentes/fraccionesUI'
import { RAICES, nuevaRaices } from '../../contenido/tema3'
import { cuadradoSiguiente, raizEntera } from '../../lib/potencias'
import { fr } from '../../lib/fracciones'
import { Pot } from './comun'

const G = 'text-2xl font-bold'
const Raiz = ({ children }: { children: ReactNode }) => (
  <span className="inline-flex items-stretch">
    <span className="self-center">√</span>
    <span className="border-t-2 border-current pl-0.5">{children}</span>
  </span>
)

const TARJETAS: Tarjeta[] = [
  {
    titulo: 'Cuadrados y raíces: una cosa y la contraria',
    texto: (
      <>
        <p>
          La <b>raíz cuadrada</b> de un número es otro que, elevado al cuadrado, da el primero:
        </p>
        <p className={G}>
          <Raiz>49</Raiz> = 7 porque <Pot b="7" e="2" /> = 49
        </p>
        <p>
          Un <b>cuadrado perfecto</b> es el cuadrado de un entero: 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144…
        </p>
        <p className="text-base text-slate-600">💡 También (−7)² = 49: un número positivo tiene dos raíces, 7 y −7. La que se escribe con √ es la positiva.</p>
      </>
    ),
    visual: (
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 49 }, (_, k) => (
          <span key={k} className="h-5 w-5 rounded bg-indigo-400" />
        ))}
        <p className="nota col-span-7 mt-1">49 baldosas forman un cuadrado de 7 de lado.</p>
      </div>
    ),
  },
  {
    titulo: 'Los negativos no tienen raíz',
    texto: (
      <>
        <p>
          <Raiz>−25</Raiz> no existe: ningún número multiplicado por sí mismo da negativo (5 · 5 = 25 y (−5) · (−5) = 25).
        </p>
        <p>Pista para descartar: un cuadrado perfecto nunca acaba en 2, 3, 7 ni 8.</p>
        <p className="text-xl">Última cifra del número → del cuadrado: 1→1, 2→4, 3→9, 4→6, 5→5, 6→6, 7→9, 8→4, 9→1, 0→0.</p>
      </>
    ),
  },
  {
    titulo: 'Raíz entera y resto',
    texto: (
      <>
        <p>Si el número no es un cuadrado perfecto, se busca el mayor cuadrado que cabe en él:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            La <b>raíz entera</b> es el número de ese cuadrado.
          </li>
          <li>
            El <b>resto</b> es lo que sobra: número − (raíz entera)².
          </li>
        </ul>
        <p className={G}>
          <Raiz>98</Raiz>: 9² = 81 ≤ 98 &lt; 100 = 10²
        </p>
        <p className={G}>Raíz entera 9, resto 98 − 81 = 17</p>
        <p className="text-base text-slate-600">Con 98 baldosas, el cuadrado más grande es de 9 por lado y sobran 17.</p>
      </>
    ),
  },
  {
    titulo: 'Raíz de una fracción',
    texto: (
      <>
        <p>La raíz de arriba entre la raíz de abajo. Si no salen exactas, simplifica primero:</p>
        <p className={G}>
          <Raiz>
            <F n={169} d={144} />
          </Raiz>{' '}
          = <F n={13} d={12} />
        </p>
        <p className={G}>
          <Raiz>
            <F n={1125} d={245} />
          </Raiz>{' '}
          ={' '}
          <Raiz>
            <F n={225} d={49} />
          </Raiz>{' '}
          = <F n={15} d={7} />
        </p>
      </>
    ),
  },
  {
    titulo: 'Problemas de cuadrados',
    texto: (
      <>
        <p>Si te dan el <b>área de un cuadrado</b>, el lado es su raíz:</p>
        <p className={G}>
          4900 m² → lado = <Raiz>4900</Raiz> = 70 m
        </p>
        <p>Si es un rectángulo y quieres un cuadrado con la misma área: multiplica largo por ancho y haz la raíz.</p>
        <p className={G}>
          16 · 9 = 144 → <Raiz>144</Raiz> = 12 m
        </p>
        <p className="text-base text-slate-600">Para que un número sea cuadrado perfecto, todos los exponentes de su descomposición tienen que ser pares.</p>
      </>
    ),
  },
]

/** Baldosas: con N baldosas se forma el mayor cuadrado posible; se ven las que sobran y las que faltarían. */
function Probar() {
  const [n, setN] = useState(77)
  const { r, resto } = raizEntera(n)
  const sig = cuadradoSiguiente(n)
  const lado = resto ? r + 1 : r
  const T = Math.min(26, Math.floor(300 / lado))
  // Las que sobran se colocan en el borde (columna de la derecha y luego fila de abajo); el resto del borde, en hueco.
  const borde: [number, number][] = resto ? [...Array.from({ length: r }, (_, k): [number, number] => [r, k]), ...Array.from({ length: r + 1 }, (_, k): [number, number] => [k, r])] : []
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold">Con baldosas</h2>
      <p>¿Cuántas baldosas tienes? Se forma el cuadrado más grande posible.</p>
      <div className="flex flex-wrap items-center gap-3">
        <Contador valor={n} cambiar={setN} min={1} max={225} etiqueta="las baldosas" />
        <input type="range" min={1} max={225} value={n} onChange={(ev) => setN(Number(ev.target.value))} className="w-56 accent-indigo-600" aria-label="Baldosas" />
        {[49, 77, 98, 144, 195].map((x) => (
          <button key={x} className={`btn ${x === n ? 'btn-activo' : ''}`} onClick={() => setN(x)}>
            {x}
          </button>
        ))}
      </div>
      <div className="lienzo gap-4 sm:flex-row sm:items-start sm:justify-around">
        <svg width={lado * T + 4} height={lado * T + 4} viewBox={`-2 -2 ${lado * T + 4} ${lado * T + 4}`} role="img" aria-label={`${n} baldosas: un cuadrado de ${r} por lado y sobran ${resto}`}>
          {Array.from({ length: r * r }, (_, k) => (
            <motion.rect key={`c${k}`} initial={false} animate={{ opacity: 1 }} x={(k % r) * T + 1} y={Math.floor(k / r) * T + 1} width={T - 2} height={T - 2} rx={3} fill="#6366f1" />
          ))}
          {borde.map(([x, y], k) => (
            <rect key={`b${k}`} x={x * T + 1} y={y * T + 1} width={T - 2} height={T - 2} rx={3} fill={k < resto ? '#f59e0b' : 'none'} stroke={k < resto ? 'none' : '#94a3b8'} strokeDasharray="4 3" strokeWidth={1.5} />
          ))}
        </svg>
        <div className="space-y-2 text-lg">
          <p className="text-2xl font-black text-indigo-700">
            <Raiz>{n}</Raiz> {resto ? `≈ ${r}` : `= ${r}`}
          </p>
          <p>
            <span className="mr-1 inline-block h-4 w-4 rounded bg-indigo-500 align-middle" />
            Cuadrado de {r} × {r} = {r * r}
          </p>
          {resto > 0 ? (
            <>
              <p>
                <span className="mr-1 inline-block h-4 w-4 rounded bg-amber-500 align-middle" />
                Sobran {resto} (el resto)
              </p>
              <p>
                <span className="mr-1 inline-block h-4 w-4 rounded border-2 border-dashed border-slate-400 align-middle" />
                Faltan {sig.faltan} para el de {sig.lado} × {sig.lado} = {sig.lado * sig.lado}
              </p>
              <p className="font-semibold">
                Raíz entera {r}, resto {resto}.
              </p>
            </>
          ) : (
            <p className="font-semibold text-emerald-700">¡Cuadrado perfecto! No sobra ninguna: {n} = {r}².</p>
          )}
        </div>
      </div>
    </section>
  )
}

/** Raíz entera paso a paso, probando cuadrados. */
export function pasosRaiz(entrada: string): PasoG[] {
  const s = entrada.replace(/\s+/g, '').replace('√', '')
  const fra = /^(\d+)\/(\d+)$/.exec(s)
  if (fra) {
    const [a, b] = [Number(fra[1]), Number(fra[2])]
    if (!b) throw new Error('El denominador no puede ser 0.')
    const f = fr(a, b)
    const ra = raizEntera(f.n)
    const rb = raizEntera(f.d)
    if (ra.resto || rb.resto) throw new Error('Esa fracción no tiene raíz exacta, ni simplificada.')
    return [
      { linea: <span className={G}><Raiz><F n={a} d={b} /></Raiz></span>, explica: <p>Raíz de una fracción: raíz de arriba entre raíz de abajo.</p> },
      ...(f.n !== a ? [{ linea: <span className={G}>= <Raiz><F n={f.n} d={f.d} /></Raiz></span>, explica: <p>Así no salen exactas: primero se simplifica.</p> }] : []),
      { linea: <span className={G}>= <F n={ra.r} d={rb.r} /></span>, explica: <p>√{f.n} = {ra.r} y √{f.d} = {rb.r}.</p> },
    ]
  }
  if (!/^\d+$/.test(s)) throw new Error('Escribe un número entero positivo (o una fracción como 169/144).')
  const n = Number(s)
  if (n > 1e9) throw new Error('Usa un número más pequeño.')
  const { r, resto } = raizEntera(n)
  return [
    { linea: <span className={G}><Raiz>{n}</Raiz></span>, explica: <p>Busca el mayor número que, elevado al cuadrado, no se pase de {n}.</p> },
    { linea: <span className="text-xl font-semibold">{r}² = {r * r} ≤ {n}{resto ? ` < ${(r + 1) ** 2} = ${r + 1}²` : ''}</span>, explica: <p>{resto ? `${r}² cabe y ${r + 1}² ya se pasa.` : `${r}² da justo ${n}.`}</p> },
    resto
      ? { linea: <span className={G}>Raíz entera {r}, resto {n} − {r * r} = {resto}</span>, explica: <p>No es un cuadrado perfecto: la raíz entera es {r} y sobran {resto}.</p> }
      : { linea: <span className={G}>√{n} = {r}</span>, explica: <p>Es un cuadrado perfecto: la raíz es exacta.</p> },
  ]
}

const EJEMPLOS = ['98', '229', '78956', '144', '169/144', '1125/245'].map((s) => ({ nombre: s, pasos: pasosRaiz(s) }))

export default function Raices({ modo, progreso, apuntar }: PropsParada) {
  return (
    <Parada
      id="raices"
      titulo="Raíces cuadradas"
      modo={modo}
      paneles={{
        entender: <Tarjetas tarjetas={TARJETAS} parada="raices" />,
        probar: <Probar />,
        desmenuzar: <PasosGuiados titulo="Una raíz, paso a paso" ejemplos={EJEMPLOS} crear={pasosRaiz} placeholder="O escribe la tuya: 500 o 49/16" ayuda="Un número entero (verás su raíz entera y su resto) o una fracción." />,
        practicar: <Practica clase={RAICES} generar={nuevaRaices} progreso={progreso} apuntar={apuntar} />,
      }}
    />
  )
}
