// Física y Química 2.º ESO, global de la 1.ª evaluación: datos de las páginas 38-41, 44, 58-61 y 66-69 del libro.
// Los usan la web (paradas.tsx) y el cuadernillo (apuntes-fuente/fq-global1.gen.mjs). Lo que se puede calcular lo
// calculan src/lib/fisica.ts y src/lib/materia.ts.
import { celsius, charles, gayLussac, boyle, kelvin, type Constante } from '../../lib/fisica'
import type { Componente, Representacion } from '../../lib/materia'

// ——— Leyes de los gases (páginas 38 y 39) ———

/** Las tablas del libro: [x, y] de cada fila. Boyle: [V (L), p (atm)]; Gay-Lussac: [p (atm), T (K)]; Charles: [V (L), T (K)]. */
export const TABLAS_GASES: Record<Constante, [number, number][]> = {
  T: [[30, 0.5], [15, 1], [5, 3], [3, 5]],
  V: [[0.5, 200], [1, 400], [1.5, 600], [2, 800]],
  p: [[2, 100], [4, 200], [6, 300], [8, 400]],
}

/** Ejemplo resuelto 2 (página 39): 3 L, 60 °C y 2 atm → 4 atm con V = cte. → 6 L con p = cte. */
export const EJEMPLO2 = (() => {
  const T1 = kelvin(60)
  const T2 = gayLussac(2, T1, 4, null)
  const T3 = charles(3, T2, 6, null)
  return { T1, T2, T2C: celsius(T2), T3, T3C: celsius(T3) }
})()

/** Actividades 14 y 15 (página 39). */
export const ACT14 = { V1: 3, p1: 4, V2: 6, p2: boyle(4, 3, null, 6) }
export const ACT15 = { V: 10, p1: 4, T1C: 20, T2C: 40, p2: gayLussac(4, kelvin(20), null, kelvin(40)) }

// ——— Cambios de estado (páginas 40, 41 y 44) ———

/** Actividad 26: el alcohol a 1 atm y estas temperaturas. */
export const ACT26 = [0, 77, 78, 79, 100, 50]
/** Actividad 27: qué sustancia de las tablas está en ese estado a esa temperatura. */
export const ACT27: ['sólido' | 'líquido' | 'gas', number][] = [
  ['gas', -100],
  ['sólido', 1300],
  ['líquido', 800],
  ['líquido', -100],
  ['líquido', 90],
  ['líquido', 2860],
]

export const EVAPORACION = [
  'Tiene lugar solo en la superficie del líquido.',
  'Ocurre a cualquier temperatura.',
  'Va más rápida si se da calor, si hay más superficie o si sopla el viento (aleja las partículas de gas).',
]
export const EBULLICION = ['Se produce en toda la masa del líquido.', 'Solo a una temperatura: la de ebullición (el agua, a 100 °C a 1 atm).', 'No depende de que la superficie sea mayor o menor.']

// ——— Cómo se presenta la materia (páginas 58 y 59) ———

export type Aspecto = 'homogéneo' | 'heterogéneo'
export type Composicion = 'sustancia pura' | 'mezcla'

