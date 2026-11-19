// Matemáticas de 3.º (Olivia), las restas: con llevadas, la prueba de la resta y problemas de dos pasos. Todos los
// resultados, los pasos y las opciones falsas salen de src/lib/restas.ts.
import type { ReactNode } from 'react'
import { Clasifica, Proba, VerdadeiroFalso, barallar, type Pregunta } from '../../pezas'
import { elixe } from '../../paisaxes/preguntas'
import { Parada } from '../../../historia/parcial1/roma'
import { EjemploResuelto, ResuelveConmigo, type PasoGuiado, type ProblemaGuiado } from '../../../tecnologia/electricidad/Resuelve'
import { NOMBRE_COLUMNA, conPunto, escribeOp, llevadas, opcionesFalsas, opcionesFalsasOp, pruebaResta, resolver } from '../../../lib/restas'
import { Cuenta, MiraComo, RestaGuiada, RestaYPrueba } from './Cuenta'
import { COMPRUEBA_HOJA, COMPRUEBA_MAS, PROBLEMAS, RESTAS_CUATRO, RESTAS_ENTERAS, RESTAS_HOJA, RESTAS_TRES, SUMA_O_RESTA, type Problema } from './datos'

type PropsParada = { ruta: string; modo?: string }
const U = 'restas'
const Practica = ({ preguntas, acabar }: { preguntas: Pregunta[]; acabar: () => void }) => <Proba practica cantas={8} preguntas={preguntas} acabar={acabar} />
const azar = <T,>(xs: readonly T[], n: number) => barallar(xs).slice(0, n)
const Nota = ({ children }: { children: ReactNode }) => <p className="rounded-2xl bg-amber-50 p-3 font-bold text-amber-900">{children}</p>
const Caja = ({ children }: { children: ReactNode }) => <div className="rounded-2xl border-2 border-violet-100 bg-white p-3">{children}</div>

// ===================================================================================================
// 1. Restar con llevadas
// ===================================================================================================

const preguntaResta = ([a, b]: [number, number]): Pregunta =>
  elixe(
    <>¿Cuánto es {a} − {b}?</>,
    String(a - b),
    opcionesFalsas(a, b).map(String),
    <>
      <Cuenta a={a} b={b} pequena />
      <span className="mt-1 block">
        {a} − {b} = {a - b}. Me llevo una {llevadas(a, b) === 1 ? 'vez' : `${llevadas(a, b)} veces`}.
      </span>
    </>,
    <Cuenta a={a} b={b} hasta={0} pequena />,
  )

/** Opciones falsas de una resta de miles, centenas o decenas enteras: equivocarse de columna. */
function falsasEnteras(a: number, b: number): string[] {
  const out: number[] = []
  for (const c of [a - b / 10, a - b * 10, a - b + 100, a - b + 10, a + b]) if (Number.isInteger(c) && c >= 0 && c !== a - b && !out.includes(c)) out.push(c)
  return out.slice(0, 3).map(conPunto)
}

const preguntaEntera = ([a, b]: [number, number]): Pregunta =>
  elixe(
    <>
      ¿Cuánto es {conPunto(a)} − {conPunto(b)}?
    </>,
    conPunto(a - b),
    falsasEnteras(a, b),
    <>
      {conPunto(b)} son {String(b)[0]} {NOMBRE_COLUMNA[String(b).length - 1]}: solo cambia esa columna. {conPunto(a)} − {conPunto(b)} = {conPunto(a - b)}.
    </>,
  )

const preguntaLlevadas = ([a, b]: [number, number]): Pregunta => {
  const n = llevadas(a, b)
  return elixe(
    <>
      ¿Cuántas veces me llevo una en {a} − {b}?
    </>,
    String(n),
    ['0', '1', '2', '3', '4'].filter((x) => x !== String(n) && Number(x) <= String(a).length).slice(0, 3),
    <>
      <Cuenta a={a} b={b} pequena />
      <span className="mt-1 block">Cada 1 pequeño de color es una vez que me llevo una.</span>
    </>,
    <Cuenta a={a} b={b} hasta={0} pequena />,
  )
}

