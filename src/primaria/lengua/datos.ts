// Lengua Castellana de 3.º (Olivia), unidad 2 «¿Somos iguales?»: las palabras y oraciones del libro (páginas 24 a
// 39), de las fichas de la libreta y de las hojas de la profesora.
import type { Oracion } from '../../lib/oracion'

// ——— Antónimos (páginas 25, 29 y 38) ———

/** Parejas de antónimos: las del libro y otras de los textos de la unidad. */
export const ANTONIMOS: [string, string][] = [
  ['viejo', 'nuevo'],
  ['contenta', 'triste'],
  ['verdadero', 'falso'],
  ['cobarde', 'valiente'],
  ['oscuro', 'claro'],
  ['frío', 'caliente'],
  ['moderna', 'antigua'],
  ['bonita', 'fea'],
  ['pequeña', 'grande'],
  ['rápida', 'lenta'],
  ['igual', 'diferente'],
  ['inútil', 'útil'],
  ['lejano', 'cercano'],
  ['lleno', 'vacío'],
  ['tranquilo', 'nervioso'],
  ['despacio', 'deprisa'],
  ['alto', 'bajo'],
  ['abrir', 'cerrar'],
  ['entrar', 'salir'],
  ['amanecer', 'atardecer'],
]

/** Palabras que significan lo mismo (sinónimos): sirven de trampa, porque no son antónimos. */
export const SINONIMOS: [string, string][] = [
  ['ayudar', 'apoyar'],
  ['contenta', 'alegre'],
  ['alba', 'amanecer'],
  ['vasija', 'cántaro'],
  ['bonita', 'preciosa'],
  ['pequeña', 'chiquita'],
]

// ——— El sonido G suave (páginas 30, 31 y 38, y la ficha de la libreta) ———

/** Palabras con sonido G suave y su dibujo cuando hay uno claro. */
export const PALABRAS_G: { palabra: string; dibujo?: string }[] = [
  { palabra: 'amiga' },
  { palabra: 'gota', dibujo: '💧' },
  { palabra: 'gustar' },
  { palabra: 'juguete', dibujo: '🧸' },
  { palabra: 'manguitos' },
  { palabra: 'vergüenza', dibujo: '😳' },
  { palabra: 'agüita' },
  { palabra: 'guantes', dibujo: '🧤' },
  { palabra: 'pingüino', dibujo: '🐧' },
  { palabra: 'bigote' },
  { palabra: 'agua' },
  { palabra: 'bilingüe' },
  { palabra: 'águila', dibujo: '🦅' },
  { palabra: 'espaguetis', dibujo: '🍝' },
  { palabra: 'nicaragüense' },
  { palabra: 'droguería' },
  { palabra: 'regadera' },
  { palabra: 'piragüista', dibujo: '🛶' },
  { palabra: 'guiño', dibujo: '😉' },
  { palabra: 'guepardo', dibujo: '🐆' },
  { palabra: 'aguijón', dibujo: '🐝' },
  { palabra: 'guitarra', dibujo: '🎸' },
  { palabra: 'hormiguero', dibujo: '🐜' },
  { palabra: 'paragüero', dibujo: '☂️' },
  { palabra: 'cigüeña' },
  { palabra: 'antiguo' },
  { palabra: 'murciélago', dibujo: '🦇' },
  { palabra: 'hoguera', dibujo: '🔥' },
  { palabra: 'seguidor' },
  { palabra: 'piragüismo' },
  { palabra: 'carguero', dibujo: '🚢' },
  { palabra: 'lago' },
  { palabra: 'agujero' },
  { palabra: 'guinda', dibujo: '🍒' },
  { palabra: 'reguero' },
  { palabra: 'lengüeta' },
  { palabra: 'desagüe' },
  { palabra: 'pliegue' },
  { palabra: 'ungüento' },
  { palabra: 'guiñol', dibujo: '🎭' },
  { palabra: 'abrigo', dibujo: '🧥' },
  { palabra: 'merengue' },
  { palabra: 'anguila' },
  { palabra: 'paraguas', dibujo: '☂️' },
  { palabra: 'gorra', dibujo: '🧢' },
  { palabra: 'albergue' },
  { palabra: 'laguna' },
  { palabra: 'lingotes' },
  { palabra: 'ciego' },
  { palabra: 'gusano', dibujo: '🐛' },
  { palabra: 'gato', dibujo: '🐱' },
]

