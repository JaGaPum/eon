// Francés 2.º ESO, unidad 2 «La maison»: lo que pidió la profesora (las piezas, los muebles del libro p. 25, el
// cuaderno pp. 22, 31 y 32, ej. 1 y 2), las dos fichas de la casa y la habitación, y los verbos pronominales con los
// momentos del día y los conectores. Artículos y conjugaciones los calcula src/lib/frances.ts.
import type { ReactNode } from 'react'
import { Busca, Clasifica, Fr, Ordena, Proba, Son, Une, VerdadeiroFalso, barallar, type Pregunta, type Tarxeta, type Xogo } from '../../../primaria/pezas'
import { elixe, toca } from '../../../primaria/paisaxes/preguntas'
import { Caixa, Parada, Truco } from '../../../historia/parcial1/roma'
import { PERSONAS, articuloDeterminado, articuloIndeterminado, pronominal, pronominalNegativo, reflexivo, sinVocales, type Genero, type Persona } from '../../../lib/frances'
import { CON_DIBUJO, PIEZAS_PLANO, Picto, PlanoCasa, lamina } from './debuxos'

type PropsParada = { ruta: string; modo?: string }
const U = 'frances2'
const Practica = ({ preguntas, acabar }: { preguntas: Pregunta[]; acabar: () => void }) => <Proba practica cantas={8} preguntas={preguntas} acabar={acabar} />
const azar = <T,>(xs: readonly T[], n: number) => barallar(xs).slice(0, n)

export interface Palabra {
  fr: string
  genero: Genero
  es: string
  plural?: boolean
}
const conUn = (p: Palabra) => articuloIndeterminado(p.fr, p.genero, p.plural)
const conLe = (p: Palabra) => articuloDeterminado(p.fr, p.genero, p.plural)
const escribe = (texto: ReactNode, respostas: string[], explica?: ReactNode): Pregunta => ({ tipo: 'escribe', texto, respostas, explica })

/** El nombre del dibujo cuando no coincide con la palabra. */
const DIBUJO: Record<string, string> = { 'corbeille à papiers': 'corbeille', rideaux: 'rideau' }
const dibujoDe = (p: Palabra) => DIBUJO[p.fr] ?? p.fr

/** Tarjeta con las palabras: dibujo (si hay), la palabra con su artículo y 🔊, y lo que significa. */
const rejilla = (ps: Palabra[], art: (p: Palabra) => string = conUn) => (
  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
    {ps.map((p) => (
      <div key={p.fr} className="flex flex-col items-center rounded-2xl border-2 border-violet-100 bg-white p-2 text-center">
        {CON_DIBUJO.includes(dibujoDe(p)) && <Picto id={dibujoDe(p)} tam={64} />}
        <span className="flex flex-wrap items-center justify-center">
          <b className="text-violet-800" lang="fr">
            {art(p)}
          </b>
          <Son texto={art(p)} />
        </span>
        <span className="text-sm text-slate-500">{p.es}</span>
      </div>
    ))}
  </div>
)

// ===================================================================================================
// 1. Les pièces de la maison
// ===================================================================================================

export const PIECES: (Palabra & { devinette?: string })[] = [
  { fr: 'entrée', genero: 'f', es: 'la entrada (el recibidor)', devinette: "Tu entres dans l'appartement à travers cette pièce." },
  { fr: 'cuisine', genero: 'f', es: 'la cocina', devinette: "C'est la pièce où tu prépares le petit déjeuner, le déjeuner, etc." },
  { fr: 'salle à manger', genero: 'f', es: 'el comedor', devinette: 'Tu manges dans cette pièce.' },
  { fr: 'salon', genero: 'm', es: 'el salón', devinette: 'Dans cette pièce, tu lis, tu regardes des films en famille…' },
  { fr: 'salle de bains', genero: 'f', es: 'el cuarto de baño', devinette: 'Dans cette pièce, tu te laves les dents, tu te douches…' },
  { fr: 'toilettes', genero: 'f', es: 'el aseo (el váter)', plural: true },
  { fr: 'chambre', genero: 'f', es: 'el dormitorio', devinette: 'Tu dors dans cette pièce.' },
  { fr: 'balcon', genero: 'm', es: 'el balcón' },
  { fr: 'terrasse', genero: 'f', es: 'la terraza', devinette: "C'est à l'extérieur, c'est grand, avec des plantes, tu lis au soleil…" },
]
const COULOIR: Palabra = { fr: 'couloir', genero: 'm', es: 'el pasillo' }

/** Las del bilan, ejercicio 1: con las vocales en blanco. */
const BILAN_PIECES = ['cuisine', 'salle de bains', 'chambre', 'toilettes', 'salon', 'salle à manger'].map((f) => PIECES.find((p) => p.fr === f)!)

