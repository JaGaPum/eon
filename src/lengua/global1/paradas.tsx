// Lengua Castellana 2.º ESO, global de la 1.ª evaluación: lo nuevo respecto al parcial (que está en ../examen1).
import { Clasifica, Une, VerdadeiroFalso, barallar, type Pregunta, type Tarxeta, type Xogo } from '../../primaria/pezas'
import { elixe } from '../../primaria/paisaxes/preguntas'
import { Caixa, Lista, Parada, Truco, b } from '../../historia/parcial1/roma'
import {
  ANTONIMOS_33,
  ANTONIMOS_TIPOS,
  CASTELLANO,
  CONCEPTOS,
  FUNCIONES_45,
  FUNCION_ELEMENTO,
  HIPONIMOS_39,
  HISTORIA,
  HOMOFONOS,
  HOMO_POLI_35,
  JERGAS,
  LENGUAS_ESPANA,
  LENGUAS_INDIGENAS,
  LLH,
  MONO_POLI_37,
  MUNDO,
  NIVELES,
  PLATERO,
  PRECOLOMBINAS_ESPANA,
  RASGOS_AMERICA,
  RELACIONES,
  RESUMENES,
  RESUMEN_NO,
  RESUMEN_PASOS,
  RESUMEN_SI,
  SINONIMOS_31,
  TEXTOS_NIVEL,
  VARIEDADES_CASTELLANO,
  VULGARISMOS,
} from './datos'

type PropsParada = { ruta: string; modo?: string }
const U = 'lengua2'
const otras = (lista: string[], correcta: string, n = 3) => barallar([...new Set(lista)].filter((x) => x !== correcta)).slice(0, n)
const Def = ({ items }: { items: [string, string][] }) => <Lista items={items.map(([t, d]) => <>{b(t)}: {d}</>)} />
const minus = (s: string) => s.charAt(0).toLowerCase() + s.slice(1)

// ===================================================================================================
// 1. Lenguaje, lengua y habla. Las lenguas de España
// ===================================================================================================

const LENGUAS_TARXETAS: Tarxeta[] = [
  { titulo: 'Lenguaje, lengua y habla', texto: <><Def items={LLH} /><Truco>La lengua tiene variedades territoriales (los dialectos) y sociales (los niveles o registros: culto, estándar, coloquial y vulgar, y las jergas).</Truco></> },
  { titulo: 'Historia de las lenguas de España', texto: <Def items={HISTORIA} /> },
  {
    titulo: 'Las lenguas de España hoy',
    texto: (
      <>
        <p>El {b('castellano')} es oficial en todo el territorio. Son {b('cooficiales')}:</p>
        <Lista items={LENGUAS_ESPANA.slice(1).map((l) => <>{b(l.lengua)}: {l.donde}</>)} />
        <Truco>Castellano, gallego, catalán y valenciano son lenguas {b('romances')} (vienen del latín). El vasco es {b('prerromana')}: más antigua que el latín y de origen desconocido.</Truco>
        <p className="text-base">Con la Guerra Civil y la dictadura, gallego, vasco, catalán y valenciano quedaron reducidos a un uso familiar y rural; con la democracia pasaron a ser cooficiales.</p>
      </>
    ),
  },
  { titulo: 'El castellano a través del tiempo', texto: <Def items={CASTELLANO} /> },
  { titulo: 'Las variedades del castellano', texto: <Def items={VARIEDADES_CASTELLANO} /> },
  {
    titulo: 'Idioma y dialecto. Bilingüismo y diglosia',
    texto: (
      <>
        <Def items={CONCEPTOS} />
        <Truco>Ejemplo de diglosia: durante la dictadura, el gallego quedó para casa y el campo, y el castellano para la escuela y la administración.</Truco>
        <p className="text-base">
          Vídeo que recomendó la profesora:{' '}
          <a className="font-semibold text-violet-700 underline" href="https://eduboom.es/video/1628/idioma-y-dialecto-bilinguismo-y-diglosia" target="_blank" rel="noreferrer">
            Idioma y dialecto. Bilingüismo y diglosia (Eduboom, 5:40)
          </a>{' '}
          (sin cuenta solo se ve un avance).
        </p>
      </>
    ),
  },
]