/** La g delante de e, i suena como la j: no es G suave. */
export const PALABRAS_G_FUERTE = ['gemas', 'genio', 'gimnasia', 'girasol', 'gente', 'página']

/** Para escribir el nombre de lo que se ve (ficha de la libreta, ejercicio 3). */
export const ESCRIBE_G = ['paraguas', 'gorra', 'guitarra', 'pingüino', 'guantes', 'águila', 'hoguera', 'abrigo', 'gusano']

/** Repaso de c y qu (página 36): «Mi tío Enrique tiene un caniche. Es un poco inquieto, pero muy cariñoso. Se llama Coco.» */
export const PALABRAS_K = ['Enrique', 'caniche', 'poco', 'inquieto', 'cariñoso', 'Coco', 'queso', 'casa', 'esquina', 'cuento', 'pequeño', 'barco']

// ——— La oración y el sujeto (páginas 32, 33 y 38, fichas de la libreta y hojas de la profesora) ———

export const ORACIONES: Oracion[] = [
  { sujeto: 'Miguel', predicado: 'tiene un perro guía' },
  { sujeto: 'mi amiga Gabriela', predicado: 'estudia la lengua de signos' },
  { sujeto: 'mis vecinos', predicado: 'tienen varios animales', plural: true },
  { sujeto: 'Paula', predicado: 'pasará lista' },
  { sujeto: 'Alejandra', predicado: 'limpiará la pizarra' },
  { sujeto: 'Álvaro', predicado: 'ayudará a formar las filas' },
  { sujeto: 'Marina', predicado: 'repartirá el material escolar' },
  { sujeto: 'Feroz', predicado: 'vivía en un lejano bosque' },
  { sujeto: 'los animales del bosque', predicado: 'le tenían miedo', plural: true },
  { sujeto: 'el lobito', predicado: 'se sentía muy solo' },
  { sujeto: 'el pobre Feroz', predicado: 'no tenía amigos' },
  { sujeto: 'mi amigo', predicado: 'vive muy lejos' },
  { sujeto: 'el perro', predicado: 'ladra mucho' },
  { sujeto: 'el parque', predicado: 'está cerca' },
  { sujeto: 'los jardines', predicado: 'están preciosos', plural: true },
  { sujeto: 'el perro de Marta', predicado: 'es muy obediente' },
  { sujeto: 'mis padres', predicado: 'me ayudan con los deberes', plural: true },
  { sujeto: 'Andrés', predicado: 'tiene un gran corazón' },
  { sujeto: 'mi prima Eva', predicado: 'va al colegio en bici' },
  { sujeto: 'la plaza', predicado: 'está en el casco antiguo' },
  { sujeto: 'el leñador', predicado: 'corta madera con su hacha' },
  { sujeto: 'el ganadero', predicado: 'ordeña una de sus vacas' },
  { sujeto: 'la panadera', predicado: 'amasa el pan' },
  { sujeto: 'el hacha', predicado: 'está bien afilada' },
  { sujeto: 'esta hogaza de pan', predicado: 'es muy tierna' },
  { sujeto: 'la peluquera', predicado: 'hace un nuevo peinado' },
  { sujeto: 'el cocinero', predicado: 'cocina el pollo' },
  { sujeto: 'el paisaje', predicado: 'es bonito' },
  { sujeto: 'el pollito', predicado: 'salió del cascarón' },
  { sujeto: 'Nerea y Damián', predicado: 'hacen un puzle juntos', plural: true },
  { sujeto: 'el gato', predicado: 'tenía unos largos bigotes' },
  { sujeto: 'esta caja', predicado: 'contiene una sorpresa' },
  { sujeto: 'el control de naturales', predicado: 'es mañana' },
  { sujeto: 'el estuche', predicado: 'estaba roto', detras: true },
  { sujeto: 'Matemáticas', predicado: 'es mi asignatura preferida' },
  { sujeto: 'mis amigas Ana y Lucía', predicado: 'son muy buenas', plural: true },
  { sujeto: 'la hora de leer', predicado: 'dura media hora' },
  { sujeto: 'los animales', predicado: 'se clasifican en reinos', plural: true },
  { sujeto: 'el libro de Clara', predicado: 'es muy interesante', detras: true },
  { sujeto: 'mi botella', predicado: 'estaba rota', detras: true },
  { predicado: 'llueve mucho' },
  { sujeto: 'Kavita', predicado: 'tenía dos cabras' },
  { sujeto: 'Ravi', predicado: 'se quedó sin palabras' },
  { sujeto: 'los perros guía', predicado: 'aprenden a pararse en los semáforos', plural: true },
  { sujeto: 'las flores', predicado: 'adornan el camino', plural: true },
]