export const PREGUNTAS_LLEVADAS: Pregunta[] = [
  ...RESTAS_HOJA.map(preguntaResta),
  ...RESTAS_TRES.map(preguntaResta),
  ...RESTAS_CUATRO.map(preguntaResta),
  ...RESTAS_ENTERAS.map(preguntaEntera),
  ...RESTAS_TRES.slice(0, 8).map(preguntaLlevadas),
]

export function Llevadas(p: PropsParada) {
  return (
    <Parada
      {...p}
      unidade={U}
      id="llevadas"
      titulo="Restar con llevadas"
      tarxetas={[
        {
          titulo: 'Restar en columna',
          texto: (
            <>
              <p>
                Se escribe el número grande <b>arriba</b> y el que quitamos <b>abajo</b>, cada cifra en su columna: unidades debajo de unidades, decenas debajo de decenas…
              </p>
              <p>
                Se empieza siempre por la <b>derecha</b>, por las unidades.
              </p>
              <Nota>Arriba, el número más grande. Las cifras, bien colocadas por la derecha.</Nota>
            </>
          ),
          visual: <Cuenta a={396} b={248} hasta={0} etiquetas />,
        },
        {
          titulo: '¿Y si arriba hay menos?',
          texto: (
            <>
              <p>
                En 396 − 248, en las unidades hay <b>6</b> y tengo que quitar <b>8</b>. ¡No se puede!
              </p>
              <p>
                Pongo un <b className="text-rose-600">1</b> delante del 6: ahora es <b>16</b>. 16 − 8 = <b>8</b>.
              </p>
              <p>
                Y <b className="text-rose-600">me llevo una</b>: escribo un 1 pequeño junto al 4 de abajo, en las decenas. Ahora quito 4 + 1 = 5.
              </p>
            </>
          ),
          visual: <Cuenta a={396} b={248} hasta={1} marcas={1} actual={1} etiquetas />,
        },
        {
          titulo: 'Mira cómo se hace',
          texto: <p>Toca el botón para hacer la resta columna a columna. Fíjate en los 1 pequeños: el de arriba suma 10 y el de abajo es «la que me llevo».</p>,
          visual: <MiraComo a={63214} b={15228} />,
        },
        {
          titulo: 'Con ceros arriba',
          texto: (
            <>
              <p>Si arriba hay un 0 y abajo algo que quitar, también pongo un 1 delante: el 0 se convierte en 10.</p>
              <p>En 95002 − 14568 me llevo una tres veces seguidas.</p>
            </>
          ),
          visual: <MiraComo a={95002} b={14568} />,
        },
        {
          titulo: 'Números de distinto tamaño',
          texto: (
            <>
              <p>
                En 13025 − 8796, el 8796 tiene una cifra menos. Se coloca <b>por la derecha</b>: el 6 debajo del 5.
              </p>
              <p>Donde abajo no hay cifra, solo se quita la que me llevo, si la hay.</p>
              <Nota>Si el resultado empieza por 0, ese 0 no se escribe: 53085 − 46387 = 6698.</Nota>
            </>
          ),
          visual: <MiraComo a={13025} b={8796} />,
        },
        {
          titulo: 'Restar miles enteros',
          texto: (
            <>
              <p>
                <b>7.352 − 7.000</b>: el 7.000 solo tiene 7 unidades de millar. Quito los miles y lo demás se queda igual: <b>352</b>.
              </p>
              <p>
                <b>9.615 − 600</b>: quito 6 centenas a las 6 centenas: <b>9.015</b>.
              </p>
              <Nota>Con miles, centenas o decenas enteras no hace falta la cuenta: se hace de cabeza.</Nota>
            </>
          ),
        },
      ]}
      xogos={[
        { id: 'conmigo', titulo: 'Resta conmigo', icono: '✏️', explica: 'Restas de tres cifras, columna a columna.', crear: (acabar) => <RestaGuiada restas={azar(RESTAS_TRES, 4)} acabar={acabar} /> },
        { id: 'grandes', titulo: 'Restas grandes', icono: '🏔️', explica: 'Las restas de cinco cifras de la hoja.', crear: (acabar) => <RestaGuiada restas={azar(RESTAS_HOJA, 3)} acabar={acabar} /> },
        { id: 'practica', titulo: 'Practica', icono: '🎯', explica: 'Elige el resultado bueno.', crear: (acabar) => <Practica preguntas={PREGUNTAS_LLEVADAS} acabar={acabar} /> },
      ]}
      preguntas={PREGUNTAS_LLEVADAS}
    />
  )
}