const ROMANCES = LENGUAS_ESPANA.map((l) => l.lengua)
const LENGUAS_PREG: Pregunta[] = [
  ...LLH.map(([t, d]) => elixe(<>«{d}» Es la definición de…</>, t, LLH.map(([x]) => x).filter((x) => x !== t), `${t}: ${minus(d)}`)),
  ...HISTORIA.map(([e, d]) => elixe(<>¿Cuándo ocurrió esto? «{d}»</>, e, otras(HISTORIA.map(([x]) => x), e), `${e}: ${minus(d)}`)),
  ...CASTELLANO.map(([e, d]) => elixe(<>Historia del castellano: «{d}» ¿Cuándo?</>, e, otras(CASTELLANO.map(([x]) => x), e), `${e}: ${minus(d)}`)),
  elixe('¿Qué lengua prerromana sobrevivió a la llegada del latín?', 'El vasco o euskera', ['El gallego', 'El catalán', 'El gótico'], 'El latín desplazó a todas las lenguas prerromanas excepto al vasco.'),
  elixe('¿Cuál de estas lenguas NO es romance?', 'El vasco o euskera', ['El gallego', 'El catalán', 'El castellano'], 'El vasco es prerromana, de origen desconocido.'),
  elixe('¿Qué lengua hablaban los visigodos?', 'El gótico, pero adoptaron el latín', ['El árabe', 'El vasco', 'El celta'], 'Invasiones germánicas, siglo V.'),
  elixe('¿Qué provocó la fragmentación del latín en gallego-portugués, castellano, catalán…?', 'La invasión musulmana del 711', ['La llegada de los romanos', 'Alfonso X el Sabio', 'El descubrimiento de América'], 'La invasión árabe del 711.'),
  elixe('¿Quién impuso el castellano como lengua oficial en el siglo XIII?', 'Alfonso X el Sabio', ['Los Reyes Católicos', 'Cervantes', 'Los visigodos'], 'Siglo XIII.'),
  elixe('¿Qué son los americanismos?', 'Palabras de las lenguas indígenas americanas incorporadas al castellano', ['Palabras inglesas', 'Palabras árabes', 'Dialectos del norte'], 'Siglo XV: para nombrar realidades nuevas.'),
  ...LENGUAS_ESPANA.slice(1).map((l) => elixe(<>¿Dónde es cooficial el {l.lengua.toLowerCase()}?</>, l.donde, otras(LENGUAS_ESPANA.slice(1).map((x) => x.donde), l.donde), `${l.lengua}: ${l.donde}.`)),
  ...VARIEDADES_CASTELLANO.map(([v, d]) => elixe(<>¿Qué variedad del castellano es esta? «{d}»</>, v, VARIEDADES_CASTELLANO.map(([x]) => x).filter((x) => x !== v), `${v}.`)),
  ...CONCEPTOS.map(([c, d]) => elixe(<>«{d}» ¿Qué es?</>, c, otras(CONCEPTOS.map(([x]) => x), c), `${c}: ${minus(d)}`)),
  elixe('El andaluz y el canario son…', 'Dialectos del castellano', ['Lenguas romances distintas', 'Lenguas prerromanas', 'Jergas'], 'Son variedades meridionales del castellano.'),
  elixe('Un niño gallego que habla gallego y castellano con la misma soltura es…', 'Bilingüe', ['Diglósico', 'Dialectal', 'Monolingüe'], 'Usa dos lenguas: bilingüismo.'),
  elixe('Cuando una lengua se usa en la escuela y la administración y la otra solo en casa, hay…', 'Diglosia', ['Bilingüismo equilibrado', 'Monosemia', 'Seseo'], 'Dos lenguas con distinto prestigio.'),
  elixe('Lenguaje, lengua y habla: el uso concreto que hace Mateo del castellano al hablar es…', 'El habla', ['El lenguaje', 'La lengua', 'Un dialecto'], 'Habla: uso que un individuo hace de una lengua.'),
]

const LENGUAS_XOGOS: Xogo[] = [
  { id: 'llh', titulo: 'Lenguaje, lengua y habla', icono: '🔗', explica: 'Une cada concepto con su definición.', crear: (acabar) => <Une pares={[...LLH, ...CONCEPTOS.slice(1, 4)].map(([palabra, significado]) => ({ palabra, significado }))} acabar={acabar} /> },
  { id: 'historia', titulo: 'La historia en orden', icono: '📜', explica: 'Une cada fecha con lo que pasó.', crear: (acabar) => <Une pares={[...HISTORIA, ...CASTELLANO.slice(0, 3)].map(([palabra, significado]) => ({ palabra, significado }))} acabar={acabar} /> },
  {
    id: 'romances',
    titulo: '¿Romance o no?',
    icono: '🗂️',
    explica: 'Clasifica las lenguas.',
    crear: (acabar) => (
      <Clasifica
        caixas={[
          { id: 'romance', nome: 'Romance (del latín)', cor: 'border-sky-300 bg-sky-100' },
          { id: 'otra', nome: 'No viene del latín', cor: 'border-amber-300 bg-amber-100' },
        ]}
        elementos={[...LENGUAS_ESPANA.map((l) => ({ texto: l.lengua, caixa: l.origen === 'romance' ? 'romance' : 'otra' })), { texto: 'Gótico', caixa: 'otra' }, { texto: 'Árabe', caixa: 'otra' }]}
        acabar={acabar}
      />
    ),
  },
]

export const Lenguas = (p: PropsParada) => <Parada {...p} unidade={U} id="lenguas" titulo="Lenguaje, lengua y habla. Las lenguas de España" tarxetas={LENGUAS_TARXETAS} xogos={LENGUAS_XOGOS} preguntas={LENGUAS_PREG} />

// ===================================================================================================
// 2. El español en el mundo y el español de América
// ===================================================================================================

const MUNDO_TARXETAS: Tarxeta[] = [
  {
    titulo: 'Rasgos del español de América',
    texto: (
      <>
        <Lista items={RASGOS_AMERICA.map(([r, d, e]) => <>{b(r)}: {minus(d)} ({e}).</>)} />
        <Truco>Algunas palabras precolombinas ya se usan también en España: {PRECOLOMBINAS_ESPANA.join(', ')}.</Truco>
      </>
    ),
  },
  { titulo: 'Lenguas indígenas que se hablan hoy', texto: <Def items={LENGUAS_INDIGENAS} /> },
  { titulo: 'Quinientos millones de castellanohablantes', texto: <Def items={MUNDO} /> },
]

