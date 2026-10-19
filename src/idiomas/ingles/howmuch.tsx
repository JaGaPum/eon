// Parada «How much / How many / How far / How long / How often» (página 22, ejercicio 12).
import { Clasifica, Fr as En, ParadaPrimaria, Proba, Tarxetas, Une, barallar, type Pregunta, type Tarxeta, type Xogo, Xogos } from '../../primaria/pezas'
import { elixe } from '../../primaria/paisaxes/preguntas'

const b = (t: string) => <b className="text-violet-800">{t}</b>

type How = 'How much' | 'How many' | 'How far' | 'How long' | 'How often'
const HOWS: How[] = ['How much', 'How many', 'How far', 'How long', 'How often']

// Preguntas con hueco y su respuesta de ejemplo. Las primeras son las del libro (ejercicios 12 y 13).
export const FRASES: [How, string, string][] = [
  ['How much', 'time is there until the next train?', 'Ten minutes.'],
  ['How many', 'bus stops are there?', 'Three.'],
  ['How far', 'is the tourist information centre from here?', 'About 500 metres.'],
  ['How long', 'is this street?', 'It’s two kilometres long.'],
  ['How long', 'is the film?', 'Two hours.'],
  ['How often', 'does the bus come?', 'Every fifteen minutes.'],
  ['How far', 'is your house from the centre of town?', 'About three kilometres.'],
  ['How often', 'do you go to the centre of town?', 'Twice a week.'],
  ['How long', 'does it take you to get there?', 'Twenty minutes.'],
  ['How much', 'does a bus ride cost?', 'One euro.'],
  ['How many', 'playgrounds are there in your neighbourhood?', 'Two.'],
  ['How many', 'brothers and sisters have you got?', 'One sister.'],
  ['How much', 'water do you drink every day?', 'Two litres.'],
  ['How much', 'homework have you got today?', 'Not much.'],
  ['How many', 'students are there in your class?', 'Twenty-five.'],
  ['How far', 'is the beach from your house?', 'Ten kilometres.'],
  ['How long', 'is the river Miño?', 'About 340 kilometres.'],
  ['How often', 'do you play football?', 'Every Saturday.'],
  ['How much', 'does this T-shirt cost?', 'Fifteen euros.'],
  ['How many', 'apples are there in the bowl?', 'Five.'],
]

// Ejercicio 13 del libro: completar con Is there, Are there o un How…
export const EJ13: [string, string][] = [
  ['Is there', 'a town square in your town?'],
  ['How far', 'is your house from the centre of town?'],
  ['How often', 'do you go to the centre of town?'],
  ['How long', 'does it take you to get there?'],
  ['Are there', 'any bus stops near your house?'],
  ['How much', 'does a bus ride cost?'],
  ['How many', 'playgrounds are there in your neighbourhood?'],
]

const CONTABLES = ['bus stops', 'students', 'apples', 'friends', 'books', 'cars', 'minutes', 'brothers']
const INCONTABLES = ['time', 'water', 'money', 'homework', 'milk', 'bread', 'food', 'information']

const REGLAS: [How, string][] = [
  ['How often', 'to ask about the frequency of something'],
  ['How far', 'to ask about distance'],
  ['How many', 'to talk about quantity with countable nouns'],
  ['How long', 'to ask about length'],
  ['How much', 'to talk about quantity with uncountable nouns'],
]
const ES: Record<How, string> = {
  'How much': 'cuánto (incontables) o cuánto cuesta',
  'How many': 'cuántos (contables)',
  'How far': 'a qué distancia',
  'How long': 'cuánto mide o cuánto dura',
  'How often': 'con qué frecuencia',
}

const TARXETAS: Tarxeta[] = [
  {
    titulo: 'Las reglas (ejercicio 12)',
    texto: (
      <ol className="list-decimal space-y-2 pl-6 text-lg">
        {REGLAS.map(([h, r]) => (
          <li key={h}>
            We use <b className="text-violet-800">{h}</b> {r}. <span className="text-base text-slate-500">({ES[h]})</span>
          </li>
        ))}
      </ol>
    ),
  },
  {
    titulo: 'Los ejemplos del libro',
    texto: (
      <div className="space-y-2 text-xl">
        {FRASES.slice(0, 6).map(([h, f]) => (
          <p key={f}>
            <En>{`${h} ${f}`}</En>
          </p>
        ))}
      </div>
    ),
  },
  {
    titulo: 'How much o How many',
    texto: (
      <>
        <p>
          {b('How many')} con nombres {b('contables')} (se pueden contar y van en plural): <i>How many bus stops…?</i>
        </p>
        <p>
          {b('How much')} con nombres {b('incontables')} (no se cuentan de uno en uno): <i>How much time…?</i>
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-sky-50 p-3">
            <p className="font-bold">Contables</p>
            <p lang="en">{CONTABLES.join(', ')}</p>
          </div>
          <div className="rounded-xl bg-amber-50 p-3">
            <p className="font-bold">Incontables</p>
            <p lang="en">{INCONTABLES.join(', ')}</p>
          </div>
        </div>
      </>
    ),
  },
  {
    titulo: 'Advanced Grammar!',
    texto: (
      <>
        <p>Para preguntar el precio decimos:</p>
        <p className="text-xl">
          ✅ <En>How much does it cost?</En>
        </p>
        <p className="text-xl">
          ❌ <s>How much money does it cost?</s>
        </p>
        <p className="text-base text-slate-600">
          💡 <i>How long</i> sirve para la longitud (<i>How long is this street?</i>) y también para la duración (<i>How long is the film?</i>).
        </p>
      </>
    ),
  },
]

