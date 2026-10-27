// Inglés de 3.º de Primaria (Olivia): unidad 1 «Animals» y unidad 2 «Bedroom» del libro, y el vocabulario de su
// libreta. Todo se puede oír (🔊 en inglés británico) y el vocabulario se aprende a escribir letra a letra.
import type { ReactNode } from 'react'
import { Busca, Clasifica, Ordena, Proba, SerieDeletrea, Son, Une, VerdadeiroFalso, barallar, type Pregunta, type Tarxeta, type Xogo } from '../pezas'
import { elixe, toca } from '../paisaxes/preguntas'
import { Parada } from '../../historia/parcial1/roma'
import { Picto, PictoPrep, lamina } from './debuxos'

type PropsParada = { ruta: string; modo?: string }
const U = 'ingles3'
const Practica = ({ preguntas, acabar }: { preguntas: Pregunta[]; acabar: () => void }) => <Proba practica cantas={8} preguntas={preguntas} acabar={acabar} />
const En = ({ children }: { children: string }) => (
  <span className="inline-flex items-center gap-1 font-bold text-violet-800" lang="en">
    {children} <Son texto={children} />
  </span>
)

interface Palabra {
  en: string
  es: string
  /** Pictograma propio (id de debuxos) o emoji. */
  dibujo?: ReactNode
}

const ANIMALES: Palabra[] = [
  { en: 'scorpion', es: 'escorpión' },
  { en: 'dolphin', es: 'delfín' },
  { en: 'snake', es: 'serpiente' },
  { en: 'frog', es: 'rana' },
  { en: 'parrot', es: 'loro' },
  { en: 'lizard', es: 'lagarto' },
  { en: 'butterfly', es: 'mariposa' },
  { en: 'worm', es: 'gusano' },
].map((p) => ({ ...p, dibujo: <Picto id={p.en} /> }))

const DORMITORIO: Palabra[] = [
  { en: 'bed', es: 'cama' },
  { en: 'rug', es: 'alfombra' },
  { en: 'alarm clock', es: 'reloj despertador' },
  { en: 'guitar', es: 'guitarra' },
  { en: 'photos', es: 'fotos' },
  { en: 'speaker', es: 'altavoz' },
  { en: 'cushions', es: 'cojines' },
  { en: 'lights', es: 'luces' },
].map((p) => ({ ...p, dibujo: <Picto id={p.en} /> }))

const emoji = (e: string) => (
  <span className="text-6xl" aria-hidden="true">
    {e}
  </span>
)
const SENTIMIENTOS: Palabra[] = [
  { en: 'energetic', es: 'enérgico', dibujo: emoji('⚡') },
  { en: 'bored', es: 'aburrido', dibujo: emoji('😑') },
  { en: 'upset', es: 'molesto', dibujo: emoji('😣') },
  { en: 'strong', es: 'fuerte', dibujo: emoji('💪') },
  { en: 'shy', es: 'tímido', dibujo: emoji('😳') },
  { en: 'brave', es: 'valiente', dibujo: emoji('🦁') },
  { en: 'tired', es: 'cansado', dibujo: emoji('😴') },
  { en: 'excited', es: 'emocionado', dibujo: emoji('🤩') },
]

const ADJETIVOS: Palabra[] = [
  { en: 'big', es: 'grande' },
  { en: 'small', es: 'pequeño' },
  { en: 'long', es: 'largo' },
  { en: 'short', es: 'corto' },
  { en: 'noisy', es: 'ruidoso' },
  { en: 'quiet', es: 'tranquilo, silencioso' },
  { en: 'colourful', es: 'de colores' },
  { en: 'grey', es: 'gris' },
  { en: 'brown', es: 'marrón' },
  { en: 'green', es: 'verde' },
]

const PREPOSICIONES: Palabra[] = [
  { en: 'in', es: 'dentro' },
  { en: 'on', es: 'encima' },
  { en: 'under', es: 'debajo' },
  { en: 'next to', es: 'al lado de' },
].map((p) => ({ ...p, dibujo: <PictoPrep id={p.en} /> }))

