// Parada «used to» (ejercicios 12 y 13): costumbres del pasado que ya no son verdad.
import { Clasifica, Fr as En, Ordena, ParadaPrimaria, Proba, Tarxetas, VerdadeiroFalso, barallar, type Pregunta, type Tarxeta, type Xogo, Xogos } from '../../../primaria/pezas'
import { elixe } from '../../../primaria/paisaxes/preguntas'
import { FRASES_USED, PREGUNTAS_USED, usedTo } from './datos'

const b = (t: string) => <b className="text-violet-800">{t}</b>
const azar = <T,>(xs: readonly T[]) => xs[Math.floor(Math.random() * xs.length)]

const TARXETAS: Tarxeta[] = [
  {
    titulo: 'Los ejemplos del libro',
    texto: (
      <div className="space-y-2 text-xl">
        <p>
          <En>I used to have a small calculator.</En>
        </p>
        <p>
          <En>Students didn't use to work with computers.</En>
        </p>
        <p>
          <En>Did he use to teach English?</En>
        </p>
        <p>
          <En>Yes, he did. / No, he didn't.</En>
        </p>
      </div>
    ),
  },
  {
    titulo: 'Las reglas (ejercicio 12)',
    texto: (
      <ol className="list-decimal space-y-2 pl-6 text-lg">
        <li>
          Usamos <i>used to</i> para hablar de hábitos y situaciones habituales del {b('pasado')}.
        </li>
        <li>
          Son hábitos que {b('ya no son verdad')} (not true any more).
        </li>
      </ol>
    ),
    visual: (
      <div className="space-y-1 p-3 text-lg">
        <p className="font-bold">En castellano: «solía…»</p>
        <p>
          <En>I used to play football.</En>
        </p>
        <p className="text-base">Antes jugaba (solía jugar) al fútbol, y ahora ya no.</p>
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
              {b('used to')} + forma base: <En>I used to have…</En>
            </td>
          </tr>
          <tr className="border-b">
            <td className="py-1.5 pr-3 font-bold">Negativa</td>
            <td>
              {b("didn't use to")} + forma base: <En>They didn't use to work…</En>
            </td>
          </tr>
          <tr className="border-b">
            <td className="py-1.5 pr-3 font-bold">Pregunta</td>
            <td>
              {b('Did')} + sujeto + {b('use to')} + forma base: <En>Did he use to teach…?</En>
            </td>
          </tr>
          <tr>
            <td className="py-1.5 pr-3 font-bold">Respuesta corta</td>
            <td>
              <En>Yes, he did.</En> · <En>No, he didn't.</En>
            </td>
          </tr>
        </tbody>
      </table>
    ),
    visual: (
      <div className="space-y-1 p-3 text-lg">
        <p className="font-bold text-rose-700">¡Ojo con la ‑d!</p>
        <p>
          Afirmativa: used to ✅ <br />
          Con did / didn't: <b>use to</b> (sin ‑d), igual que <En>didn't go</En>.
        </p>
        <p className="text-rose-700">❌ didn't used to · ❌ Did you used to</p>
        <p className="text-rose-700">❌ used to had (después de to, forma base)</p>
      </div>
    ),
  },
]

// ---------- Preguntas ----------

function frase(f: (typeof FRASES_USED)[number]) {
  return `${f.suj} ___ (${f.neg ? 'not / ' : ''}${f.v}) ${f.resto}.`
}

