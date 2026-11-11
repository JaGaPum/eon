// Lengua Castellana de 3.º (Olivia), unidad 2 «¿Somos iguales?»: los textos, los antónimos, el sonido G suave, la
// oración y el sujeto y el predicado. Las respuestas de ortografía, sílabas y concordancia las calcula el código.
import { useMemo, useState, type ReactNode } from 'react'
import { Burbulla, Clasifica, Ordena, Proba, SerieDeletrea, Une, VerdadeiroFalso, barallar, type Pregunta } from '../pezas'
import { elixe } from '../paisaxes/preguntas'
import { Parada } from '../../historia/parcial1/roma'
import { conHuecoG, faltasG, grupoG, huecoG, huecoK, reglaG, reglaK, type GrupoG } from '../../lib/ortografia'
import { desordenada, mayuscula, palabras, partes, texto, type Oracion } from '../../lib/oracion'
import { separar, silabas } from '../../lib/silabas'
import { ANTONIMOS, CONCORDANCIA, ESCRIBE_G, NO_ORACIONES, ORACIONES, PALABRAS_CUENTO, PALABRAS_G, PALABRAS_G_FUERTE, PALABRAS_K, SINONIMOS } from './datos'

type PropsParada = { ruta: string; modo?: string }
const U = 'iguales'
const Practica = ({ preguntas, acabar }: { preguntas: Pregunta[]; acabar: () => void }) => <Proba practica cantas={8} preguntas={preguntas} acabar={acabar} />
const azar = <T,>(xs: readonly T[], n: number) => barallar(xs).slice(0, n)

/** El sujeto rodeado de azul y el predicado de verde, como en las hojas de la profesora. */
const Suj = ({ children }: { children: ReactNode }) => <span className="rounded-full border-2 border-sky-500 bg-sky-50 px-2 text-sky-900">{children}</span>
const Pred = ({ children }: { children: ReactNode }) => <span className="rounded-full border-2 border-emerald-500 bg-emerald-50 px-2 text-emerald-900">{children}</span>

export function Coloreada({ o }: { o: Oracion }) {
  const { sujeto, predicado } = partes(o)
  const s = sujeto && <Suj>{sujeto}</Suj>
  const p = <Pred>{predicado}</Pred>
  const [primero, ultimo] = !s ? [null, p] : o.detras ? [p, s] : [s, p]
  // El punto va pegado a la última parte, para que no baje solo a otra línea.
  return (
    <span className="inline-flex flex-wrap items-center gap-1 leading-loose">
      {primero}
      <span className="whitespace-nowrap">{ultimo}.</span>
    </span>
  )
}

const Caja = ({ children, cor = 'border-violet-200 bg-white' }: { children: ReactNode; cor?: string }) => <div className={`rounded-2xl border-2 p-3 ${cor}`}>{children}</div>
const dibujo = (e?: string) =>
  e ? (
    <span className="block text-center text-7xl" aria-hidden="true">
      {e}
    </span>
  ) : undefined

// ===================================================================================================
// 1. Los textos: el cuento «Todo es valioso» y el texto informativo «Mucho más que un amigo»
// ===================================================================================================

const CUENTO_PREG: Pregunta[] = [
  elixe('¿Dónde ocurre la historia de Kavita?', 'En una aldea cercana a Jaipur, en la India', ['En una aldea de Pakistán', 'En una gran ciudad de China'], 'Vivía en una pequeña aldea del Rajastán, cerca de Jaipur, en la India.'),
  elixe('¿Cuándo ocurre la historia?', 'Hace mucho tiempo', ['En la actualidad, hace pocos meses', 'Dentro de muchos años'], 'Empieza así: «Hace mucho tiempo…».'),
  elixe('¿Qué tenía Kavita?', 'Dos cabras, unas gallinas y un pequeño huerto', ['Muchas vacas y un gran campo de trigo', 'Una tienda de cántaros'], 'Por eso su casa es la que tiene cabras, gallinas y un huerto.'),
  elixe('¿Cuál era el secreto de Kavita para ser feliz?', 'Sabía apreciar los detalles hermosos de cada día', ['No trabajaba nunca', 'Tenía muchos cántaros nuevos'], 'Trabajaba sin descanso, pero sabía apreciar los infinitos detalles hermosos que tenemos cada día.'),
  elixe('¿A dónde iba Kavita todos los días muy temprano?', 'A un arroyo lejano', ['Al mercado de Jaipur', 'A casa de Ravi'], 'Salía de casa al alba y caminaba hasta un arroyo lejano.'),
  elixe('¿Para qué iba Kavita al arroyo?', 'Para llenar de agua sus dos cántaros', ['Para coger flores', 'Para bañar a sus cabras'], 'Llenaba de agua fresca sus dos viejos cántaros de barro.'),
  elixe('¿Qué le pasó un día a uno de los cántaros?', 'Tenía una grieta y perdía agua', ['Se rompió en mil pedazos', 'Se lo llevó el río'], '«¡Oh! Mi vieja vasija tiene una grieta.»'),
  elixe('¿Qué hizo Kavita con el cántaro roto?', 'Nada: siguió usándolo', ['Lo tiró y compró otro', 'Lo arregló con barro'], 'No hizo nada por solucionar el problema y siguió llevándolo al arroyo.'),
  elixe('¿Para qué sirvió al final la vasija rota?', 'Para regar las flores del camino', ['Para guardar el arroz', 'No sirvió para nada'], 'El agua que se derramaba regó las flores que nacieron en primavera.'),
  elixe('¿Quién dice: «La vasija ya no sirve, hay que tirarla»?', 'Ravi', ['Kavita'], 'Ravi, el vecino, le dice que tire esa vasija inútil.'),
  elixe('¿Quién dice: «La vasija aún puede ser valiosa»?', 'Kavita', ['Ravi'], 'Kavita le enseña a Ravi las flores del camino.'),
  elixe('¿Cuál es la enseñanza del cuento?', 'Lo que parece defectuoso puede tener un gran valor', ['Hay que tirar las cosas rotas', 'Es mejor no trabajar'], '«Lo aparentemente defectuoso puede tener enorme valor.»'),
  elixe('¿Qué significa «alba»?', 'Amanecer', ['Atardecer', 'Medianoche'], 'Alba: amanecer.'),
  elixe('¿Qué es un cántaro?', 'Una vasija de barro o metal, ancha por la barriga', ['Un pozo para sacar agua', 'Un río pequeño'], 'Cántaros: vasijas de barro o metal, de boca pequeña, anchas por la barriga y estrechas por el pie.'),
  elixe('¿Qué tipo de texto es «Todo es valioso»?', 'Un cuento: una historia', ['Un texto informativo', 'Unas instrucciones'], 'Es un cuento popular indio: cuenta una historia.'),
]