// ===================================================================================================
// 2. La prueba de la resta
// ===================================================================================================

const COMPRUEBA = [...COMPRUEBA_HOJA, ...COMPRUEBA_MAS]

const explicaPrueba = (a: number, b: number, r: number) =>
  pruebaResta(a, b, r) ? (
    <>
      {conPunto(r)} + {conPunto(b)} = {conPunto(a)}, que es el número de arriba. ¡Está bien!
    </>
  ) : (
    <>
      {conPunto(r)} + {conPunto(b)} = {conPunto(r + b)}, pero arriba hay {conPunto(a)}. Está mal: lo bueno es {conPunto(a)} − {conPunto(b)} = {conPunto(a - b)}.
    </>
  )

const SI = 'Sí, está bien'
const NO = 'No, está mal'

export const PREGUNTAS_PRUEBA: Pregunta[] = [
  ...COMPRUEBA.map(([a, b, r]) =>
    elixe(
      <>
        ¿Está bien hecha esta resta? {conPunto(a)} − {conPunto(b)} = {conPunto(r)}
      </>,
      pruebaResta(a, b, r) ? SI : NO,
      [pruebaResta(a, b, r) ? NO : SI],
      explicaPrueba(a, b, r),
      <Cuenta a={a} b={b} resultado={r} pequena />,
    ),
  ),
  ...COMPRUEBA_HOJA.map(([a, b, r]) =>
    elixe(
      <>
        Para comprobar {a} − {b} = {r}, ¿qué suma haces?
      </>,
      `${r} + ${b}`,
      [`${a} + ${b}`, `${a} + ${r}`],
      <>Se suma el resultado y el número de abajo: {r} + {b}. Tiene que dar el de arriba, {a}.</>,
    ),
  ),
  ...COMPRUEBA.filter(([a, b, r]) => !pruebaResta(a, b, r)).map(([a, b, r]) =>
    elixe(
      <>
        {conPunto(a)} − {conPunto(b)} = {conPunto(r)} está mal. ¿Cuál es el resultado bueno?
      </>,
      conPunto(a - b),
      opcionesFalsas(a, b)
        .filter((x) => x !== r)
        .slice(0, 2)
        .map(conPunto),
      <>
        {conPunto(a)} − {conPunto(b)} = {conPunto(a - b)}. Prueba: {conPunto(a - b)} + {conPunto(b)} = {conPunto(a)}.
      </>,
      <Cuenta a={a} b={b} hasta={0} pequena />,
    ),
  ),
]

/** Comprobar una resta paso a paso: qué suma, cuánto da y si está bien. */
function compruebaGuiada([a, b, r]: [number, number, number]): ProblemaGuiado {
  const bien = pruebaResta(a, b, r)
  const pasos: PasoGuiado[] = [
    {
      tipo: 'elige',
      titulo: 'Qué suma hago',
      pregunta: '¿Qué dos números sumo?',
      correcta: `${conPunto(r)} + ${conPunto(b)}`,
      otras: [`${conPunto(a)} + ${conPunto(b)}`, `${conPunto(a)} + ${conPunto(r)}`],
      luego: (
        <>
          El resultado más el número de abajo: {conPunto(r)} + {conPunto(b)}.
        </>
      ),
    },
    {
      tipo: 'elige',
      titulo: 'La suma',
      pregunta: (
        <>
          ¿Cuánto es {conPunto(r)} + {conPunto(b)}?
        </>
      ),
      correcta: conPunto(r + b),
      otras: opcionesFalsasOp(r, '+', b, 2).map(conPunto),
      visual: <Cuenta a={r} b={b} op="+" hasta={0} pequena />,
      luego: <Cuenta a={r} b={b} op="+" pequena />,
    },
    {
      tipo: 'elige',
      titulo: '¿Está bien?',
      pregunta: (
        <>
          Da {conPunto(r + b)} y arriba hay {conPunto(a)}. ¿Está bien la resta?
        </>
      ),
      correcta: bien ? SI : NO,
      otras: [bien ? NO : SI],
      luego: bien ? <>Da el número de arriba: ¡la resta está bien! ✓</> : <>No da el número de arriba: la resta está mal. ✗</>,
    },
  ]
  if (!bien)
    pasos.push({
      tipo: 'elige',
      titulo: 'La resta bien hecha',
      pregunta: (
        <>
          ¿Cuánto es de verdad {conPunto(a)} − {conPunto(b)}?
        </>
      ),
      correcta: conPunto(a - b),
      otras: opcionesFalsas(a, b)
        .filter((x) => x !== r)
        .slice(0, 2)
        .map(conPunto),
      visual: <Cuenta a={a} b={b} hasta={0} pequena />,
      luego: <Cuenta a={a} b={b} pequena />,
    })
  return {
    enunciado: (
      <>
        Comprueba si está bien: {conPunto(a)} − {conPunto(b)} = {conPunto(r)}
      </>
    ),
    visual: <Cuenta a={a} b={b} resultado={r} pequena />,
    pasos,
  }
}