function preguntaEscribe(): Pregunta {
  const f = azar(FRASES_USED)
  return { tipo: 'escribe', texto: <span lang="en">{frase(f)}</span>, respostas: usedTo(f.v, f.neg), explica: f.neg ? <>Negativa: didn't use to + {f.v}.</> : <>Afirmativa: used to + {f.v}.</> }
}

const PASADOS: Record<string, string> = { have: 'had', do: 'did', work: 'worked', write: 'wrote', be: 'was', study: 'studied', watch: 'watched', send: 'sent', play: 'played', like: 'liked', live: 'lived', wear: 'wore', drink: 'drank', travel: 'travelled' }

function preguntaElige(): Pregunta {
  const f = azar(FRASES_USED)
  const ok = usedTo(f.v, f.neg)[0]
  const otras = f.neg ? [`didn't used to ${f.v}`, `don't use to ${f.v}`, `didn't use to ${PASADOS[f.v] ?? f.v}`] : [`use to ${f.v}`, `used to ${PASADOS[f.v] ?? f.v}`, `was used to ${f.v}`]
  return elixe(<span lang="en">{`${f.suj} ___ ${f.resto}.`}</span>, ok, [...new Set(otras)].filter((x) => x !== ok), f.neg ? <>didn't use to + forma base (sin ‑d en use).</> : <>used to + forma base.</>)
}

const fijas: Pregunta[] = [
  elixe(<>Usamos <i>used to</i> para hablar de hábitos…</>, 'del pasado', ['del presente'], <>Regla 1 del ejercicio 12.</>),
  elixe(<>Con <i>used to</i> hablamos de hábitos que…</>, 'ya no son verdad', ['todavía son verdad'], <>Regla 2 del ejercicio 12.</>),
  ...PREGUNTAS_USED.map(([t, ok, otras]) => elixe(<span lang="en">{t}</span>, ok, otras, <span lang="en">{t.replace('___', ok)}</span>)),
  elixe(<>Ejercicio 13.1: <span lang="en">Children ___ calculators. (have)</span></>, "didn't use to have", ["didn't used to have", 'used to have', "didn't use to had"], <>En la época victoriana no había calculadoras.</>),
  elixe(<>Ejercicio 13.1: <span lang="en">They ___ maths with an abacus. (do)</span></>, 'used to do', ['use to do', 'used to did', "didn't use to do"], <>Hacían las cuentas con un ábaco.</>),
]

export const PREGUNTAS: Pregunta[] = [...fijas, ...Array.from({ length: 10 }, preguntaElige), ...Array.from({ length: 10 }, preguntaEscribe)]

const XOGOS: Xogo[] = [
  {
    id: 'antes',
    titulo: '¿Antes o ahora?',
    icono: '🗂️',
    explica: '¿Es una costumbre del pasado (used to) o de ahora (Present Simple)?',
    crear: (acabar) => (
      <Clasifica
        caixas={[
          { id: 'antes', nome: 'Antes (used to)', cor: 'border-amber-300 bg-amber-100' },
          { id: 'ahora', nome: 'Ahora (Present Simple)', cor: 'border-sky-300 bg-sky-100' },
        ]}
        elementos={barallar([
          { texto: 'I used to have a small calculator.', caixa: 'antes' },
          { texto: 'Students use computers every day.', caixa: 'ahora' },
          { texto: 'Children used to do maths with an abacus.', caixa: 'antes' },
          { texto: 'My dad plays tennis on Sundays.', caixa: 'ahora' },
          { texto: 'People used to send letters.', caixa: 'antes' },
          { texto: 'We usually send messages.', caixa: 'ahora' },
          { texto: 'Teachers used to be very strict.', caixa: 'antes' },
          { texto: 'She has short hair.', caixa: 'ahora' },
        ]).map((x) => ({ ...x, pista: x.caixa === 'antes' ? 'used to: algo que ya no pasa.' : 'Present Simple: lo que pasa ahora.' }))}
        acabar={acabar}
      />
    ),
  },
  {
    id: 'elige',
    titulo: 'Elige la forma',
    icono: '🎯',
    explica: 'used to, didn’t use to…',
    crear: (acabar) => <Proba practica cantas={10} preguntas={Array.from({ length: 10 }, preguntaElige)} acabar={acabar} />,
  },
  {
    id: 'escribe',
    titulo: 'Escribe la forma',
    icono: '✍️',
    explica: 'Afirmativa o negativa.',
    crear: (acabar) => <Proba practica cantas={10} preguntas={Array.from({ length: 10 }, preguntaEscribe)} acabar={acabar} />,
  },
  {
    id: 'ordena',
    titulo: 'Ordena la frase',
    icono: '🧩',
    explica: 'Frases con used to.',
    crear: (acabar) =>
      (
        <Ordena
          frases={['Did he use to teach English ?', "Students didn't use to work with computers .", 'I used to have a small calculator .', 'Did your parents use to walk to school ?'].map((f) => ({ palabras: f.split(' ') }))}
          acabar={acabar}
        />
      ),
  },
  {
    id: 'vf',
    titulo: 'Verdadero o falso',
    icono: '✅',
    explica: 'Las reglas del cuadro azul.',
    crear: (acabar) => (
      <VerdadeiroFalso
        frases={[
          { texto: '«I used to play football» quiere decir que antes jugaba y ahora ya no.', certa: true, explica: 'Un hábito que ya no es verdad.' },
          { texto: '«She didn’t used to like fish» está bien.', certa: false, explica: 'Con didn’t, sin ‑d: didn’t use to.' },
          { texto: 'La pregunta es «Did you use to…?».', certa: true, explica: 'Did + sujeto + use to + forma base.' },
          { texto: '«They used to went to school by bus» está bien.', certa: false, explica: 'Después de used to, forma base: used to go.' },
          { texto: 'Used to sirve para hablar de hábitos del presente.', certa: false, explica: 'Para el presente, el Present Simple.' },
        ]}
        acabar={acabar}
      />
    ),
  },
]

export default function UsedTo({ ruta, modo }: { ruta: string; modo?: string }) {
  return (
    <ParadaPrimaria
      ruta={ruta}
      titulo="used to"
      modo={modo}
      paneis={{
        descubre: <Tarxetas tarxetas={TARXETAS} xoga={`${ruta}/xoga`} />,
        xoga: <Xogos xogos={XOGOS} proba={`${ruta}/proba`} />,
        proba: <Proba id="ingles2/usedto" preguntas={PREGUNTAS} />,
      }}
    />
  )
}