const MUNDO_PREG: Pregunta[] = [
  ...RASGOS_AMERICA.map(([r, d, e]) => elixe(<>Español de América: «{d}» ({e}). ¿Cómo se llama este rasgo?</>, r, otras(RASGOS_AMERICA.map(([x]) => x), r), `${r}.`)),
  elixe('«Vos tenés razón» es un ejemplo de…', 'Voseo', ['Seseo', 'Yeísmo', 'Arcaísmo'], 'Usa vos en lugar de tú.'),
  elixe('Pronunciar igual «poyo» y «pollo» es…', 'Yeísmo', ['Seseo', 'Voseo', 'Ceceo'], 'Confundir ll e y.'),
  elixe('Decir «sapato» por «zapato» es…', 'Seseo', ['Yeísmo', 'Voseo', 'Arcaísmo'], 'La c y la z se pronuncian como s.'),
  elixe('En América, «choclo» significa…', 'Maíz tierno', ['Pimiento', 'Mujer india', 'Chocolate'], 'Palabra de origen precolombino.'),
  elixe('En América, «ají» significa…', 'Pimiento', ['Maíz tierno', 'Canoa', 'Tiza'], 'Palabra de origen precolombino.'),
  elixe('¿Cuál de estas palabras precolombinas se usa también en España?', 'chocolate', ['choclo', 'ají', 'china (mujer india)'], `También: ${PRECOLOMBINAS_ESPANA.join(', ')}.`),
  ...LENGUAS_INDIGENAS.map(([l, p]) => elixe(<>¿Dónde se habla el {l.toLowerCase()}?</>, p, otras(LENGUAS_INDIGENAS.map(([, x]) => x), p), `${l}: ${p}.`)),
  ...MUNDO.map(([l, d]) => elixe(<>«{d}» ¿De qué lugar o institución se habla?</>, l, otras(MUNDO.map(([x]) => x), l), `${l}: ${minus(d)}`)),
  elixe('¿Cómo se llama el castellano arcaico que hablan los descendientes de los judíos expulsados en 1492?', 'Sefardí o judeoespañol', ['Náhuatl', 'Guaraní', 'Spanglish'], 'Lo hablan en Grecia, Turquía, Israel…'),
  elixe('¿En qué país africano es lengua oficial el español?', 'Guinea Ecuatorial', ['Marruecos', 'Egipto', 'Sáhara'], 'Oficial y de instrucción; desde 1998, también el francés.'),
  elixe('¿Para qué se creó el Instituto Cervantes en 1991?', 'Para difundir la cultura y la lengua españolas por el mundo', ['Para estudiar a Cervantes', 'Para enseñar inglés', 'Para traducir documentos filipinos'], 'Ha elaborado el primer método unitario de enseñanza del español.'),
]

const MUNDO_XOGOS: Xogo[] = [
  { id: 'rasgos', titulo: 'Rasgos de América', icono: '🌎', explica: 'Une cada rasgo con lo que es.', crear: (acabar) => <Une pares={RASGOS_AMERICA.map(([palabra, significado]) => ({ palabra, significado }))} acabar={acabar} /> },
  { id: 'indigenas', titulo: 'Lenguas indígenas', icono: '🗺️', explica: 'Une cada lengua con su país.', crear: (acabar) => <Une pares={LENGUAS_INDIGENAS.map(([palabra, significado]) => ({ palabra, significado }))} acabar={acabar} /> },
  { id: 'mundo', titulo: 'El español en el mundo', icono: '🌍', explica: 'Une cada lugar con la situación del español.', crear: (acabar) => <Une pares={barallar(MUNDO).slice(0, 6).map(([palabra, significado]) => ({ palabra, significado }))} acabar={acabar} /> },
]

export const Mundo = (p: PropsParada) => <Parada {...p} unidade={U} id="mundo" titulo="El español en el mundo y de América" tarxetas={MUNDO_TARXETAS} xogos={MUNDO_XOGOS} preguntas={MUNDO_PREG} />

// ===================================================================================================
// 3. Niveles del lenguaje y jergas
// ===================================================================================================