/** Palabras de la libreta de Olivia, con su significado (corregida la ortografía). */
export const LIBRETA: Palabra[] = [
  { en: 'nice to meet you', es: 'encantada de conocerte' },
  { en: 'learn', es: 'aprender' },
  { en: 'amazing', es: 'sorprendente' },
  { en: 'find', es: 'encontrar, buscar' },
  { en: 'hear', es: 'oír' },
  { en: 'see', es: 'ver' },
  { en: 'water', es: 'agua' },
  { en: 'everyone', es: 'todos' },
  { en: 'funny', es: 'divertido' },
  { en: 'fish', es: 'pez' },
  { en: 'eat', es: 'comer' },
  { en: 'like', es: 'gustar' },
  { en: 'song', es: 'canción' },
  { en: 'wonderful', es: 'maravilloso' },
  { en: 'world', es: 'mundo' },
  { en: 'everywhere', es: 'por todas partes' },
  { en: 'pets', es: 'mascotas' },
  { en: 'have got', es: 'tener' },
  { en: 'help', es: 'ayudar' },
  { en: 'birds', es: 'pájaros' },
  { en: 'catch', es: 'coger, atrapar' },
  { en: 'fisherman', es: 'pescador' },
  { en: 'throw', es: 'lanzar' },
  { en: 'swim', es: 'nadar' },
  { en: 'nets', es: 'redes' },
  { en: 'teach', es: 'enseñar' },
  { en: 'homework', es: 'deberes' },
  { en: 'work', es: 'trabajar' },
  { en: 'together', es: 'juntos' },
  { en: 'high', es: 'alto' },
  { en: 'follow', es: 'seguir' },
  { en: 'lots of', es: 'muchos' },
  { en: 'lost', es: 'perdido' },
  { en: 'forest', es: 'bosque' },
  { en: 'walk', es: 'caminar; paseo' },
  { en: 'want', es: 'querer' },
  { en: 'cool', es: 'guay, chulo' },
  { en: 'have fun', es: 'divertirse' },
  { en: 'kids', es: 'chicos, niños' },
  { en: 'firefly', es: 'luciérnaga' },
  { en: 'dangerous', es: 'peligroso' },
  { en: 'silly', es: 'tonto' },
  { en: 'slimy', es: 'pegajoso, viscoso' },
  { en: 'good', es: 'bueno' },
  { en: 'earth', es: 'tierra' },
  { en: 'friendly', es: 'amable, simpático' },
  { en: 'where?', es: '¿dónde?' },
  { en: 'path', es: 'camino, sendero' },
  { en: "I don't know", es: 'no lo sé' },
  { en: 'now', es: 'ahora' },
  { en: "it's scary", es: 'da miedo' },
  { en: "don't worry", es: 'no te preocupes' },
  { en: 'home', es: 'casa' },
  { en: 'things', es: 'cosas' },
  { en: 'dark', es: 'oscuro' },
  { en: 'think', es: 'pensar' },
  { en: 'afraid of', es: 'tener miedo de' },
  { en: 'dots', es: 'lunares, manchas' },
  { en: 'tree', es: 'árbol' },
  { en: 'three', es: 'tres' },
  { en: 'bedroom', es: 'dormitorio, habitación' },
  { en: 'messy', es: 'desordenado' },
  { en: 'somewhere', es: 'en algún lugar' },
  { en: "you're right", es: 'tienes razón' },
  { en: 'tidy up', es: 'ordenar' },
  { en: 'of course', es: 'por supuesto' },
  { en: 'pretty', es: 'bonito' },
  { en: 'listen', es: 'escuchar' },
  { en: 'here', es: 'aquí' },
  { en: 'there', es: 'allí' },
  { en: 'what are you doing?', es: '¿qué estás haciendo?' },
]

// ——— Piezas comunes a las paradas de vocabulario ———

/** Tarjeta con todas las palabras: dibujo, palabra con 🔊 y lo que significa. */
const tarjetaPalabras = (titulo: string, ps: Palabra[], texto?: ReactNode): Tarxeta => ({
  titulo,
  texto: (
    <>
      {texto}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {ps.map((p) => (
          <div key={p.en} className="flex flex-col items-center rounded-2xl border-2 border-violet-100 bg-white p-2 text-center">
            {p.dibujo}
            <En>{p.en}</En>
            <span className="text-sm text-slate-500">{p.es}</span>
          </div>
        ))}
      </div>
    </>
  ),
})

