// Parada «Les parties du corps»: las palabras de la ficha de clase, con el cuerpo y la cara para tocar.
import { Busca, Clasifica, Fr, ParadaPrimaria, Proba, Tarxetas, Une, barallar, type Debuxo, type Pregunta, type Tarxeta, type Xogo, Xogos } from '../../primaria/pezas'
import { elixe, toca } from '../../primaria/paisaxes/preguntas'
import { Cara2, Corpo, NOMES_CARA, NOMES_CORPO } from './debuxos'

const CorpoXogo: Debuxo = (p) => <Corpo {...p} />
const CaraXogo: Debuxo = (p) => <Cara2 {...p} />

// Las de la ficha de clase.
export const PARTES: [string, string][] = [
  ['la tête', 'la cabeza'],
  ['les cheveux', 'el pelo'],
  ["l'œil", 'el ojo'],
  ["l'oreille", 'la oreja'],
  ['le nez', 'la nariz'],
  ['la bouche', 'la boca'],
  ['les dents', 'los dientes'],
  ['la langue', 'la lengua'],
  ['le cou', 'el cuello'],
  ["l'épaule", 'el hombro'],
  ['le bras', 'el brazo'],
  ['le coude', 'el codo'],
  ['la main', 'la mano'],
  ['les doigts', 'los dedos'],
  ['le pouce', 'el pulgar'],
  ['le torse', 'el torso'],
  ['la jambe', 'la pierna'],
  ['le genou', 'la rodilla'],
  ['le pied', 'el pie'],
  ['les orteils', 'los dedos del pie'],
]

const b = (t: string) => <b className="text-violet-800">{t}</b>

const lista = (desde: number, ata: number) => (
  <div className="grid gap-1.5">
    {PARTES.slice(desde, ata).map(([fr, es]) => (
      <span key={fr} className="rounded-xl bg-white px-3 py-2 text-lg">
        <Fr>{fr}</Fr> <span className="text-slate-500">= {es}</span>
      </span>
    ))}
  </div>
)

const TARXETAS: Tarxeta[] = [
  {
    titulo: 'La cabeza y la cara',
    texto: lista(0, 8),
    visual: <Cara2 etiquetas />,
  },
  {
    titulo: 'El cuerpo',
    texto: lista(8, 20),
    visual: <Corpo etiquetas />,
  },
  {
    titulo: 'Le, la, l’, les',
    texto: (
      <>
        <p>Cada parte del cuerpo va con su artículo. Apréndelas juntas, porque a veces no coincide con el castellano:</p>
        <ul className="space-y-2">
          <li>
            {b('le')} masculino: <Fr>le bras</Fr>, <Fr>le nez</Fr>, <Fr>le cou</Fr>
          </li>
          <li>
            {b('la')} femenino: <Fr>la main</Fr>, <Fr>la tête</Fr>, <Fr>la jambe</Fr>
          </li>
          <li>
            {b("l'")} delante de vocal: <Fr>l'œil</Fr>, <Fr>l'oreille</Fr>, <Fr>l'épaule</Fr>
          </li>
          <li>
            {b('les')} plural: <Fr>les cheveux</Fr>, <Fr>les doigts</Fr>, <Fr>les dents</Fr>
          </li>
        </ul>
        <p className="text-base text-slate-600">
          💡 <i>le nez</i> es masculino aunque en castellano sea «la nariz». Y el plural de <i>l'œil</i> es especial: <Fr>les yeux</Fr> (los ojos).
        </p>
      </>
    ),
  },
]

/** Sin artículo, para el juego de los artículos: «bras», «main»... */
const ARTIGO = (fr: string) => (fr.startsWith("l'") ? "l'" : fr.split(' ')[0])
const SEN_ARTIGO = (fr: string) => (fr.startsWith("l'") ? fr.slice(2) : fr.split(' ').slice(1).join(' '))