const NOMBRES_NIVEL = NIVELES.map((n) => n.nivel)
const NIVELES_TARXETAS: Tarxeta[] = [
  {
    titulo: 'Las variedades sociales',
    texto: (
      <>
        <p>Dependen de la edad, el sexo, el nivel sociocultural… La hoja de la profesora distingue cuatro niveles: {b('culto, estándar, coloquial y vulgar')}. Y aparte, las {b('jergas')}.</p>
        <Truco>El libro junta estándar y coloquial en un «nivel común o coloquial». En el examen, usa los cuatro de la hoja.</Truco>
      </>
    ),
  },
  ...NIVELES.map(
    (n): Tarxeta => ({
      titulo: `Nivel ${n.nivel.toLowerCase()}`,
      texto: (
        <>
          <p>{b('Quién')}: {n.quien}</p>
          <p>{b('Rasgos')}: {n.rasgos}</p>
          {n.nivel === 'Culto' && <p className="text-base">Dentro del culto: el {b('lenguaje científico-técnico')} (tecnicismos: termodinámica, airbag, web) y el {b('lenguaje literario')} (cuida la forma: comparaciones, metáforas).</p>}
          {n.nivel === 'Vulgar' && <p className="text-base">Afecta al nivel fónico (na, acabao), léxico (almóndiga), morfológico (andé, conducí) y sintáctico (yo me parece, me se cayó).</p>}
          <Caixa titulo="Ejemplo">
            <i>{n.ejemplo}</i>
          </Caixa>
        </>
      ),
    }),
  ),
  {
    titulo: 'Jergas y argots',
    texto: (
      <>
        <p>Las {b('jergas')} son formas de hablar de grupos que tienen algo en común (una profesión, una afición). Inventan palabras, cambian significados o toman palabras de otros idiomas para que los demás no les entiendan.</p>
        <p>{JERGAS.map(([j, s]) => `${j} (${s})`).join(', ')}.</p>
        <p>Los {b('argots')} son jergas de grupos marginales (delincuentes, presidiarios…).</p>
      </>
    ),
  },
]

const NIVELES_PREG: Pregunta[] = [
  ...TEXTOS_NIVEL.map(([t, n, e]) => elixe(<>«{t}» ¿A qué nivel corresponde?</>, n, otras(NOMBRES_NIVEL, n), e)),
  ...NIVELES.map((n) => elixe(<>«{n.rasgos}» ¿Qué nivel es?</>, n.nivel, otras(NOMBRES_NIVEL, n.nivel), `Nivel ${n.nivel.toLowerCase()}: ${minus(n.quien)}`)),
  ...NIVELES.map((n) => elixe(<>¿Quién usa el nivel {n.nivel.toLowerCase()}?</>, n.quien, otras(NIVELES.map((x) => x.quien), n.quien), `Nivel ${n.nivel.toLowerCase()}.`)),
  ...VULGARISMOS.map(([v, c, niv]) => elixe(<>«{v}» es un vulgarismo. ¿Cuál es la forma correcta?</>, c, otras(VULGARISMOS.map(([, x]) => x), c), `Afecta al nivel ${niv}.`)),
  ...VULGARISMOS.map(([v, , niv]) => elixe(<>El vulgarismo «{v}», ¿a qué nivel de la lengua afecta?</>, niv, ['fónico', 'léxico', 'morfológico', 'sintáctico'].filter((x) => x !== niv), `Es un vulgarismo ${niv}.`)),
  ...JERGAS.slice(0, 3).map(([j, s]) => elixe(<>En la jerga, «{j}» significa…</>, s, otras(JERGAS.map(([, x]) => x).concat(['coche', 'casa']), s), 'Las jergas inventan palabras, cambian significados o usan palabras de otros idiomas.')),
  elixe('El habla familiar pertenece al nivel culto.', 'Falso', ['Verdadero'], 'Pertenece al nivel coloquial.'),
  elixe('La riqueza de vocabulario es una característica del nivel culto.', 'Verdadero', ['Falso'], 'Permite usar muchos sinónimos.'),
  elixe('El lenguaje científico-técnico y el literario pertenecen al nivel culto.', 'Verdadero', ['Falso'], 'Son sus dos manifestaciones principales.'),
  elixe('El habla familiar está cargada de matices afectivos.', 'Verdadero', ['Falso'], 'Diminutivos, aumentativos, apelativos cariñosos…'),
  elixe('La desorganización del contenido es una característica del nivel culto.', 'Falso', ['Verdadero'], 'Es del vulgar; el culto tiene orden lógico.'),
  elixe('¿Qué son los tecnicismos?', 'Palabras propias del lenguaje científico-técnico', ['Vulgarismos', 'Palabras de una jerga juvenil', 'Palabras antiguas'], 'Ejemplos: termodinámica, airbag, web.'),
  elixe('¿En qué se diferencian «A palabras necias, oídos sordos» y «A vocablos poco meditados… pabellón auricular y trompas de Eustaquio en estado de catalepsia»?', 'Dicen lo mismo; el segundo usa cultismos y tecnicismos', ['Dicen cosas opuestas', 'El primero es vulgar y el segundo coloquial', 'El segundo es una jerga juvenil'], 'El segundo parodia el nivel culto.'),
  elixe('¿Qué son los argots?', 'Jergas de grupos marginales', ['Palabras cultas', 'Dialectos del sur', 'Tecnicismos'], 'Delincuentes, traficantes, presidiarios…'),
]

