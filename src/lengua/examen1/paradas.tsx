// Lengua Castellana 2.º ESO, parcial: los recuadros azules de las páginas 8, 10, 11, 22 y 23 del cuaderno, en ese
// orden. Las sílabas, tildes y fonemas los calcula src/lib/silabas.ts.
import { Clasifica, Ordena, Proba, Une, VerdadeiroFalso, barallar, type Pregunta, type Tarxeta, type Xogo } from '../../primaria/pezas'
import { elixe } from '../../primaria/paisaxes/preguntas'
import { fonemas, grupos, separar, tipo as tipoDe } from '../../lib/silabas'
import type { Video } from '../../contenido/tema1'
import { Caixa, Lista, Parada, Truco, b } from '../../historia/parcial1/roma'
import { preguntaClase, preguntaGrupo, preguntaPorQue, preguntaSilabas, preguntaTilde, preguntaTipo, preguntaTonica } from './xerar'

type PropsParada = { ruta: string; modo?: string }
const U = 'lengua1'
const Ej = ({ children }: { children: string }) => <i className="text-violet-700">{children}</i>

// ===================================================================================================
// 1. Las funciones del lenguaje (página 8)
// ===================================================================================================

const FUNCIONES = [
  { palabra: 'Referencial', significado: 'Informar al receptor sobre la realidad, sin valoraciones.', ej: 'Ayer estuve en el cine.' },
  { palabra: 'Expresiva', significado: 'Expresar sentimientos, emociones y deseos.', ej: '¡Qué película más divertida vimos!' },
  { palabra: 'Conativa', significado: 'Influir en el receptor para que actúe de una manera.', ej: 'Ven con nosotros al cine esta tarde.' },
  { palabra: 'Fática', significado: 'Iniciar la comunicación, mantenerla o finalizarla.', ej: '¡Hola!, ¿me oyes bien?' },
  { palabra: 'Poética', significado: 'Llamar la atención sobre la forma del mensaje y crear belleza.', ej: 'El viento, galán de torres, / la prende por la cintura.' },
  { palabra: 'Metalingüística', significado: 'Hablar sobre la propia lengua.', ej: 'El sustantivo y el adjetivo concuerdan en género y número.' },
]

const FRASES_FUNCION: [string, string][] = [
  ['La preposición «cabe» está en desuso.', 'Metalingüística'],
  ['Ve a la papelería y compra un compás.', 'Conativa'],
  ['¿Me oyes?', 'Fática'],
  ['¡Me encanta!', 'Expresiva'],
  ['El sol brillará mañana en toda España.', 'Referencial'],
  ['Hasta el cuarenta de mayo no te quites el sayo.', 'Poética'],
  ['El tren sale a las ocho y cuarto.', 'Referencial'],
  ['Madrid es la capital de España.', 'Referencial'],
  ['El agua hierve a cien grados.', 'Referencial'],
  ['¡Qué miedo he pasado!', 'Expresiva'],
  ['¡Ojalá apruebe mañana!', 'Expresiva'],
  ['¡Qué alegría verte!', 'Expresiva'],
  ['Cierra la puerta, por favor.', 'Conativa'],
  ['No toques eso.', 'Conativa'],
  ['Estudia para el examen.', 'Conativa'],
  ['Hola, ¿qué tal?', 'Fática'],
  ['Bueno, pues nada, hasta luego.', 'Fática'],
  ['¿Sí? ¿Diga?', 'Fática'],
  ['Verde que te quiero verde.', 'Poética'],
  ['Tus ojos son dos luceros.', 'Poética'],
  ['«Casa» es un sustantivo.', 'Metalingüística'],
  ['«Lápiz» se escribe con tilde porque es llana acabada en -z.', 'Metalingüística'],
  ['El verbo concuerda con el sujeto.', 'Metalingüística'],
]

const FUNCIONES_TARXETAS: Tarxeta[] = [
  {
    titulo: 'Para qué usamos el lenguaje',
    texto: (
      <>
        <p>
          El lenguaje se usa con distintas {b('intenciones o finalidades')}: pedir un favor, contar un hecho… Cada intención da lugar a una {b('función del lenguaje')}. Hay seis.
        </p>
        <Truco>Pregúntate: ¿qué quiere conseguir quien habla? Informar, contar lo que siente, que hagas algo, comprobar que le oyes, que suene bonito o hablar de la lengua.</Truco>
      </>
    ),
  },
  ...FUNCIONES.map((f) => ({
    titulo: `Función ${f.palabra.toLowerCase()}`,
    texto: (
      <>
        <p>La intención es {b(f.significado.charAt(0).toLowerCase() + f.significado.slice(1))}</p>
        <Caixa titulo="Ejemplo">
          <Ej>{f.ej}</Ej>
        </Caixa>
      </>
    ),
  })),
  {
    titulo: 'Pistas para reconocerlas',
    texto: (
      <div className="grid gap-2 sm:grid-cols-2">
        <Caixa titulo="Referencial">Datos, noticias, el tiempo: frases enunciativas sin opinión.</Caixa>
        <Caixa titulo="Expresiva">Exclamaciones (¡!), interjecciones, «ojalá».</Caixa>
        <Caixa titulo="Conativa">Órdenes, ruegos, imperativos (ven, compra, cierra) y preguntas que piden algo.</Caixa>
        <Caixa titulo="Fática">Saludos, despedidas, «¿me oyes?», «¿diga?».</Caixa>
        <Caixa titulo="Poética">Versos, refranes, rimas y comparaciones bonitas.</Caixa>
        <Caixa titulo="Metalingüística">Palabras como sustantivo, verbo, sílaba, tilde, preposición…</Caixa>
      </div>
    ),
  },
]