/** Grupos de palabras que no son oraciones: no dicen nada de nadie (falta lo que se dice). */
export const NO_ORACIONES = ['El paisaje bonito.', 'La casa de mi abuela.', 'Un perro muy obediente.', 'Las flores del camino.', 'Mi amiga Gabriela.', 'El estuche roto.']

/**
 * Concordancia: un predicado y dos sujetos, uno solo y varios. Solo uno va con el verbo, como en la libreta
 * («Los árboles se refleja» → «El árbol se refleja»).
 */
export const CONCORDANCIA: { predicado: string; plural: boolean; sujetos: [string, string] }[] = [
  { predicado: 'brillan en el cielo nocturno', plural: true, sujetos: ['la estrella', 'las estrellas'] },
  { predicado: 'pasean por el campo', plural: true, sujetos: ['Manuela', 'Manuela y su perro'] },
  { predicado: 'se refleja en el río', plural: false, sujetos: ['el árbol', 'los árboles'] },
  { predicado: 'se levantan al amanecer', plural: true, sujetos: ['Nico', 'Nico y Laura'] },
  { predicado: 'caminaba despacio', plural: false, sujetos: ['Paula', 'Paula y Ana'] },
  { predicado: 'tarda mucho en llegar', plural: false, sujetos: ['Manuela', 'Manuela y Pedro'] },
  { predicado: 'dura dos horas', plural: false, sujetos: ['la clase de baile', 'las clases de baile'] },
  { predicado: 'saltaba muy alto', plural: false, sujetos: ['el conejo', 'los conejos'] },
  { predicado: 'viven en cuevas', plural: true, sujetos: ['el oso', 'los osos'] },
  { predicado: 'es mi plato favorito', plural: false, sujetos: ['la tortilla', 'las tortillas'] },
  { predicado: 'me leyó un cuento', plural: false, sujetos: ['mi abuela', 'mis abuelas'] },
  { predicado: 'hacen una barbacoa', plural: true, sujetos: ['el amigo de Paco', 'los amigos de Paco'] },
  { predicado: 'tienen varios animales', plural: true, sujetos: ['mi vecino', 'mis vecinos'] },
  { predicado: 'ladra mucho', plural: false, sujetos: ['el perro', 'los perros'] },
  { predicado: 'brillan con el sol', plural: true, sujetos: ['la gota de agua', 'las gotas de agua'] },
]

/** Palabras del cuento para contar sílabas (página 29, actividad 10 B). */
export const PALABRAS_CUENTO = ['sol', 'flores', 'agua', 'alba', 'barro', 'cabras', 'Kavita', 'cántaros', 'arroyo', 'vasija', 'camino', 'montañas', 'gallinas', 'primavera', 'esfuerzo', 'muchacha', 'sendero', 'verduras', 'apreciar', 'maravillosos', 'horizonte']