const DETECTIVE = COMPRUEBA.map(([a, b, r]) => ({
  texto: `${conPunto(a)} − ${conPunto(b)} = ${conPunto(r)}`,
  certa: pruebaResta(a, b, r),
  explica: pruebaResta(a, b, r) ? `${conPunto(r)} + ${conPunto(b)} = ${conPunto(a)}. ¡Bien hecha!` : `${conPunto(r)} + ${conPunto(b)} = ${conPunto(r + b)}, no ${conPunto(a)}. Lo bueno es ${conPunto(a - b)}.`,
}))

export function PruebaResta(p: PropsParada) {
  return (
    <Parada
      {...p}
      unidade={U}
      id="prueba"
      titulo="La prueba de la resta"
      tarxetas={[
        {
          titulo: 'La suma deshace la resta',
          texto: (
            <>
              <p>Si a 396 le quito 248, me quedan 148.</p>
              <p>Si a esos 148 les vuelvo a poner los 248, ¡vuelvo a tener 396!</p>
              <Nota>Resultado + número de abajo = número de arriba.</Nota>
            </>
          ),
          visual: <RestaYPrueba a={396} b={248} r={148} />,
        },
        {
          titulo: 'Cómo se comprueba',
          texto: (
            <ol className="list-decimal space-y-1.5 pl-6">
              <li>Sumo el resultado y el número de abajo.</li>
              <li>
                Si da el número de arriba: la resta está <b className="text-emerald-700">bien ✓</b>.
              </li>
              <li>
                Si da otro número: está <b className="text-rose-700">mal ✗</b>. Hay que repetirla.
              </li>
            </ol>
          ),
          visual: <RestaYPrueba a={851} b={428} r={423} />,
        },
        {
          titulo: 'Una resta mal hecha',
          texto: (
            <>
              <p>550 − 125 = 325. ¿Está bien?</p>
              <p>
                325 + 125 = <b>450</b>. ¡Pero arriba hay <b>550</b>! Está mal.
              </p>
              <p>
                La buena: 550 − 125 = <b>425</b>. Prueba: 425 + 125 = 550 ✓
              </p>
            </>
          ),
          visual: <RestaYPrueba a={550} b={125} r={325} />,
        },
      ]}
      xogos={[
        { id: 'conmigo', titulo: 'Comprueba conmigo', icono: '🔍', explica: 'Comprueba restas paso a paso.', crear: (acabar) => <ResuelveConmigo problemas={azar(COMPRUEBA, 4).map(compruebaGuiada)} acabar={acabar} fin="Así se comprueba una resta." todos="¡Muy bien! Ya sabes comprobar restas." /> },
        { id: 'detective', titulo: 'Detective de restas', icono: '🕵️', explica: '¿Bien hecha o mal hecha?', crear: (acabar) => <VerdadeiroFalso frases={azar(DETECTIVE, 8)} acabar={acabar} /> },
        { id: 'practica', titulo: 'Practica', icono: '🎯', explica: 'Preguntas como las de la prueba.', crear: (acabar) => <Practica preguntas={PREGUNTAS_PRUEBA} acabar={acabar} /> },
      ]}
      preguntas={PREGUNTAS_PRUEBA}
    />
  )
}