const preguntaFuncion = ([f, c]: [string, string]) =>
  elixe(<>«{f}» ¿Qué función del lenguaje predomina?</>, c, barallar(FUNCIONES.map((x) => x.palabra).filter((x) => x !== c)).slice(0, 3), <>{c}: {FUNCIONES.find((x) => x.palabra === c)!.significado}</>)

const FUNCIONES_XOGOS: Xogo[] = [
  { id: 'une', titulo: 'Cada función, su intención', icono: '🔗', explica: 'Une cada función con lo que pretende.', crear: (acabar) => <Une pares={FUNCIONES} acabar={acabar} /> },
  {
    id: 'clasifica',
    titulo: '¿Qué función es?',
    icono: '🗂️',
    explica: 'Pon cada mensaje en su función.',
    crear: (acabar) => (
      <Clasifica
        caixas={[
          { id: 'Referencial', nome: 'Referencial', cor: 'border-sky-300 bg-sky-100' },
          { id: 'Expresiva', nome: 'Expresiva', cor: 'border-pink-300 bg-pink-100' },
          { id: 'Conativa', nome: 'Conativa', cor: 'border-amber-300 bg-amber-100' },
          { id: 'Fática', nome: 'Fática', cor: 'border-lime-300 bg-lime-100' },
          { id: 'Poética', nome: 'Poética', cor: 'border-violet-300 bg-violet-100' },
          { id: 'Metalingüística', nome: 'Metalingüística', cor: 'border-slate-300 bg-slate-100' },
        ]}
        elementos={FUNCIONES.map((f) => barallar(FRASES_FUNCION.filter(([, c]) => c === f.palabra))[0]).map(([texto, caixa]) => ({ texto, caixa }))}
        acabar={acabar}
      />
    ),
  },
  {
    id: 'serie',
    titulo: 'Más mensajes',
    icono: '💬',
    explica: 'Elige la función de cada mensaje.',
    crear: (acabar) => <ProbaPractica preguntas={FRASES_FUNCION.map(preguntaFuncion)} acabar={acabar} />,
  },
]

const FUNCIONES_PREG: Pregunta[] = [
  ...FRASES_FUNCION.map(preguntaFuncion),
  ...FUNCIONES.map((f) => elixe(<>¿Qué función tiene como intención «{f.significado.charAt(0).toLowerCase() + f.significado.slice(1, -1)}»?</>, f.palabra, barallar(FUNCIONES.filter((x) => x !== f).map((x) => x.palabra)).slice(0, 3), <>Ejemplo: {f.ej}</>)),
  elixe('¿Qué función cumplen los signos de interrogación en «¿Me oyes?»?', 'Fática: comprobar que la comunicación funciona', ['Expresiva: mostrar una emoción', 'Metalingüística: hablar de la lengua', 'Poética: crear belleza'], 'Sirve para mantener la comunicación.'),
  elixe('¿Qué función cumplen los signos de exclamación en «¡Me encanta!»?', 'Expresiva: mostrar una emoción', ['Fática: comprobar que la comunicación funciona', 'Referencial: dar un dato', 'Conativa: dar una orden'], 'Expresan un sentimiento.'),
  elixe('Un cartel que anuncia un concurso de cuentos destaca por la función…', 'Referencial', ['Expresiva', 'Fática', 'Poética'], 'Informa del concurso.'),
  elixe('Si escribes un poema para un concurso, ¿qué función usas?', 'Poética', ['Fática', 'Metalingüística', 'Referencial'], 'Cuida la forma y busca la belleza.'),
]

// Serie de práctica sin estrellas.
function ProbaPractica({ preguntas, acabar }: { preguntas: Pregunta[]; acabar: () => void }) {
  return <Proba practica cantas={8} preguntas={preguntas} acabar={acabar} />
}

export const FUNCIONES_VIDEOS: Video[] = [{ id: '_7sIvY80YPM', titulo: 'Las funciones del lenguaje de Jakobson', canal: 'Blog de Lengua', minutos: 7 }]

export function Funciones(p: PropsParada) {
  return <Parada {...p} unidade={U} id="funciones" titulo="Las funciones del lenguaje" tarxetas={FUNCIONES_TARXETAS} xogos={FUNCIONES_XOGOS} preguntas={FUNCIONES_PREG} videos={FUNCIONES_VIDEOS} />
}

// ===================================================================================================
// 2. La sílaba. Diptongo, triptongo e hiato (página 10)
// ===================================================================================================

/** Palabras para dividir en sílabas (las del cuaderno y otras parecidas). */
export const PALABRAS_SILABAS = [
  'entraba', 'haberla', 'botella', 'cuchillo', 'después', 'momia', 'receta', 'urgente', 'cuando', 'chirriaba', 'luego', 'fuese', 'hiciese', 'nieve',
  'baúl', 'país', 'héroe', 'león', 'poeta', 'púa', 'campeón', 'oían', 'querían', 'maullido', 'ciudad', 'ruina', 'raudo', 'feudo', 'agua', 'sabia',
  'sabía', 'saeta', 'guay', 'buey', 'aire', 'caer', 'tío', 'teatro', 'huevo', 'reír', 'cuidado', 'piano', 'tráiler', 'océano',
]
/** Palabras con un solo grupo de vocales, para preguntar si es diptongo, triptongo o hiato. */
export const PALABRAS_GRUPO = PALABRAS_SILABAS.filter((p) => grupos(p).length === 1).concat(['Uruguay', 'averiguáis', 'miau', 'Paraguay'])
const PALABRAS_DIPTONGO = PALABRAS_GRUPO.filter((p) => grupos(p)[0].tipo === 'diptongo')