const PERROS_PREG: Pregunta[] = [
  elixe('¿Qué tipo de texto es «Mucho más que un amigo»?', 'Un texto con información sobre los perros guía', ['Una historia sobre los perros guía', 'Un texto con instrucciones para entrenar a un perro guía'], 'Es un texto informativo: nos da información.'),
  elixe('¿A quién ayudan los perros guía?', 'A las personas ciegas', ['A los bomberos', 'A los pastores'], 'Ayudan a las personas ciegas a desplazarse por la calle.'),
  elixe('¿Qué aprende un perro guía?', 'A pararse en los semáforos', ['A leer en braille', 'A conducir el autobús'], 'Aprenden a pararse en los semáforos y a esperar en el paso de cebra.'),
  elixe('¿Qué otra cosa sabe hacer un perro guía?', 'Buscar un asiento libre en el autobús', ['Comprar el pan', 'Abrir la puerta con llave'], 'También buscan un asiento libre en el transporte público y evitan los obstáculos.'),
  elixe('¿Qué es lo más importante de un perro guía?', 'Que jamás se separa de su dueño', ['Que corre muy rápido', 'Que ladra mucho'], '«¡Jamás se separan de sus dueños!»'),
  elixe('¿Dónde viven primero los perros guía?', 'Con una familia de acogida', ['En un centro especializado', 'Con la persona ciega'], 'Primero, con una familia de acogida; después, en un centro; y al final, con la persona que los necesita.'),
  elixe('¿Qué pasa después de vivir con la familia de acogida?', 'Los entrenan en un centro especializado', ['Van a vivir a la calle', 'Vuelven con su madre'], 'Después los entrenan en un centro especializado.'),
  elixe('¿Cómo debe ser un buen perro guía?', 'Tranquilo, sociable y muy obediente', ['Nervioso y juguetón', 'Grande y ladrador'], 'Tranquilo, sociable, muy obediente y que cumpla siempre las órdenes de su dueño.'),
  elixe('¿Quién cría y adiestra a los perros guía?', 'La Fundación ONCE del Perro Guía', ['Los veterinarios del barrio', 'Los profesores del colegio'], 'Ellos crían y adiestran a estos maravillosos animales.'),
  elixe('¿Qué información NO aparece en el texto?', 'Cuánto dura su entrenamiento', ['Qué es un perro guía', 'Qué tareas realiza', 'Quiénes lo necesitan'], 'El texto no dice cuánto tiempo dura el entrenamiento.'),
  elixe('¿Qué página web es mejor para saber cómo acoger un perro guía?', 'perrosguia.once.es', ['kids.nationalgeographic.com'], 'La de la ONCE, que es quien cría y adiestra a los perros guía.'),
]

const SILABAS_PREG: Pregunta[] = PALABRAS_CUENTO.map((w) => {
  const n = silabas(w).length
  return elixe(
    <>¿Cuántas sílabas tiene «{w}»?</>,
    String(n),
    ['1', '2', '3', '4', '5'].filter((x) => x !== String(n)).slice(0, 3),
    <>
      {separar(w)}: {n === 1 ? 'una sílaba' : `${n} sílabas`}.
    </>,
  )
})

const TEXTOS_PREG = [...CUENTO_PREG, ...PERROS_PREG, ...azar(SILABAS_PREG, 4)]

