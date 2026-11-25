// Parada «Past Simple» (página 31, ejercicios 7, 8, 9 y 12): regulares e irregulares, negativa e interrogativa con
// did, reglas de ortografía y there was / there were.
import { Clasifica, Fr as En, Ordena, ParadaPrimaria, Proba, Tarxetas, Une, VerdadeiroFalso, barallar, type Pregunta, type Tarxeta, type Xogo, Xogos } from '../../../primaria/pezas'
import { elixe } from '../../../primaria/paisaxes/preguntas'
import { EJ8_P31, EJ8_VERBOS, EJ9_P31, FRASES_PASADO, IRREGULARES, NOMBRE_REGLA, REGULARES, SIMONE, SUJETOS2, pasado, verbo, type VerboPasado } from './datos'

const b = (t: string) => <b className="text-violet-800">{t}</b>
const azar = <T,>(xs: readonly T[]) => xs[Math.floor(Math.random() * xs.length)]

const TARXETAS: Tarxeta[] = [
  {
    titulo: 'Los ejemplos del libro',
    texto: (
      <div className="space-y-2 text-xl">
        <p>
          <En>The mechanic checked my car a week ago.</En> <span className="text-base text-slate-500">(regular verb)</span>
        </p>
        <p>
          <En>He drove a taxi last year.</En> <span className="text-base text-slate-500">(irregular verb)</span>
        </p>
        <p>
          <En>The salesperson didn't help us yesterday.</En>
        </p>
        <p>
          <En>Did you hear the singer yesterday evening?</En>
        </p>
        <p>
          <En>Yes, I did. / No, I didn't.</En>
        </p>
        <p className="text-base text-slate-600">💡 Lo subrayado (a week ago, last year, yesterday…) te dice que es pasado: algo que empezó y acabó.</p>
      </div>
    ),
  },
  {
    titulo: 'Cómo se forma',
    texto: (
      <table className="w-full text-lg">
        <tbody>
          <tr className="border-b">
            <td className="py-1.5 pr-3 font-bold">Afirmativa</td>
            <td>
              <En>I worked</En> · <En>She drove</En> <span className="text-base text-slate-500">(igual para todas las personas)</span>
            </td>
          </tr>
          <tr className="border-b">
            <td className="py-1.5 pr-3 font-bold">Negativa</td>
            <td>
              <En>I didn't work</En> · <En>She didn't drive</En>
            </td>
          </tr>
          <tr className="border-b">
            <td className="py-1.5 pr-3 font-bold">Pregunta</td>
            <td>
              <En>Did you work?</En> · <En>Did she drive?</En>
            </td>
          </tr>
          <tr>
            <td className="py-1.5 pr-3 font-bold">Respuesta corta</td>
            <td>
              <En>Yes, I did.</En> · <En>No, she didn't.</En>
            </td>
          </tr>
        </tbody>
      </table>
    ),
    visual: (
      <div className="space-y-2 p-3 text-lg">
        <p className="font-bold">Las reglas (ejercicio 7)</p>
        <p>1. Los verbos irregulares {b('cambian su forma')} en la afirmativa: go → went.</p>
        <p>
          2. En negativa y pregunta se usa la {b('forma base')}: <En>didn't go</En>, <En>Did you go?</En>
        </p>
        <p className="text-rose-700">❌ didn't went · ❌ Did you went?</p>
      </div>
    ),
  },
  {
    titulo: 'Reglas de ortografía (regulares)',
    texto: (
      <ul className="space-y-2 text-lg">
        {(['ed', 'd', 'ied', 'doble'] as const).map((r) => (
          <li key={r}>
            <b>{NOMBRE_REGLA[r]}</b>
            <br />
            <span lang="en" className="text-slate-600">
              {REGULARES.filter((v) => v.regla === r)
                .slice(0, 4)
                .map((v) => `${v.base} → ${v.past}`)
                .join(' · ')}
            </span>
          </li>
        ))}
        <li className="text-base text-slate-600">
          Ojo: <En>play → played</En> (vocal + y: solo ‑ed) pero <En>try → tried</En> (consonante + y).
        </li>
      </ul>
    ),
  },
  {
    titulo: 'Los irregulares',
    texto: (
      <>
        <p>No siguen ninguna regla: hay que aprenderlos (lista de las páginas 138 y 139). Los más usados:</p>
        <div className="mt-2 grid grid-cols-2 gap-x-4 text-lg sm:grid-cols-3" lang="en">
          {IRREGULARES.filter((v) => v.base !== 'be')
            .slice(0, 30)
            .map((v) => (
              <span key={v.base}>
                {v.base} → <b>{v.past}</b>
              </span>
            ))}
        </div>
      </>
    ),
  },
  {
    titulo: 'TIP: there was / there were',
    texto: (
      <div className="space-y-2 text-xl">
        <p>
          El pasado de <En>there is</En> es <En>there was</En>, y el de <En>there are</En>, <En>there were</En>.
        </p>
        <p>
          <En>There were two actors in the show yesterday.</En>
        </p>
        <p>
          <En>There was a storm.</En> · <En>There wasn't a test.</En> · <En>Were there any guests?</En>
        </p>
        <p className="text-base text-slate-600">💡 Singular o incontable → was. Plural → were.</p>
      </div>
    ),
  },
]