const SILABA_TARXETAS: Tarxeta[] = [
  {
    titulo: 'La sílaba',
    texto: (
      <>
        <p>
          La sílaba es el conjunto de {b('sonidos que se pronuncian juntos en cada emisión de voz')}: <Ej>re-ce-ta</Ej>, <Ej>ur-gen-te</Ej>.
        </p>
        <p>Cuando hay varias vocales seguidas, pueden ir en la misma sílaba o en sílabas diferentes.</p>
        <div className="grid gap-2 sm:grid-cols-2">
          <Caixa titulo="Vocales abiertas">a, e, o</Caixa>
          <Caixa titulo="Vocales cerradas">i, u</Caixa>
        </div>
        <Truco>Da palmadas: una palmada por cada sílaba. Des-pués son dos palmadas, no tres.</Truco>
      </>
    ),
  },
  {
    titulo: 'Diptongo: dos vocales en una sílaba',
    texto: (
      <div className="grid gap-2">
        <Caixa titulo="Abierta + cerrada">
          <Ej>raudo</Ej>, <Ej>feudo</Ej>
        </Caixa>
        <Caixa titulo="Cerrada + abierta">
          <Ej>sabia</Ej>, <Ej>agua</Ej>
        </Caixa>
        <Caixa titulo="Dos cerradas">
          <Ej>ruina</Ej>, <Ej>ciudad</Ej>
        </Caixa>
      </div>
    ),
  },
  {
    titulo: 'Triptongo e hiato',
    texto: (
      <>
        <Caixa titulo="Triptongo">
          Una {b('vocal abierta entre dos cerradas')} en la misma sílaba: <Ej>guay</Ej>, <Ej>buey</Ej>, <Ej>Uruguay</Ej>.
        </Caixa>
        <Caixa titulo="Hiato">
          Dos vocales seguidas que van en {b('sílabas distintas')}:
          <Lista
            items={[
              <>
                Las dos son {b('abiertas')}: <Ej>sa-e-ta</Ej>, <Ej>po-e-ta</Ej>.
              </>,
              <>
                Una abierta y una {b('cerrada acentuada')}: <Ej>sa-bí-a</Ej>, <Ej>ba-úl</Ej>.
              </>,
            ]}
          />
        </Caixa>
        <Truco>sabia (sa-bia, diptongo) y sabía (sa-bí-a, hiato): la tilde rompe el diptongo.</Truco>
      </>
    ),
  },
]

const SILABA_XOGOS: Xogo[] = [
  {
    id: 'clasifica',
    titulo: '¿Diptongo, triptongo o hiato?',
    icono: '🗂️',
    explica: 'Pon cada palabra en su caja.',
    crear: (acabar) => (
      <Clasifica
        caixas={[
          { id: 'diptongo', nome: 'Diptongo', cor: 'border-sky-300 bg-sky-100' },
          { id: 'triptongo', nome: 'Triptongo', cor: 'border-violet-300 bg-violet-100' },
          { id: 'hiato', nome: 'Hiato', cor: 'border-amber-300 bg-amber-100' },
        ]}
        elementos={[
          ...barallar(PALABRAS_GRUPO.filter((p) => grupos(p)[0].tipo === 'diptongo')).slice(0, 4),
          ...barallar(PALABRAS_GRUPO.filter((p) => grupos(p)[0].tipo === 'triptongo')).slice(0, 2),
          ...barallar(PALABRAS_GRUPO.filter((p) => grupos(p)[0].tipo === 'hiato')).slice(0, 4),
        ].map((p) => ({ texto: p, caixa: grupos(p)[0].tipo, pista: `${separar(p)}: es ${grupos(p)[0].tipo}.` }))}
        acabar={acabar}
      />
    ),
  },
  {
    id: 'silabas',
    titulo: 'Divide en sílabas',
    icono: '✂️',
    explica: 'Elige la división buena.',
    crear: (acabar) => <ProbaPractica preguntas={PALABRAS_SILABAS.map(preguntaSilabas)} acabar={acabar} />,
  },
  {
    id: 'vocales',
    titulo: '¿Qué vocales forman el diptongo?',
    icono: '🔤',
    explica: 'Abierta, cerrada…',
    crear: (acabar) => <ProbaPractica preguntas={PALABRAS_DIPTONGO.map(preguntaClase)} acabar={acabar} />,
  },
]

const SILABA_PREG: Pregunta[] = [
  ...PALABRAS_SILABAS.map(preguntaSilabas),
  ...PALABRAS_GRUPO.map(preguntaGrupo),
  ...PALABRAS_DIPTONGO.slice(0, 8).map(preguntaClase),
  elixe('¿Cuáles son las vocales abiertas?', 'a, e, o', ['i, u', 'a, i, u', 'e, i, o'], 'Las abiertas son a, e, o; las cerradas, i, u.'),
  elixe('¿Qué es un triptongo?', 'Una vocal abierta entre dos cerradas en la misma sílaba', ['Tres vocales en sílabas distintas', 'Dos vocales abiertas juntas', 'Tres sílabas seguidas'], 'Como en guay.'),
  elixe('¿Cuándo hay hiato?', 'Cuando dos vocales seguidas van en sílabas distintas', ['Cuando dos vocales van en la misma sílaba', 'Cuando una palabra no tiene vocales', 'Cuando hay tres vocales en una sílaba'], 'Sa-e-ta, sa-bí-a.'),
]

