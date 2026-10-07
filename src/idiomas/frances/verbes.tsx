// Parada «Les verbes en -er»: los verbos regulares de la ficha de Jérémie, con marcher de modelo y manger y
// nager como casos especiales (nous mangeons, nous nageons).
import { Fr, ParadaPrimaria, Proba, Tarxetas, Une, barallar, type Pregunta, type Tarxeta, type Xogo, Xogos } from '../../primaria/pezas'
import { elixe } from '../../primaria/paisaxes/preguntas'

export const VERBOS: [string, string][] = [
  ['marcher', 'andar'],
  ['sauter', 'saltar'],
  ['tomber', 'caerse'],
  ['téléphoner', 'llamar por teléfono'],
  ['jouer', 'jugar'],
  ['danser', 'bailar'],
  ['pleurer', 'llorar'],
  ['crier', 'gritar'],
  ['dessiner', 'dibujar'],
  ['écouter', 'escuchar'],
  ['manger', 'comer'],
  ['nager', 'nadar'],
]

export const PERSOAS = ['je', 'tu', 'il', 'elle', 'on', 'nous', 'vous', 'ils', 'elles'] as const
type Persoa = (typeof PERSOAS)[number]

const TERMINACION: Record<Persoa, string> = { je: 'e', tu: 'es', il: 'e', elle: 'e', on: 'e', nous: 'ons', vous: 'ez', ils: 'ent', elles: 'ent' }
const PRONOME_ES: Record<Persoa, string> = { je: 'yo', tu: 'tú', il: 'él', elle: 'ella', on: 'se (nosotros)', nous: 'nosotros', vous: 'vosotros', ils: 'ellos', elles: 'ellas' }

/** Solo la forma del verbo: marche, mangeons... */
export function forma(inf: string, p: Persoa): string {
  let raiz = inf.slice(0, -2)
  // Con -ger se conserva la e delante de -ons para que la g suene igual: nous mangeons.
  if (p === 'nous' && raiz.endsWith('g')) raiz += 'e'
  return raiz + TERMINACION[p]
}

/** Pronombre y verbo, con je → j' delante de vocal: je marche, j'écoute. */
export function conxuga(inf: string, p: Persoa): string {
  const f = forma(inf, p)
  return p === 'je' && /^[aeiouéèêh]/.test(f) ? `j'${f}` : `${p} ${f}`
}

const MODELO = ['je', 'tu', 'il', 'nous', 'vous', 'ils'] as const