/** Faltas de ortografía creíbles: quitar una letra, doblarla, cambiar dos de sitio o cambiar una vocal. */
export function faltas(palabra: string): string[] {
  const r = new Set<string>()
  const w = [...palabra]
  for (let i = 0; i < w.length; i++) {
    if (w[i] === ' ') continue
    r.add([...w.slice(0, i), ...w.slice(i + 1)].join(''))
    r.add([...w.slice(0, i + 1), w[i], ...w.slice(i + 1)].join(''))
    if (i + 1 < w.length && w[i + 1] !== ' ' && w[i] !== w[i + 1]) r.add([...w.slice(0, i), w[i + 1], w[i], ...w.slice(i + 2)].join(''))
    const v = { a: 'e', e: 'i', i: 'e', o: 'u', u: 'o', y: 'i' }[w[i]]
    if (v) r.add([...w.slice(0, i), v, ...w.slice(i + 1)].join(''))
  }
  r.delete(palabra)
  return [...r].filter((x) => x.trim().length > 1 && !x.includes('  '))
}

/** Preguntas de vocabulario: oír y tocar, significado, cómo se escribe y deletrear. */
function preguntasVocabulario(ps: Palabra[], conLamina: boolean): Pregunta[] {
  const nomes = Object.fromEntries(ps.map((p) => [p.en, p.en]))
  const Lam = lamina(ps.map((p) => p.en))
  return [
    ...(conLamina ? ps.map((p) => toca('Escucha 🔊 y toca el dibujo.', Lam, nomes, p.en, <>Es «{p.en}»: {p.es}.</>, p.en)) : []),
    ...ps.map((p): Pregunta => ({ ...elixe(<>Escucha 🔊. ¿Qué significa?</>, p.es, barallar(ps.filter((x) => x !== p).map((x) => x.es)).slice(0, 3), <>«{p.en}» significa «{p.es}».</>), oir: p.en })),
    ...ps.map((p) => elixe(<>¿Cómo se dice «{p.es}» en inglés?</>, p.en, barallar(ps.filter((x) => x !== p).map((x) => x.en)).slice(0, 3), <>«{p.es}» es «{p.en}».</>, p.dibujo)),
    ...ps.map((p): Pregunta => ({ ...elixe(<>Escucha 🔊. ¿Cómo se escribe?</>, p.en, barallar(faltas(p.en)).slice(0, 3), <>Se escribe «{p.en}».</>, p.dibujo), oir: p.en })),
    ...ps.map((p): Pregunta => ({ tipo: 'deletrea', texto: <>Escucha y escribe la palabra con las letras.</>, palabra: p.en, visual: p.dibujo, explica: <>«{p.en}»: {p.es}.</> })),
  ]
}

/** Juegos de vocabulario: oír y tocar, unir con su significado y deletrear. */
function juegosVocabulario(ps: Palabra[], conLamina: boolean, extra: Xogo[] = []): Xogo[] {
  const nomes = Object.fromEntries(ps.map((p) => [p.en, p.en]))
  const Lam = lamina(ps.map((p) => p.en))
  return [
    ...(conLamina ? [{ id: 'oye', titulo: 'Escucha y toca', icono: '👂', explica: 'Oyes una palabra: toca su dibujo.', crear: (acabar: () => void) => <Busca Debuxo={Lam} nomes={nomes} obxectivos={ps.map((p) => p.en)} escoita acabar={acabar} /> }] : []),
    { id: 'une', titulo: 'Une', icono: '🔗', explica: 'Cada palabra en inglés con su significado.', crear: (acabar) => <Une pares={barallar(ps).slice(0, 8).map((p) => ({ palabra: p.en, significado: p.es }))} acabar={acabar} /> },
    { id: 'escribe', titulo: 'Aprende a escribirlas', icono: '✏️', explica: 'Escucha la palabra y forma sus letras.', crear: (acabar) => <SerieDeletrea palabras={ps.map((p) => ({ palabra: p.en, visual: p.dibujo, pista: p.es }))} acabar={acabar} /> },
    ...extra,
  ]
}

const ANIMALS_PREG = preguntasVocabulario(ANIMALES, true)
const BEDROOM_PREG = preguntasVocabulario(DORMITORIO, true)
const FEELINGS_PREG = preguntasVocabulario(SENTIMIENTOS, false)

// ===================================================================================================
// 1. Animals (unidad 1)
// ===================================================================================================