export function Silaba(p: PropsParada) {
  return <Parada {...p} unidade={U} id="silaba" titulo="La sílaba. Diptongo, triptongo e hiato" videos={[{ id: 'tKDeISjw328', titulo: 'Diptongo, triptongo e hiato', canal: 'Clases Particulares en Ávila', minutos: 4 }]} tarxetas={SILABA_TARXETAS} xogos={SILABA_XOGOS} preguntas={SILABA_PREG} />
}

// ===================================================================================================
// 3. La lengua y sus unidades (página 11)
// ===================================================================================================

const UNIDADES = [
  { palabra: 'Fonema', significado: 'Cada sonido de la lengua. No tiene significado, pero ayuda a distinguir palabras (beso / peso).' },
  { palabra: 'Morfema', significado: 'La unidad más pequeña con significado que forma las palabras (granj-ero).' },
  { palabra: 'Palabra', significado: 'Unidad con significado separada por espacios en la escritura (flor, desde).' },
  { palabra: 'Enunciado', significado: 'La unidad mínima de comunicación, con sentido completo (¡Suerte!).' },
  { palabra: 'Texto', significado: 'La unidad mayor: un mensaje completo con una intención.' },
]

/** Palabras separadas en morfemas, al estilo del cuaderno (cas-ona, salt-aba). */
const MORFEMAS: [string, string][] = [
  ['casona', 'cas-ona'],
  ['saltaba', 'salt-aba'],
  ['granjero', 'granj-ero'],
  ['relojes', 'reloj-es'],
  ['perrito', 'perr-ito'],
  ['zapatero', 'zapat-ero'],
  ['inútil', 'in-útil'],
  ['flores', 'flor-es'],
  ['mira', 'mir-a'],
]
const MORFEMAS_FALSOS: Record<string, string[]> = {
  casona: ['ca-so-na', 'caso-na'],
  saltaba: ['sal-ta-ba', 'saltab-a'],
  granjero: ['gran-je-ro', 'granje-ro'],
  relojes: ['re-lo-jes', 'relo-jes'],
  perrito: ['pe-rri-to', 'perri-to'],
  zapatero: ['za-pa-te-ro', 'zapa-tero'],
  inútil: ['i-nú-til', 'inú-til'],
  flores: ['flo-res', 'flore-s'],
  mira: ['mi-ra', 'm-ira'],
}

/** Palabras para formar con sus fonemas desordenados (sin h, ch, ll ni qu: una letra, un fonema). */
const PARA_FORMAR = ['gente', 'calamar', 'bonito', 'camino', 'pelota', 'tomate', 'ventana', 'planeta', 'música', 'zapato']

const ENUNCIADOS: [string, number][] = [
  ['Ana: te espero en casa a partir de las siete. Por favor, compra el pan.', 2],
  ['¡Suerte!', 1],
  ['Hola. ¿Vienes? Te espero.', 3],
  ['Mañana hay examen de Lengua.', 1],
  ['¡Qué frío! Cierra la ventana, por favor.', 2],
]
const contaPalabras = (t: string) => t.split(/[^\p{L}]+/u).filter(Boolean).length

const UNIDADES_TARXETAS: Tarxeta[] = [
  {
    titulo: 'La lengua y sus unidades',
    texto: (
      <>
        <p>
          La lengua está formada por {b('unidades lingüísticas')} que se combinan con las reglas de la Gramática para formar unidades mayores:
        </p>
        <div className="flex flex-wrap items-center gap-2 text-lg font-bold">
          {UNIDADES.map((u, i) => (
            <span key={u.palabra} className="flex items-center gap-2">
              <span className="rounded-xl bg-violet-100 px-3 py-1 text-violet-900">{u.palabra.toLowerCase()}</span>
              {i < UNIDADES.length - 1 && <span aria-hidden="true">→</span>}
            </span>
          ))}
        </div>
        <Truco>Como las piezas de construcción: los fonemas forman morfemas, los morfemas palabras, las palabras enunciados y los enunciados textos.</Truco>
      </>
    ),
  },
  {
    titulo: 'Fonemas y letras',
    texto: (
      <>
        <p>
          Los {b('fonemas')} son los sonidos de la lengua. {b('No tienen significado')}, pero ayudan a distinguir palabras: <Ej>beso</Ej> / <Ej>peso</Ej>.
        </p>
        <p>
          Las {b('letras')} son la representación escrita de los fonemas. No siempre coinciden:
        </p>
        <Lista items={[<>La {b('h')} no suena: <Ej>hola</Ej> tiene 4 letras y 3 fonemas.</>, <>{b('ch, ll, rr, qu')} son dos letras y un solo fonema.</>, <>La {b('x')} suena como dos: /ks/.</>]} />
      </>
    ),
  },
  {
    titulo: 'Morfemas y palabras',
    texto: (
      <>
        <p>
          Los {b('morfemas')} son las unidades {b('más pequeñas con significado')} que forman las palabras: <Ej>granj-ero</Ej>, <Ej>salt-aba</Ej>, <Ej>cas-ona</Ej>.
        </p>
        <p>
          Las {b('palabras')} son unidades con significado {b('separadas por espacios')} al escribir. Pueden tener uno o varios morfemas: <Ej>flor</Ej> (uno), <Ej>desde</Ej>.
        </p>
        <Truco>Morfemas ≠ sílabas. «Casona» tiene tres sílabas (ca-so-na) pero dos morfemas (cas-ona: casa + grande).</Truco>
      </>
    ),
  },
  {
    titulo: 'Enunciado y texto',
    texto: (
      <>
        <p>
          El {b('enunciado')} es la {b('unidad mínima de comunicación')}: transmite una información con sentido completo: <Ej>¡Suerte!</Ej>
        </p>
        <p>
          El {b('texto')} es la {b('unidad mayor')}: un mensaje completo con una {b('intención')} determinada.
        </p>
        <Caixa titulo="Un texto con dos enunciados">
          <Ej>Ana: te espero en casa a partir de las siete. Por favor, compra el pan.</Ej>
        </Caixa>
      </>
    ),
  },
]

