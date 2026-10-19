// Parada «Mettre et acheter»: los dos verbos de la página 15 del libro, en presente, y con la ropa.
import { Fr, ParadaPrimaria, Proba, Tarxetas, Une, barallar, type Pregunta, type Tarxeta, type Xogo, Xogos } from '../../primaria/pezas'
import { elixe } from '../../primaria/paisaxes/preguntas'
import { demostrativo, ROUPA } from './demonstratifs'

type P = 'je' | 'tu' | 'il' | 'elle' | 'on' | 'nous' | 'vous' | 'ils' | 'elles'
const PERSOAS: P[] = ['je', 'tu', 'il', 'elle', 'on', 'nous', 'vous', 'ils', 'elles']

// Presente de indicativo. Mettre es irregular; acheter lleva acento grave donde la e suena abierta.
const FORMAS: Record<'mettre' | 'acheter', Record<P, string>> = {
  mettre: { je: 'mets', tu: 'mets', il: 'met', elle: 'met', on: 'met', nous: 'mettons', vous: 'mettez', ils: 'mettent', elles: 'mettent' },
  acheter: { je: 'achète', tu: 'achètes', il: 'achète', elle: 'achète', on: 'achète', nous: 'achetons', vous: 'achetez', ils: 'achètent', elles: 'achètent' },
}
const ES = { mettre: 'poner, ponerse (la ropa)', acheter: 'comprar' }

export const conxuga = (v: 'mettre' | 'acheter', p: P) => {
  const f = FORMAS[v][p]
  return p === 'je' && /^[aeiou]/.test(f) ? `j'${f}` : `${p} ${f}`
}

const FILAS: [string, P][] = [
  ['je', 'je'],
  ['tu', 'tu'],
  ['il / elle / on', 'il'],
  ['nous', 'nous'],
  ['vous', 'vous'],
  ['ils / elles', 'ils'],
]