const NOMBRES_PLANO = Object.fromEntries(PIECES.map((p) => [p.fr, conLe(p)]))

const PIECES_PREG: Pregunta[] = [
  ...PIECES.map((p): Pregunta => ({ ...toca(<>Escucha 🔊 y toca la pieza.</>, PlanoCasa, NOMBRES_PLANO, p.fr, <>{conLe(p)} = {p.es}.</>), oir: conLe(p) })),
  ...PIECES.filter((p) => p.devinette).map((p) => elixe(<span lang="fr">Devinette : {p.devinette}</span>, conLe(p), azar(PIECES.filter((x) => x !== p && x.devinette).map(conLe), 3), <>{conLe(p)}: {p.es}.</>)),
  ...PIECES.map((p) => elixe(<>¿Cómo se dice «{p.es}» en francés?</>, conLe(p), azar(PIECES.filter((x) => x !== p).map(conLe), 3), <>{p.es} = {conLe(p)}.</>)),
  ...BILAN_PIECES.map((p) => {
    const art = conLe(p).slice(0, conLe(p).length - p.fr.length)
    return escribe(
      <>
        Escribe las vocales que faltan: <span className="font-mono" lang="fr">{art}{sinVocales(p.fr)}</span>
      </>,
      [conLe(p), p.fr],
      <>Es {conLe(p)} ({p.es}).</>,
    )
  }),
  ...PIECES.map((p) => escribe(<>Escribe en francés, con el artículo: «{p.es}»</>, [conLe(p), conUn(p)], <>{conLe(p)}</>)),
  elixe('¿Qué es «le couloir»?', 'el pasillo', ['la entrada', 'el balcón', 'el comedor'], 'le couloir = el pasillo.'),
  elixe('«Les toilettes» va siempre…', 'en plural: les toilettes', ['en singular: la toilette', 'sin artículo'], 'Se dice les toilettes.'),
]

export function Pieces(p: PropsParada) {
  const tarjetas: Tarxeta[] = [
    {
      titulo: 'Les pièces de la maison',
      texto: (
        <>
          <p>Toca 🔊 para oír cada pieza. Fíjate en el artículo: le, la, l' o les.</p>
          {rejilla([...PIECES, COULOIR], conLe)}
        </>
      ),
    },
    { titulo: 'El plano de la casa', texto: <p>Así se reparte una casa. Luego tendrás que encontrar cada pieza oyendo su nombre.</p>, visual: <PlanoCasa />, ancho: true },
    {
      titulo: 'Le, la, l’, les',
      texto: (
        <div className="grid gap-2 sm:grid-cols-2">
          <Caixa titulo="le (masculino)">
            <Fr>le salon</Fr> <Fr>le balcon</Fr> <Fr>le couloir</Fr>
          </Caixa>
          <Caixa titulo="la (femenino)">
            <Fr>la cuisine</Fr> <Fr>la chambre</Fr> <Fr>la terrasse</Fr>
          </Caixa>
          <Caixa titulo="l’ (delante de vocal)">
            <Fr>l'entrée</Fr>
          </Caixa>
          <Caixa titulo="les (plural)">
            <Fr>les toilettes</Fr>
          </Caixa>
        </div>
      ),
    },
    {
      titulo: 'Devinettes (cuaderno, página 22)',
      texto: (
        <ul className="space-y-2">
          {PIECES.filter((x) => x.devinette).map((x) => (
            <li key={x.fr} className="rounded-xl bg-white p-2">
              <span lang="fr">{x.devinette}</span> → <Fr>{conLe(x)}</Fr>
            </li>
          ))}
        </ul>
      ),
    },
  ]
  const xogos: Xogo[] = [
    { id: 'plano', titulo: 'Escucha y toca', icono: '👂', explica: 'Oyes una pieza: tócala en el plano.', crear: (acabar) => <Busca Debuxo={PlanoCasa} nomes={NOMBRES_PLANO} obxectivos={PIEZAS_PLANO} escoita acabar={acabar} /> },
    { id: 'une', titulo: 'Une', icono: '🔗', explica: 'Cada pieza con lo que significa.', crear: (acabar) => <Une pares={azar([...PIECES, COULOIR], 7).map((x) => ({ palabra: conLe(x), significado: x.es }))} acabar={acabar} /> },
    { id: 'vocales', titulo: 'Las vocales que faltan', icono: '✍️', explica: 'Como el ejercicio 1 del bilan.', crear: (acabar) => <Practica preguntas={PIECES_PREG.filter((q) => q.tipo === 'escribe')} acabar={acabar} /> },
    { id: 'devinettes', titulo: 'Devinettes', icono: '❓', explica: '¿Qué pieza es?', crear: (acabar) => <Practica preguntas={PIECES_PREG.filter((q) => q.tipo === 'elixe')} acabar={acabar} /> },
  ]
  return <Parada {...p} unidade={U} id="pieces" titulo="Les pièces de la maison" tarxetas={tarjetas} xogos={xogos} preguntas={PIECES_PREG} />
}