const UNIDADES_XOGOS: Xogo[] = [
  {
    id: 'orden',
    titulo: 'De la más pequeña a la mayor',
    icono: '🧱',
    explica: 'Ordena las unidades.',
    crear: (acabar) => <Ordena frases={[{ palabras: UNIDADES.map((u) => u.palabra.toLowerCase()), traducion: 'De la más pequeña a la mayor' }]} acabar={acabar} />,
  },
  { id: 'une', titulo: 'Cada unidad, su definición', icono: '🔗', explica: 'Une cada unidad con lo que es.', crear: (acabar) => <Une pares={UNIDADES} acabar={acabar} /> },
  {
    id: 'fonemas',
    titulo: 'Combina los fonemas',
    icono: '🔀',
    explica: 'Ordena los fonemas para formar una palabra.',
    crear: (acabar) => <Ordena frases={barallar(PARA_FORMAR).slice(0, 4).map((p) => ({ palabras: [...p], traducion: 'Forma una palabra con estos fonemas' }))} acabar={acabar} />,
  },
]

const UNIDADES_PREG: Pregunta[] = [
  ...UNIDADES.map((u) => elixe(<>«{u.significado}» ¿Qué unidad es?</>, u.palabra, barallar(UNIDADES.filter((x) => x !== u).map((x) => x.palabra)).slice(0, 3), <>{u.palabra}.</>)),
  ...MORFEMAS.map(([p, m]) => elixe(<>¿Cómo se separa «{p}» en morfemas?</>, m, MORFEMAS_FALSOS[p], <>{m}. Ojo: morfemas no son sílabas ({separar(p)}).</>)),
  ...['Campoamor', 'beso', 'hola', 'chuleta', 'queso', 'perro', 'taxi', 'calle', 'hielo', 'guitarra'].map((p) => {
    const n = fonemas(p)
    return elixe(<>¿Cuántos fonemas tiene «{p}»?</>, String(n), [n - 1, n + 1, n + 2].map(String), <>«{p}»: {n} fonemas. Recuerda: la h no suena; ch, ll, rr y qu son un fonema; la x son dos.</>)
  }),
  ...ENUNCIADOS.map(([t, n]) => elixe(<>«{t}» ¿Cuántos enunciados hay?</>, String(n), [1, 2, 3, 4].filter((x) => x !== n).map(String), <>Cada enunciado tiene sentido completo y termina con punto, ? o !. Aquí hay {n}.</>)),
  ...ENUNCIADOS.slice(0, 3).map(([t]) => {
    const n = contaPalabras(t)
    return elixe(<>«{t}» ¿Cuántas palabras hay?</>, String(n), [n - 1, n + 1, n + 2].map(String), <>Se cuentan las palabras separadas por espacios: {n}.</>)
  }),
  elixe('¿Cuál de estas afirmaciones es verdadera?', 'Un morfema es la unidad más pequeña con significado que forma las palabras', ['Un fonema es la unidad más pequeña con significado', 'Un morfema es la unidad mínima de comunicación', 'Un texto es la unidad más pequeña de la lengua'], 'El fonema no tiene significado; el morfema sí.'),
  elixe('¿Qué unidad NO tiene significado?', 'El fonema', ['El morfema', 'La palabra', 'El enunciado'], 'El fonema solo distingue palabras (beso/peso).'),
]

export function Unidades(p: PropsParada) {
  return <Parada {...p} unidade={U} id="unidades" titulo="La lengua y sus unidades" tarxetas={UNIDADES_TARXETAS} xogos={UNIDADES_XOGOS} preguntas={UNIDADES_PREG} />
}

// ===================================================================================================
// 4. Las reglas de acentuación (página 22)
// ===================================================================================================

export const PALABRAS_TILDE = [
  'sofá', 'jamón', 'revés', 'portón', 'mamá', 'Andrés', 'matiz', 'reloj', 'cantar', 'feliz', 'café', 'canción', 'compás', 'pared',
  'hábil', 'Cádiz', 'túnel', 'lápiz', 'árbol', 'fácil', 'Mateo', 'termina', 'examen', 'casa', 'joven', 'lunes', 'césped', 'azúcar',
  'brújula', 'vínculo', 'complementábamos', 'préstaselo', 'música', 'pájaro', 'murciélago', 'lingüístico', 'acariciáis', 'aéreo',
  'tenía', 'laúd', 'salió', 'peón', 'Jaén', 'ganzúa', 'increíble', 'ataúd', 'vehículo', 'megafonía', 'Ceuta', 'fraile', 'oasis', 'viuda', 'muérdago', 'cuídate',
]