// ===================================================================================================
// 3. Problemas de dos pasos
// ===================================================================================================

const voltea = (op: '+' | '−') => (op === '+' ? '−' : '+')

/** Cuentas parecidas pero equivocadas para el paso `j`. */
function cuentasFalsas(pr: Problema, j: number): string[] {
  const res = resolver(pr.ops)
  const x = res[j]
  const out = [`${conPunto(x.a)} ${voltea(x.op)} ${conPunto(x.b)}`]
  const otro = pr.ops[j + 1] ?? pr.ops[j - 1]
  if (otro && typeof otro.b === 'number') out.push(`${conPunto(j === 0 ? x.a : res[0].a)} ${otro.op === x.op ? voltea(x.op) : x.op} ${conPunto(otro.b)}`)
  if (j > 0 && typeof pr.ops[0].a === 'number') out.push(`${conPunto(res[0].a)} ${x.op} ${conPunto(x.b)}`)
  const bien = escribeOp(x)
  return [...new Set(out)].filter((o) => o !== bien).slice(0, 2)
}

const final = (pr: Problema) => {
  const res = resolver(pr.ops)
  return res[res.length - 1].r
}
const conUnidad = (n: number, u: string) => `${conPunto(n)} ${u}`

function solucionesFalsas(pr: Problema): string[] {
  const res = resolver(pr.ops)
  const ult = res[res.length - 1]
  const cand = [res[0].r, ult.op === '−' ? ult.a + ult.b : ult.a - ult.b, ...opcionesFalsasOp(ult.a, ult.op, ult.b)]
  const out: number[] = []
  for (const c of cand) if (c >= 0 && c !== ult.r && !out.includes(c)) out.push(c)
  return out.slice(0, 3).map((n) => conUnidad(n, pr.unidad))
}

const fraseSolucion = (pr: Problema) => pr.solucion.replace('#', conPunto(final(pr)))

export function problemaGuiado(pr: Problema): ProblemaGuiado {
  const res = resolver(pr.ops)
  const pasos: PasoGuiado[] = res.flatMap((x, j): PasoGuiado[] => [
    {
      tipo: 'elige',
      titulo: `Cuenta ${j + 1}`,
      pregunta:
        j === 0 ? (
          '¿Qué cuenta hago primero?'
        ) : (
          <>
            Ya sé que hay {conUnidad(res[j - 1].r, pr.unidad)} ({pr.queda[j - 1]}). ¿Qué cuenta hago ahora?
          </>
        ),
      correcta: escribeOp(x),
      otras: cuentasFalsas(pr, j),
      luego: (
        <>
          {escribeOp(x)}: {x.op === '−' ? 'se resta' : 'se suma'}.
        </>
      ),
    },
    {
      tipo: 'elige',
      titulo: `Resultado ${j + 1}`,
      pregunta: <>¿Cuánto es {escribeOp(x)}?</>,
      correcta: conPunto(x.r),
      otras: opcionesFalsasOp(x.a, x.op, x.b).map(conPunto),
      visual: <Cuenta a={x.a} b={x.b} op={x.op} hasta={0} pequena />,
      luego: (
        <>
          {escribeOp(x)} = <b>{conPunto(x.r)}</b>: {pr.queda[j]}.
        </>
      ),
    },
  ])
  pasos.push({ tipo: 'info', titulo: 'Solución', contenido: <b>{fraseSolucion(pr)}</b> })
  return { enunciado: pr.enunciado, pasos }
}

export const PREGUNTAS_PROBLEMAS: Pregunta[] = PROBLEMAS.flatMap((pr) => {
  const res = resolver(pr.ops)
  return [
    elixe(<>{pr.enunciado} ¿Qué cuenta hay que hacer primero?</>, escribeOp(res[0]), cuentasFalsas(pr, 0), <>Primero, {escribeOp(res[0])} = {conPunto(res[0].r)}: {pr.queda[0]}.</>),
    elixe(
      <>
        {pr.enunciado}
      </>,
      conUnidad(final(pr), pr.unidad),
      solucionesFalsas(pr),
      <>
        {res.map((x) => `${escribeOp(x)} = ${conPunto(x.r)}`).join('; ')}. {fraseSolucion(pr)}
      </>,
    ),
  ]
})