/** Tabla de conjugación con la terminación resaltada y botón para oír cada forma. */
export function Taboa({ inf, resalta }: { inf: string; resalta?: Persoa }) {
  const raiz = inf.slice(0, -2)
  return (
    <table className="w-full text-xl">
      <tbody>
        {MODELO.map((p) => {
          const pron = p === 'il' ? 'il / elle / on' : p === 'ils' ? 'ils / elles' : p
          const f = forma(inf, p)
          const conPron = conxuga(inf, p)
          const xunto = conPron.startsWith("j'")
          return (
            <tr key={p} className={`border-b border-slate-100 last:border-0 ${resalta === p ? 'bg-amber-50' : ''}`}>
              <td className="py-1.5 pr-3 text-slate-500" lang="fr">
                {xunto ? "j'" : pron}
              </td>
              <td className="py-1.5 font-bold text-slate-800" lang="fr">
                {f.slice(0, raiz.length)}
                <span className="text-rose-600">{f.slice(raiz.length)}</span>
              </td>
              <td className="py-1.5 text-right">
                <Fr>{conPron}</Fr>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

const b = (t: string) => <b className="text-violet-800">{t}</b>

const TARXETAS: Tarxeta[] = [
  {
    titulo: 'Los verbos regulares en ‑er',
    texto: (
      <>
        <p>
          Los verbos que estudiamos acaban en {b('‑er')} en infinitivo: <Fr>marcher</Fr>, <Fr>danser</Fr>, <Fr>jouer</Fr>...
        </p>
        <p>
          Se llaman {b('regulares')} porque todos se conjugan igual: se quita la <b>‑er</b> y se pone la terminación de cada persona.
        </p>
      </>
    ),
    visual: (
      <div className="flex flex-col items-center gap-3 p-4 text-3xl font-black" lang="fr">
        <span>
          march<span className="text-slate-300 line-through">er</span>
        </span>
        <span className="text-xl text-slate-500">↓</span>
        <span>
          march<span className="text-rose-600">e</span> · march<span className="text-rose-600">ons</span> · march<span className="text-rose-600">ez</span>
        </span>
      </div>
    ),
  },
  {
    titulo: <>El modelo: MARCHER (andar)</>,
    texto: (
      <>
        <p>Así se conjuga. Fíjate en las terminaciones en rojo: son las mismas para todos los verbos en ‑er.</p>
        <p className="text-base text-slate-600">Toca 🔊 para oír cada forma.</p>
      </>
    ),
    visual: <Taboa inf="marcher" />,
  },
  {
    titulo: 'Las terminaciones',
    texto: (
      <>
        <div className="grid grid-cols-2 gap-x-6 gap-y-1 rounded-2xl bg-white p-4 text-2xl font-bold" lang="fr">
          <span>je ‑<span className="text-rose-600">e</span></span>
          <span>nous ‑<span className="text-rose-600">ons</span></span>
          <span>tu ‑<span className="text-rose-600">es</span></span>
          <span>vous ‑<span className="text-rose-600">ez</span></span>
          <span>il/elle/on ‑<span className="text-rose-600">e</span></span>
          <span>ils/elles ‑<span className="text-rose-600">ent</span></span>
        </div>
        <p className="text-base text-slate-600">
          💡 <i>je marche, tu marches, il marche</i> e <i>ils marchent</i> suenan igual: la ‑s y la ‑ent no se pronuncian. Solo se oyen distintas <i>nous marchons</i> y <i>vous marchez</i>. Por eso hay que fijarse al escribir.
        </p>
      </>
    ),
  },
  {
    titulo: 'Los pronombres',
    texto: (
      <>
        <div className="grid grid-cols-2 gap-2 text-xl sm:grid-cols-3">
          {PERSOAS.map((p) => (
            <span key={p} className="rounded-xl bg-white px-3 py-2">
              <Fr>{p}</Fr> <span className="text-slate-500">= {PRONOME_ES[p]}</span>
            </span>
          ))}
        </div>
        <p>
          ⚠️ Delante de vocal o h, {b('je')} pierde la e: <Fr>j'écoute</Fr>, no <s>je écoute</s>.
        </p>
      </>
    ),
  },
  {
    titulo: 'Los verbos de la ficha',
    texto: (
      <div className="grid gap-2 sm:grid-cols-2">
        {VERBOS.map(([v, es]) => (
          <span key={v} className="rounded-xl bg-white px-3 py-2 text-xl">
            <Fr>{v}</Fr> <span className="text-slate-500">= {es}</span>
          </span>
        ))}
      </div>
    ),
  },
  {
    titulo: 'Cuidado con MANGER y NAGER',
    texto: (
      <>
        <p>
          Son regulares, pero con <b>nous</b> conservan la {b('e')}: <Fr>nous mangeons</Fr>, <Fr>nous nageons</Fr>.
        </p>
        <p>Sin esa e, la g sonaría como en «gato». Con ella suena igual que en «je mange».</p>
      </>
    ),
    visual: <Taboa inf="manger" resalta="nous" />,
  },
]

/** Una persona al azar entre las nueve. */
const persoa = () => PERSOAS[Math.floor(Math.random() * PERSOAS.length)]

/** Elegir la forma correcta entre las de otras personas del mismo verbo. */
function preguntaTerminacion(): Pregunta {
  const [inf] = VERBOS[Math.floor(Math.random() * VERBOS.length)]
  const p = persoa()
  const boa = forma(inf, p)
  const outras = [...new Set(PERSOAS.map((q) => forma(inf, q)))].filter((f) => f !== boa)
  const pron = conxuga(inf, p).startsWith("j'") ? "j'" : p
  return elixe(
    <span lang="fr">
      {pron} ___ ({inf})
    </span>,
    boa,
    barallar(outras).slice(0, 3),
    <>
      Con <b>{p}</b> la terminación es <b>‑{TERMINACION[p]}</b>: <Fr>{conxuga(inf, p)}</Fr>
      {p === 'nous' && inf.endsWith('ger') && ' (con e, por la g)'}.
    </>,
  )
}

/** Escribir la forma: se acepta con o sin pronombre, salvo con j', que hay que escribir. */
function preguntaEscribe(): Pregunta {
  const [inf, es] = VERBOS[Math.floor(Math.random() * VERBOS.length)]
  const p = persoa()
  const completa = conxuga(inf, p)
  const elision = completa.startsWith("j'")
  return {
    tipo: 'escribe',
    texto: (
      <span>
        Escribe <b lang="fr">{elision ? 'je' : p}</b> + <b lang="fr">{inf}</b> <span className="text-base font-semibold text-slate-500">({es})</span>
      </span>
    ),
    respostas: elision ? [completa] : [completa, forma(inf, p)],
    explica: elision ? <>Delante de vocal, je se convierte en j'.</> : undefined,
  }
}

/** Qué significa una forma conjugada. */
function preguntaSignificado(): Pregunta {
  const [inf, es] = VERBOS[Math.floor(Math.random() * VERBOS.length)]
  const outros = barallar(VERBOS.filter(([v]) => v !== inf)).slice(0, 3)
  return elixe(<span lang="fr">{inf}</span>, es, outros.map(([, e]) => e), <>{inf} = {es}.</>, undefined)
}

const serie = (crear: () => Pregunta, n: number) => Array.from({ length: n }, crear)

const XOGOS: Xogo[] = [
  {
    id: 'significado',
    titulo: '¿Qué significa?',
    icono: '🔗',
    explica: 'Une cada verbo con lo que significa.',
    crear: (acabar) => <Une pares={barallar(VERBOS).slice(0, 7).map(([palabra, significado]) => ({ palabra, significado }))} acabar={acabar} />,
  },
  {
    id: 'terminacion',
    titulo: 'Elige la forma',
    icono: '🎯',
    explica: '¿Qué forma va con cada pronombre?',
    crear: (acabar) => <Proba practica cantas={10} preguntas={serie(preguntaTerminacion, 10)} acabar={acabar} />,
  },
  {
    id: 'escribe',
    titulo: 'Escribe el verbo',
    icono: '✍️',
    explica: 'Conjuga tú, con las teclas de los acentos.',
    crear: (acabar) => <Proba practica cantas={10} preguntas={serie(preguntaEscribe, 10)} acabar={acabar} />,
  },
]

export const PREGUNTAS: Pregunta[] = [
  ...serie(preguntaTerminacion, 10),
  ...serie(preguntaEscribe, 10),
  ...serie(preguntaSignificado, 4),
  elixe(
    <span lang="fr">nous ___ (manger)</span>,
    'mangeons',
    ['mangons', 'mangez', 'mangent'],
    <>Con -ger se conserva la e: nous mangeons.</>,
  ),
  elixe(
    <span lang="fr">nous ___ (nager)</span>,
    'nageons',
    ['nagons', 'nagez', 'nageent'],
    <>Como manger: nous nageons.</>,
  ),
  elixe('¿Cómo se dice «yo escucho»?', "j'écoute", ['je écoute', "j'écoutes", 'je écoutons'], <>Delante de vocal, je → j': j'écoute.</>),
  elixe('¿Qué terminación lleva «vous»?', '‑ez', ['‑ons', '‑ent', '‑es'], <>vous marchez, vous dansez...</>),
  elixe('¿Qué terminación lleva «ils / elles»?', '‑ent', ['‑ons', '‑ez', '‑e'], <>ils marchent, elles dansent... (la ‑ent no se pronuncia).</>),
]

export default function Verbes({ ruta, modo }: { ruta: string; modo?: string }) {
  return (
    <ParadaPrimaria
      ruta={ruta}
      titulo="Les verbes en ‑er"
      modo={modo}
      paneis={{
        descubre: <Tarxetas tarxetas={TARXETAS} xoga={`${ruta}/xoga`} />,
        xoga: <Xogos xogos={XOGOS} proba={`${ruta}/proba`} />,
        proba: <Proba id="frances1/verbes" preguntas={PREGUNTAS} />,
      }}
    />
  )
}