const NIVELES_XOGOS: Xogo[] = [
  {
    id: 'clasifica',
    titulo: '¿Qué nivel es?',
    icono: '🗂️',
    explica: 'Coloca cada frase en su nivel.',
    crear: (acabar) => (
      <Clasifica
        caixas={NIVELES.map((n, i) => ({ id: n.nivel, nome: n.nivel, cor: ['border-violet-300 bg-violet-100', 'border-sky-300 bg-sky-100', 'border-amber-300 bg-amber-100', 'border-rose-300 bg-rose-100'][i] }))}
        elementos={[
          ...NIVELES.map((n) => ({ texto: n.ejemplo, caixa: n.nivel })),
          { texto: 'Me se ha olvidao el libro.', caixa: 'Vulgar' },
          { texto: 'Oye, guapa, ¿te vienes luego o qué?', caixa: 'Coloquial' },
          { texto: 'El Gobierno aprobó ayer los presupuestos.', caixa: 'Estándar' },
          { texto: 'La fotosíntesis transforma la energía lumínica en energía química.', caixa: 'Culto' },
        ]}
        acabar={acabar}
      />
    ),
  },
  { id: 'vulgarismos', titulo: 'Corrige el vulgarismo', icono: '✏️', explica: 'Une cada vulgarismo con su forma correcta.', crear: (acabar) => <Une pares={barallar(VULGARISMOS).slice(0, 6).map(([palabra, significado]) => ({ palabra, significado }))} acabar={acabar} /> },
  {
    id: 'vf',
    titulo: 'Verdadero o falso (página 34)',
    icono: '✅',
    explica: 'La actividad 1 del libro.',
    crear: (acabar) => (
      <VerdadeiroFalso
        frases={[
          { texto: 'El habla familiar pertenece al nivel culto.', certa: false, explica: 'Es coloquial.' },
          { texto: 'La riqueza de vocabulario es una característica del lenguaje culto.', certa: true, explica: 'Abundantes sinónimos.' },
          { texto: 'El lenguaje científico-técnico y el literario pertenecen al nivel culto.', certa: true, explica: 'Son sus manifestaciones.' },
          { texto: 'El habla familiar está cargada de matices afectivos.', certa: true, explica: 'Diminutivos, apelativos cariñosos…' },
          { texto: 'La desorganización en el contenido es una característica del nivel culto.', certa: false, explica: 'Es del vulgar.' },
        ]}
        acabar={acabar}
      />
    ),
  },
]

export const Niveles = (p: PropsParada) => <Parada {...p} unidade={U} id="niveles" titulo="Los niveles del lenguaje y las jergas" tarxetas={NIVELES_TARXETAS} xogos={NIVELES_XOGOS} preguntas={NIVELES_PREG} />

// ===================================================================================================
// 4. Relaciones semánticas (páginas 158 y 159)
// ===================================================================================================

const NOMBRES_REL = RELACIONES.map(([r]) => r)
const TIPOS_ANT = ANTONIMOS_TIPOS.map(([t]) => t)

const SEMANTICA_TARXETAS: Tarxeta[] = [
  { titulo: 'Relaciones entre los significados', texto: <Lista items={RELACIONES.map(([r, d, e]) => <>{b(r)}: {minus(d)} <i className="text-slate-600">({e})</i></>)} /> },
  {
    titulo: 'Tres clases de antónimos',
    texto: (
      <>
        <Lista items={ANTONIMOS_TIPOS.map(([t, d, e]) => <>{b(t)}: {minus(d)} <i className="text-slate-600">({e})</i></>)} />
        <Truco>¿Hay algo en medio (templado, tibio)? Gradual. ¿Si no es uno, es el otro (vivo / muerto)? Complementaria. ¿Uno no existe sin el otro (comprar / vender)? Recíproca.</Truco>
      </>
    ),
  },
  {
    titulo: 'Homónimas: homófonas y homógrafas',
    texto: (
      <>
        <p>{b('Homófonos')}: suenan igual pero se escriben distinto (asta / hasta, vaca / baca, hola / ola).</p>
        <p>{b('Homógrafos')}: suenan y se escriben igual (vino bebida / vino del verbo venir; cubo recipiente / cubo figura).</p>
        <Truco>¿Homónima o polisémica? Mira el diccionario: la polisémica tiene una sola entrada con varias acepciones; las homónimas, varias entradas.</Truco>
      </>
    ),
  },
  {
    titulo: 'El contexto',
    texto: (
      <>
        <p>Dos palabras pueden ser sinónimas en un contexto y no en otro: «Juan me ha {b('proporcionado')} / me ha {b('dado')} los billetes», pero solo «Juan me ha {b('dado')} las gracias».</p>
        <p>En las polisémicas, el contexto aclara la acepción: «se {b('declaró')} el incendio» (empezar), «se {b('declaró')} a su novia» (manifestar su amor), «se han {b('declarado')} en huelga».</p>
      </>
    ),
  },
]