/** Los ejemplos de la página 58 (actividad 1). «Agua con gas» se deja fuera del aspecto: se ven las burbujas, pero es una disolución. */
export const EJEMPLOS_58: { nombre: string; aspecto: Aspecto | null; composicion: Composicion; porque: string }[] = [
  { nombre: 'Azúcar', aspecto: 'homogéneo', composicion: 'sustancia pura', porque: 'Es una sola sustancia (sacarosa).' },
  { nombre: 'Agua con hielo', aspecto: 'heterogéneo', composicion: 'sustancia pura', porque: 'Se ven dos partes, pero el hielo y el agua son la misma sustancia.' },
  { nombre: 'Agua con gas', aspecto: null, composicion: 'mezcla', porque: 'Lleva dióxido de carbono disuelto en agua.' },
  { nombre: 'Leche', aspecto: 'homogéneo', composicion: 'mezcla', porque: 'Parece igual en todas partes, pero al microscopio se ven las gotitas de grasa.' },
  { nombre: 'Agua con sal', aspecto: 'homogéneo', composicion: 'mezcla', porque: 'Es una disolución: no se distingue la sal.' },
  { nombre: 'Miel', aspecto: 'homogéneo', composicion: 'mezcla', porque: 'Lleva azúcares y agua, pero se ve igual en todas partes.' },
  { nombre: 'Macedonia', aspecto: 'heterogéneo', composicion: 'mezcla', porque: 'Se ven los trozos de cada fruta.' },
  { nombre: 'Granito', aspecto: 'heterogéneo', composicion: 'mezcla', porque: 'Se ven sus tres minerales: cuarzo, feldespato y mica.' },
  { nombre: 'Aluminio', aspecto: 'homogéneo', composicion: 'sustancia pura', porque: 'Es un solo elemento: Al.' },
  { nombre: 'Chocolate con almendra', aspecto: 'heterogéneo', composicion: 'mezcla', porque: 'Se ven las almendras.' },
  { nombre: 'Infusión de té', aspecto: 'homogéneo', composicion: 'mezcla', porque: 'Es una disolución de sustancias del té en agua.' },
  { nombre: 'Aceite', aspecto: 'homogéneo', composicion: 'mezcla', porque: 'Está formado por varias sustancias, pero se ve igual en todas partes.' },
  { nombre: 'Caracol', aspecto: 'heterogéneo', composicion: 'mezcla', porque: 'Tiene concha, cuerpo… partes muy distintas.' },
  { nombre: 'Oro', aspecto: 'homogéneo', composicion: 'sustancia pura', porque: 'Es un solo elemento: Au.' },
  { nombre: 'Geranio', aspecto: 'heterogéneo', composicion: 'mezcla', porque: 'Hojas, tallo y flores distintos.' },
]

/** Actividad 2 (sin el yogur ni la leche con cacao, que dependen de cómo estén). */
export const ACT2: [string, Aspecto, string][] = [
  ['Aire', 'homogéneo', 'No se distinguen sus gases.'],
  ['Agua hirviendo', 'heterogéneo', 'Se ven las burbujas de vapor dentro del agua.'],
  ['Humo', 'heterogéneo', 'Se ven las partículas de hollín en el aire.'],
  ['Azúcar', 'homogéneo', 'Todos los granos son iguales.'],
  ['Granizado de limón', 'heterogéneo', 'Se ven los trocitos de hielo en el líquido.'],
  ['Papel escrito', 'heterogéneo', 'Se distingue la tinta del papel.'],
]

/** Actividad 5: agua con cubitos de hielo. */
export const ACT5: [string, boolean, string][] = [
  ['El contenido del vaso es una mezcla heterogénea.', false, 'No es una mezcla: el hielo y el agua son la misma sustancia (aunque se vean dos partes).'],
  ['El contenido del vaso no es una mezcla.', true, 'Es una sustancia pura, el agua, en dos estados.'],
  ['El contenido del vaso es una mezcla homogénea, ya que el hielo y el agua son la misma sustancia.', false, 'Si son la misma sustancia, no es una mezcla.'],
]

// ——— Disoluciones (páginas 60 y 61) ———

/** Actividad 11: [mezcla, soluto, disolvente]. Los estados del soluto y del disolvente. */
export const ACT11: [string, string, string, string, string][] = [
  ['Aire', 'oxígeno y otros gases', 'gas', 'nitrógeno', 'gas'],
  ['Azúcar en agua', 'azúcar', 'sólido', 'agua', 'líquido'],
  ['Acero', 'carbono', 'sólido', 'hierro', 'sólido'],
  ['Agua con gas', 'dióxido de carbono', 'gas', 'agua', 'líquido'],
  ['Manzanilla en agua', 'manzanilla', 'sólido', 'agua', 'líquido'],
]

