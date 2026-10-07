// Parada «Les métiers»: las profesiones que ha dado la profesora, por grupos según cómo forman el femenino.
import { Clasifica, Fr, ParadaPrimaria, Proba, Tarxetas, Une, barallar, type Pregunta, type Tarxeta, type Xogo, Xogos } from '../../primaria/pezas'
import { elixe } from '../../primaria/paisaxes/preguntas'

interface Metier {
  m: string
  /** Femenino; si no hay (solo masculino), se omite. */
  f?: string
  es: string
  icono: string
  grupo: 'igual' | 'ere' | 'enne' | 'eur' | 'masc'
}

export const METIERS: Metier[] = [
  { m: 'le dentiste', f: 'la dentiste', es: 'el / la dentista', icono: '🦷', grupo: 'igual' },
  { m: 'le photographe', f: 'la photographe', es: 'el fotógrafo / la fotógrafa', icono: '📷', grupo: 'igual' },
  { m: 'le journaliste', f: 'la journaliste', es: 'el / la periodista', icono: '📰', grupo: 'igual' },
  { m: 'le vétérinaire', f: 'la vétérinaire', es: 'el veterinario / la veterinaria', icono: '🐶', grupo: 'igual' },
  { m: "l'infirmier", f: "l'infirmière", es: 'el enfermero / la enfermera', icono: '💉', grupo: 'ere' },
  { m: 'le cuisinier', f: 'la cuisinière', es: 'el cocinero / la cocinera', icono: '🍳', grupo: 'ere' },
  { m: "l'informaticien", f: "l'informaticienne", es: 'el informático / la informática', icono: '💻', grupo: 'enne' },
  { m: 'le pharmacien', f: 'la pharmacienne', es: 'el farmacéutico / la farmacéutica', icono: '💊', grupo: 'enne' },
  { m: "l'acteur", f: "l'actrice", es: 'el actor / la actriz', icono: '🎭', grupo: 'eur' },
  { m: 'le serveur', f: 'la serveuse', es: 'el camarero / la camarera', icono: '🍽️', grupo: 'eur' },
  { m: 'le coiffeur', f: 'la coiffeuse', es: 'el peluquero / la peluquera', icono: '💇', grupo: 'eur' },
  { m: 'le pompier', es: 'el bombero', icono: '🚒', grupo: 'masc' },
  { m: 'le plombier', es: 'el fontanero', icono: '🔧', grupo: 'masc' },
  { m: 'le médecin', es: 'el médico', icono: '🩺', grupo: 'masc' },
  { m: 'le professeur', es: 'el profesor', icono: '🏫', grupo: 'masc' },
]

const GRUPOS: Record<Metier['grupo'], string> = {
  igual: 'No cambian',
  ere: '‑er → ‑ère',
  enne: '‑en → ‑enne',
  eur: '‑eur → ‑euse / ‑rice',
  masc: 'Solo masculino',
}

const b = (t: string) => <b className="text-violet-800">{t}</b>

const Grupo = ({ g }: { g: Metier['grupo'] }) => (
  <div className="grid gap-2">
    {METIERS.filter((x) => x.grupo === g).map((x) => (
      <p key={x.m} className="flex flex-wrap items-center gap-x-2 rounded-xl bg-white px-3 py-2 text-lg">
        <span className="text-2xl" aria-hidden="true">
          {x.icono}
        </span>
        <Fr>{x.m}</Fr>
        {x.f && (
          <>
            → <Fr>{x.f}</Fr>
          </>
        )}
        <span className="basis-full pl-9 text-base text-slate-500">{x.es}</span>
      </p>
    ))}
  </div>
)

const TARXETAS: Tarxeta[] = [
  {
    titulo: 'Les métiers: las profesiones',
    texto: (
      <>
        <p>Para el examen, lo importante es saber cómo se forma el {b('femenino')} de cada profesión.</p>
        <p>Hay cinco grupos:</p>
        <ol className="list-decimal space-y-1 pl-7">
          <li>Las que {b('no cambian')}: solo cambia el artículo.</li>
          <li>
            Las que cambian {b('‑er → ‑ère')}.
          </li>
          <li>
            Las que cambian {b('‑en → ‑enne')}.
          </li>
          <li>
            Las que cambian {b('‑eur → ‑euse')} o {b('‑rice')}.
          </li>
          <li>Las que {b('solo van en masculino')}.</li>
        </ol>
      </>
    ),
  },
  {
    titulo: '1. Las que no cambian',
    texto: (
      <>
        <p>
          Acaban en ‑e y son iguales en masculino y femenino. Solo cambia {b('le')} por {b('la')}.
        </p>
        <Grupo g="igual" />
      </>
    ),
  },
  {
    titulo: '2. ‑er → ‑ère',
    texto: (
      <>
        <p>
          Se cambia la terminación {b('‑er')} por {b('‑ère')} (con acento grave).
        </p>
        <Grupo g="ere" />
        <p className="text-base text-slate-600">
          💡 Delante de vocal el artículo es <i>l'</i> en los dos: <i>l'infirmier, l'infirmière</i>.
        </p>
      </>
    ),
  },
  {
    titulo: '3. ‑en → ‑enne',
    texto: (
      <>
        <p>
          Se cambia {b('‑en')} por {b('‑enne')}: se dobla la n y se añade e.
        </p>
        <Grupo g="enne" />
      </>
    ),
  },
  {
    titulo: '4. ‑eur → ‑euse o ‑rice',
    texto: (
      <>
        <p>
          La mayoría cambian {b('‑eur → ‑euse')}. Si acaban en {b('‑teur')}, cambian a {b('‑trice')}.
        </p>
        <Grupo g="eur" />
      </>
    ),
  },
  {
    titulo: '5. Solo en masculino',
    texto: (
      <>
        <p>
          Tu profesora las ha dado {b('solo en masculino')}: se usan igual para un hombre y para una mujer.
        </p>
        <Grupo g="masc" />
        <p className="text-base text-slate-600">💡 Para el examen, apréndelas como dice tu profesora.</p>
      </>
    ),
  },
]