const ACENTO_TARXETAS: Tarxeta[] = [
  {
    titulo: 'Agudas, llanas y esdrújulas',
    texto: (
      <>
        <p>Según dónde esté la sílaba tónica (la que suena más fuerte):</p>
        <div className="grid gap-2 sm:grid-cols-2">
          <Caixa titulo="Aguda">La última: ca-{b('fé')}, re-{b('loj')}</Caixa>
          <Caixa titulo="Llana">La penúltima: {b('ár')}-bol, {b('ca')}-sa</Caixa>
          <Caixa titulo="Esdrújula">La antepenúltima: {b('brú')}-ju-la</Caixa>
          <Caixa titulo="Sobresdrújula">Antes de la antepenúltima: {b('prés')}-ta-se-lo</Caixa>
        </div>
      </>
    ),
  },
  {
    titulo: 'Reglas generales',
    texto: (
      <>
        <Caixa titulo="Agudas">
          Llevan tilde cuando terminan {b('en vocal o en -n o -s')}: <Ej>sofá, jamón, revés</Ej>.
        </Caixa>
        <Caixa titulo="Llanas">
          Llevan tilde cuando {b('no terminan ni en vocal ni en -n o -s')}: <Ej>hábil, Cádiz</Ej>.
        </Caixa>
        <Caixa titulo="Esdrújulas y sobresdrújulas">
          {b('Siempre')} llevan tilde: <Ej>brújula, préstaselo</Ej>.
        </Caixa>
        <Truco>Agudas y llanas son al revés: lo que hace llevar tilde a una aguda (vocal, -n, -s) es lo que se la quita a una llana.</Truco>
      </>
    ),
  },
  {
    titulo: 'Diptongos, triptongos e hiatos',
    texto: (
      <Lista
        items={[
          <>
            Los {b('diptongos')} siguen las reglas generales. La tilde va en la {b('vocal abierta')} (<Ej>murciélago</Ej>) o en la {b('segunda si las dos son cerradas')} (<Ej>lingüístico</Ej>, <Ej>cuídate</Ej>).
          </>,
          <>
            Los {b('triptongos')} siguen las reglas generales y la tilde va {b('siempre en la vocal abierta')}: <Ej>acariciáis</Ej>.
          </>,
          <>
            El {b('hiato de dos abiertas')} sigue las reglas generales: <Ej>aéreo</Ej>, <Ej>peón</Ej>.
          </>,
          <>
            El {b('hiato de abierta y cerrada')} (o al revés) {b('siempre lleva tilde en la cerrada')}, aunque no le toque por las reglas generales: <Ej>tenía</Ej>, <Ej>laúd</Ej>.
          </>,
        ]}
      />
    ),
  },
]

const POLISILABAS = PALABRAS_TILDE.filter((p) => separar(p).includes('-'))

const ACENTO_XOGOS: Xogo[] = [
  {
    id: 'tipo',
    titulo: 'Aguda, llana o esdrújula',
    icono: '🗂️',
    explica: 'Pon cada palabra en su caja.',
    crear: (acabar) => (
      <Clasifica
        caixas={[
          { id: 'aguda', nome: 'Aguda', cor: 'border-sky-300 bg-sky-100' },
          { id: 'llana', nome: 'Llana', cor: 'border-amber-300 bg-amber-100' },
          { id: 'esdrújula', nome: 'Esdrújula', cor: 'border-violet-300 bg-violet-100' },
        ]}
        elementos={barallar(POLISILABAS.filter((p) => ['aguda', 'llana', 'esdrújula'].includes(tipoDe(p))))
          .slice(0, 9)
          .map((p) => ({ texto: p, caixa: tipoDe(p), pista: `${separar(p)}: es ${tipoDe(p)}.` }))}
        acabar={acabar}
      />
    ),
  },
  { id: 'tilde', titulo: 'Pon la tilde', icono: '✍️', explica: 'Toca la vocal que lleva tilde, o «No lleva tilde».', crear: (acabar) => <ProbaPractica preguntas={POLISILABAS.map(preguntaTilde)} acabar={acabar} /> },
  { id: 'tonica', titulo: 'La sílaba tónica', icono: '🔊', explica: '¿Qué sílaba suena más fuerte?', crear: (acabar) => <ProbaPractica preguntas={POLISILABAS.map(preguntaTonica)} acabar={acabar} /> },
  {
    id: 'vf',
    titulo: 'Verdadero o falso',
    icono: '✅',
    explica: 'Sobre las reglas.',
    crear: (acabar) => (
      <VerdadeiroFalso
        frases={[
          { texto: 'Las esdrújulas llevan tilde siempre.', certa: true, explica: 'Y las sobresdrújulas también.' },
          { texto: 'Una aguda acabada en -z lleva tilde.', certa: false, explica: 'No: matiz, feliz. Las agudas la llevan si acaban en vocal, -n o -s.' },
          { texto: 'Una llana acabada en -l lleva tilde.', certa: true, explica: 'Árbol, túnel, hábil.' },
          { texto: 'Una llana acabada en -s lleva tilde.', certa: false, explica: 'No: lunes, oasis.' },
          { texto: 'En «tenía» la tilde va en la vocal cerrada.', certa: true, explica: 'Hiato de abierta y cerrada tónica.' },
          { texto: 'En un triptongo la tilde va en la vocal cerrada.', certa: false, explica: 'Va siempre en la abierta: acariciáis.' },
        ]}
        acabar={acabar}
      />
    ),
  },
]