/** Actividad 10: alcohol yodado = 98 % de alcohol de 70° (70 % alcohol, 30 % agua) + 2 % de yodo. */
export const ALCOHOL_YODADO: [number, Componente[]][] = [
  [98, [{ nombre: 'alcohol', estado: 'líquido', porcentaje: 70 }, { nombre: 'agua', estado: 'líquido', porcentaje: 30 }]],
  [2, [{ nombre: 'yodo', estado: 'sólido', porcentaje: 100 }]],
]

/** Actividad 12: composición del aire seco (porcentajes en volumen, redondeados). */
export const AIRE: Componente[] = [
  { nombre: 'nitrógeno', estado: 'gas', porcentaje: 78 },
  { nombre: 'oxígeno', estado: 'gas', porcentaje: 21 },
  { nombre: 'argón', estado: 'gas', porcentaje: 0.93 },
  { nombre: 'dióxido de carbono', estado: 'gas', porcentaje: 0.04 },
]

/** Actividad 13: las aleaciones. El disolvente es el metal principal. */
export const ALEACIONES: { nombre: string; disolvente: string; solutos: string; uso: string; mejor: string }[] = [
  { nombre: 'Bronce', disolvente: 'cobre', solutos: 'estaño', uso: 'Estatuas, campanas y medallas.', mejor: 'Es más duro y resiste mejor la corrosión que el cobre.' },
  { nombre: 'Latón', disolvente: 'cobre', solutos: 'cinc', uso: 'Grifos, llaves e instrumentos de viento.', mejor: 'Es más duro y fácil de trabajar que el cobre.' },
  { nombre: 'Oro blanco', disolvente: 'oro', solutos: 'otros metales blancos (paladio, plata o níquel)', uso: 'Joyas, como anillos.', mejor: 'Es más duro que el oro puro y tiene color blanco.' },
  { nombre: 'Acero', disolvente: 'hierro', solutos: 'carbono', uso: 'Puentes, edificios, coches.', mejor: 'Es mucho más resistente que el hierro.' },
]

// ——— De qué está formada la materia (páginas 66 y 67) ———

export const MODELOS: { nombre: string; año: number; idea: string }[] = [
  { nombre: 'Bohr', año: 1913, idea: 'Los electrones se organizan en capas o niveles de energía.' },
  { nombre: 'Dalton', año: 1803, idea: 'Los átomos son partículas indivisibles con forma de esfera.' },
  { nombre: 'Rutherford', año: 1909, idea: 'Protones en el núcleo y electrones girando alrededor.' },
  { nombre: 'Thomson', año: 1904, idea: 'Esfera de carga positiva con partículas de carga negativa (electrones).' },
]

export const PARTICULAS: [string, string][] = [
  ['Protón', 'Partícula con carga positiva; está en el núcleo.'],
  ['Neutrón', 'Partícula sin carga; está en el núcleo.'],
  ['Electrón', 'Partícula con carga negativa; gira alrededor del núcleo.'],
]

/** Átomos de la página 66: [elemento, protones, neutrones, electrones] contados en el dibujo. */
export const ATOMOS_DIBUJO: [string, number, number, number][] = [
  ['H', 1, 0, 1],
  ['O', 8, 8, 8],
]

/** Ejemplos de la página 66: fórmula, nombre y cómo se agrupan sus átomos. */
export const SUSTANCIAS_66: { formula: string; nombre: string; agrupacion: 'átomos aislados' | 'moléculas' | 'cristal' }[] = [
  { formula: 'He', nombre: 'helio', agrupacion: 'átomos aislados' },
  { formula: 'Ne', nombre: 'neón', agrupacion: 'átomos aislados' },
  { formula: 'H2', nombre: 'hidrógeno', agrupacion: 'moléculas' },
  { formula: 'O2', nombre: 'oxígeno', agrupacion: 'moléculas' },
  { formula: 'O3', nombre: 'ozono', agrupacion: 'moléculas' },
  { formula: 'H2O', nombre: 'agua', agrupacion: 'moléculas' },
  { formula: 'C2H6O', nombre: 'alcohol etílico', agrupacion: 'moléculas' },
  { formula: 'CO2', nombre: 'dióxido de carbono', agrupacion: 'moléculas' },
  { formula: 'NCl3', nombre: 'tricloruro de nitrógeno', agrupacion: 'moléculas' },
  { formula: 'C', nombre: 'diamante', agrupacion: 'cristal' },
  { formula: 'NaCl', nombre: 'cloruro de sodio (sal de mesa)', agrupacion: 'cristal' },
  { formula: 'Au', nombre: 'oro', agrupacion: 'cristal' },
  { formula: 'Fe', nombre: 'hierro', agrupacion: 'cristal' },
]