export function Problemas(p: PropsParada) {
  const quiosco = problemaGuiado(PROBLEMAS[0])
  return (
    <Parada
      {...p}
      unidade={U}
      id="problemas"
      titulo="Problemas de dos pasos"
      tarxetas={[
        {
          titulo: 'Cómo se resuelve un problema',
          texto: (
            <ol className="list-decimal space-y-1.5 pl-6">
              <li>
                <b>Leo</b> el problema despacio, dos veces.
              </li>
              <li>
                Busco los <b>datos</b> (los números) y la <b>pregunta</b>.
              </li>
              <li>
                Pienso las <b>cuentas</b>: ¿qué pasa primero? ¿Y después?
              </li>
              <li>Hago las cuentas bien colocadas.</li>
              <li>
                Escribo la <b>solución</b> con su palabra: «Han quedado 46 periódicos».
              </li>
            </ol>
          ),
        },
        {
          titulo: '¿Sumo o resto?',
          texto: (
            <>
              <p>
                <b className="text-rose-700">Resto</b> cuando hay <b>menos</b>: vender, bajar, romperse, gastar, regalar, perder, cortar…
              </p>
              <p>
                <b className="text-emerald-700">Sumo</b> cuando hay <b>más</b>: subir, cobrar, ganar, recibir, plantar, juntar…
              </p>
              <Nota>¡Ojo con «comprar»! Si Paula compra vasos, tiene más vasos (sumo). Si Miguel compra un ordenador, tiene menos dinero (resto).</Nota>
            </>
          ),
        },
        {
          titulo: 'Un problema resuelto',
          texto: <p>Toca los botones para ver cómo se resuelve el problema del quiosco, paso a paso.</p>,
          visual: <EjemploResuelto problema={quiosco} />,
          ancho: true,
        },
        {
          titulo: 'Las cifras bien colocadas',
          texto: (
            <>
              <p>
                En el problema de Miguel hay que sumar <b>1.687 + 2.725</b>. Unidades debajo de unidades, decenas debajo de decenas… Si una cifra se mueve de sitio, la cuenta sale mal.
              </p>
              <p>
                Luego se resta el ordenador: 4.412 − 975 = <b>3.437 €</b>.
              </p>
            </>
          ),
          visual: (
            <Caja>
              <div className="flex flex-wrap items-center justify-center gap-6">
                <Cuenta a={1687} b={2725} op="+" pequena etiquetas />
                <Cuenta a={4412} b={975} pequena etiquetas />
              </div>
            </Caja>
          ),
        },
      ]}
      xogos={[
        { id: 'conmigo', titulo: 'Resuelve conmigo', icono: '🧩', explica: 'Problemas paso a paso.', crear: (acabar) => <ResuelveConmigo problemas={azar(PROBLEMAS, 3).map(problemaGuiado)} acabar={acabar} fin="No olvides escribir la solución con su palabra." todos="¡Muy bien! Has resuelto todos los problemas paso a paso." /> },
        {
          id: 'sumaoresta',
          titulo: '¿Suma o resta?',
          icono: '➕',
          explica: '¿Hay más o hay menos?',
          crear: (acabar) => (
            <Clasifica
              caixas={[
                { id: 'sumar', nome: '➕ Sumo (hay más)', cor: 'border-emerald-300 bg-emerald-50 text-emerald-900' },
                { id: 'restar', nome: '➖ Resto (hay menos)', cor: 'border-rose-300 bg-rose-50 text-rose-900' },
              ]}
              elementos={azar(SUMA_O_RESTA, 8)}
              acabar={acabar}
            />
          ),
        },
        { id: 'practica', titulo: 'Practica', icono: '🎯', explica: 'Preguntas como las de la prueba.', crear: (acabar) => <Practica preguntas={PREGUNTAS_PROBLEMAS} acabar={acabar} /> },
      ]}
      preguntas={PREGUNTAS_PROBLEMAS}
    />
  )
}
