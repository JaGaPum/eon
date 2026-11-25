// Parada «Present Simple Passive / Past Simple Passive» (ejercicios 12 a 15): am/is/are o was/were + participio, by y
// de activa a pasiva.
import { Clasifica, Fr as En, ParadaPrimaria, Proba, Tarxetas, Une, VerdadeiroFalso, barallar, type Pregunta, type Tarxeta, type Xogo, Xogos } from '../../../primaria/pezas'
import { elixe } from '../../../primaria/paisaxes/preguntas'
import { ACTIVA_PASIVA, EJ13_PASIVA, EJ14_PASIVA, EJ15_PASIVA, FRASES_PASIVA, IRREGULARES, pasiva, verbo } from './datos'

const b = (t: string) => <b className="text-violet-800">{t}</b>
const azar = <T,>(xs: readonly T[]) => xs[Math.floor(Math.random() * xs.length)]

const TARXETAS: Tarxeta[] = [
  {
    titulo: 'Activa y pasiva',
    texto: (
      <div className="space-y-2 text-xl">
        <p>
          Activa: <En>The cook prepares dinner every day.</En>
        </p>
        <p>
          Pasiva: <En>Dinner is prepared by the cook every day.</En>
        </p>
        <p className="text-base text-slate-600">
          El objeto de la activa (dinner) pasa a ser el sujeto de la pasiva. En la pasiva, lo importante es {b('la acción')}, no quién la hace (regla del ejercicio 12).
        </p>
      </div>
    ),
    visual: (
      <div className="space-y-1 p-3 text-lg">
        <p className="font-bold">La fórmula</p>
        <p>
          sujeto + {b('be')} + {b('participio')} (+ by …)
        </p>
        <p className="pt-2 text-base">Participio de los regulares: igual que el pasado (cleaned). De los irregulares: la 3.ª columna de la lista (eaten, made, written).</p>
      </div>
    ),
  },
  {
    titulo: 'Present Simple Passive: am / is / are + participio',
    texto: (
      <table className="w-full text-lg">
        <tbody>
          <tr className="border-b">
            <td className="py-1.5 pr-3 font-bold">Afirmativa</td>
            <td>
              <En>The cooking is done in the kitchen.</En>
            </td>
          </tr>
          <tr className="border-b">
            <td className="py-1.5 pr-3 font-bold">Negativa</td>
            <td>
              <En>The rooms aren't cleaned on Sundays.</En>
            </td>
          </tr>
          <tr className="border-b">
            <td className="py-1.5 pr-3 font-bold">Pregunta</td>
            <td>
              <En>Are vegetables bought at the market?</En>
            </td>
          </tr>
          <tr>
            <td className="py-1.5 pr-3 font-bold">Respuesta corta</td>
            <td>
              <En>Yes, they are. / No, they aren't.</En>
            </td>
          </tr>
        </tbody>
      </table>
    ),
  },
  {
    titulo: 'Past Simple Passive: was / were + participio',
    texto: (
      <table className="w-full text-lg">
        <tbody>
          <tr className="border-b">
            <td className="py-1.5 pr-3 font-bold">Afirmativa</td>
            <td>
              <En>All of the food was eaten by my friends.</En>
            </td>
          </tr>
          <tr className="border-b">
            <td className="py-1.5 pr-3 font-bold">Negativa</td>
            <td>
              <En>The servants weren't paid a lot of money.</En>
            </td>
          </tr>
          <tr className="border-b">
            <td className="py-1.5 pr-3 font-bold">Pregunta</td>
            <td>
              <En>Were your grandparents invited to the meal?</En>
            </td>
          </tr>
          <tr>
            <td className="py-1.5 pr-3 font-bold">Respuesta corta</td>
            <td>
              <En>Yes, they were. / No, they weren't.</En>
            </td>
          </tr>
        </tbody>
      </table>
    ),
    visual: (
      <div className="space-y-1 p-3 text-lg">
        <p className="font-bold">¿Presente o pasado?</p>
        <p>every day, on Sundays, usually → {b('is / are')}</p>
        <p>yesterday, last week, in 1990 → {b('was / were')}</p>
        <p className="pt-2 font-bold">¿Singular o plural?</p>
        <p>
          the food → is / was · the rooms → are / were
        </p>
      </div>
    ),
  },
  {
    titulo: 'TIP: by',
    texto: (
      <div className="space-y-2 text-xl">
        <p>
          Cuando decimos quién hace la acción, usamos {b('by')}:
        </p>
        <p>
          <En>The programme was watched by many people.</En>
        </p>
        <p className="text-base text-slate-600">
          Si no importa o no se sabe quién lo hace, no se dice: <En>My bike was stolen.</En>
        </p>
        <p className="text-base text-slate-600">
          Pregunta con by: <En>Who is the food usually prepared by?</En>
        </p>
      </div>
    ),
  },
]