/** Ejemplo resuelto 1 y actividad 17 (página 67): los dibujos de bolitas. */
export const DIBUJOS_67: Record<string, Representacion> = {
  'ejemplo a': { agrupacion: 'moléculas', formulas: ['O2'] },
  'ejemplo b': { agrupacion: 'moléculas', formulas: ['NCl3'] },
  'ejemplo c': { agrupacion: 'moléculas', formulas: ['O2', 'NCl3'] },
  A: { agrupacion: 'cristal', formulas: ['FeO'] },
  B: { agrupacion: 'moléculas', formulas: ['CO2'] },
  C: { agrupacion: 'cristal', formulas: ['C'] },
  D: { agrupacion: 'moléculas', formulas: ['O2'] },
  'H₂ y O₂': { agrupacion: 'moléculas', formulas: ['H2', 'O2'] },
  agua: { agrupacion: 'moléculas', formulas: ['H2O'] },
}

/** Actividad 17: qué dibujo corresponde a cada descripción (la clave la saca el código de DIBUJOS_67). */
export const ACT17: [string, (r: Representacion, clase: string) => boolean][] = [
  ['Un cristal que es una sustancia simple', (r, c) => r.formulas.length === 1 && r.agrupacion === 'cristal' && c === 'sustancia simple'],
  ['Un compuesto formado por moléculas', (r, c) => r.formulas.length === 1 && r.agrupacion === 'moléculas' && c === 'compuesto'],
  ['Una sustancia simple formada por moléculas', (r, c) => r.formulas.length === 1 && r.agrupacion === 'moléculas' && c === 'sustancia simple'],
  ['Un cristal que es un compuesto', (r, c) => r.formulas.length === 1 && r.agrupacion === 'cristal' && c === 'compuesto'],
]

// ——— Tabla periódica (páginas 68 y 69, lo subrayado) ———

export const TABLA_IDEAS: [string, string][] = [
  ['118 elementos', 'En la actualidad se conocen 118 elementos químicos. Están ordenados en la tabla periódica.'],
  ['Periodos y grupos', 'Los elementos están dispuestos en siete filas, llamadas periodos, y dieciocho columnas, llamadas grupos.'],
  ['Número atómico', 'Están ordenados por orden creciente de su número atómico, que indica el número de protones de los átomos de cada elemento. El hidrógeno (H) tiene 1 protón; el oganesón (Og), 118.'],
  ['Elemento químico', 'Los átomos que tienen el mismo número de protones pertenecen al mismo elemento químico.'],
  ['Mismo grupo', 'Los elementos de un mismo grupo tienen propiedades semejantes (y el mismo número de electrones en la última capa). El lugar que ocupa un elemento nos permite conocer sus propiedades.'],
  ['Gases nobles', 'Todos están en el grupo 18. Se llaman así porque son muy estables y casi nunca se combinan con otros, como la nobleza, que no se mezclaba con otras clases sociales.'],
]

export const SIMBOLOS_REGLAS: [string, string][] = [
  ['Una o dos letras', 'Cada elemento se representa con un símbolo de una o dos letras.'],
  ['Mayúscula', 'La primera letra es la inicial de su nombre y va siempre en mayúscula: H es el hidrógeno; Li, el litio.'],
  ['Griego o latín', 'Algunos elementos conocidos desde la Antigüedad usan su nombre en griego o en latín: Hg es el mercurio, de hydrargyrum, «agua de plata».'],
  ['Segunda letra en minúscula', 'Si varios elementos tienen la misma inicial, se añade una segunda letra en minúscula: He es el helio, para distinguirlo del H.'],
]