// ===================================================================================================
// 2. Les meubles et la décoration (libro, página 25)
// ===================================================================================================

export const MEUBLES: Palabra[] = [
  { fr: 'canapé', genero: 'm', es: 'el sofá' },
  { fr: 'fauteuil', genero: 'm', es: 'el sillón' },
  { fr: 'chaise', genero: 'f', es: 'la silla' },
  { fr: 'table', genero: 'f', es: 'la mesa' },
  { fr: 'lit', genero: 'm', es: 'la cama' },
  { fr: 'bureau', genero: 'm', es: 'el escritorio (la mesa de trabajo)' },
  { fr: 'étagère', genero: 'f', es: 'la estantería' },
  { fr: 'armoire', genero: 'f', es: 'el armario' },
  { fr: 'coussin', genero: 'm', es: 'el cojín' },
  { fr: 'tapis', genero: 'm', es: 'la alfombra' },
  { fr: 'rideau', genero: 'm', es: 'la cortina' },
  { fr: 'lampe', genero: 'f', es: 'la lámpara' },
]
const NOMBRES_MEUBLES = Object.fromEntries(MEUBLES.map((m) => [m.fr, conUn(m)]))
const LAMINAS = [lamina(MEUBLES.slice(0, 6).map((m) => m.fr)), lamina(MEUBLES.slice(6).map((m) => m.fr))]
const laminaDe = (m: Palabra) => LAMINAS[MEUBLES.indexOf(m) < 6 ? 0 : 1]

const MEUBLES_PREG: Pregunta[] = [
  ...MEUBLES.map((m): Pregunta => ({ ...toca(<>Escucha 🔊 y toca el dibujo.</>, laminaDe(m), NOMBRES_MEUBLES, m.fr, <>{conUn(m)} = {m.es}.</>), oir: conUn(m) })),
  ...MEUBLES.map((m) => elixe(<>¿Un o une? «___ {m.fr}»</>, m.genero === 'm' ? 'un' : 'une', [m.genero === 'm' ? 'une' : 'un'], <>{conUn(m)}: es {m.genero === 'm' ? 'masculino' : 'femenino'}.</>, <Picto id={m.fr} />)),
  ...MEUBLES.map((m) => escribe(<>Escribe el nombre con su artículo:</>, [conUn(m), conLe(m)], <>{conUn(m)} = {m.es}.</>)).map((q, i) => ({ ...q, texto: <span className="flex flex-wrap items-center gap-3">Escribe el nombre con su artículo: <Picto id={MEUBLES[i].fr} tam={80} /></span> })),
  ...MEUBLES.map((m) => elixe(<>¿Qué significa «{conUn(m)}»?</>, m.es, azar(MEUBLES.filter((x) => x !== m).map((x) => x.es), 3), <>{conUn(m)} = {m.es}.</>)),
  elixe('¿Qué es «un canapé»?', 'un sofá', ['un sillón', 'una silla', 'una cama'], 'Ojo: canapé es el sofá; el sillón es un fauteuil.'),
  elixe('¿Cómo se dice «el sillón»?', 'le fauteuil', ['le canapé', 'la chaise', 'le bureau'], 'El sofá es le canapé.'),
  elixe('¿Cómo es el plural de «un rideau»?', 'des rideaux', ['des rideaus', 'des rideau'], 'Las palabras en -eau hacen el plural en -eaux: rideaux, tableaux, bureaux.'),
]