export function Animals(p: PropsParada) {
  return (
    <Parada
      {...p}
      unidade={U}
      id="animals"
      titulo="Unit 1 · Animals"
      tarxetas={[
        tarjetaPalabras('Los ocho animales', ANIMALES, <p>Toca 🔊 para oír cada palabra. Repítela en voz alta.</p>),
        {
          titulo: 'Para recordarlas',
          texto: (
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                <En>butterfly</En>: butter (mantequilla) + fly (mosca). Con dos <b>t</b>.
              </li>
              <li>
                <En>parrot</En>: con dos <b>r</b>.
              </li>
              <li>
                <En>dolphin</En>: el sonido «f» se escribe <b>ph</b>.
              </li>
              <li>
                <En>lizard</En>: con <b>z</b>.
              </li>
              <li>
                <En>worm</En>: suena «uerm», pero se escribe con <b>o</b>.
              </li>
            </ul>
          ),
        },
      ]}
      xogos={juegosVocabulario(ANIMALES, true)}
      preguntas={ANIMALS_PREG}
    />
  )
}

// ===================================================================================================
// 2. It's… They're… (unidad 1)
// ===================================================================================================

/** Frases de la unidad 1 (libro y cuaderno), con su traducción. */
const FRASES_1: [string, string][] = [
  ["It's a parrot. It's noisy.", 'Es un loro. Es ruidoso.'],
  ["It isn't noisy now. It's quiet.", 'Ahora no es ruidoso. Está tranquilo.'],
  ["They aren't quiet. They're noisy.", 'No son silenciosos. Son ruidosos.'],
  ["They're dolphins. They're big.", 'Son delfines. Son grandes.'],
  ["They're butterflies. They aren't big.", 'Son mariposas. No son grandes.'],
  ["It's a lizard. It's quiet.", 'Es un lagarto. Es silencioso.'],
  ["It's a dolphin. It's grey.", 'Es un delfín. Es gris.'],
  ["They're scorpions. They're brown.", 'Son escorpiones. Son marrones.'],
  ["It's green. It's got four legs.", 'Es verde. Tiene cuatro patas.'],
  ['What is it?', '¿Qué es?'],
  ["Are they big? No, they aren't.", '¿Son grandes? No, no lo son.'],
  ['Are they small? Yes, they are.', '¿Son pequeños? Sí, lo son.'],
  ["Are you afraid of spiders? No, I'm not.", '¿Te dan miedo las arañas? No.'],
  ["I'm afraid of sharks.", 'Me dan miedo los tiburones.'],
  ["It's a parrot. It's colourful.", 'Es un loro. Es de colores.'],
]

/** ¿Uno o varios? Con el dibujo de uno o de tres animales. */
const unoOVarios = (id: string, varios: boolean) => (
  <div className="flex justify-center">
    {Array.from({ length: varios ? 3 : 1 }, (_, i) => (
      <Picto key={i} id={id} tam={varios ? 72 : 96} />
    ))}
  </div>
)