export function Textos(p: PropsParada) {
  return (
    <Parada
      {...p}
      unidade={U}
      id="textos"
      titulo="Los textos de la unidad"
      tarxetas={[
        {
          titulo: '«Todo es valioso» (cuento popular indio)',
          texto: (
            <>
              <p>
                Hace mucho tiempo, en una aldea cerca de <b>Jaipur</b>, en la India, vivía <b>Kavita</b>. Tenía dos cabras, unas gallinas y un pequeño huerto. Era feliz porque sabía apreciar los detalles hermosos de cada día.
              </p>
              <p>
                Cada mañana, al <b>alba</b> (amanecer), iba a un arroyo lejano a llenar sus dos <b>cántaros</b> (vasijas de barro).
              </p>
            </>
          ),
          visual: dibujo('🏺💧🏺'),
        },
        {
          titulo: 'El cántaro roto',
          texto: (
            <>
              <p>Un día, uno de los cántaros tenía una grieta y perdía agua. Kavita no hizo nada y siguió usándolo.</p>
              <p>
                Su vecino <b>Ravi</b> le dijo: «Tira esa vasija inútil». Pero Kavita le enseñó las flores del camino: habían crecido gracias al agua del cántaro roto.
              </p>
              <p className="rounded-2xl bg-amber-50 p-3 font-bold text-amber-900">Enseñanza: lo que parece defectuoso puede tener un gran valor.</p>
            </>
          ),
          visual: dibujo('🌸🌼🌺'),
        },
        {
          titulo: '«Mucho más que un amigo» (texto informativo)',
          texto: (
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                <b>¿Qué son?</b> Perros que ayudan a las personas ciegas a moverse por la calle.
              </li>
              <li>
                <b>¿Qué tareas hacen?</b> Se paran en los semáforos, esperan en el paso de cebra, buscan un asiento libre en el autobús y evitan los obstáculos. ¡Y jamás se separan de su dueño!
              </li>
              <li>
                <b>¿Cómo aprenden?</b> Primero viven con una familia de acogida, después los entrenan en un centro y al final van con la persona que los necesita.
              </li>
              <li>
                <b>¿Cómo son?</b> Tranquilos, sociables y muy obedientes.
              </li>
            </ul>
          ),
          visual: dibujo('🦮'),
        },
        {
          titulo: 'Tipos de texto',
          texto: (
            <div className="grid gap-2">
              <Caja>
                <b>Cuento:</b> cuenta una historia con personajes. «Todo es valioso».
              </Caja>
              <Caja>
                <b>Texto informativo:</b> nos da información sobre algo real. «Mucho más que un amigo».
              </Caja>
              <Caja>
                <b>Instrucciones:</b> explican paso a paso cómo hacer algo.
              </Caja>
            </div>
          ),
        },
      ]}
      xogos={[
        {
          id: 'vfcuento',
          titulo: 'El cuento',
          icono: '🏺',
          explica: '¿Verdadero o falso?',
          crear: (acabar) => (
            <VerdadeiroFalso
              frases={[
                { texto: 'Kavita vivía en la India.', certa: true, explica: 'En una aldea cerca de Jaipur.' },
                { texto: 'Kavita iba al arroyo por la tarde.', certa: false, explica: 'Iba al alba, al amanecer.' },
                { texto: 'Kavita tiró el cántaro roto.', certa: false, explica: 'Siguió usándolo.' },
                { texto: 'Ravi era el vecino de Kavita.', certa: true, explica: 'Ravi, su vecino.' },
                { texto: 'Las flores crecieron gracias al cántaro roto.', certa: true, explica: 'El agua que se derramaba las regó.' },
                { texto: 'El cuento enseña que hay que tirar lo que está roto.', certa: false, explica: 'Enseña que lo que parece defectuoso puede tener un gran valor.' },
              ]}
              acabar={acabar}
            />
          ),
        },
        {
          id: 'vfperros',
          titulo: 'Los perros guía',
          icono: '🦮',
          explica: '¿Verdadero o falso?',
          crear: (acabar) => (
            <VerdadeiroFalso
              frases={[
                { texto: 'Los perros guía ayudan a las personas ciegas.', certa: true, explica: 'Las ayudan a moverse por la calle.' },
                { texto: 'Un perro guía se separa de su dueño cuando se cansa.', certa: false, explica: '¡Jamás se separan de sus dueños!' },
                { texto: 'Un buen perro guía debe ser muy obediente.', certa: true, explica: 'Tranquilo, sociable y muy obediente.' },
                { texto: 'Primero viven en un centro y después con una familia.', certa: false, explica: 'Al revés: primero con una familia de acogida y después en un centro.' },
                { texto: 'El texto dice cuánto dura el entrenamiento.', certa: false, explica: 'Eso no aparece en el texto.' },
              ]}
              acabar={acabar}
            />
          ),
        },
        {
          id: 'silabas',
          titulo: 'Cuenta sílabas',
          icono: '👏',
          explica: 'Palabras del cuento: ¿dos, tres o cuatro sílabas?',
          crear: (acabar) => (
            <Clasifica
              caixas={[
                { id: '2', nome: 'Dos sílabas', cor: 'border-sky-300 bg-sky-100' },
                { id: '3', nome: 'Tres sílabas', cor: 'border-amber-300 bg-amber-100' },
                { id: '4', nome: 'Cuatro sílabas', cor: 'border-pink-300 bg-pink-100' },
              ]}
              elementos={azar(
                PALABRAS_CUENTO.filter((w) => [2, 3, 4].includes(silabas(w).length)),
                9,
              ).map((w) => ({ texto: w, caixa: String(silabas(w).length), pista: `Da palmadas: ${separar(w)}.` }))}
              acabar={acabar}
            />
          ),
        },
        { id: 'preguntas', titulo: 'Preguntas', icono: '❓', explica: 'Sobre los dos textos.', crear: (acabar) => <Practica preguntas={[...CUENTO_PREG, ...PERROS_PREG]} acabar={acabar} /> },
      ]}
      preguntas={TEXTOS_PREG}
    />
  )
}

// ===================================================================================================
// 2. Los antónimos
// ===================================================================================================

const todasAntonimas = ANTONIMOS.flat()
const antonimo = (w: string) => ANTONIMOS.find((p) => p.includes(w))!.find((x) => x !== w)!

const ANTONIMOS_PREG: Pregunta[] = [
  ...ANTONIMOS.flatMap(([a, b]) =>
    [
      [a, b],
      [b, a],
    ].map(([x, y]) => {
      const sinonimo = SINONIMOS.find((s) => s[0] === x)?.[1]
      const outras = barallar(todasAntonimas.filter((w) => w !== x && w !== y)).slice(0, sinonimo ? 2 : 3)
      return elixe(<>¿Cuál es el antónimo de «{x}»?</>, y, sinonimo ? [sinonimo, ...outras] : outras, <>«{x}» y «{y}» significan lo contrario: son antónimos.</>)
    }),
  ),
  elixe(<>Kavita estaba siempre <b>contenta</b>. ¿Cuál es el antónimo de «contenta»?</>, 'triste', ['preocupada', 'inquieta', 'sonriente'], 'Lo contrario de contenta es triste.'),
  elixe('¿Qué son las palabras antónimas?', 'Las que tienen significados contrarios', ['Las que significan lo mismo', 'Las que riman'], 'Por ejemplo, viejo y nuevo son palabras antónimas.'),
  elixe('¿Qué palabra de la nube significa lo contrario de «igual»?', 'diferente', ['respeto', 'apoyar', 'integración'], 'Igual ↔ diferente.'),
  elixe('¿Qué palabra de la nube tiene un significado parecido al de «ayudar»?', 'apoyar', ['diferente', 'igual', 'diversidad'], 'Ayudar y apoyar significan casi lo mismo: no son antónimos.'),
  elixe('¿Son antónimos «ayudar» y «apoyar»?', 'No, significan casi lo mismo', ['Sí, significan lo contrario'], 'Las palabras que significan lo mismo no son antónimas.'),
  elixe(<>Cambia por antónimos: «Vive en una casa <b>moderna</b> y muy <b>bonita</b>.»</>, 'Vive en una casa antigua y muy fea.', ['Vive en una casa nueva y muy bonita.', 'Vive en una casa antigua y muy bonita.'], 'moderna ↔ antigua, bonita ↔ fea.'),
  elixe(<>Cambia por antónimos: «Mi bicicleta es <b>pequeña</b>, pero <b>rápida</b>.»</>, 'Mi bicicleta es grande, pero lenta.', ['Mi bicicleta es chiquita, pero rápida.', 'Mi bicicleta es grande, pero rápida.'], 'pequeña ↔ grande, rápida ↔ lenta.'),
  elixe(<>Kavita tenía dos cántaros <b>viejos</b>. ¿Qué palabra significa lo contrario?</>, 'nuevos', ['rotos', 'antiguos', 'grandes'], 'viejo ↔ nuevo.'),
]