export function Meubles(p: PropsParada) {
  const tarjetas: Tarxeta[] = [
    { titulo: 'Les meubles et la décoration', texto: <>{rejilla(MEUBLES)}</> },
    {
      titulo: '¿Un o une?',
      texto: (
        <div className="grid gap-2 sm:grid-cols-2">
          <Caixa titulo="un (masculino)">
            {MEUBLES.filter((m) => m.genero === 'm').map((m) => (
              <Fr key={m.fr}>{conUn(m)}</Fr>
            ))}
          </Caixa>
          <Caixa titulo="une (femenino)">
            {MEUBLES.filter((m) => m.genero === 'f').map((m) => (
              <Fr key={m.fr}>{conUn(m)}</Fr>
            ))}
          </Caixa>
          <Truco>Cuidado, que no coinciden con el castellano: une armoire (el armario), un tapis (la alfombra), un rideau (la cortina), un lit (la cama).</Truco>
        </div>
      ),
    },
    {
      titulo: 'Sofá y sillón',
      texto: (
        <div className="grid grid-cols-2 gap-2">
          <Caixa titulo="le canapé = el sofá">
            <Picto id="canapé" />
          </Caixa>
          <Caixa titulo="le fauteuil = el sillón">
            <Picto id="fauteuil" />
          </Caixa>
        </div>
      ),
    },
  ]
  const xogos: Xogo[] = [
    { id: 'oye1', titulo: 'Escucha y toca (1)', icono: '👂', explica: 'canapé, fauteuil, chaise, table, lit, bureau.', crear: (acabar) => <Busca Debuxo={LAMINAS[0]} nomes={NOMBRES_MEUBLES} obxectivos={MEUBLES.slice(0, 6).map((m) => m.fr)} escoita acabar={acabar} /> },
    { id: 'oye2', titulo: 'Escucha y toca (2)', icono: '👂', explica: 'étagère, armoire, coussin, tapis, rideau, lampe.', crear: (acabar) => <Busca Debuxo={LAMINAS[1]} nomes={NOMBRES_MEUBLES} obxectivos={MEUBLES.slice(6).map((m) => m.fr)} escoita acabar={acabar} /> },
    {
      id: 'genero',
      titulo: '¿Un o une?',
      icono: '⚖️',
      explica: 'Cada mueble en su caja.',
      crear: (acabar) => (
        <Clasifica
          caixas={[
            { id: 'm', nome: 'un', cor: 'border-sky-300 bg-sky-100' },
            { id: 'f', nome: 'une', cor: 'border-pink-300 bg-pink-100' },
          ]}
          elementos={MEUBLES.map((m) => ({ texto: m.fr, caixa: m.genero }))}
          acabar={acabar}
        />
      ),
    },
    { id: 'escribe', titulo: 'Escríbelos', icono: '✍️', explica: 'Como el ejercicio 2 del bilan.', crear: (acabar) => <Practica preguntas={MEUBLES_PREG.filter((q) => q.tipo === 'escribe')} acabar={acabar} /> },
  ]
  return <Parada {...p} unidade={U} id="meubles" titulo="Les meubles et la décoration" tarxetas={tarjetas} xogos={xogos} preguntas={MEUBLES_PREG} />
}

// ===================================================================================================
// 3. Las fichas: la casa y la habitación
// ===================================================================================================

export const FICHES: Palabra[] = [
  { fr: 'miroir', genero: 'm', es: 'el espejo' },
  COULOIR,
  { fr: 'tiroirs', genero: 'm', es: 'los cajones', plural: true },
  { fr: 'tableau', genero: 'm', es: 'el cuadro' },
  { fr: 'réveil', genero: 'm', es: 'el despertador' },
  { fr: 'table de chevet', genero: 'f', es: 'la mesita de noche' },
  { fr: 'vase', genero: 'm', es: 'el jarrón' },
  { fr: 'corbeille à papiers', genero: 'f', es: 'la papelera' },
  { fr: 'ordinateur', genero: 'm', es: 'el ordenador' },
  { fr: 'fenêtre', genero: 'f', es: 'la ventana' },
  { fr: 'console', genero: 'f', es: 'la consola' },
  { fr: 'rideaux', genero: 'm', es: 'las cortinas', plural: true },
]

const FICHES_PREG: Pregunta[] = [
  ...FICHES.map((f) => elixe(<>¿Qué significa «{conLe(f)}»?</>, f.es, azar(FICHES.filter((x) => x !== f).map((x) => x.es), 3), <>{conLe(f)} = {f.es}.</>, CON_DIBUJO.includes(dibujoDe(f)) ? <Picto id={dibujoDe(f)} /> : undefined)),
  ...FICHES.map((f) => elixe(<>¿Cómo se dice «{f.es}»?</>, conLe(f), azar(FICHES.filter((x) => x !== f).map(conLe), 3), <>{f.es} = {conLe(f)}.</>)),
  ...FICHES.map((f) => escribe(<>Escribe en francés, con el artículo: «{f.es}»</>, [conLe(f), conUn(f)], <>{conLe(f)}</>)),
]

export function Fiches(p: PropsParada) {
  const tarjetas: Tarxeta[] = [
    { titulo: 'Las palabras de las fichas', texto: <>{rejilla(FICHES, conLe)}</> },
    {
      titulo: 'Los plurales en -eaux y los cajones',
      texto: (
        <ul className="space-y-2">
          <li>
            <Fr>le rideau</Fr> → <Fr>les rideaux</Fr>
          </li>
          <li>
            <Fr>le tableau</Fr> → <Fr>les tableaux</Fr>
          </li>
          <li>
            <Fr>le tiroir</Fr> → <Fr>les tiroirs</Fr>
          </li>
        </ul>
      ),
    },
  ]
  const xogos: Xogo[] = [
    { id: 'une1', titulo: 'Une (1)', icono: '🔗', explica: 'Cada palabra con su significado.', crear: (acabar) => <Une pares={FICHES.slice(0, 6).map((f) => ({ palabra: conLe(f), significado: f.es }))} acabar={acabar} /> },
    { id: 'une2', titulo: 'Une (2)', icono: '🔗', explica: 'Las otras seis.', crear: (acabar) => <Une pares={FICHES.slice(6).map((f) => ({ palabra: conLe(f), significado: f.es }))} acabar={acabar} /> },
    { id: 'escribe', titulo: 'Escríbelas', icono: '✍️', explica: 'Con su artículo.', crear: (acabar) => <Practica preguntas={FICHES_PREG.filter((q) => q.tipo === 'escribe')} acabar={acabar} /> },
  ]
  return <Parada {...p} unidade={U} id="fiches" titulo="Dans la maison et la chambre" tarxetas={tarjetas} xogos={xogos} preguntas={FICHES_PREG} />
}