const ACENTO_PREG: Pregunta[] = [
  ...POLISILABAS.map(preguntaTilde),
  ...POLISILABAS.map(preguntaTipo),
  ...POLISILABAS.map((p) => preguntaPorQue(p, POLISILABAS)),
  ...POLISILABAS.slice(0, 20).map(preguntaTonica),
  elixe('¿Cuándo llevan tilde las palabras agudas?', 'Cuando terminan en vocal o en -n o -s', ['Cuando no terminan ni en vocal ni en -n o -s', 'Siempre', 'Nunca'], 'Sofá, jamón, revés.'),
  elixe('¿Cuándo llevan tilde las palabras llanas?', 'Cuando no terminan ni en vocal ni en -n o -s', ['Cuando terminan en vocal o en -n o -s', 'Siempre', 'Nunca'], 'Hábil, Cádiz.'),
  elixe('¿Dónde va la tilde en un diptongo de dos vocales cerradas?', 'En la segunda', ['En la primera', 'En ninguna', 'En la que quieras'], 'Lingüístico, cuídate.'),
  elixe('¿Dónde va la tilde en un hiato de abierta y cerrada?', 'Siempre en la cerrada', ['Siempre en la abierta', 'Según las reglas generales', 'No lleva nunca'], 'Tenía, laúd.'),
]

export function Acentuacion(p: PropsParada) {
  return <Parada {...p} unidade={U} id="acentuacion" titulo="Las reglas de acentuación" videos={[{ id: '69KYr9BaiYA', titulo: 'Reglas de acentuación: agudas, llanas y esdrújulas', canal: 'Clases Particulares en Ávila', minutos: 7 }]} tarxetas={ACENTO_TARXETAS} xogos={ACENTO_XOGOS} preguntas={ACENTO_PREG} />
}

// ===================================================================================================
// 5. La palabra. Significado y sentido (página 23)
// ===================================================================================================

const SIGNIFICADOS: { palabra: string; sentido: string; tipo: 'D' | 'C' }[] = [
  { palabra: 'lluvia', sentido: 'gotas de agua que caen', tipo: 'D' },
  { palabra: 'lluvia', sentido: 'tristeza', tipo: 'C' },
  { palabra: 'cielo', sentido: 'atmósfera', tipo: 'D' },
  { palabra: 'cielo', sentido: 'persona dulce', tipo: 'C' },
  { palabra: 'fósil', sentido: 'resto orgánico petrificado', tipo: 'D' },
  { palabra: 'fósil', sentido: 'viejo, anticuado', tipo: 'C' },
  { palabra: 'rápido', sentido: 'que se mueve con velocidad', tipo: 'D' },
  { palabra: 'rápido', sentido: 'inteligente', tipo: 'C' },
  { palabra: 'sol', sentido: 'estrella que da luz a la Tierra', tipo: 'D' },
  { palabra: 'sol', sentido: 'alegría, persona encantadora', tipo: 'C' },
  { palabra: 'corazón', sentido: 'órgano que bombea la sangre', tipo: 'D' },
  { palabra: 'corazón', sentido: 'amor', tipo: 'C' },
  { palabra: 'zorro', sentido: 'mamífero de cola larga', tipo: 'D' },
  { palabra: 'zorro', sentido: 'persona astuta', tipo: 'C' },
]

const SENTIDOS: { frase: string; tipo: 'literal' | 'figurado' }[] = [
  { frase: 'Rellena la papeleta para votar.', tipo: 'literal' },
  { frase: '¡Vaya papeleta tengo con este problema!', tipo: 'figurado' },
  { frase: 'El Sol es una estrella.', tipo: 'literal' },
  { frase: 'Mi hermana es una estrella del baloncesto.', tipo: 'figurado' },
  { frase: 'He comido una chuleta de cerdo.', tipo: 'literal' },
  { frase: 'Lo pillaron con una chuleta en el examen.', tipo: 'figurado' },
  { frase: 'El perro come pienso.', tipo: 'literal' },
  { frase: 'Ese chico es un perro: no hace nada.', tipo: 'figurado' },
  { frase: 'Me duele la cabeza.', tipo: 'literal' },
  { frase: 'Laura es la cabeza del grupo.', tipo: 'figurado' },
  { frase: 'Se me ha roto el corazón al saber la noticia.', tipo: 'figurado' },
  { frase: 'El médico escuchó el corazón del paciente.', tipo: 'literal' },
]

const MONO_POLI: { texto: string; caixa: 'mono' | 'poli' }[] = [
  { texto: 'bolígrafo', caixa: 'mono' },
  { texto: 'reloj', caixa: 'mono' },
  { texto: 'bisturí', caixa: 'mono' },
  { texto: 'termómetro', caixa: 'mono' },
  { texto: 'martes', caixa: 'mono' },
  { texto: 'mina', caixa: 'poli' },
  { texto: 'bomba', caixa: 'poli' },
  { texto: 'sirena', caixa: 'poli' },
  { texto: 'caravana', caixa: 'poli' },
  { texto: 'banco', caixa: 'poli' },
  { texto: 'ratón', caixa: 'poli' },
  { texto: 'hoja', caixa: 'poli' },
]