const SEMANTICA_PREG: Pregunta[] = [
  ...RELACIONES.map(([r, d]) => elixe(<>«{d}» ¿Cómo se llama esta relación?</>, r, otras(NOMBRES_REL, r), `${r}.`)),
  ...RELACIONES.map(([r, , e]) => elixe(<>«{e}» es un ejemplo de…</>, r, otras(NOMBRES_REL, r), `${r}.`)),
  ...SINONIMOS_31.map(([v, s]) => elixe(<>Sinónimo de «{v}»:</>, s, otras(SINONIMOS_31.map(([, x]) => x), s), `${v} = ${s} (actividad 31).`)),
  ...ANTONIMOS_33.map(([p, t]) => elixe(<>¿Qué clase de antónimos son «{p}»?</>, t, TIPOS_ANT.filter((x) => x !== t), ANTONIMOS_TIPOS.find(([x]) => x === t)![1])),
  ...HOMO_POLI_35.map(([p, t, e]) => elixe(<>«{p}» ({e}): ¿homónima o polisémica?</>, t, [t === 'Homónima' ? 'Polisémica' : 'Homónima'], t === 'Homónima' ? 'Tiene varias entradas en el diccionario: orígenes distintos.' : 'Una sola entrada con varias acepciones.')),
  ...MONO_POLI_37.map(([p, t, e]) => elixe(<>«{p}»: ¿monosémica o polisémica?</>, t, [t === 'Monosémica' ? 'Polisémica' : 'Monosémica'], `${p}: ${e}.`)),
  ...HIPONIMOS_39.flatMap(([h, xs]) => xs.slice(0, 2).map((x) => elixe(<>«{x}» es un hipónimo de…</>, h, HIPONIMOS_39.map(([y]) => y).filter((y) => y !== h), `${h}: ${xs.join(', ')}.`))),
  ...HOMOFONOS.map(([p, t]) => elixe(<>«{p}» son…</>, t, [t === 'Homófonos' ? 'Homógrafos' : 'Homófonos'], t === 'Homófonos' ? 'Suenan igual y se escriben distinto.' : 'Suenan y se escriben igual.')),
  elixe('En «árbol → pino, tilo, cedro», «árbol» es el…', 'Hiperónimo', ['Hipónimo', 'Sinónimo', 'Antónimo'], 'La palabra de significado más amplio.'),
  elixe('¿Qué palabras suelen ser monosémicas?', 'Los tecnicismos', ['Los verbos más usados', 'Los vulgarismos', 'Las palabras cortas'], 'citoplasma, cátodo, escoliosis…'),
]

const SEMANTICA_XOGOS: Xogo[] = [
  { id: 'sinonimos', titulo: 'Actividad 31: sinónimos', icono: '🔗', explica: 'Une cada verbo con su sinónimo.', crear: (acabar) => <Une pares={barallar(SINONIMOS_31).slice(0, 6).map(([palabra, significado]) => ({ palabra, significado }))} acabar={acabar} /> },
  {
    id: 'antonimos',
    titulo: 'Actividad 33: antónimos',
    icono: '⚖️',
    explica: 'Clasifica cada pareja.',
    crear: (acabar) => (
      <Clasifica
        caixas={ANTONIMOS_TIPOS.map(([t], i) => ({ id: t, nome: t, cor: ['border-sky-300 bg-sky-100', 'border-amber-300 bg-amber-100', 'border-pink-300 bg-pink-100'][i] }))}
        elementos={barallar(ANTONIMOS_33).slice(0, 9).map(([texto, caixa]) => ({ texto, caixa }))}
        acabar={acabar}
      />
    ),
  },
  {
    id: 'hiponimos',
    titulo: 'Actividad 39: hipónimos',
    icono: '🌰',
    explica: 'Lleva cada palabra a su hiperónimo.',
    crear: (acabar) => (
      <Clasifica
        caixas={HIPONIMOS_39.map(([h], i) => ({ id: h, nome: h, cor: ['border-amber-300 bg-amber-100', 'border-rose-300 bg-rose-100', 'border-slate-300 bg-slate-100'][i] }))}
        elementos={barallar(HIPONIMOS_39.flatMap(([h, xs]) => xs.map((texto) => ({ texto, caixa: h })))).slice(0, 9)}
        acabar={acabar}
      />
    ),
  },
]

export const Semantica = (p: PropsParada) => <Parada {...p} unidade={U} id="semantica" titulo="Relaciones semánticas" tarxetas={SEMANTICA_TARXETAS} xogos={SEMANTICA_XOGOS} preguntas={SEMANTICA_PREG} />

// ===================================================================================================
// 5. Funciones del lenguaje: las actividades
// ===================================================================================================

const FUN6 = ['Referencial', 'Expresiva o emotiva', 'Apelativa o conativa', 'Fática', 'Poética', 'Metalingüística']
const nombreCorto = (f: string) => f.split(' o ')[0]
const FUNCIONES_TARXETAS: Tarxeta[] = [
  {
    titulo: 'Cada función, un elemento de la comunicación',
    texto: (
      <>
        <Lista items={FUNCION_ELEMENTO.map(([f, e]) => <>{b(e)} → función {f.toLowerCase()}</>)} />
        <Truco>En el esquema de la fotocopia, la función del código pone «referencial» por error: es la {b('metalingüística')}, como dijo la profesora en Classroom.</Truco>
      </>
    ),
  },
  {
    titulo: 'Pistas rápidas',
    texto: (
      <Lista
        items={[
          <>{b('Referencial')}: informa (oraciones enunciativas). «Marte es el planeta más cercano a la Tierra.»</>,
          <>{b('Expresiva')}: sentimientos (exclamaciones, interjecciones). «¡Qué bien!»</>,
          <>{b('Apelativa')}: quiere influir en el receptor (imperativo, órdenes, publicidad). «¡Vota a…!»</>,
          <>{b('Fática')}: abre, mantiene o cierra la comunicación. «¿Me oyes bien? —Sí, sí, dime.»</>,
          <>{b('Poética')}: cuida la forma (metáforas, rimas). «Región de Murcia, donde vive el sol.»</>,
          <>{b('Metalingüística')}: habla de la lengua. «El sujeto y el predicado concuerdan.»</>,
        ]}
      />
    ),
  },
  {
    titulo: 'Varias funciones a la vez',
    texto: (
      <>
        <p>Las funciones no aparecen aisladas: suele haber una {b('predominante')}.</p>
        <Caixa titulo="Ejemplo">
          <i>¡Qué mala suerte que vaya a empeorar el tiempo para las vacaciones!</i> → predomina la {b('expresiva')} (un sentimiento), pero también informa ({b('referencial')}).
        </Caixa>
        <p className="text-base">El {b('lenguaje literario')}: uso artístico de la lengua en el que predomina la función poética; importa la connotación y trata temas universales (amor, muerte, tiempo).</p>
      </>
    ),
  },
]