// ---------- Preguntas ----------

function crear() {
  const f = azar(FRASES_PASIVA)
  const tiempo = Math.random() < 0.5 ? ('presente' as const) : ('pasado' as const)
  const neg = Math.random() < 0.3
  const v = verbo(f.v)
  return { f, v, tiempo, neg, correctas: pasiva(v, f.plural, tiempo, neg), cuando: tiempo === 'presente' ? f.presente : f.pasado }
}

const porque = (c: ReturnType<typeof crear>) => (
  <>
    {c.tiempo === 'presente' ? 'Presente' : 'Pasado'} ({c.cuando}) y {c.f.plural ? 'plural' : 'singular'} ({c.f.suj.toLowerCase()}): {c.correctas[0].split(' ')[0]} + participio de {c.v.base} ({c.v.pp}).
  </>
)

function preguntaEscribe(): Pregunta {
  const c = crear()
  return {
    tipo: 'escribe',
    texto: <span lang="en">{`${c.f.suj} ___ (${c.neg ? 'not / ' : ''}${c.v.base}) ${c.f.resto} ${c.cuando}.`.replace(/\s+/g, ' ')}</span>,
    respostas: c.correctas,
    explica: porque(c),
  }
}

function preguntaElige(): Pregunta {
  const c = crear()
  const ok = c.correctas[0]
  const [aux] = ok.split(' ')
  const otrosAux = c.tiempo === 'presente' ? (c.f.plural ? ['is', 'were'] : ['are', 'was']) : c.f.plural ? ['was', 'are'] : ['were', 'is']
  const neg = (a: string) => (c.neg ? `${a}n't` : a)
  const otras = [...new Set([`${neg(otrosAux[0])} ${c.v.pp}`, `${neg(otrosAux[1])} ${c.v.pp}`, `${aux} ${c.v.base}`, c.v.past.split(' / ')[0]])].filter((x) => x !== ok)
  return elixe(<span lang="en">{`${c.f.suj} ___ ${c.f.resto} ${c.cuando}.`.replace(/\s+/g, ' ')}</span>, ok, otras.slice(0, 3), porque(c))
}

const fijas: Pregunta[] = [
  elixe('En las frases en pasiva, lo importante es…', 'la acción', ['la persona que hace la acción'], <>Regla del ejercicio 12.</>),
  elixe('Cuando decimos quién hace la acción en una pasiva, usamos…', 'by', ['for', 'of', 'from'], <>The programme was watched by many people.</>),
  elixe(<span lang="en">Are vegetables bought at the market? — Yes, they ___.</span>, 'are', ['do', 'were', 'is'], <>Respuesta corta con are.</>),
  elixe(<span lang="en">Were your grandparents invited to the meal? — No, they ___.</span>, "weren't", ["didn't", "aren't", "wasn't"], <>Respuesta corta con were.</>),
  ...ACTIVA_PASIVA.map(([act, ok, otras]) => elixe(<>Pasa a pasiva: «<span lang="en">{act}</span>»</>, ok, otras, <span lang="en">{ok}</span>)),
  ...EJ14_PASIVA.map(([pal, ok, malas]) => elixe(<>Ejercicio 14: <span lang="en">{pal}</span></>, ok, malas, <>be + sujeto + participio.</>)),
]

export const PREGUNTAS: Pregunta[] = [...fijas, ...Array.from({ length: 12 }, preguntaElige), ...Array.from({ length: 12 }, preguntaEscribe)]

/** Huecos de los ejercicios 13 y 15 del libro, uno por pregunta. */
export const HUECOS_LIBRO: Pregunta[] = [
  ...EJ13_PASIVA.flatMap((e, i) =>
    e.huecos.map((h, j) => ({
      tipo: 'escribe' as const,
      texto: (
        <span lang="en">
          Ej. 13.{i + 1}: {e.frase.split('___').map((t, k, a) => (k < a.length - 1 ? <span key={k}>{t}<b className="text-rose-600">{k === j ? ' ___ ' : ' … '}</b></span> : <span key={k}>{t}</span>))}
        </span>
      ),
      respostas: h,
      explica: <span lang="en">Present Simple Passive: {h[0]}.</span>,
    })),
  ),
  ...EJ15_PASIVA.map((e, i) => ({
    tipo: 'escribe' as const,
    texto: (
      <span lang="en">
        Ej. 15 «Family Life in the Past» ({i + 1}): …{e.antes} <b className="text-rose-600">___</b> ({e.verbo})…
        {e.verbo === 'keep' && <span className="mt-1 block text-base text-slate-500">Es una pregunta («How ___ busy?»): escribe el auxiliar, el sujeto (kids) y el participio, en ese orden.</span>}
      </span>
    ),
    respostas: e.respuestas,
    explica: <span lang="en">Past Simple Passive: {e.respuestas[0]}.</span>,
  })),
]