// ---------- Preguntas ----------

function frase(): { suj: string; plural: boolean; v: VerboPasado; resto: string; cuando: string } {
  const [suj, plural] = azar(SUJETOS2)
  const [base, resto, cuando] = azar(FRASES_PASADO)
  return { suj, plural, v: verbo(base), resto, cuando }
}

function preguntaEscribe(): Pregunta {
  const f = frase()
  const neg = Math.random() < 0.35
  return {
    tipo: 'escribe',
    texto: <span lang="en">{`${f.suj} ___ (${neg ? 'not / ' : ''}${f.v.base}) ${f.resto} ${f.cuando}.`}</span>,
    respostas: pasado(f.v, neg),
    explica: neg ? <>Negativa: didn't + forma base ({f.v.base}).</> : f.v.regla ? <>Regular: {NOMBRE_REGLA[f.v.regla]}.</> : <>Irregular: {f.v.base} → {f.v.past}.</>,
  }
}

function preguntaElige(): Pregunta {
  const f = frase()
  const tipo = azar(['afirm', 'neg', 'preg'] as const)
  const malPast = f.v.regla ? `${f.v.base}ed` : f.v.base + (f.v.base.endsWith('e') ? 'd' : 'ed')
  if (tipo === 'afirm') {
    const otras = [...new Set([f.v.base, malPast, `did ${f.v.base}`])].filter((x) => x !== f.v.past)
    return elixe(<span lang="en">{`${f.suj} ___ ${f.resto} ${f.cuando}.`}</span>, f.v.past, otras.slice(0, 3), f.v.regla ? <>{NOMBRE_REGLA[f.v.regla]}.</> : <>Irregular: {f.v.past}.</>)
  }
  if (tipo === 'neg')
    return elixe(
      <span lang="en">{`${f.suj} ___ ${f.resto} ${f.cuando}.`} (negative)</span>,
      `didn't ${f.v.base}`,
      [`didn't ${f.v.past}`, `don't ${f.v.base}`, `wasn't ${f.v.base}`].filter((x) => x !== `didn't ${f.v.base}`),
      <>En negativa: didn't + forma base.</>,
    )
  const s = f.suj === 'I' ? 'you' : f.suj.replace(/^My /, 'your ').replace(/^(He|She|We|They|You)$/, (x) => x.toLowerCase())
  return elixe(
    <span lang="en">{`___ ${s} ___ ${f.resto} ${f.cuando}?`}</span>,
    `Did … ${f.v.base}`,
    [`Did … ${f.v.past}`, `Do … ${f.v.past}`, `Was … ${f.v.base}`].filter((x) => x !== `Did … ${f.v.base}`),
    <>En pregunta: Did + sujeto + forma base.</>,
  )
}