const preguntaHueco = ([h, f, r]: [How, string, string]): Pregunta =>
  elixe(
    <span lang="en">___ {f}</span>,
    h,
    HOWS.filter((x) => x !== h)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3),
    <>
      <En>{`${h} ${f}`}</En> — {r}
    </>,
  )

export const PREGUNTAS: Pregunta[] = [
  ...FRASES.map(preguntaHueco),
  ...EJ13.map(([c, f]) =>
    elixe(<span lang="en">___ {f}</span>, c, ['Is there', 'Are there', ...HOWS].filter((x) => x !== c).sort(() => Math.random() - 0.5).slice(0, 3), <>Ejercicio 13: {c} {f}</>),
  ),
  ...REGLAS.map(([h, r]) => elixe(<span lang="en">We use ___ {r}.</span>, h, HOWS.filter((x) => x !== h).slice(0, 3), <>Regla del ejercicio 12.</>)),
  elixe('¿Cómo se pregunta el precio?', 'How much does it cost?', ['How much money does it cost?', 'How many does it cost?', 'How long does it cost?'], <>Advanced Grammar: sin «money».</>),
  ...[...CONTABLES.slice(0, 4).map((n) => [n, 'How many'] as const), ...INCONTABLES.slice(0, 4).map((n) => [n, 'How much'] as const)].map(([n, h]) =>
    elixe(<span lang="en">___ {n} …?</span>, h, [h === 'How many' ? 'How much' : 'How many'], <>«{n}» es {h === 'How many' ? 'contable' : 'incontable'}.</>),
  ),
]

const XOGOS: Xogo[] = [
  {
    id: 'hueco',
    titulo: 'Completa la pregunta',
    icono: '🎯',
    explica: 'Elige el How… correcto.',
    crear: (acabar) => <Proba practica cantas={10} preguntas={FRASES.map(preguntaHueco)} acabar={acabar} />,
  },
  {
    id: 'ej13',
    titulo: 'Ejercicio 13 del libro',
    icono: '📘',
    explica: 'Con Is there, Are there o How…',
    crear: (acabar) => <Proba practica cantas={7} preguntas={PREGUNTAS.slice(FRASES.length, FRASES.length + EJ13.length)} acabar={acabar} />,
  },
  {
    id: 'respuesta',
    titulo: 'Pregunta y respuesta',
    icono: '🔗',
    explica: 'Une cada pregunta con su respuesta.',
    crear: (acabar) => (
      <Une
        pares={HOWS.map((h) => {
          const [, f, r] = barallar(FRASES.filter(([x]) => x === h))[0]
          return { palabra: `${h} ${f}`, significado: r }
        })}
        acabar={acabar}
      />
    ),
  },
  {
    id: 'contables',
    titulo: '¿How much o How many?',
    icono: '🗂️',
    explica: 'Contables o incontables.',
    crear: (acabar) => (
      <Clasifica
        caixas={[
          { id: 'many', nome: 'How many (contables)', cor: 'border-sky-300 bg-sky-100' },
          { id: 'much', nome: 'How much (incontables)', cor: 'border-amber-300 bg-amber-100' },
        ]}
        elementos={[...CONTABLES.map((t) => ({ texto: t, caixa: 'many' })), ...INCONTABLES.map((t) => ({ texto: t, caixa: 'much' }))]}
        acabar={acabar}
      />
    ),
  },
]

export default function HowMuch({ ruta, modo }: { ruta: string; modo?: string }) {
  return (
    <ParadaPrimaria
      ruta={ruta}
      titulo="How much / many / far / long / often"
      modo={modo}
      paneis={{
        descubre: <Tarxetas tarxetas={TARXETAS} xoga={`${ruta}/xoga`} />,
        xoga: <Xogos xogos={XOGOS} proba={`${ruta}/proba`} />,
        proba: <Proba id="ingles1/how" preguntas={PREGUNTAS} />,
      }}
    />
  )
}