const FUNCIONES_PREG: Pregunta[] = [
  ...FUNCIONES_45.map(([f, c]) => elixe(<>«{f}» ¿Qué función predomina?</>, c, otras(FUN6, c), `Página 45, actividad 1: ${c.toLowerCase()}.`)),
  ...PLATERO.map(([f, c]) => elixe(<>En el texto de Platero: «{f}» ¿Qué función cumple?</>, c, otras(FUN6, c), `Actividad 2: ${c.toLowerCase()}.`)),
  ...FUNCION_ELEMENTO.map(([f, e]) => elixe(<>¿En qué elemento de la comunicación se centra la función {nombreCorto(f).toLowerCase()}?</>, e, otras(FUNCION_ELEMENTO.map(([, x]) => x), e), `${f}: ${e.toLowerCase()}.`)),
  elixe('En el esquema de la fotocopia, la función centrada en el código («Mesa» es un sustantivo) aparece como referencial. ¿Cuál es en realidad?', 'Metalingüística', ['Referencial', 'Fática', 'Poética'], 'Es una errata: lo dijo la profesora.'),
  elixe('«¡Qué mala suerte que vaya a empeorar el tiempo para las vacaciones!» ¿Qué función predomina?', 'Expresiva o emotiva', ['Referencial', 'Fática', 'Metalingüística'], 'Predomina el sentimiento, aunque también informa.'),
  elixe('¿Qué función predomina en el lenguaje literario?', 'Poética', ['Referencial', 'Fática', 'Apelativa o conativa'], 'Importa la forma del mensaje.'),
  elixe('¿Qué función usa sobre todo la publicidad para que compremos?', 'Apelativa o conativa', ['Metalingüística', 'Fática', 'Referencial'], 'Quiere influir en la conducta del receptor (imperativo).'),
]

const FUNCIONES_XOGOS: Xogo[] = [
  {
    id: 'p45',
    titulo: 'Página 45, actividad 1',
    icono: '💬',
    explica: 'Clasifica los mensajes por su función.',
    crear: (acabar) => (
      <Clasifica
        caixas={FUN6.map((id, i) => ({ id, nome: nombreCorto(id), cor: ['border-sky-300 bg-sky-100', 'border-pink-300 bg-pink-100', 'border-amber-300 bg-amber-100', 'border-lime-300 bg-lime-100', 'border-violet-300 bg-violet-100', 'border-slate-300 bg-slate-100'][i] }))}
        elementos={barallar(FUNCIONES_45).slice(0, 8).map(([texto, caixa]) => ({ texto, caixa }))}
        acabar={acabar}
      />
    ),
  },
  { id: 'elemento', titulo: 'Función y elemento', icono: '🔗', explica: 'Une cada función con su elemento.', crear: (acabar) => <Une pares={FUNCION_ELEMENTO.map(([palabra, significado]) => ({ palabra, significado }))} acabar={acabar} /> },
  { id: 'platero', titulo: 'Las funciones en Platero', icono: '🐴', explica: 'Une cada frase del texto con su función.', crear: (acabar) => <Une pares={PLATERO.map(([significado, palabra]) => ({ palabra: nombreCorto(palabra), significado }))} acabar={acabar} /> },
]

export const Funciones2 = (p: PropsParada) => <Parada {...p} unidade={U} id="funciones" titulo="Funciones del lenguaje: las actividades" tarxetas={FUNCIONES_TARXETAS} xogos={FUNCIONES_XOGOS} preguntas={FUNCIONES_PREG} />

// ===================================================================================================
// 6. Cómo hacer un buen resumen
// ===================================================================================================

const RESUMEN_TARXETAS: Tarxeta[] = [
  ...RESUMEN_PASOS.map(([t, xs]): Tarxeta => ({ titulo: `Antes de resumir: ${t}`, texto: <Lista items={xs} /> })),
  { titulo: 'Cómo es un buen resumen', texto: <Lista items={RESUMEN_SI} /> },
  {
    titulo: 'Qué debemos evitar',
    texto: (
      <>
        <Lista items={RESUMEN_NO} />
        <Truco>¡Ojo! En Lengua NO se empieza con «Este texto…» (en Galego la profesora sí lo pide: no los mezcles).</Truco>
      </>
    ),
  },
  { titulo: 'Un ejemplo', texto: <><Caixa titulo="Texto"><span className="text-base">{RESUMENES[0].texto}</span></Caixa><Caixa titulo="Resumen" cor="border-emerald-300"><span className="text-base">{RESUMENES[0].bueno}</span></Caixa></> },
]