const SIGNIFICADO_TARXETAS: Tarxeta[] = [
  {
    titulo: 'Denotativo y connotativo',
    texto: (
      <>
        <Caixa titulo="Denotativo">
          El significado {b('objetivo')}, el que viene en el {b('diccionario')}. <Ej>lluvia</Ej>: «gotas de agua que caen».
        </Caixa>
        <Caixa titulo="Connotativo">
          El significado {b('subjetivo')} que añadimos al relacionar la palabra con nuestros {b('sentimientos y emociones')}. <Ej>lluvia</Ej>: «tristeza».
        </Caixa>
        <Truco>Denotativo = Diccionario (las dos empiezan por D). Connotativo = Corazón.</Truco>
      </>
    ),
  },
  {
    titulo: 'Sentido literal y figurado',
    texto: (
      <>
        <p>Las palabras pueden tener diferentes {b('sentidos')} según el contexto:</p>
        <Caixa titulo="Sentido literal">
          Mantiene el significado denotativo. <Ej>Rellena la papeleta</Ej> (papeleta: «impreso para votar»).
        </Caixa>
        <Caixa titulo="Sentido figurado">
          Cambia el significado en algunos contextos. <Ej>¡Vaya papeleta!</Ej> (papeleta: «asunto difícil de resolver»).
        </Caixa>
      </>
    ),
  },
  {
    titulo: 'Monosémicas y polisémicas',
    texto: (
      <>
        <Caixa titulo="Monosémicas: un solo significado">
          <Ej>bolígrafo</Ej>: 1. Instrumento para escribir que tiene en su interior un tubo de tinta especial.
        </Caixa>
        <Caixa titulo="Polisémicas: varios significados">
          <Ej>mina</Ej>: 1. Yacimiento de minerales. 2. Grafito de los lápices. 3. Explosivo.
        </Caixa>
        <Truco>Mono = uno (monopatín, monociclo). Poli = muchos (polígono, polideportivo).</Truco>
      </>
    ),
  },
]

const SIGNIFICADO_XOGOS: Xogo[] = [
  {
    id: 'dc',
    titulo: '¿Denotativo o connotativo?',
    icono: '📖',
    explica: 'Pon cada significado en su caja.',
    crear: (acabar) => (
      <Clasifica
        caixas={[
          { id: 'D', nome: '📖 Denotativo', cor: 'border-sky-300 bg-sky-100' },
          { id: 'C', nome: '❤️ Connotativo', cor: 'border-pink-300 bg-pink-100' },
        ]}
        elementos={barallar(SIGNIFICADOS)
          .slice(0, 8)
          .map((s) => ({ texto: `${s.palabra}: «${s.sentido}»`, caixa: s.tipo }))}
        acabar={acabar}
      />
    ),
  },
  {
    id: 'sentido',
    titulo: '¿Literal o figurado?',
    icono: '🎭',
    explica: 'Pon cada frase en su caja.',
    crear: (acabar) => (
      <Clasifica
        caixas={[
          { id: 'literal', nome: 'Literal', cor: 'border-sky-300 bg-sky-100' },
          { id: 'figurado', nome: 'Figurado', cor: 'border-violet-300 bg-violet-100' },
        ]}
        elementos={barallar(SENTIDOS)
          .slice(0, 8)
          .map((s) => ({ texto: s.frase, caixa: s.tipo }))}
        acabar={acabar}
      />
    ),
  },
  {
    id: 'mono',
    titulo: '¿Monosémica o polisémica?',
    icono: '🔢',
    explica: 'Pon cada palabra en su caja.',
    crear: (acabar) => (
      <Clasifica
        caixas={[
          { id: 'mono', nome: 'Monosémica', cor: 'border-amber-300 bg-amber-100' },
          { id: 'poli', nome: 'Polisémica', cor: 'border-lime-300 bg-lime-100' },
        ]}
        elementos={barallar(MONO_POLI).slice(0, 8)}
        acabar={acabar}
      />
    ),
  },
]

const SIGNIFICADO_PREG: Pregunta[] = [
  ...SIGNIFICADOS.map((s) => elixe(<>«{s.palabra}»: «{s.sentido}». ¿Qué significado es?</>, s.tipo === 'D' ? 'Denotativo' : 'Connotativo', [s.tipo === 'D' ? 'Connotativo' : 'Denotativo'], s.tipo === 'D' ? 'Es el objetivo, el del diccionario.' : 'Es subjetivo: lo añadimos por lo que nos hace sentir.')),
  ...SENTIDOS.map((s) => elixe(<>«{s.frase}» ¿Sentido literal o figurado?</>, s.tipo === 'literal' ? 'Literal' : 'Figurado', [s.tipo === 'literal' ? 'Figurado' : 'Literal'], s.tipo === 'literal' ? 'La palabra mantiene su significado del diccionario.' : 'La palabra cambia de significado en este contexto.')),
  ...MONO_POLI.map((m) => elixe(<>«{m.texto}» es una palabra…</>, m.caixa === 'mono' ? 'Monosémica' : 'Polisémica', [m.caixa === 'mono' ? 'Polisémica' : 'Monosémica'], m.caixa === 'mono' ? 'Tiene un solo significado.' : 'Tiene varios significados.')),
  elixe('¿Qué es el significado denotativo?', 'El objetivo, el que aparece en el diccionario', ['El subjetivo, el que añadimos con nuestros sentimientos', 'El de las palabras extranjeras', 'El de las palabras con tilde'], 'Lluvia: «gotas de agua que caen».'),
  elixe('¿Qué es una palabra polisémica?', 'La que tiene varios significados', ['La que tiene un solo significado', 'La que tiene muchas sílabas', 'La que lleva tilde'], 'Mina: yacimiento, grafito, explosivo.'),
]

export function Significado(p: PropsParada) {
  return <Parada {...p} unidade={U} id="significado" titulo="La palabra. Significado y sentido" videos={[{ id: 'ftHl7b218SU', titulo: 'Significado denotativo y connotativo', canal: 'Clases Particulares en Ávila', minutos: 4 }]} tarxetas={SIGNIFICADO_TARXETAS} xogos={SIGNIFICADO_XOGOS} preguntas={SIGNIFICADO_PREG} />
}

export const PREGUNTAS_LENGUA1: Record<string, Pregunta[]> = {
  funciones: FUNCIONES_PREG,
  silaba: SILABA_PREG,
  unidades: UNIDADES_PREG,
  acentuacion: ACENTO_PREG,
  significado: SIGNIFICADO_PREG,
}