/** La tabla del verbo, con lo que cambia en rojo y 🔊 en cada forma. */
function Taboa({ v }: { v: 'mettre' | 'acheter' }) {
  return (
    <table className="w-full text-xl">
      <tbody>
        {FILAS.map(([etq, p]) => {
          const f = FORMAS[v][p]
          const destaca = v === 'mettre' ? f.replace(/^met(t?)/, '') : f.replace(/^ach[eè]t/, '')
          const raiz = f.slice(0, f.length - destaca.length)
          const conPron = conxuga(v, p)
          return (
            <tr key={p} className="border-b border-slate-100 last:border-0">
              <td className="py-1.5 pr-3 text-slate-500" lang="fr">
                {conPron.startsWith("j'") ? "j'" : etq}
              </td>
              <td className="py-1.5 font-bold text-slate-800" lang="fr">
                {v === 'acheter' && raiz.includes('è') ? (
                  <>
                    ach<span className="text-rose-600">è</span>t
                  </>
                ) : (
                  raiz
                )}
                <span className="text-rose-600">{destaca}</span>
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
    titulo: 'METTRE: poner, ponerse',
    texto: (
      <>
        <p>
          Es <b>irregular</b>. Se usa mucho con la ropa: <Fr>Je mets un pull.</Fr> (Me pongo un jersey.)
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            En singular lleva {b('una t')}: <i>je mets, tu mets, il met</i>.
          </li>
          <li>
            En plural lleva {b('dos t')}: <i>nous mettons, vous mettez, ils mettent</i>.
          </li>
          <li>
            <i>Il met</i> no lleva nada al final (ni ‑e ni ‑t de más).
          </li>
        </ul>
      </>
    ),
    visual: <Taboa v="mettre" />,
  },
  {
    titulo: 'ACHETER: comprar',
    texto: (
      <>
        <p>Casi como los verbos en ‑er, pero con un cambio: cuando la e de en medio suena abierta, se escribe {b('è')} (acento grave).</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            {b('Con è')}: <i>j'achète, tu achètes, il achète, ils achètent</i>.
          </li>
          <li>
            {b('Sin acento')}: <i>nous achetons, vous achetez</i> (y el infinitivo, <i>acheter</i>).
          </li>
          <li>
            <i>Je</i> pasa a <i>j'</i> porque acheter empieza por vocal.
          </li>
        </ul>
      </>
    ),
    visual: <Taboa v="acheter" />,
  },
  {
    titulo: 'El truco de las «botas»',
    texto: (
      <>
        <p>
          En <i>acheter</i>, <i>nous</i> y <i>vous</i> son los «diferentes»: no llevan acento.
        </p>
        <p>Si en la tabla rodeas las formas con è (je, tu, il, ils), queda la forma de una bota. Así se recuerda dónde va el acento.</p>
        <p className="text-base text-slate-600">💡 Al hablar, je, tu, il e ils suenan igual: lo que cambia es cómo se escriben.</p>
      </>
    ),
  },
  {
    titulo: 'Con la ropa y los demostrativos',
    texto: (
      <div className="space-y-2 text-xl">
        <p>
          <Fr>Je mets ce pantalon.</Fr> <span className="text-base text-slate-500">Me pongo este pantalón.</span>
        </p>
        <p>
          <Fr>Tu achètes cette jupe ?</Fr> <span className="text-base text-slate-500">¿Compras esta falda?</span>
        </p>
        <p>
          <Fr>Nous achetons ces baskets.</Fr> <span className="text-base text-slate-500">Compramos estas zapatillas.</span>
        </p>
        <p>
          <Fr>Elle met cet anorak.</Fr> <span className="text-base text-slate-500">Ella se pone este anorak.</span>
        </p>
      </div>
    ),
  },
]

const azar = <T,>(xs: T[]) => xs[Math.floor(Math.random() * xs.length)]

/** Elegir la forma correcta entre las del mismo verbo. */
function preguntaForma(v: 'mettre' | 'acheter', p: P): Pregunta {
  const boa = FORMAS[v][p]
  const outras = barallar(
    [...new Set(Object.values(FORMAS[v]).concat(v === 'acheter' ? ['achete', 'achetes', 'achètons', 'achètez'] : ['mett', 'metes', 'metons', 'mete']))].filter(
      (x) => x !== boa,
    ),
  ).slice(0, 3)
  const pron = conxuga(v, p).startsWith("j'") ? "j'" : p
  return elixe(
    <span lang="fr">
      {pron} ___ ({v})
    </span>,
    boa,
    outras,
    <>
      Es <Fr>{conxuga(v, p)}</Fr>.
    </>,
  )
}

function preguntaEscribe(v: 'mettre' | 'acheter', p: P): Pregunta {
  const completa = conxuga(v, p)
  const elision = completa.startsWith("j'")
  return {
    tipo: 'escribe',
    texto: (
      <span>
        Escribe <b lang="fr">{elision ? 'je' : p}</b> + <b lang="fr">{v}</b> <span className="text-base font-semibold text-slate-500">({ES[v]})</span>
      </span>
    ),
    respostas: elision ? [completa] : [completa, FORMAS[v][p]],
    explica: v === 'acheter' && FORMAS[v][p].includes('è') ? <>Con je, tu, il y ils lleva è.</> : undefined,
  }
}

/** Una frase con ropa: verbo conjugado y demostrativo. */
function preguntaFrase(): Pregunta {
  const v = azar(['mettre', 'acheter'] as const)
  const p = azar(['je', 'tu', 'il', 'elle', 'nous', 'vous', 'ils', 'elles'] as P[])
  const r = azar(ROUPA)
  const nome = r.fr.split(' ').slice(1).join(' ')
  const frase = `${conxuga(v, p)} ${demostrativo(r.fr)} ${nome}.`
  const persoaEs: Record<string, string> = { je: 'Yo', tu: 'Tú', il: 'Él', elle: 'Ella', nous: 'Nosotros', vous: 'Vosotros', ils: 'Ellos', elles: 'Ellas' }
  const verboEs: Record<string, Record<string, string>> = {
    mettre: { je: 'me pongo', tu: 'te pones', il: 'se pone', elle: 'se pone', nous: 'nos ponemos', vous: 'os ponéis', ils: 'se ponen', elles: 'se ponen' },
    acheter: { je: 'compro', tu: 'compras', il: 'compra', elle: 'compra', nous: 'compramos', vous: 'compráis', ils: 'compran', elles: 'compran' },
  }
  const demEs = r.es
    .replace(/^un /, 'este ')
    .replace(/^una /, 'esta ')
    .replace(/^unos /, 'estos ')
    .replace(/^unas /, 'estas ')
  return {
    tipo: 'escribe',
    texto: (
      <span>
        <span aria-hidden="true">{r.icono}</span> En francés: «{persoaEs[p]} {verboEs[v][p]} {demEs}».
      </span>
    ),
    respostas: [frase, frase.replace(/\.$/, '')],
    explica: (
      <>
        Verbo {v} con {p}, y {demostrativo(r.fr)} porque es «{r.fr}».
      </>
    ),
  }
}

const todas = (f: (v: 'mettre' | 'acheter', p: P) => Pregunta) =>
  (['mettre', 'acheter'] as const).flatMap((v) => PERSOAS.filter((p) => p !== 'on').map((p) => f(v, p)))

export const PREGUNTAS: Pregunta[] = [
  ...todas(preguntaForma),
  ...todas(preguntaEscribe),
  ...Array.from({ length: 8 }, preguntaFrase),
  elixe('¿Qué significa «mettre»?', 'Poner, ponerse', ['Comprar', 'Llevar puesto', 'Quitarse'], <>Je mets mon manteau: me pongo el abrigo.</>),
  elixe('¿Qué significa «acheter»?', 'Comprar', ['Vender', 'Poner', 'Pagar'], <>J'achète du pain: compro pan.</>),
  elixe(
    '¿Con qué personas lleva è el verbo acheter?',
    'je, tu, il/elle/on, ils/elles',
    ['nous y vous', 'Con todas', 'Con ninguna'],
    <>Nous achetons y vous achetez no llevan acento.</>,
  ),
  elixe(
    '¿Cuántas t lleva «mettre» en plural?',
    'Dos: nous mettons, vous mettez, ils mettent',
    ['Una: nous metons', 'Ninguna'],
    <>En singular una (je mets), en plural dos.</>,
  ),
]

const XOGOS: Xogo[] = [
  {
    id: 'forma',
    titulo: 'Elige la forma',
    icono: '🎯',
    explica: 'Mettre y acheter con cada pronombre.',
    crear: (acabar) => <Proba practica cantas={10} preguntas={todas(preguntaForma)} acabar={acabar} />,
  },
  {
    id: 'escribe',
    titulo: 'Escribe el verbo',
    icono: '✍️',
    explica: 'Con las teclas de los acentos (è).',
    crear: (acabar) => <Proba practica cantas={10} preguntas={todas(preguntaEscribe)} acabar={acabar} />,
  },
  {
    id: 'frases',
    titulo: 'Frases con ropa',
    icono: '👕',
    explica: 'Verbo + demostrativo + prenda, como en el libro.',
    crear: (acabar) => <Proba practica cantas={6} preguntas={Array.from({ length: 6 }, preguntaFrase)} acabar={acabar} />,
  },
  {
    id: 'une',
    titulo: 'Une pronombre y verbo',
    icono: '🔗',
    explica: 'Cada pronombre con su forma de acheter.',
    crear: (acabar) => (
      <Une
        pares={[
          { palabra: "j'", significado: 'achète' },
          { palabra: 'tu', significado: 'achètes' },
          { palabra: 'nous', significado: 'achetons' },
          { palabra: 'vous', significado: 'achetez' },
          { palabra: 'ils', significado: 'achètent' },
        ]}
        acabar={acabar}
      />
    ),
  },
]

export default function Mettre({ ruta, modo }: { ruta: string; modo?: string }) {
  return (
    <ParadaPrimaria
      ruta={ruta}
      titulo="Mettre et acheter"
      modo={modo}
      paneis={{
        descubre: <Tarxetas tarxetas={TARXETAS} xoga={`${ruta}/xoga`} />,
        xoga: <Xogos xogos={XOGOS} proba={`${ruta}/proba`} />,
        proba: <Proba id="frances1/mettre" preguntas={PREGUNTAS} />,
      }}
    />
  )
}