const XOGOS: Xogo[] = [
  {
    id: 'corpo',
    titulo: 'Toca el cuerpo',
    icono: '🧍',
    explica: 'Toca la parte del cuerpo que te pida.',
    crear: (acabar) => <Busca Debuxo={CorpoXogo} nomes={NOMES_CORPO} obxectivos={Object.keys(NOMES_CORPO)} acabar={acabar} />,
  },
  {
    id: 'cara',
    titulo: 'Toca la cara',
    icono: '😮',
    explica: 'Pelo, ojos, orejas, nariz, boca, dientes y lengua.',
    crear: (acabar) => <Busca Debuxo={CaraXogo} nomes={NOMES_CARA} obxectivos={Object.keys(NOMES_CARA)} acabar={acabar} />,
  },
  {
    id: 'escoita',
    titulo: 'Escucha y toca',
    icono: '👂',
    explica: 'Oyes la palabra en francés y tocas esa parte.',
    crear: (acabar) => <Busca escoita Debuxo={CorpoXogo} nomes={NOMES_CORPO} obxectivos={Object.keys(NOMES_CORPO)} acabar={acabar} />,
  },
  {
    id: 'significado',
    titulo: '¿Qué significa?',
    icono: '🔗',
    explica: 'Une cada palabra con su significado.',
    crear: (acabar) => <Une pares={barallar(PARTES).slice(0, 7).map(([palabra, significado]) => ({ palabra, significado }))} acabar={acabar} />,
  },
  {
    id: 'artigos',
    titulo: '¿Le, la, l’ o les?',
    icono: '🗂️',
    explica: 'Pon cada palabra con su artículo.',
    crear: (acabar) => (
      <Clasifica
        caixas={[
          { id: 'le', nome: 'le', cor: 'border-sky-300 bg-sky-100' },
          { id: 'la', nome: 'la', cor: 'border-pink-300 bg-pink-100' },
          { id: "l'", nome: "l'", cor: 'border-amber-300 bg-amber-100' },
          { id: 'les', nome: 'les', cor: 'border-violet-300 bg-violet-100' },
        ]}
        elementos={PARTES.map(([fr, es]) => ({
          texto: SEN_ARTIGO(fr),
          caixa: ARTIGO(fr),
          pista: `Es ${fr} (${es}).`,
        }))}
        acabar={acabar}
      />
    ),
  },
]

export const PREGUNTAS: Pregunta[] = [
  ...Object.keys(NOMES_CORPO).map((id) => toca(<>Touche {NOMES_CORPO[id]}</>, CorpoXogo, NOMES_CORPO, id, <>Es {NOMES_CORPO[id]}.</>, NOMES_CORPO[id])),
  ...Object.keys(NOMES_CARA).map((id) => toca(<>Touche {NOMES_CARA[id]}</>, CaraXogo, NOMES_CARA, id, <>Es {NOMES_CARA[id]}.</>, NOMES_CARA[id])),
  ...PARTES.map(([fr, es]) =>
    elixe(
      <>¿Cómo se dice «{es}»?</>,
      fr,
      barallar(PARTES.filter(([f]) => f !== fr))
        .slice(0, 3)
        .map(([f]) => f),
      <>
        {es} = {fr}.
      </>,
    ),
  ),
  ...PARTES.map(
    ([fr, es]): Pregunta => ({
      tipo: 'escribe',
      texto: (
        <span>
          Escribe en francés, con su artículo: <b>{es}</b>
        </span>
      ),
      respostas: [fr],
    }),
  ),
  elixe('¿Cuál es el plural de «l’œil»?', 'les yeux', ['les œils', 'les oeils', 'les œilles'], <>Es irregular: l'œil → les yeux.</>),
]

export default function Corps({ ruta, modo }: { ruta: string; modo?: string }) {
  return (
    <ParadaPrimaria
      ruta={ruta}
      titulo="Les parties du corps"
      modo={modo}
      paneis={{
        descubre: <Tarxetas tarxetas={TARXETAS} xoga={`${ruta}/xoga`} />,
        xoga: <Xogos xogos={XOGOS} proba={`${ruta}/proba`} />,
        proba: <Proba id="frances1/corps" preguntas={PREGUNTAS} />,
      }}
    />
  )
}