const CON_FEMENINO = METIERS.filter((x) => x.f)
const solo = (s: string) => s.replace(/^(le |la |l')/, '')

const preguntaFemenino = (x: Metier): Pregunta => ({
  tipo: 'escribe',
  texto: (
    <span>
      Femenino de <b lang="fr">{x.m}</b> <span className="text-base font-semibold text-slate-500">({x.es})</span>
    </span>
  ),
  respostas: [x.f!, solo(x.f!)],
  explica: <>Grupo: {GRUPOS[x.grupo]}.</>,
})

const XOGOS: Xogo[] = [
  {
    id: 'grupos',
    titulo: '¿De qué grupo es?',
    icono: '🗂️',
    explica: 'Coloca cada profesión según cómo hace el femenino.',
    crear: (acabar) => (
      <Clasifica
        caixas={[
          { id: 'igual', nome: GRUPOS.igual, cor: 'border-slate-300 bg-slate-100' },
          { id: 'ere', nome: GRUPOS.ere, cor: 'border-sky-300 bg-sky-100' },
          { id: 'enne', nome: GRUPOS.enne, cor: 'border-emerald-300 bg-emerald-100' },
          { id: 'eur', nome: GRUPOS.eur, cor: 'border-amber-300 bg-amber-100' },
          { id: 'masc', nome: GRUPOS.masc, cor: 'border-rose-300 bg-rose-100' },
        ]}
        elementos={METIERS.map((x) => ({
          texto: x.m,
          caixa: x.grupo,
          pista: x.grupo === 'masc' ? `${x.m} es de los que solo van en masculino.` : `${x.m} → ${x.f}. Fíjate en cómo cambia la terminación.`,
        }))}
        acabar={acabar}
      />
    ),
  },
  {
    id: 'femenino',
    titulo: 'Escribe el femenino',
    icono: '✍️',
    explica: 'Del masculino al femenino, con las teclas de los acentos.',
    crear: (acabar) => <Proba practica cantas={8} preguntas={CON_FEMENINO.map(preguntaFemenino)} acabar={acabar} />,
  },
  {
    id: 'parellas',
    titulo: 'Masculino y femenino',
    icono: '👫',
    explica: 'Une cada profesión con su femenino.',
    crear: (acabar) => <Une pares={barallar(CON_FEMENINO).slice(0, 7).map((x) => ({ palabra: x.m, significado: x.f! }))} acabar={acabar} />,
  },
  {
    id: 'significado',
    titulo: '¿Qué significa?',
    icono: '🔗',
    explica: 'Une cada profesión con su significado.',
    crear: (acabar) => <Une pares={barallar(METIERS).slice(0, 7).map((x) => ({ palabra: x.m, significado: x.es }))} acabar={acabar} />,
  },
]

export const PREGUNTAS: Pregunta[] = [
  ...CON_FEMENINO.map(preguntaFemenino),
  ...METIERS.map((x) =>
    elixe(
      <>¿Qué significa <span lang="fr">«{x.m}»</span>?</>,
      x.es,
      barallar(METIERS.filter((y) => y !== x))
        .slice(0, 3)
        .map((y) => y.es),
      <>
        {x.m} = {x.es}.
      </>,
    ),
  ),
  elixe('¿Cuál es el femenino de «le serveur»?', 'la serveuse', ['la serveurice', 'la serveure', 'la serveuresse'], <>‑eur → ‑euse: la serveuse.</>),
  elixe('¿Cuál es el femenino de «l’acteur»?', "l'actrice", ["l'acteuse", "l'acteure", "l'actrisse"], <>‑teur → ‑trice: l'actrice.</>),
  elixe('¿Cuál es el femenino de «le pharmacien»?', 'la pharmacienne', ['la pharmaciène', 'la pharmacienné', 'la pharmaciere'], <>‑en → ‑enne: la pharmacienne.</>),
  elixe('¿Cuál es el femenino de «le cuisinier»?', 'la cuisinière', ['la cuisiniere', 'la cuisinienne', 'la cuisinieuse'], <>‑er → ‑ère, con acento grave: la cuisinière.</>),
  elixe('¿Cuál de estas profesiones solo se usa en masculino (según tu profesora)?', 'le pompier', ['le dentiste', 'le coiffeur', "l'infirmier"], <>Pompier, plombier, médecin y professeur van solo en masculino.</>),
  elixe('¿Cuál de estas no cambia en femenino?', 'le journaliste', ['le serveur', 'le pharmacien', 'le cuisinier'], <>Journaliste es igual: le journaliste, la journaliste.</>),
]

export default function Metiers({ ruta, modo }: { ruta: string; modo?: string }) {
  return (
    <ParadaPrimaria
      ruta={ruta}
      titulo="Les métiers"
      modo={modo}
      paneis={{
        descubre: <Tarxetas tarxetas={TARXETAS} xoga={`${ruta}/xoga`} />,
        xoga: <Xogos xogos={XOGOS} proba={`${ruta}/proba`} />,
        proba: <Proba id="frances1/metiers" preguntas={PREGUNTAS} />,
      }}
    />
  )
}