export function Antonimos(p: PropsParada) {
  return (
    <Parada
      {...p}
      unidade={U}
      id="antonimos"
      titulo="Los antónimos"
      tarxetas={[
        {
          titulo: '¿Qué son los antónimos?',
          texto: (
            <>
              <p>
                Las <b>palabras antónimas</b> son las que tienen <b>significados contrarios</b>.
              </p>
              <Caja cor="border-pink-200 bg-pink-50">
                Kavita tenía dos cántaros <b>viejos</b>. Lo contrario: cántaros <b>nuevos</b>.
              </Caja>
              <p>
                <b>viejo</b> ↔ <b>nuevo</b> son antónimos.
              </p>
            </>
          ),
          visual: dibujo('🏺 ↔ ✨'),
        },
        {
          titulo: 'Antónimos del libro',
          texto: (
            <div className="grid grid-cols-2 gap-2 text-lg">
              {ANTONIMOS.slice(0, 12).map(([a, b]) => (
                <span key={a} className="rounded-xl bg-white px-3 py-1.5 text-center">
                  {a} ↔ <b>{b}</b>
                </span>
              ))}
            </div>
          ),
        },
        {
          titulo: '¡Cuidado!',
          texto: (
            <>
              <p>Si dos palabras significan lo mismo, NO son antónimas.</p>
              <Caja cor="border-amber-200 bg-amber-50">
                <b>ayudar</b> y <b>apoyar</b> significan casi lo mismo.
              </Caja>
              <Caja cor="border-emerald-200 bg-emerald-50">
                <b>igual</b> y <b>diferente</b> significan lo contrario: son antónimos.
              </Caja>
            </>
          ),
        },
      ]}
      xogos={[
        { id: 'une', titulo: 'Une los contrarios', icono: '🔗', explica: 'Cada palabra con su antónimo.', crear: (acabar) => <Une axuda="Toca una palabra y después su antónimo." pares={azar(ANTONIMOS, 6).map(([a, b]) => ({ palabra: a, significado: b }))} acabar={acabar} /> },
        { id: 'une2', titulo: 'Más contrarios', icono: '🔁', explica: 'Otra vez, con otras palabras.', crear: (acabar) => <Une axuda="Toca una palabra y después su antónimo." pares={azar(ANTONIMOS, 6).map(([a, b]) => ({ palabra: b, significado: a }))} acabar={acabar} /> },
        {
          id: 'vf',
          titulo: '¿Son antónimos?',
          icono: '🤔',
          explica: 'Verdadero o falso.',
          crear: (acabar) => (
            <VerdadeiroFalso
              frases={[
                ...azar(ANTONIMOS, 4).map(([a, b]) => ({ texto: `«${a}» y «${b}» son antónimos.`, certa: true, explica: `Significan lo contrario.` })),
                ...azar(SINONIMOS, 3).map(([a, b]) => ({ texto: `«${a}» y «${b}» son antónimos.`, certa: false, explica: `Significan casi lo mismo: no son contrarios.` })),
              ]}
              acabar={acabar}
            />
          ),
        },
        { id: 'practica', titulo: 'Elige el antónimo', icono: '✏️', explica: 'Preguntas como las del libro.', crear: (acabar) => <Practica preguntas={ANTONIMOS_PREG} acabar={acabar} /> },
      ]}
      preguntas={ANTONIMOS_PREG}
    />
  )
}

// ===================================================================================================
// 3. El sonido G suave (y repaso de c y qu)
// ===================================================================================================

const GRAFIAS_G = ['g', 'gu', 'gü']
const NOMBRE_GRUPO: Record<GrupoG, string> = { 'ga-go-gu': 'Con ga, go, gu', 'gue-gui': 'Con gue, gui', 'güe-güi': 'Con güe, güi' }
/** Las palabras del ejercicio 2 de la página 30. */
const CLASIFICA_30 = ['bigote', 'agua', 'bilingüe', 'águila', 'espaguetis', 'nicaragüense', 'droguería', 'regadera', 'piragüista', 'guiño', 'guepardo', 'aguijón']
const dibujoDe = (w: string) => PALABRAS_G.find((x) => x.palabra === w)?.dibujo
const Hueco = ({ w }: { w: string }) => <span className="font-mono tracking-wider">{conHuecoG(w).replace('_', '＿')}</span>