const XOGOS: Xogo[] = [
  {
    id: 'tiempo',
    titulo: '¿Presente o pasado?',
    icono: '🗂️',
    explica: 'Mira el auxiliar: is/are o was/were.',
    crear: (acabar) => (
      <Clasifica
        caixas={[
          { id: 'pres', nome: 'Present Simple Passive', cor: 'border-sky-300 bg-sky-100' },
          { id: 'past', nome: 'Past Simple Passive', cor: 'border-amber-300 bg-amber-100' },
        ]}
        elementos={barallar(FRASES_PASIVA)
          .slice(0, 8)
          .map((f, i) => {
            const t = i % 2 ? ('presente' as const) : ('pasado' as const)
            return { texto: `${f.suj} ${pasiva(verbo(f.v), f.plural, t, false)[0]} ${f.resto}`.replace(/\s+/g, ' ').trim() + '.', caixa: t === 'presente' ? 'pres' : 'past', pista: t === 'presente' ? 'is / are: presente.' : 'was / were: pasado.' }
          })}
        acabar={acabar}
      />
    ),
  },
  {
    id: 'participios',
    titulo: 'Une los participios',
    icono: '🔗',
    explica: 'Cada verbo con su participio (la 3.ª columna).',
    crear: (acabar) => <Une pares={barallar(IRREGULARES.filter((v) => v.pp !== v.base && v.base !== 'be')).slice(0, 6).map((v) => ({ palabra: v.base, significado: v.pp }))} acabar={acabar} />,
  },
  {
    id: 'escribe',
    titulo: 'Escribe la pasiva',
    icono: '✍️',
    explica: 'Presente o pasado, afirmativa o negativa.',
    crear: (acabar) => <Proba practica cantas={10} preguntas={Array.from({ length: 10 }, preguntaEscribe)} acabar={acabar} />,
  },
  {
    id: 'libro',
    titulo: 'Ejercicios 13 y 15 del libro',
    icono: '📖',
    explica: 'Las familias de hoy y «Family Life in the Past».',
    crear: (acabar) => <Proba practica cantas={HUECOS_LIBRO.length} preguntas={HUECOS_LIBRO} acabar={acabar} />,
  },
  {
    id: 'activa',
    titulo: 'De activa a pasiva',
    icono: '🔄',
    explica: 'Elige la pasiva correcta.',
    crear: (acabar) => <Proba practica cantas={ACTIVA_PASIVA.length} preguntas={ACTIVA_PASIVA.map(([act, ok, otras]) => elixe(<span lang="en">{act}</span>, ok, otras, <span lang="en">{ok}</span>))} acabar={acabar} />,
  },
  {
    id: 'vf',
    titulo: 'Verdadero o falso',
    icono: '✅',
    explica: 'Las reglas del cuadro azul.',
    crear: (acabar) => (
      <VerdadeiroFalso
        frases={[
          { texto: '«The food was ate by my friends» está bien.', certa: false, explica: 'Va el participio: was eaten.' },
          { texto: 'La pasiva se forma con be + participio.', certa: true, explica: 'is done, were eaten.' },
          { texto: '«The rooms is cleaned» está bien.', certa: false, explica: 'Rooms es plural: are cleaned.' },
          { texto: 'En la pasiva, lo importante es la acción.', certa: true, explica: 'Por eso a veces ni se dice quién la hace.' },
          { texto: 'Quien hace la acción se introduce con «by».', certa: true, explica: 'by many people, by the cook.' },
          { texto: 'La negativa de «Messages were sent» es «Messages didn’t sent».', certa: false, explica: 'Messages weren’t sent.' },
        ]}
        acabar={acabar}
      />
    ),
  },
]

export default function Pasiva({ ruta, modo }: { ruta: string; modo?: string }) {
  return (
    <ParadaPrimaria
      ruta={ruta}
      titulo="Present Simple Passive / Past Simple Passive"
      modo={modo}
      paneis={{
        descubre: <Tarxetas tarxetas={TARXETAS} xoga={`${ruta}/xoga`} />,
        xoga: <Xogos xogos={XOGOS} proba={`${ruta}/proba`} />,
        proba: <Proba id="ingles2/pasiva" preguntas={[...PREGUNTAS, ...HUECOS_LIBRO]} />,
      }}
    />
  )
}