// ===================================================================================================
// 4. Décrire sa chambre
// ===================================================================================================

/** Libro, página 25, ejercicio 6: cada acción con los muebles que sirven. */
const ACCIONES: { fr: string; es: string; muebles: string[] }[] = [
  { fr: 'manger', es: 'comer', muebles: ['table', 'chaise'] },
  { fr: "s'asseoir", es: 'sentarse', muebles: ['chaise', 'fauteuil', 'canapé'] },
  { fr: 'lire le soir', es: 'leer por la noche', muebles: ['lampe', 'lit', 'fauteuil'] },
  { fr: 'dormir', es: 'dormir', muebles: ['lit'] },
  { fr: 'travailler', es: 'trabajar', muebles: ['bureau', 'chaise'] },
  { fr: 'ranger ses affaires', es: 'ordenar sus cosas', muebles: ['armoire', 'étagère'] },
]
const meuble = (fr: string) => MEUBLES.find((m) => m.fr === fr)!

const FRASES: [string, string][] = [
  ["Qu'est-ce qu'il y a dans ta chambre ?", '¿Qué hay en tu habitación?'],
  ['Il y a un lit, une armoire, un bureau, une chaise et des étagères.', 'Hay una cama, un armario, un escritorio, una silla y estanterías.'],
  ["J'ai une chambre pour moi tout seul.", 'Tengo una habitación para mí solo.'],
  ['Elle est petite.', 'Es pequeña.'],
  ['Il y a un petit bureau devant la fenêtre.', 'Hay un escritorio pequeño delante de la ventana.'],
  ['Je partage ma chambre avec ma sœur.', 'Comparto mi habitación con mi hermana.'],
  ['Il y a deux lits.', 'Hay dos camas.'],
  ['À côté de chaque lit, il y a une petite table avec une lampe.', 'Al lado de cada cama hay una mesita con una lámpara.'],
  ['À côté du salon, vous avez la cuisine.', 'Al lado del salón tenéis la cocina.'],
]

const CHAMBRE_PREG: Pregunta[] = [
  ...ACCIONES.map((a) => {
    const bueno = azar(a.muebles, 1)[0]
    const malos = MEUBLES.filter((m) => !a.muebles.includes(m.fr))
    return elixe(<>¿Qué mueble sirve para «{a.fr}» ({a.es})?</>, conUn(meuble(bueno)), azar(malos, 3).map(conUn), <>Para {a.es}: {a.muebles.map((x) => conUn(meuble(x))).join(', ')}.</>)
  }),
  ...FRASES.map(([fr, es]): Pregunta => ({ ...elixe(<>Escucha 🔊. ¿Qué significa?</>, es, azar(FRASES.filter(([x]) => x !== fr).map(([, y]) => y), 3), <span lang="fr">«{fr}»</span>), oir: fr })),
  ...MEUBLES.map((m) => elixe(<span lang="fr">Dans ma chambre, il y a ___ {m.fr}.</span>, m.genero === 'm' ? 'un' : 'une', [m.genero === 'm' ? 'une' : 'un', 'des'], <>{conUn(m)}.</>)),
  elixe(<span lang="fr">Il y a ___ coussins sur le lit.</span>, 'des', ['un', 'une'], 'En plural: des coussins.'),
  elixe(<span lang="fr">Il y a ___ rideaux à la fenêtre.</span>, 'des', ['un', 'une'], 'En plural: des rideaux.'),
  elixe('¿Qué significa «il y a»?', 'hay', ['tiene', 'es', 'está'], 'Il y a un lit = hay una cama.'),
  elixe('¿Qué significa «à côté de»?', 'al lado de', ['delante de', 'encima de', 'debajo de'], 'À côté du salon = al lado del salón.'),
  elixe('¿Qué significa «devant»?', 'delante de', ['al lado de', 'detrás de', 'debajo de'], 'devant la fenêtre = delante de la ventana.'),
]