const G_PREG: Pregunta[] = [
  ...PALABRAS_G.map(({ palabra, dibujo: d }): Pregunta => {
    const { grafia } = huecoG(palabra)
    return {
      ...elixe(
        <>
          ¿Cómo se completa? <Hueco w={palabra} />
        </>,
        grafia,
        GRAFIAS_G.filter((x) => x !== grafia),
        <>
          Se escribe «{palabra}». {reglaG(grafia)}
        </>,
        dibujo(d),
      ),
      oir: palabra,
    }
  }),
  ...CLASIFICA_30.map((w) => {
    const g = grupoG(w)
    return elixe(<>¿En qué grupo va «{w}»?</>, NOMBRE_GRUPO[g], Object.values(NOMBRE_GRUPO).filter((x) => x !== NOMBRE_GRUPO[g]), <>«{w}» va {NOMBRE_GRUPO[g].toLowerCase()}.</>)
  }),
  ...PALABRAS_G.filter((x) => huecoG(x.palabra).grafia !== 'g').map(({ palabra }) => {
    const suena = huecoG(palabra).grafia === 'gü'
    return elixe(<>En «{palabra}», ¿suena la u?</>, suena ? 'Sí, suena: por eso lleva ü' : 'No, no suena', [suena ? 'No, no suena' : 'Sí, suena: por eso lleva ü'], reglaG(suena ? 'gü' : 'gu'))
  }),
  ...PALABRAS_G_FUERTE.map((f) => {
    const suaves = azar(PALABRAS_G, 2).map((x) => x.palabra)
    return elixe('¿Qué palabra NO tiene el sonido G suave?', f, suaves, <>En «{f}» la g va delante de e, i: suena fuerte, como la j.</>)
  }),
  ...azar(PALABRAS_G, 8).map(({ palabra }) => elixe('¿Qué palabra tiene el sonido G suave?', palabra, azar(PALABRAS_G_FUERTE, 2), <>«{palabra}» tiene G suave. {reglaG(huecoG(palabra).grafia)}</>)),
  ...PALABRAS_G.filter((x) => x.dibujo).map(({ palabra, dibujo: d }) => elixe('¿Cómo se escribe?', palabra, faltasG(palabra), <>Se escribe «{palabra}». {reglaG(huecoG(palabra).grafia)}</>, dibujo(d))),
  elixe('¿Cómo se escribe?', 'paraguas', ['paragüas', 'pargüas'], 'Se escribe «paraguas»: delante de a no se pone ü. La diéresis solo va en güe, güi.', dibujo('☂️')),
  ...PALABRAS_K.map((w): Pregunta => {
    const { antes, grafia, despues } = huecoK(w)
    return { ...elixe(<>¿c o qu? <span className="font-mono tracking-wider">{antes}＿{despues}</span></>, grafia, [grafia === 'c' ? 'qu' : 'c'], <>Se escribe «{w}». {reglaK(grafia)}</>), oir: w }
  }),
]

const Regla = () => (
  <ul className="space-y-2">
    <li className="rounded-xl bg-white p-2">
      <b className="text-rose-600">g</b> delante de <b>a, o, u</b>: amiga, gota, gustar.
    </li>
    <li className="rounded-xl bg-white p-2">
      <b className="text-rose-600">gu</b> delante de <b>e, i</b> cuando la u <b>no suena</b>: juguete, manguitos.
    </li>
    <li className="rounded-xl bg-white p-2">
      <b className="text-rose-600">gü</b> delante de <b>e, i</b> cuando la u <b>suena</b>: vergüenza, agüita.
    </li>
  </ul>
)

export function GSuave(p: PropsParada) {
  const huecos = G_PREG.filter((q) => q.tipo === 'elixe' && GRAFIAS_G.includes(q.correcta))
  return (
    <Parada
      {...p}
      unidade={U}
      id="gsuave"
      titulo="El sonido G suave"
      tarxetas={[
        {
          titulo: 'g, gu, gü',
          texto: (
            <>
              <p>El sonido G suave (el de «gato») se escribe de tres maneras:</p>
              <Regla />
            </>
          ),
          visual: dibujo('🐱🧸🐧'),
        },
        {
          titulo: '¿Suena la u?',
          texto: (
            <>
              <p>Delante de e, i, di la palabra en voz alta y escucha la u:</p>
              <div className="grid gap-2 sm:grid-cols-2">
                <Caja cor="border-sky-200 bg-sky-50">
                  <b>guitarra, hoguera</b>
                  <br />
                  La u no suena → <b>gu</b>
                </Caja>
                <Caja cor="border-pink-200 bg-pink-50">
                  <b>pingüino, cigüeña</b>
                  <br />
                  La u suena → <b>gü</b> (con dos puntitos: diéresis)
                </Caja>
              </div>
            </>
          ),
          visual: dibujo('🎸 🐧'),
        },
        {
          titulo: '¡Ojo con estas!',
          texto: (
            <>
              <Caja cor="border-amber-200 bg-amber-50">
                Delante de <b>a, o</b> nunca se pone ü: <b>paraguas</b>, <b>agua</b> (no «paragüas»).
              </Caja>
              <Caja>
                <b>ge, gi</b> suenan fuerte, como la j: <b>gemas, genio</b>. No son G suave.
              </Caja>
            </>
          ),
          visual: dibujo('☂️ 💎'),
        },
        {
          titulo: 'Repaso: c y qu',
          texto: (
            <>
              <p>El sonido K se escribe igual que la G suave, pero sin diéresis:</p>
              <ul className="space-y-2">
                <li className="rounded-xl bg-white p-2">
                  <b className="text-rose-600">c</b> delante de a, o, u: caniche, poco, Coco.
                </li>
                <li className="rounded-xl bg-white p-2">
                  <b className="text-rose-600">qu</b> delante de e, i: Enrique, inquieto.
                </li>
              </ul>
            </>
          ),
        },
      ]}
      xogos={[
        {
          id: 'grupos',
          titulo: 'Clasifica',
          icono: '🗂️',
          explica: 'Las palabras de la página 30 en sus tres grupos.',
          crear: (acabar) => (
            <Clasifica
              caixas={[
                { id: 'ga-go-gu', nome: NOMBRE_GRUPO['ga-go-gu'], cor: 'border-emerald-300 bg-emerald-100' },
                { id: 'gue-gui', nome: NOMBRE_GRUPO['gue-gui'], cor: 'border-rose-300 bg-rose-100' },
                { id: 'güe-güi', nome: NOMBRE_GRUPO['güe-güi'], cor: 'border-violet-300 bg-violet-100' },
              ]}
              elementos={CLASIFICA_30.map((w) => ({ texto: w, caixa: grupoG(w), pista: `Mira qué va después de la g en «${w}».` }))}
              acabar={acabar}
            />
          ),
        },
        {
          id: 'suave',
          titulo: '¿Suave o fuerte?',
          icono: '👂',
          explica: 'G suave (gato) o como la j (genio).',
          crear: (acabar) => (
            <Clasifica
              caixas={[
                { id: 's', nome: 'G suave (gato)', cor: 'border-sky-300 bg-sky-100' },
                { id: 'f', nome: 'Suena como la j (genio)', cor: 'border-amber-300 bg-amber-100' },
              ]}
              elementos={[...azar(PALABRAS_G, 6).map((x) => ({ texto: x.palabra, caixa: 's' })), ...azar(PALABRAS_G_FUERTE, 3).map((w) => ({ texto: w, caixa: 'f', pista: `En «${w}» la g va delante de e, i.` }))]}
              acabar={acabar}
            />
          ),
        },
        { id: 'completa', titulo: 'Completa', icono: '🧩', explica: '¿g, gu o gü? Escucha la palabra 🔊.', crear: (acabar) => <Practica preguntas={huecos} acabar={acabar} /> },
        { id: 'escribe', titulo: 'Escribe el nombre', icono: '✏️', explica: 'Mira el dibujo y forma la palabra.', crear: (acabar) => <SerieDeletrea palabras={ESCRIBE_G.map((w) => ({ palabra: w, visual: dibujo(dibujoDe(w)) }))} acabar={acabar} /> },
      ]}
      preguntas={G_PREG}
    />
  )
}