const RESUMEN_PREG: Pregunta[] = [
  ...RESUMENES.flatMap((r) => [
    elixe(<><span className="mb-2 block text-base font-normal text-slate-600">{r.texto}</span>¿Cuál es el mejor resumen?</>, r.bueno, r.malos.map(([m]) => m), 'Es breve, con palabras propias, en presente, sin opiniones y sin empezar por «Este texto».'),
    ...r.malos.map(([m, fallo]) => elixe(<>Este resumen está mal: «{m}» ¿Por qué?</>, fallo, otras(RESUMENES.flatMap((x) => x.malos.map(([, f]) => f)), fallo), fallo)),
  ]),
  elixe('¿Cuánto debe ocupar como máximo un resumen?', 'Un tercio del texto', ['La mitad del texto', 'Lo mismo que el texto', 'Una línea'], 'No debe exceder 1/3 del texto.'),
  elixe('¿En qué tiempo y persona se escribe el resumen?', 'Presente de indicativo y 3.ª persona del singular', ['Pasado y 1.ª persona', 'Futuro y 2.ª persona', 'Como quieras'], 'No se narra, se explica.'),
  elixe('¿Cuántas veces conviene leer el texto antes de resumir?', 'Dos o tres', ['Una, rápido', 'Ninguna: se resume el título', 'Diez'], 'Lectura en silencio y con concentración.'),
  elixe('¿Cuál de estas cosas NO se hace en un resumen?', 'Dar tu opinión', ['Usar conectores', 'Escribir en un párrafo', 'Usar palabras propias'], 'Es personal, pero no se opina.'),
  elixe('¿Con qué NO debe empezar un resumen en Lengua?', '«Este texto…»', ['Con la idea principal', 'Con el tema', 'Con un sujeto del texto'], 'Lo dice la presentación de la profesora.'),
  elixe('¿Qué conectores conviene usar en el resumen?', 'Además, por último, por otra parte, también', ['Tío, o sea, en plan', 'Yo creo, me parece', 'Había una vez'], 'Conectores textuales.'),
  elixe('¿Cuántos párrafos conviene que tenga el resumen?', 'Uno', ['Tantos como el texto', 'Tres: introducción, desarrollo y conclusión', 'Ninguno: se hace en esquema'], 'Conviene que ocupe un único párrafo.'),
  elixe('«Yo creo que el autor tiene toda la razón.» ¿Por qué no vale en un resumen?', 'Opina y usa la primera persona', ['Es demasiado largo', 'Está en pasado', 'Tiene conectores'], 'El resumen no opina ni usa la primera persona.'),
  elixe('¿Se pueden copiar frases del texto en el resumen?', 'No: tiene que ser elaboración propia', ['Sí, cuantas más mejor', 'Solo la primera y la última', 'Sí, si van entre comillas'], 'No se copian frases ni se cita textualmente.'),
  elixe('¿Cuántos contenidos importantes se localizan en el esquema de ideas?', 'Entre 2 y 5', ['Uno solo', 'Más de 10', 'Todos los que haya'], 'Ideas principales y secundarias.'),
  elixe('Al subrayar, ¿qué hacemos con lo irrelevante?', 'Lo omitimos', ['Lo copiamos', 'Lo subrayamos en rojo', 'Lo ponemos al principio'], 'Solo subrayamos las palabras clave.'),
  elixe('Al subrayar, ¿qué hay que buscar en cada párrafo?', 'La idea principal', ['Las palabras más largas', 'Los nombres propios', 'Las comas'], 'Y omitir lo irrelevante.'),
  elixe('¿En cuántas partes suele dividirse el esquema de ideas?', 'Introducción, desarrollo y conclusión', ['Tema, título y resumen', 'Presentación, nudo y desenlace', 'Sujeto y predicado'], 'Localiza entre 2 y 5 contenidos importantes.'),
]

const RESUMEN_XOGOS: Xogo[] = [
  {
    id: 'si-no',
    titulo: '¿Se hace o se evita?',
    icono: '🗂️',
    explica: 'Coloca cada consejo.',
    crear: (acabar) => (
      <Clasifica
        caixas={[
          { id: 'si', nome: 'Se hace', cor: 'border-emerald-300 bg-emerald-100' },
          { id: 'no', nome: 'Se evita', cor: 'border-rose-300 bg-rose-100' },
        ]}
        elementos={barallar([...RESUMEN_SI.map((texto) => ({ texto, caixa: 'si' })), ...RESUMEN_NO.map((texto) => ({ texto, caixa: 'no' }))]).slice(0, 8)}
        acabar={acabar}
      />
    ),
  },
  { id: 'fallos', titulo: '¿Qué falla?', icono: '🔍', explica: 'Une cada resumen malo con su fallo.', crear: (acabar) => <Une pares={RESUMENES.flatMap((r) => r.malos).map(([significado, palabra]) => ({ palabra, significado }))} acabar={acabar} /> },
]

export const Resumen = (p: PropsParada) => <Parada {...p} unidade={U} id="resumen" titulo="Cómo hacer un buen resumen" tarxetas={RESUMEN_TARXETAS} xogos={RESUMEN_XOGOS} preguntas={RESUMEN_PREG} />

export const PREGUNTAS_LENGUA2: Record<string, Pregunta[]> = {
  lenguas: LENGUAS_PREG,
  mundo: MUNDO_PREG,
  niveles: NIVELES_PREG,
  semantica: SEMANTICA_PREG,
  funciones: FUNCIONES_PREG,
  resumen: RESUMEN_PREG,
}