const DESCRIBE_PREG: Pregunta[] = [
  ...ANIMALES.flatMap((a) => [
    elixe(<>Mira el dibujo. ¿Cómo empieza la frase?</>, "It's", ["They're"], <>Es uno solo: «It's a {a.en}.»</>, unoOVarios(a.en, false)),
    elixe(<>Mira el dibujo. ¿Cómo empieza la frase?</>, "They're", ["It's"], <>Son varios: «They're…»</>, unoOVarios(a.en, true)),
  ]),
  ...FRASES_1.map(([en, es]) => ({ ...elixe(<>Escucha 🔊. ¿Qué significa?</>, es, barallar(FRASES_1.filter(([x]) => x !== en).map(([, y]) => y)).slice(0, 2), <>«{en}»</>), oir: en })),
  elixe('¿Qué es lo contrario de «big»?', 'small', ['long', 'noisy', 'quiet'], 'big (grande) ↔ small (pequeño).'),
  elixe('¿Qué es lo contrario de «noisy»?', 'quiet', ['small', 'short', 'big'], 'noisy (ruidoso) ↔ quiet (tranquilo).'),
  elixe('¿Qué es lo contrario de «long»?', 'short', ['small', 'quiet', 'big'], 'long (largo) ↔ short (corto).'),
  elixe("¿Qué significa «It isn't»?", 'No es', ['Es', 'Son', 'No son'], "It isn't = It is not."),
  elixe("¿Qué significa «They aren't»?", 'No son', ['Son', 'Es', 'No es'], "They aren't = They are not."),
  elixe('Completa: «Are they big? No, they ___.»', "aren't", ["isn't", 'are', "I'm not"], "No, they aren't."),
  elixe('Completa: «Are you afraid of snakes? No, ___.»', "I'm not", ["they aren't", "it isn't", 'I am'], "No, I'm not."),
  ...ADJETIVOS.slice(0, 6).map((p): Pregunta => ({ tipo: 'deletrea', texto: <>Escucha y escribe: «{p.es}».</>, palabra: p.en })),
]

export function Describe(p: PropsParada) {
  return (
    <Parada
      {...p}
      unidade={U}
      id="describe"
      titulo="Unit 1 · It's… They're…"
      tarxetas={[
        {
          titulo: 'Uno o muchos',
          texto: (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-white p-3 text-center">
                <Picto id="frog" />
                <p>
                  <En>It's a frog.</En>
                </p>
                <p className="text-slate-600">Uno: It's = It is</p>
              </div>
              <div className="rounded-2xl bg-white p-3 text-center">
                <div className="flex justify-center">
                  <Picto id="frog" tam={64} />
                  <Picto id="frog" tam={64} />
                  <Picto id="frog" tam={64} />
                </div>
                <p>
                  <En>They're frogs.</En>
                </p>
                <p className="text-slate-600">Varios: They're = They are</p>
              </div>
            </div>
          ),
        },
        {
          titulo: 'Sí y no',
          texto: (
            <table className="w-full border-collapse text-lg">
              <thead>
                <tr className="bg-violet-100">
                  <th className="border p-2">✔️</th>
                  <th className="border p-2">❌</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">
                    <En>It's noisy.</En>
                  </td>
                  <td className="border p-2">
                    <En>It isn't noisy.</En>
                  </td>
                </tr>
                <tr>
                  <td className="border p-2">
                    <En>They're quiet.</En>
                  </td>
                  <td className="border p-2">
                    <En>They aren't quiet.</En>
                  </td>
                </tr>
              </tbody>
            </table>
          ),
        },
        tarjetaPalabras('Palabras para describir', ADJETIVOS),
        {
          titulo: 'Preguntas',
          texto: (
            <ul className="space-y-2">
              <li>
                <En>What is it?</En> → <En>It's a snake.</En>
              </li>
              <li>
                <En>Are they big?</En> → <En>Yes, they are.</En> / <En>No, they aren't.</En>
              </li>
              <li>
                <En>Are you afraid of spiders?</En> → <En>Yes, I am.</En> / <En>No, I'm not.</En>
              </li>
              <li>
                <En>It's green. It's got four legs.</En> → <En>It's a frog.</En>
              </li>
            </ul>
          ),
        },
      ]}
      xogos={[
        { id: 'ordena', titulo: 'Ordena las frases', icono: '🧩', explica: 'Toca las palabras en orden.', crear: (acabar) => <Ordena frases={barallar(FRASES_1).slice(0, 5).map(([en, es]) => ({ palabras: en.split(' '), traducion: es }))} acabar={acabar} /> },
        {
          id: 'uno',
          titulo: "It's o They're",
          icono: '🐸',
          explica: '¿Uno o varios?',
          crear: (acabar) => <Practica preguntas={DESCRIBE_PREG.slice(0, 16)} acabar={acabar} />,
        },
        { id: 'contrarios', titulo: 'Une las palabras', icono: '🔗', explica: 'Cada palabra con su significado.', crear: (acabar) => <Une pares={barallar(ADJETIVOS).slice(0, 6).map((p) => ({ palabra: p.en, significado: p.es }))} acabar={acabar} /> },
        { id: 'escribe', titulo: 'Aprende a escribirlas', icono: '✏️', explica: 'big, small, long, short…', crear: (acabar) => <SerieDeletrea palabras={ADJETIVOS.slice(0, 6).map((p) => ({ palabra: p.en, pista: p.es }))} acabar={acabar} /> },
      ]}
      preguntas={DESCRIBE_PREG}
    />
  )
}

// ===================================================================================================
// 3. Bedroom (unidad 2)
// ===================================================================================================

export function Bedroom(p: PropsParada) {
  return (
    <Parada
      {...p}
      unidade={U}
      id="bedroom"
      titulo="Unit 2 · Bedroom"
      tarxetas={[
        tarjetaPalabras('Las cosas de mi habitación', DORMITORIO, <p>Toca 🔊 para oír cada palabra.</p>),
        {
          titulo: 'Para recordarlas',
          texto: (
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                <En>guitar</En>: con <b>u</b> después de la g: g-u-i-t-a-r.
              </li>
              <li>
                <En>alarm clock</En>: son dos palabras.
              </li>
              <li>
                <En>photos</En>: el sonido «f» se escribe <b>ph</b>, como en dolphin.
              </li>
              <li>
                <En>lights</En>: con <b>gh</b>, que no suena.
              </li>
              <li>
                <En>cushions</En>: con <b>sh</b>, que suena «sh».
              </li>
            </ul>
          ),
        },
      ]}
      xogos={juegosVocabulario(DORMITORIO, true)}
      preguntas={BEDROOM_PREG}
    />
  )
}

// ===================================================================================================
// 4. This is my… These are our… (unidad 2)
// ===================================================================================================

const FRASES_2: [string, string][] = [
  ['Come in. Look! This is my new speaker.', 'Pasa. ¡Mira! Este es mi altavoz nuevo.'],
  ["It's cool.", 'Es guay.'],
  ['And these are our new cushions. Sit down.', 'Y estos son nuestros cojines nuevos. Siéntate.'],
  ["This isn't a cushion. It's a cat!", '¡Esto no es un cojín! ¡Es un gato!'],
  ['This is my alarm clock.', 'Este es mi despertador.'],
  ['This is our rug.', 'Esta es nuestra alfombra.'],
  ['These are our lights.', 'Estas son nuestras luces.'],
  ['These are my photos.', 'Estas son mis fotos.'],
  ['Have you got a rug in your bedroom?', '¿Tienes una alfombra en tu habitación?'],
  ['Yes, I have.', 'Sí, tengo.'],
  ["No, I haven't.", 'No, no tengo.'],
  ["What's your favourite thing in your bedroom?", '¿Cuál es tu cosa favorita de tu habitación?'],
  ['The ball is under the table.', 'La pelota está debajo de la mesa.'],
]

/** This is / These are según el dibujo; my (yo) / our (nosotros). */
const SINGULAR: Record<string, string> = { bed: 'bed', rug: 'rug', 'alarm clock': 'alarm clock', guitar: 'guitar', speaker: 'speaker' }
const PLURAL: Record<string, string> = { photos: 'photos', cushions: 'cushions', lights: 'lights' }

const THISIS_PREG: Pregunta[] = [
  ...Object.keys(SINGULAR).map((id) => elixe(<>Mira el dibujo. ¿Qué dices?</>, `This is my ${id}.`, [`These are my ${id}.`, `This are my ${id}.`], 'Es una sola cosa: «This is…».', <Picto id={id} />)),
  ...Object.keys(PLURAL).map((id) => elixe(<>Mira el dibujo. ¿Qué dices?</>, `These are my ${id}.`, [`This is my ${id}.`, `These is my ${id}.`], 'Son varias cosas: «These are…».', <Picto id={id} />)),
  elixe('Hablas tú solo, de tu altavoz: «This is ___ speaker.»', 'my', ['our', 'your'], 'my = mi (de una persona).'),
  elixe('Hablas con tu hermano, de vuestras luces: «These are ___ lights.»', 'our', ['my', 'this'], 'our = nuestro (de varios).'),
  elixe('¿Qué significa «my»?', 'mi', ['nuestro', 'tu', 'este'], 'my = mi.'),
  elixe('¿Qué significa «our»?', 'nuestro', ['mi', 'tu', 'estos'], 'our = nuestro, nuestra.'),
  elixe('¿Qué significa «This»?', 'esto, este, esta', ['estos, estas', 'mi', 'allí'], 'This para una cosa; These para varias.'),
  elixe('¿Qué significa «These»?', 'estos, estas', ['esto, esta', 'nuestro', 'aquí'], 'These para varias cosas.'),
  elixe('«Have you got a guitar?» Sí. ¿Qué contestas?', 'Yes, I have.', ["No, I haven't.", 'Yes, they are.'], 'Yes, I have.'),
  elixe('«Have you got a rug?» No. ¿Qué contestas?', "No, I haven't.", ['Yes, I have.', "No, they aren't."], "No, I haven't."),
  ...(['in', 'on', 'under', 'next to'] as const).map((id) => elixe(<>¿Dónde está la pelota?</>, id, ['in', 'on', 'under', 'next to'].filter((x) => x !== id), <>«{id}»: {PREPOSICIONES.find((x) => x.en === id)!.es}.</>, <PictoPrep id={id} />)),
  ...FRASES_2.map(([en, es]) => ({ ...elixe(<>Escucha 🔊. ¿Qué significa?</>, es, barallar(FRASES_2.filter(([x]) => x !== en).map(([, y]) => y)).slice(0, 2), <>«{en}»</>), oir: en })),
  ...PREPOSICIONES.map((p): Pregunta => ({ tipo: 'deletrea', texto: <>Escucha y escribe: «{p.es}».</>, palabra: p.en, visual: p.dibujo })),
]

export function ThisIs(p: PropsParada) {
  return (
    <Parada
      {...p}
      unidade={U}
      id="thisis"
      titulo="Unit 2 · This is my… These are our…"
      tarxetas={[
        {
          titulo: 'This is… These are…',
          texto: (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-white p-3 text-center">
                <Picto id="speaker" />
                <p>
                  <En>This is my speaker.</En>
                </p>
                <p className="text-slate-600">Una cosa: This is (este es)</p>
              </div>
              <div className="rounded-2xl bg-white p-3 text-center">
                <Picto id="lights" />
                <p>
                  <En>These are our lights.</En>
                </p>
                <p className="text-slate-600">Varias cosas: These are (estos son)</p>
              </div>
            </div>
          ),
        },
        {
          titulo: 'my y our',
          texto: (
            <ul className="space-y-2 text-xl">
              <li>
                <En>my</En> = mi (mío, de una persona): <En>This is my rug.</En>
              </li>
              <li>
                <En>our</En> = nuestro (de varios): <En>This is our rug.</En>
              </li>
            </ul>
          ),
        },
        {
          titulo: 'Have you got…?',
          texto: (
            <ul className="space-y-2 text-xl">
              <li>
                <En>Have you got a rug in your bedroom?</En>
              </li>
              <li>
                ✔️ <En>Yes, I have.</En> ❌ <En>No, I haven't.</En>
              </li>
              <li>
                <En>What's your favourite thing in your bedroom?</En>
              </li>
            </ul>
          ),
        },
        tarjetaPalabras('¿Dónde está?', PREPOSICIONES),
      ]}
      xogos={[
        { id: 'ordena', titulo: 'Ordena las frases', icono: '🧩', explica: 'Toca las palabras en orden.', crear: (acabar) => <Ordena frases={barallar(FRASES_2.slice(4, 11)).slice(0, 5).map(([en, es]) => ({ palabras: en.split(' '), traducion: es }))} acabar={acabar} /> },
        {
          id: 'this',
          titulo: 'This o These',
          icono: '🛏️',
          explica: '¿Una cosa o varias?',
          crear: (acabar) => (
            <Clasifica
              caixas={[
                { id: 's', nome: 'This is my…', cor: 'border-sky-300 bg-sky-100' },
                { id: 'p', nome: 'These are my…', cor: 'border-pink-300 bg-pink-100' },
              ]}
              elementos={[...Object.keys(SINGULAR).map((t) => ({ texto: t, caixa: 's' })), ...Object.keys(PLURAL).map((t) => ({ texto: t, caixa: 'p' }))]}
              acabar={acabar}
            />
          ),
        },
        { id: 'donde', titulo: '¿Dónde está?', icono: '⚽', explica: 'in, on, under, next to.', crear: (acabar) => <Practica preguntas={THISIS_PREG.filter((q) => q.tipo === 'elixe' && ['in', 'on', 'under', 'next to'].includes(q.correcta))} acabar={acabar} /> },
        { id: 'escribe', titulo: 'Aprende a escribirlas', icono: '✏️', explica: 'in, on, under, next to.', crear: (acabar) => <SerieDeletrea palabras={PREPOSICIONES.map((p) => ({ palabra: p.en, visual: p.dibujo, pista: p.es }))} acabar={acabar} /> },
      ]}
      preguntas={THISIS_PREG}
    />
  )
}

// ===================================================================================================
// 5. Feelings (libreta)
// ===================================================================================================

export function Feelings(p: PropsParada) {
  return (
    <Parada
      {...p}
      unidade={U}
      id="feelings"
      titulo="Feelings"
      tarxetas={[
        tarjetaPalabras('¿Cómo te sientes?', SENTIMIENTOS, <p>Las palabras de tu libreta. Toca 🔊 y pon la cara de cada una.</p>),
        {
          titulo: 'Para decirlo',
          texto: (
            <ul className="space-y-2 text-xl">
              <li>
                <En>I'm tired.</En> = Estoy cansada.
              </li>
              <li>
                <En>I'm excited.</En> = Estoy emocionada.
              </li>
              <li>
                <En>I'm not bored.</En> = No estoy aburrida.
              </li>
              <li>
                <En>You're brave!</En> = ¡Eres valiente!
              </li>
            </ul>
          ),
        },
      ]}
      xogos={juegosVocabulario(SENTIMIENTOS, false, [
        {
          id: 'vf',
          titulo: '¿Verdadero o falso?',
          icono: '✅',
          explica: 'Mira y piensa.',
          crear: (acabar) => (
            <VerdadeiroFalso
              frases={[
                { texto: '«tired» significa cansado.', certa: true, explica: '😴 tired = cansado.' },
                { texto: '«brave» significa tímido.', certa: false, explica: 'brave = valiente. Tímido es shy.' },
                { texto: '«excited» significa emocionado.', certa: true, explica: '🤩' },
                { texto: '«bored» significa enfadado.', certa: false, explica: 'bored = aburrido.' },
                { texto: '«strong» significa fuerte.', certa: true, explica: '💪' },
              ]}
              acabar={acabar}
            />
          ),
        },
      ])}
      preguntas={FEELINGS_PREG}
    />
  )
}

// ===================================================================================================
// 6. Palabras de la libreta
// ===================================================================================================

const LIBRETA_PREG: Pregunta[] = [
  ...LIBRETA.map((p) => ({ ...elixe(<>Escucha 🔊. ¿Qué significa?</>, p.es, barallar(LIBRETA.filter((x) => x !== p).map((x) => x.es)).slice(0, 3), <>«{p.en}» significa «{p.es}».</>), oir: p.en })),
  ...LIBRETA.map((p) => elixe(<>¿Cómo se dice «{p.es}» en inglés?</>, p.en, barallar(LIBRETA.filter((x) => x !== p).map((x) => x.en)).slice(0, 3), <>«{p.en}».</>)),
]

export function Libreta(p: PropsParada) {
  const grupos = [LIBRETA.slice(0, 24), LIBRETA.slice(24, 48), LIBRETA.slice(48)]
  return (
    <Parada
      {...p}
      unidade={U}
      id="libreta"
      titulo="Las palabras de mi libreta"
      tarxetas={grupos.map((g, i) => ({
        titulo: `Libreta (${i + 1} de 3)`,
        texto: (
          <div className="grid gap-1.5 sm:grid-cols-2">
            {g.map((w) => (
              <div key={w.en} className="flex items-center justify-between gap-2 rounded-xl bg-white px-3 py-1.5 text-lg">
                <En>{w.en}</En>
                <span className="text-right text-base text-slate-600">{w.es}</span>
              </div>
            ))}
          </div>
        ),
      }))}
      xogos={grupos.map((g, i) => ({ id: `une${i}`, titulo: `Une (${i + 1} de 3)`, icono: '🔗', explica: 'Cada palabra con su significado.', crear: (acabar: () => void) => <Une pares={barallar(g).slice(0, 8).map((w) => ({ palabra: w.en, significado: w.es }))} acabar={acabar} /> }))}
      preguntas={LIBRETA_PREG}
    />
  )
}

export const PREGUNTAS_INGLES3: Record<string, Pregunta[]> = {
  animals: ANIMALS_PREG,
  describe: DESCRIBE_PREG,
  bedroom: BEDROOM_PREG,
  thisis: THISIS_PREG,
  feelings: FEELINGS_PREG,
  libreta: LIBRETA_PREG,
}
export const VOCABULARIO = { ANIMALES, DORMITORIO, SENTIMIENTOS, ADJETIVOS, PREPOSICIONES }