// ===================================================================================================
// 4. La oración
// ===================================================================================================

const SI = 'Sí, es una oración'
const NO = 'No, no es una oración'
/** Otra forma de desordenarla: las dos primeras palabras cambiadas de sitio. */
function cambiada(o: Oracion) {
  const ws = (!o.sujeto ? [o.predicado] : o.detras ? [o.predicado, o.sujeto] : [o.sujeto, o.predicado]).join(' ').split(' ')
  if (ws.length < 3) return null
  ;[ws[1], ws[2]] = [ws[2], ws[1]]
  return `${mayuscula(ws.join(' '))}.`
}

const CON_SUJETO = ORACIONES.filter((o) => o.sujeto)

const ORACION_PREG: Pregunta[] = [
  ...azar(ORACIONES, 12).map((o) => elixe(<>¿Es una oración? «{texto(o)}»</>, SI, [NO], <>Se entiende y dice algo: es una oración.</>)),
  ...NO_ORACIONES.map((t) => elixe(<>¿Es una oración? «{t}»</>, NO, [SI], <>No dice nada de nadie: falta lo que se dice.</>)),
  ...azar(CON_SUJETO, 8).map((o) => elixe(<>¿Es una oración? «{desordenada(o)}»</>, NO, [SI], <>Las palabras están desordenadas y no se entiende. Bien escrita: «{texto(o)}»</>)),
  ...CON_SUJETO.map((o) => {
    const otras = [desordenada(o), cambiada(o)].filter((x): x is string => !!x && x !== texto(o))
    return elixe('¿Cuál está bien ordenada?', texto(o), [...new Set(otras)], <>«{texto(o)}»</>)
  }),
  elixe('¿Cuál es una oración?', 'El paisaje es bonito.', ['El paisaje bonito.', 'Es paisaje el bonito.'], 'La ficha de refuerzo: «El paisaje es bonito.»'),
  elixe('¿Qué son las oraciones?', 'Mensajes que expresan nuestras ideas y sentimientos', ['Palabras sueltas sin orden', 'Palabras que significan lo contrario'], 'Por ejemplo, «Miguel tiene un perro guía» es una oración.'),
  elixe('Separa bien: «Ellobitosesentíamuysolo.»', 'El lobito se sentía muy solo.', ['El lo bito se sen tía muy solo.', 'Ello bitos es entía muysolo.'], 'Cada palabra va separada: El · lobito · se · sentía · muy · solo.'),
  elixe('Separa bien: «Feroznoteníaamigos.»', 'Feroz no tenía amigos.', ['Fe roz note nía amigos.', 'Feroz no te nía a migos.'], 'Feroz · no · tenía · amigos.'),
  elixe('¿Cómo empieza una oración?', 'Con mayúscula', ['Con minúscula', 'Con un punto'], 'Empieza con mayúscula y termina con punto.'),
]

export function LaOracion(p: PropsParada) {
  return (
    <Parada
      {...p}
      unidade={U}
      id="oracion"
      titulo="La oración"
      tarxetas={[
        {
          titulo: '¿Qué es una oración?',
          texto: (
            <>
              <p>
                Las <b>oraciones</b> son mensajes que expresan nuestras ideas y sentimientos.
              </p>
              <Caja cor="border-sky-200 bg-sky-50">«Miguel tiene un perro guía.» es una oración.</Caja>
              <p>Empiezan con mayúscula y terminan con punto.</p>
            </>
          ),
          visual: dibujo('💬'),
        },
        {
          titulo: '¿Es una oración o no?',
          texto: (
            <div className="space-y-2">
              <Caja cor="border-rose-200 bg-rose-50">✗ El paisaje bonito. (falta lo que se dice)</Caja>
              <Caja cor="border-emerald-200 bg-emerald-50">✓ El paisaje es bonito.</Caja>
              <Caja cor="border-rose-200 bg-rose-50">✗ Es paisaje el bonito. (desordenada: no se entiende)</Caja>
            </div>
          ),
        },
        {
          titulo: 'Un cuento sin espacios',
          texto: (
            <>
              <p>Las palabras van separadas. Sin espacios no se entiende nada:</p>
              <Caja>Ferozvivíaenunlejanobosque.</Caja>
              <Caja cor="border-emerald-200 bg-emerald-50">Feroz vivía en un lejano bosque.</Caja>
            </>
          ),
          visual: dibujo('🐺'),
        },
      ]}
      xogos={[
        { id: 'ordena', titulo: 'Ordena las palabras', icono: '🧩', explica: 'Forma la oración tocando las palabras.', crear: (acabar) => <Ordena frases={azar(CON_SUJETO, 5).map((o) => ({ palabras: palabras(o) }))} acabar={acabar} /> },
        {
          id: 'vf',
          titulo: '¿Es una oración?',
          icono: '🤔',
          explica: 'Verdadero o falso.',
          crear: (acabar) => (
            <VerdadeiroFalso
              frases={[
                ...azar(CON_SUJETO, 3).map((o) => ({ texto: `«${texto(o)}» es una oración.`, certa: true, explica: 'Se entiende y dice algo de alguien.' })),
                ...azar(NO_ORACIONES, 2).map((t) => ({ texto: `«${t}» es una oración.`, certa: false, explica: 'Falta lo que se dice.' })),
                ...azar(CON_SUJETO, 2).map((o) => ({ texto: `«${desordenada(o)}» es una oración.`, certa: false, explica: `Está desordenada. Bien: «${texto(o)}»` })),
              ]}
              acabar={acabar}
            />
          ),
        },
        { id: 'practica', titulo: 'Practica', icono: '✏️', explica: 'Oraciones bien y mal escritas.', crear: (acabar) => <Practica preguntas={ORACION_PREG} acabar={acabar} /> },
      ]}
      preguntas={ORACION_PREG}
    />
  )
}