export function Chambre(p: PropsParada) {
  const tarjetas: Tarxeta[] = [
    {
      titulo: "Qu'est-ce qu'il y a dans ta chambre ?",
      texto: (
        <>
          <p>
            <Fr>Il y a</Fr> = hay. Después va el mueble con <b>un</b>, <b>une</b> o, si son varios, <b>des</b>.
          </p>
          <Caixa>
            <Fr>Il y a un lit, une armoire, un bureau, une chaise et des étagères.</Fr>
          </Caixa>
          <div className="flex flex-wrap justify-center gap-2">
            {['lit', 'armoire', 'bureau', 'chaise', 'étagère'].map((id) => (
              <Picto key={id} id={id} tam={64} />
            ))}
          </div>
        </>
      ),
    },
    {
      titulo: 'Para decir dónde está',
      texto: (
        <ul className="space-y-2">
          <li>
            <Fr>à côté de</Fr> = al lado de: <Fr>À côté de chaque lit, il y a une petite table.</Fr>
          </li>
          <li>
            <Fr>devant</Fr> = delante de: <Fr>Il y a un petit bureau devant la fenêtre.</Fr>
          </li>
          <li>
            <Fr>à côté du salon</Fr>: de + le = du.
          </li>
        </ul>
      ),
    },
    {
      titulo: '¿Para qué sirve? (libro, página 25, ejercicio 6)',
      texto: (
        <ul className="space-y-1.5">
          {ACCIONES.map((a) => (
            <li key={a.fr} className="rounded-xl bg-white p-2">
              <Fr>{a.fr}</Fr> ({a.es}): {a.muebles.map((x) => conUn(meuble(x))).join(', ')}
            </li>
          ))}
        </ul>
      ),
    },
  ]
  const xogos: Xogo[] = [
    { id: 'ordena', titulo: 'Ordena las frases', icono: '🧩', explica: 'Las frases para describir tu habitación.', crear: (acabar) => <Ordena frases={azar(FRASES, 5).map(([fr, es]) => ({ palabras: fr.split(' '), traducion: es }))} acabar={acabar} /> },
    {
      id: 'vf',
      titulo: '¿Para qué sirve?',
      icono: '🛏️',
      explica: 'Verdadero o falso.',
      crear: (acabar) => (
        <VerdadeiroFalso
          frases={[
            { texto: 'Pour dormir, il y a un lit.', certa: true, explica: 'Para dormir, una cama.' },
            { texto: 'Pour travailler, il y a un tapis.', certa: false, explica: 'Para trabajar: un bureau y une chaise.' },
            { texto: 'Pour ranger ses affaires, il y a une armoire.', certa: true, explica: 'Y también une étagère.' },
            { texto: "Pour s'asseoir, il y a un rideau.", certa: false, explica: 'Para sentarse: une chaise, un fauteuil, un canapé.' },
            { texto: 'Pour lire le soir, il y a une lampe.', certa: true, explica: 'Para leer por la noche.' },
          ]}
          acabar={acabar}
        />
      ),
    },
    { id: 'practica', titulo: 'Practica', icono: '✏️', explica: 'Il y a, un, une, des…', crear: (acabar) => <Practica preguntas={CHAMBRE_PREG} acabar={acabar} /> },
  ]
  return <Parada {...p} unidade={U} id="chambre" titulo="Décrire sa chambre" tarxetas={tarjetas} xogos={xogos} preguntas={CHAMBRE_PREG} />
}

// ===================================================================================================
// 5. Les verbes pronominaux et la journée
// ===================================================================================================

export const VERBES: { inf: string; es: string; resto?: string }[] = [
  { inf: 'se lever', es: 'levantarse' },
  { inf: "s'habiller", es: 'vestirse' },
  { inf: 'se doucher', es: 'ducharse' },
  { inf: 'se coucher', es: 'acostarse' },
  { inf: 'se laver', es: 'lavarse (los dientes)', resto: 'les dents' },
  { inf: 'se préparer', es: 'prepararse' },
]
const MOMENTOS: [string, string][] = [
  ['le matin', 'la mañana'],
  ["l'après-midi", 'la tarde'],
  ['le soir', 'la tarde-noche'],
  ['la nuit', 'la noche'],
]
const CONECTORES: [string, string][] = [
  ["d'abord", 'primero'],
  ['ensuite', 'luego'],
  ['après', 'después'],
  ['puis', 'luego, después'],
]

const con = (v: (typeof VERBES)[number], s: string) => (v.resto ? `${s} ${v.resto}` : s)
/** Sin el sujeto: «me lève». */
const sinSujeto = (frase: string, p: Persona) => frase.slice(p.length + 1)

const PERSONAS_BILAN: [string, Persona][] = [
  ['se lever', 'je'],
  ["s'habiller", 'je'],
  ['se doucher', 'tu'],
  ['se laver', 'on'],
  ["s'habiller", 'nous'],
  ['se préparer', 'vous'],
  ['se coucher', 'elles'],
  ["s'habiller", 'ils'],
]