function preguntaThere(): Pregunta {
  const items: [string, boolean][] = [
    ['two actors in the show yesterday', true],
    ['a storm last night', false],
    ['any guests at your house last weekend?', true],
    ['an English test last week?', false],
    ['a lot of people at the concert', true],
    ['some milk in the fridge', false],
    ["many cars in the street in 1900", true],
    ['a cinema in my town', false],
  ]
  const [resto, plural] = azar(items)
  const preg = resto.endsWith('?')
  const neg = !preg && Math.random() < 0.3
  const ok = preg ? (plural ? 'Were there' : 'Was there') : `There ${plural ? 'were' : 'was'}${neg ? 'n’t' : ''}`.replace('’', "'")
  const opciones = preg ? ['Was there', 'Were there', 'Did there', 'There were'] : neg ? ["There wasn't", "There weren't", "There didn't", "There isn't"] : ['There was', 'There were', 'There is', 'It was']
  return elixe(<span lang="en">{`___ ${resto}`}</span>, ok, opciones.filter((x) => x !== ok), plural ? <>Plural: were.</> : <>Singular o incontable: was.</>)
}

const fijas: Pregunta[] = [
  elixe('Regla 1: los verbos irregulares en la afirmativa del Past Simple…', 'cambian su forma', ['añaden ‑ed'], <>go → went, drive → drove.</>),
  elixe('Regla 2: en negativa y pregunta usamos la forma…', 'base', ['de pasado'], <>didn't go, Did you go?</>),
  elixe(<span lang="en">The mechanic ___ my car a week ago.</span>, 'checked', ['check', 'checks', 'did check'], <>Regular: check → checked.</>),
  elixe(<span lang="en">He ___ a taxi last year.</span>, 'drove', ['drived', 'drive', 'driven'], <>Irregular: drive → drove.</>),
  elixe(<span lang="en">The salesperson ___ us yesterday.</span>, "didn't help", ["didn't helped", "doesn't help", "wasn't help"], <>didn't + forma base.</>),
  elixe(<span lang="en">Did you hear the singer? — No, I ___.</span>, "didn't", ["don't", "wasn't", "didn't hear it"], <>Respuesta corta: No, I didn't.</>),
  elixe('¿Cuál está bien escrito?', 'stopped', ['stoped', 'stopt', 'stopeed'], <>stop: consonante‑vocal‑consonante, se dobla la p.</>),
  elixe('¿Cuál está bien escrito?', 'tried', ['tryed', 'tryied', 'trid'], <>try: consonante + y → ‑ied.</>),
  elixe('¿Cuál está bien escrito?', 'played', ['plaied', 'playd', 'plaid'], <>play: vocal + y → solo ‑ed.</>),
  elixe('¿Cuál está bien escrito?', 'lived', ['liveed', 'livd', 'livved'], <>live acaba en ‑e: solo ‑d.</>),
  ...EJ9_P31.map(([pal, ok, malas]) => elixe(<span lang="en">{pal}</span>, ok, malas, <>Ejercicio 9 de la página 31.</>)),
  ...SIMONE.slice(0, 5).map(([p, ok, otras]) => elixe(<>Ficha de Simone (ej. 12): <span lang="en">{p}</span></>, ok, otras, <>Mira la ficha de la página 31.</>)),
]

export const PREGUNTAS: Pregunta[] = [
  ...fijas,
  ...Array.from({ length: 10 }, preguntaElige),
  ...Array.from({ length: 10 }, preguntaEscribe),
  ...Array.from({ length: 6 }, preguntaThere),
]

const XOGOS: Xogo[] = [
  {
    id: 'regulares',
    titulo: '¿Regular o irregular?',
    icono: '🗂️',
    explica: 'Mira el pasado de cada verbo.',
    crear: (acabar) => (
      <Clasifica
        caixas={[
          { id: 'reg', nome: 'Regular (‑ed)', cor: 'border-sky-300 bg-sky-100' },
          { id: 'irr', nome: 'Irregular', cor: 'border-amber-300 bg-amber-100' },
        ]}
        elementos={barallar([...barallar(REGULARES).slice(0, 5), ...barallar(IRREGULARES.filter((v) => v.base !== 'be')).slice(0, 5)]).map((v) => ({
          texto: `${v.base} → ${v.past}`,
          caixa: v.regla ? 'reg' : 'irr',
          pista: v.regla ? 'Acaba en ‑ed: regular.' : 'Cambia la forma: irregular.',
        }))}
        acabar={acabar}
      />
    ),
  },
  {
    id: 'irregulares',
    titulo: 'Une los irregulares',
    icono: '🔗',
    explica: 'Cada verbo con su pasado.',
    crear: (acabar) => <Une pares={barallar(IRREGULARES.filter((v) => v.base !== 'be' && v.base !== v.past)).slice(0, 6).map((v) => ({ palabra: v.base, significado: v.past }))} acabar={acabar} />,
  },
  {
    id: 'escribe',
    titulo: 'Escribe el verbo',
    icono: '✍️',
    explica: 'Afirmativa o negativa, regulares e irregulares.',
    crear: (acabar) => <Proba practica cantas={10} preguntas={Array.from({ length: 10 }, preguntaEscribe)} acabar={acabar} />,
  },
  {
    id: 'ej8',
    titulo: 'Ejercicio 8 del libro',
    icono: '📖',
    explica: `Verbos: ${EJ8_VERBOS} y there was / there were.`,
    crear: (acabar) => (
      <Proba
        practica
        cantas={10}
        preguntas={EJ8_P31.flatMap((e, i) =>
          e.huecos.map((h, j) => ({
            tipo: 'escribe' as const,
            texto: (
              <span lang="en">
                {i + 1}. {e.frase.split('___').map((t, k, a) => (k < a.length - 1 ? <span key={k}>{t}<b className="text-rose-600">{k === j ? ' ___ ' : ' … '}</b></span> : <span key={k}>{t}</span>))}
                <span className="mt-1 block text-base text-slate-500">({EJ8_VERBOS})</span>
              </span>
            ),
            respostas: h,
            explica: <span lang="en">{h[0]}</span>,
          })),
        )}
        acabar={acabar}
      />
    ),
  },
  {
    id: 'ordena',
    titulo: 'Ordena la pregunta',
    icono: '🧩',
    explica: 'Las preguntas del ejercicio 9.',
    crear: (acabar) => <Ordena frases={EJ9_P31.map(([, q]) => ({ palabras: q.replace('?', ' ?').split(' ') }))} acabar={acabar} />,
  },
  {
    id: 'vf',
    titulo: 'Verdadero o falso',
    icono: '✅',
    explica: 'Las reglas del cuadro azul.',
    crear: (acabar) => (
      <VerdadeiroFalso
        frases={[
          { texto: '«She didn’t went» está bien.', certa: false, explica: 'Después de didn’t, forma base: She didn’t go.' },
          { texto: 'El pasado de «there are» es «there were».', certa: true, explica: 'There were two actors in the show.' },
          { texto: 'El pasado de «study» es «studyed».', certa: false, explica: 'Consonante + y: studied.' },
          { texto: 'En Past Simple, con he/she/it no se añade nada especial.', certa: true, explica: 'I worked, she worked: igual.' },
          { texto: 'La pregunta de «You saw the film» es «Did you see the film?».', certa: true, explica: 'Did + sujeto + forma base.' },
          { texto: 'El pasado de «stop» es «stoped».', certa: false, explica: 'Se dobla la p: stopped.' },
        ]}
        acabar={acabar}
      />
    ),
  },
]

export default function Pasado({ ruta, modo }: { ruta: string; modo?: string }) {
  return (
    <ParadaPrimaria
      ruta={ruta}
      titulo="Past Simple"
      modo={modo}
      paneis={{
        descubre: <Tarxetas tarxetas={TARXETAS} xoga={`${ruta}/xoga`} />,
        xoga: <Xogos xogos={XOGOS} proba={`${ruta}/proba`} />,
        proba: <Proba id="ingles2/pasado" preguntas={PREGUNTAS} />,
      }}
    />
  )
}