// ===================================================================================================
// 5. Sujeto y predicado
// ===================================================================================================

export const SIN_SUJETO = 'No tiene sujeto'

/** Dónde están en la oración las palabras del sujeto. */
export function indicesSujeto(o: Oracion): number[] {
  if (!o.sujeto) return []
  const n = palabras(o).length
  const k = o.sujeto.split(' ').length
  return Array.from({ length: k }, (_, i) => (o.detras ? n - k + i : i))
}

function preguntaSujeto(o: Oracion): Pregunta {
  const { sujeto, predicado } = partes(o)
  const pw = predicado.split(' ')
  const trampa = sujeto ? (o.detras ? pw[0] : `${sujeto} ${pw[0]}`) : pw[pw.length - 1]
  const correcta = sujeto ?? SIN_SUJETO
  const outras = [...new Set([predicado, trampa, SIN_SUJETO, pw[0]])].filter((x) => x !== correcta).slice(0, 3)
  return elixe(
    <>¿Cuál es el sujeto de «{texto(o)}»?</>,
    correcta,
    outras,
    sujeto ? (
      <>
        Se dice algo de «{sujeto}»: es el sujeto. <Coloreada o={o} />
      </>
    ) : (
      <>No se dice de quién: «{texto(o)}» no tiene sujeto. Todo es predicado.</>
    ),
  )
}

function preguntaPredicado(o: Oracion): Pregunta {
  const { sujeto, predicado } = partes(o)
  const pw = predicado.split(' ')
  const outras = [...new Set([sujeto!, texto(o).slice(0, -1), pw.length > 1 ? pw[0] : `${pw[0]} ${sujeto}`])].filter((x) => x !== predicado)
  return elixe(
    <>¿Cuál es el predicado de «{texto(o)}»?</>,
    predicado,
    outras,
    <>
      Lo que se dice de «{sujeto}» es el predicado. <Coloreada o={o} />
    </>,
  )
}

function preguntaConcordancia(c: (typeof CONCORDANCIA)[number]): Pregunta {
  const bien = mayuscula(c.sujetos[c.plural ? 1 : 0])
  const mal = mayuscula(c.sujetos[c.plural ? 0 : 1])
  return elixe(
    <>¿Qué sujeto va con «＿＿ {c.predicado}»?</>,
    bien,
    [mal],
    <>
      «{c.predicado.split(' ').find((w) => w !== 'se' && w !== 'me')}» habla de {c.plural ? 'varios' : 'uno solo'}: «{bien} {c.predicado}.»
    </>,
  )
}

const SUJETO_PREG: Pregunta[] = [
  ...ORACIONES.map(preguntaSujeto),
  ...azar(CON_SUJETO, 14).map(preguntaPredicado),
  ...CONCORDANCIA.map(preguntaConcordancia),
  elixe('¿Qué es el sujeto de una oración?', 'La persona o cosa de la que se dice algo', ['Lo que se dice de alguien', 'La última palabra de la oración'], 'En «Miguel tiene un perro guía», el sujeto es Miguel.'),
  elixe('¿Qué es el predicado de una oración?', 'Lo que se dice del sujeto', ['La persona de la que se habla', 'La primera palabra'], 'En «Miguel tiene un perro guía», el predicado es «tiene un perro guía».'),
  elixe('¿Qué oración no tiene sujeto?', 'Llueve mucho.', ['El perro ladra mucho.', 'Estaba roto el estuche.'], '«Llueve mucho» no dice de quién: no tiene sujeto.'),
  elixe('¿Dónde está el sujeto en «Estaba roto el estuche»?', 'Al final: el estuche', ['Al principio: Estaba', 'No tiene sujeto'], 'El sujeto puede ir detrás: ¿qué estaba roto? El estuche.'),
]