const conjuga = (inf: string, p: Persona): Pregunta => {
  const v = VERBES.find((x) => x.inf === inf)!
  const bien = con(v, pronominal(inf, p))
  return escribe(
    <span lang="fr">
      {p} ({inf}){v.resto ? ` … ${v.resto}` : ''}
    </span>,
    [bien, con(v, sinSujeto(pronominal(inf, p), p))],
    <>
      <Fr>{bien}</Fr>
      {inf === 'se lever' && p !== 'nous' && p !== 'vous' ? ' (con è, como acheter).' : ''}
    </>,
  )
}

const VERBES_PREG: Pregunta[] = [
  ...PERSONAS_BILAN.map(([inf, p]) => conjuga(inf, p)),
  ...VERBES.flatMap((v) =>
    PERSONAS.filter((p) => p !== 'on' && p !== 'elles').map((p) => {
      const r = reflexivo(v.inf, p)
      const verbo = sinSujeto(pronominal(v.inf, p), p).slice(r.length).trim()
      return elixe(
        <span lang="fr">
          {p.charAt(0).toUpperCase() + p.slice(1)} ___ {verbo}
          {v.resto ? ` ${v.resto}` : ''}.
        </span>,
        r,
        azar(['me', "m'", 'te', "t'", 'se', "s'", 'nous', 'vous'].filter((x) => x !== r), 3),
        <>
          <Fr>{con(v, pronominal(v.inf, p))}</Fr>. Me, te, se + vocal → m', t', s'.
        </>,
      )
    }),
  ),
  ...[
    ['se préparer', 'je'],
    ["s'habiller", 'je'],
    ['se lever', 'elle'],
    ['se laver', 'ils'],
    ['se doucher', 'nous'],
    ['se coucher', 'tu'],
  ].map(([inf, p]) => {
    const v = VERBES.find((x) => x.inf === inf)!
    const afirm = con(v, pronominal(inf, p as Persona))
    const neg = con(v, pronominalNegativo(inf, p as Persona))
    const partes = afirm.split(' ')
    const mal1 = partes.length > 2 ? `${partes[0]} ${partes[1]} ne ${partes.slice(2).join(' ')} pas` : `${partes[0]} ne ${partes[1]}`
    const mal2 = `ne ${afirm} pas`
    return elixe(<span lang="fr">Pon en negativo: «{afirm}»</span>, neg, [...new Set([mal1, mal2])].filter((x) => x !== neg), <>ne + pronombre + verbo + pas: <Fr>{neg}</Fr></>)
  }),
  ...VERBES.map((v) => elixe(<>¿Qué significa «{v.inf}{v.resto ? ` ${v.resto}` : ''}»?</>, v.es, azar(VERBES.filter((x) => x !== v).map((x) => x.es), 3), <>{v.inf} = {v.es}.</>)),
  elixe(<span lang="fr">tu ___ (se lever)</span>, 'te lèves', ['te leves', 'se lèves', 'te lèvent'], 'Se lever se conjuga como acheter: con è (tu te lèves). Pero nous nous levons.'),
  elixe(<span lang="fr">nous ___ (se lever)</span>, 'nous levons', ['nous lèvons', 'se levons', 'nous levez'], 'Con nous y vous no lleva acento: nous nous levons, vous vous levez.'),
  ...MOMENTOS.map(([fr, es]) => elixe(<>¿Cómo se dice «{es}»?</>, fr, MOMENTOS.filter(([x]) => x !== fr).map(([x]) => x), <>{es} = {fr}.</>)),
  elixe(<span lang="fr">le matin, l'après-midi, le soir, la ___</span>, 'nuit', ['matin', 'soir', 'jour'], 'Los momentos del día: le matin, l’après-midi, le soir, la nuit.'),
  elixe(<span lang="fr">___, je me lève. Ensuite, je me douche.</span>, "D'abord", ['Puis', 'Après', 'Ensuite'], 'D’abord (primero) va siempre el primero.'),
  ...CONECTORES.map(([fr, es]) => elixe(<>¿Qué significa «{fr}»?</>, es, CONECTORES.filter(([x]) => x !== fr).map(([, y]) => y).filter((y) => y !== es), <>{fr} = {es}.</>)),
  elixe('«À quelle heure tu te lèves ?»', '¿A qué hora te levantas?', ['¿A qué hora te acuestas?', '¿Qué haces por la mañana?'], 'Je me lève à 7 h 30.'),
]

export function Verbes(p: PropsParada) {
  const tabla = (inf: string) => (
    <table className="w-full text-lg">
      <tbody>
        {(['je', 'tu', 'il', 'nous', 'vous', 'ils'] as Persona[]).map((x) => (
          <tr key={x} className="border-b border-slate-100 last:border-0">
            <td className="py-1">
              <Fr>{pronominal(inf, x)}</Fr>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
  const tarjetas: Tarxeta[] = [
    {
      titulo: 'Les verbes pronominaux',
      texto: (
        <>
          <p>Llevan un pronombre delante del verbo, como en castellano (me levanto, te duchas):</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {VERBES.map((v) => (
              <Caixa key={v.inf}>
                <Fr>{v.inf + (v.resto ? ` ${v.resto}` : '')}</Fr> = {v.es}
              </Caixa>
            ))}
          </div>
        </>
      ),
    },
    {
      titulo: 'Se lever (como acheter: ¡ojo al acento!)',
      texto: (
        <>
          {tabla('se lever')}
          <Truco>è con je, tu, il y ils: je me lève. Sin acento con nous y vous: nous nous levons.</Truco>
        </>
      ),
    },
    {
      titulo: "S'habiller: me, te, se + vocal → m', t', s'",
      texto: (
        <>
          {tabla("s'habiller")}
          <Truco>Delante de vocal o h muda, me, te, se pierden la e: je m'habille, tu t'habilles, il s'habille.</Truco>
        </>
      ),
    },
    {
      titulo: 'En negativo',
      texto: (
        <>
          <p>
            <b>ne</b> va delante del pronombre y <b>pas</b> detrás del verbo:
          </p>
          <Caixa>
            <Fr>Je me prépare.</Fr> → <Fr>Je ne me prépare pas.</Fr>
          </Caixa>
          <Caixa>
            <Fr>Je m'habille.</Fr> → <Fr>Je ne m'habille pas.</Fr>
          </Caixa>
        </>
      ),
    },
    {
      titulo: 'Los momentos del día y los conectores',
      texto: (
        <div className="grid gap-2 sm:grid-cols-2">
          <Caixa titulo="Les moments de la journée">
            {MOMENTOS.map(([fr, es]) => (
              <div key={fr}>
                <Fr>{fr}</Fr> = {es}
              </div>
            ))}
          </Caixa>
          <Caixa titulo="Les connecteurs">
            {CONECTORES.map(([fr, es]) => (
              <div key={fr}>
                <Fr>{fr}</Fr> = {es}
              </div>
            ))}
          </Caixa>
          <p className="sm:col-span-2">
            <Fr>D'abord, je prends mon petit déjeuner, après je me lave les dents, puis je m'habille.</Fr>
          </p>
        </div>
      ),
    },
  ]
  const xogos: Xogo[] = [
    { id: 'conjuga', titulo: 'Conjuga (bilan, ejercicio 3)', icono: '✍️', explica: 'Escribe el verbo con su pronombre.', crear: (acabar) => <Practica preguntas={VERBES_PREG.filter((q) => q.tipo === 'escribe')} acabar={acabar} /> },
    { id: 'pronombre', titulo: 'Me, te, se…', icono: '🧩', explica: 'El pronombre que falta (cuaderno, página 24).', crear: (acabar) => <Practica preguntas={VERBES_PREG.filter((q) => q.tipo === 'elixe' && ['me', "m'", 'te', "t'", 'se', "s'", 'nous', 'vous'].includes(q.correcta))} acabar={acabar} /> },
    { id: 'rutina', titulo: 'Ordena la rutina', icono: '⏰', explica: "D'abord, ensuite, après, puis.", crear: (acabar) => <Ordena frases={[{ palabras: ["D'abord,", 'je', 'me', 'lève.'], traducion: 'Primero, me levanto.' }, { palabras: ['Ensuite,', 'je', 'me', 'douche.'], traducion: 'Luego, me ducho.' }, { palabras: ['Puis,', 'je', "m'habille."], traducion: 'Después, me visto.' }, { palabras: ['Le', 'soir,', 'je', 'me', 'couche', 'à', '22', 'h.'], traducion: 'Por la noche, me acuesto a las 22 h.' }, { palabras: ['Je', 'ne', 'me', 'prépare', 'pas.'], traducion: 'No me preparo.' }]} acabar={acabar} /> },
    { id: 'practica', titulo: 'Practica', icono: '✏️', explica: 'De todo: negativo, momentos, conectores.', crear: (acabar) => <Practica preguntas={VERBES_PREG} acabar={acabar} /> },
  ]
  return <Parada {...p} unidade={U} id="verbes" titulo="Les verbes pronominaux" tarxetas={tarjetas} xogos={xogos} preguntas={VERBES_PREG} />
}

export const PREGUNTAS_UNITE2: Record<string, Pregunta[]> = {
  pieces: PIECES_PREG,
  meubles: MEUBLES_PREG,
  fiches: FICHES_PREG,
  chambre: CHAMBRE_PREG,
  verbes: VERBES_PREG,
}