/** Rodea el sujeto: se tocan las palabras del sujeto (o «No tiene sujeto») y se comprueba. */
function Rodea({ acabar }: { acabar: () => void }) {
  const orde = useMemo(() => [...azar(ORACIONES.filter((o) => o.sujeto && !o.detras), 4), ...azar(ORACIONES.filter((o) => o.detras), 1), ...ORACIONES.filter((o) => !o.sujeto)], [])
  const [k, setK] = useState(0)
  const [marcadas, setMarcadas] = useState<number[]>([])
  const [estado, setEstado] = useState<'ben' | 'mal' | null>(null)
  if (k >= orde.length) return <Burbulla ton="ben">¡Muy bien! Has encontrado todos los sujetos.</Burbulla>
  const o = orde[k]
  const ws = palabras(o)
  const boas = indicesSujeto(o)

  function comprobar(sinSujeto: boolean) {
    const ok = sinSujeto ? boas.length === 0 : boas.length > 0 && boas.length === marcadas.length && boas.every((i) => marcadas.includes(i))
    setEstado(ok ? 'ben' : 'mal')
  }
  function seguinte() {
    setK(k + 1)
    setMarcadas([])
    setEstado(null)
    if (k + 1 === orde.length) acabar()
  }

  return (
    <div className="space-y-4">
      <p className="text-center text-sm font-semibold text-slate-500">
        {k + 1} / {orde.length}
      </p>
      {estado === 'ben' ? (
        <>
          <Burbulla ton="ben">
            ¡Bien!{' '}
            <span className="font-medium">
              <Coloreada o={o} />
            </span>
          </Burbulla>
          <button className="btn btn-primario min-h-14 w-full border-violet-600 bg-violet-600 text-xl hover:bg-violet-700" onClick={seguinte}>
            {k + 1 === orde.length ? 'Ver cómo me ha ido' : 'Siguiente →'}
          </button>
        </>
      ) : (
        <>
          <Burbulla ton={estado === 'mal' ? 'mal' : 'normal'}>
            {estado === 'mal' ? 'Todavía no. Pregúntate: ¿de quién se dice algo? ' : 'Toca las palabras del sujeto y pulsa «Comprobar». '}
            <span className="font-medium">Si no se dice de quién, toca «No tiene sujeto».</span>
          </Burbulla>
          <div className="flex flex-wrap justify-center gap-2 rounded-2xl border-2 border-violet-100 bg-white p-4">
            {ws.map((w, i) => (
              <button
                key={i}
                onClick={() => {
                  setEstado(null)
                  setMarcadas((m) => (m.includes(i) ? m.filter((x) => x !== i) : [...m, i]))
                }}
                className={`min-h-12 cursor-pointer rounded-full border-2 px-3 text-xl font-bold transition ${marcadas.includes(i) ? 'border-sky-500 bg-sky-100 text-sky-900' : 'border-transparent bg-slate-50 text-slate-800 hover:bg-violet-50'}`}
              >
                {w}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button className="btn min-h-12 flex-1 text-lg" onClick={() => comprobar(true)}>
              {SIN_SUJETO}
            </button>
            <button className="btn btn-primario min-h-12 flex-1 border-violet-600 bg-violet-600 text-lg hover:bg-violet-700" disabled={marcadas.length === 0} onClick={() => comprobar(false)}>
              Comprobar
            </button>
          </div>
        </>
      )}
    </div>
  )
}

/** La ficha de la libreta: el leñador, el ganadero y la panadera. */
const OFICIOS = ['el leñador', 'el ganadero', 'la panadera'].map((s) => ORACIONES.find((o) => o.sujeto === s)!)

export function SujetoPredicado(p: PropsParada) {
  const ejemplo: Oracion = { sujeto: 'Miguel', predicado: 'tiene un perro guía' }
  return (
    <Parada
      {...p}
      unidade={U}
      id="sujeto"
      titulo="Sujeto y predicado"
      tarxetas={[
        {
          titulo: 'Las dos partes de la oración',
          texto: (
            <>
              <p className="text-2xl">
                <Coloreada o={ejemplo} />
              </p>
              <p>
                El <b className="text-sky-700">sujeto</b> es la persona o cosa de la que se dice algo: <b>Miguel</b>.
              </p>
              <p>
                El <b className="text-emerald-700">predicado</b> es lo que se dice del sujeto: <b>tiene un perro guía</b>.
              </p>
            </>
          ),
          visual: dibujo('🧒🦮'),
        },
        {
          titulo: 'Dos preguntas para encontrarlos',
          texto: (
            <div className="space-y-2">
              <p className="text-2xl">
                <Coloreada o={{ sujeto: 'mi amiga Gabriela', predicado: 'estudia la lengua de signos' }} />
              </p>
              <Caja cor="border-sky-200 bg-sky-50">
                ¿<b>De quién</b> se dice algo? → De mi amiga Gabriela: <b>sujeto</b>.
              </Caja>
              <Caja cor="border-emerald-200 bg-emerald-50">
                ¿<b>Qué</b> se dice de ella? → Estudia la lengua de signos: <b>predicado</b>.
              </Caja>
            </div>
          ),
        },
        {
          titulo: 'Como en las hojas de la profe',
          texto: (
            <>
              <p>Rodea de azul el sujeto y de verde el predicado.</p>
              <p>A veces el sujeto va al final:</p>
              <p className="text-2xl">
                <Coloreada o={{ sujeto: 'el estuche', predicado: 'estaba roto', detras: true }} />
              </p>
              <p>Y a veces no hay sujeto, porque no se dice de quién:</p>
              <p className="text-2xl">
                <Coloreada o={{ predicado: 'llueve mucho' }} />
              </p>
            </>
          ),
        },
        {
          titulo: 'Uno o varios',
          texto: (
            <>
              <p>El sujeto y el verbo tienen que ir de acuerdo: si el sujeto es uno, el verbo habla de uno; si son varios, de varios.</p>
              <Caja cor="border-emerald-200 bg-emerald-50">
                ✓ El árbol se refleja en el río.
                <br />✓ Los árboles se reflejan en el río.
              </Caja>
              <Caja cor="border-rose-200 bg-rose-50">✗ Los árboles se refleja en el río.</Caja>
              <Caja cor="border-emerald-200 bg-emerald-50">✓ Nico y Laura se levantan al amanecer.</Caja>
            </>
          ),
          visual: dibujo('🌳🌳'),
        },
      ]}
      xogos={[
        { id: 'rodea', titulo: 'Rodea el sujeto', icono: '🔵', explica: 'Toca las palabras del sujeto.', crear: (acabar) => <Rodea acabar={acabar} /> },
        {
          id: 'une',
          titulo: 'Une sujeto y predicado',
          icono: '🔗',
          explica: 'El leñador, el ganadero, la panadera…',
          crear: (acabar) => (
            <Une
              axuda="Toca un sujeto y después su predicado."
              pares={[...OFICIOS, ...azar(CON_SUJETO.filter((o) => !o.detras && !OFICIOS.some((x) => x.sujeto === o.sujeto)), 2)].map((o) => ({ palabra: partes(o).sujeto!, significado: `${o.predicado}.` }))}
              acabar={acabar}
            />
          ),
        },
        { id: 'concuerda', titulo: '¿Uno o varios?', icono: '🌳', explica: 'Elige el sujeto que va con el verbo.', crear: (acabar) => <Practica preguntas={CONCORDANCIA.map(preguntaConcordancia)} acabar={acabar} /> },
        { id: 'practica', titulo: 'Practica', icono: '✏️', explica: 'Sujeto, predicado y oraciones sin sujeto.', crear: (acabar) => <Practica preguntas={SUJETO_PREG} acabar={acabar} /> },
      ]}
      preguntas={SUJETO_PREG}
    />
  )
}

export const PREGUNTAS_IGUALES: Record<string, Pregunta[]> = {
  textos: TEXTOS_PREG,
  antonimos: ANTONIMOS_PREG,
  gsuave: G_PREG,
  oracion: ORACION_PREG,
  sujeto: SUJETO_PREG,
}
