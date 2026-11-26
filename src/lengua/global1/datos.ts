// Datos del global de Lengua Castellana de la 1.ª evaluación (2.º ESO): fotocopias y apuntes de la profesora.
// También los usa el cuadernillo en PDF (apuntes-fuente/lengua-global1.gen.mjs).

// ——— Lenguaje, lengua y habla; lenguas de España ———

export const LLH: [string, string][] = [
  ['Lenguaje', 'Capacidad que tenemos los seres humanos de comunicarnos.'],
  ['Lengua', 'Sistema de signos lingüísticos regidos por normas que usa una determinada comunidad lingüística.'],
  ['Habla', 'Uso que un individuo hace de una lengua.'],
]

/** Historia de las lenguas de España (resumen de la profesora). [época, qué pasó] */
export const HISTORIA: [string, string][] = [
  ['Iberia prerromana', 'Pueblos diversos (íberos, celtas, vascos…) con sus propias lenguas.'],
  ['218 a. C.', 'Llegan los romanos con el latín, que desplaza a las lenguas prerromanas, excepto al vasco.'],
  ['Siglo V', 'Invasiones germánicas: los visigodos hablaban gótico, pero adoptaron el latín.'],
  ['711', 'Invasión musulmana: propicia la fragmentación del latín (gallego-portugués, castellano, catalán…).'],
]

export const CASTELLANO: [string, string][] = [
  ['Siglo X', 'Primeros textos escritos.'],
  ['Siglo XIII', 'Alfonso X el Sabio lo impone como lengua oficial.'],
  ['Siglo XV', 'Conquista de América: se incorporan palabras de las lenguas indígenas (americanismos).'],
  ['Siglos XVI y XVII', 'Siglos de Oro: muchísimas obras y autores.'],
  ['Siglo XVIII hasta hoy', 'Palabras que llegan del francés, el portugués, el italiano, el inglés…'],
]

export const LENGUAS_ESPANA: { lengua: string; donde: string; origen: 'romance' | 'prerromana' }[] = [
  { lengua: 'Castellano', donde: 'Lengua oficial de todo el territorio', origen: 'romance' },
  { lengua: 'Gallego', donde: 'Galicia', origen: 'romance' },
  { lengua: 'Catalán', donde: 'Cataluña e Islas Baleares', origen: 'romance' },
  { lengua: 'Valenciano', donde: 'Comunidad Valenciana', origen: 'romance' },
  { lengua: 'Vasco o euskera', donde: 'País Vasco y parte de Navarra', origen: 'prerromana' },
]

export const VARIEDADES_CASTELLANO: [string, string][] = [
  ['Septentrional', 'Zona norte. Dialectos históricos: astur-leonés y navarro-aragonés.'],
  ['Meridional', 'Zona sur y Canarias: andaluz, murciano, extremeño y canario. Rasgos: seseo, ceceo o pérdida de consonantes.'],
  ['Español de América', 'El castellano que se habla en América.'],
]

/** Idioma y dialecto, bilingüismo y diglosia (tema del vídeo de Eduboom; definiciones de clase). */
export const CONCEPTOS: [string, string][] = [
  ['Lengua o idioma', 'Sistema de comunicación propio de una comunidad, con su norma y su literatura (castellano, gallego…).'],
  ['Dialecto', 'Variedad de una lengua propia de una zona geográfica (el andaluz, el canario…).'],
  ['Bilingüismo', 'Uso de dos lenguas por una persona o una comunidad (en Galicia, el gallego y el castellano).'],
  ['Diglosia', 'Dos lenguas conviven pero con distinto prestigio: una se usa en los ámbitos cultos y oficiales y la otra queda para el uso familiar.'],
  ['Normalización lingüística', 'Medidas para que una lengua recupere todos los ámbitos de uso (enseñanza, administración, medios…).'],
]

// ——— El español en el mundo y de América ———

export const RASGOS_AMERICA: [string, string, string][] = [
  ['Seseo', 'Pronunciar la c y la z como s', '«sapato» por zapato'],
  ['Yeísmo', 'Confundir ll e y', 'pronunciar igual poyo y pollo'],
  ['Voseo', 'Usar el pronombre vos en lugar de tú', '«vos sabés»'],
  ['Arcaísmo', 'Conservar palabras antiguas que en España cayeron en desuso', 'palabras antiguas'],
  ['Influencia del inglés', 'Muchos neologismos importados del inglés', 'préstamos del inglés'],
  ['Palabras precolombinas', 'Palabras de las lenguas indígenas', 'choclo (maíz tierno), ají (pimiento), china (mujer india)'],
]

export const PRECOLOMBINAS_ESPANA = ['canoa', 'cacique', 'petaca', 'hule', 'chocolate', 'tiza']

export const LENGUAS_INDIGENAS: [string, string][] = [
  ['Quechua', 'Perú'],
  ['Guaraní', 'Paraguay'],
  ['Náhuatl', 'México'],
  ['Maya-quiché', 'México y Guatemala'],
  ['Aimara', 'Bolivia y Perú'],
  ['Araucano', 'Chile'],
]

/** «Quinientos millones de castellano hablantes». [lugar, situación del español] */
export const MUNDO: [string, string][] = [
  ['España y América', 'Lengua oficial de España y de diecinueve países de América y el Caribe.'],
  ['Filipinas', 'Situación pesimista: se ha reducido su enseñanza, aunque la historia filipina está escrita en español.'],
  ['Marruecos', 'Subsiste en muchas ciudades, pero con tendencia a la extinción.'],
  ['Guinea Ecuatorial', 'Lengua oficial y de instrucción; desde 1998 se ha impuesto también el francés.'],
  ['Pueblo saharaui', 'Sigue siendo lengua diplomática, junto al francés.'],
  ['Oceanía', 'Crece cada día el porcentaje de hispanohablantes (Australia).'],
  ['Judíos sefardíes', 'Descendientes de los expulsados en 1492: hablan un castellano muy arcaico, el sefardí o judeoespañol.'],
  ['Estados Unidos', 'Es el segundo idioma más hablado.'],
  ['Organismos internacionales', 'Lengua oficial de las Naciones Unidas y de la Unión Europea.'],
  ['Instituto Cervantes', 'Creado en 1991 para difundir la cultura y la lengua españolas.'],
]

// ——— Niveles del lenguaje ———

export const NIVELES: { nivel: string; quien: string; rasgos: string; ejemplo: string }[] = [
  { nivel: 'Culto', quien: 'Las personas más instruidas, con mayor formación cultural.', rasgos: 'Uso muy cuidado; gran riqueza de vocabulario (sinónimos, cultismos); oraciones bien construidas; orden lógico.', ejemplo: 'El cólera es una enfermedad epidémica y contagiosa.' },
  { nivel: 'Estándar', quien: 'Los medios de comunicación, la enseñanza y la política.', rasgos: 'Uso correcto dentro de la norma; léxico preciso pero menos rico que el culto.', ejemplo: 'La reunión se celebrará mañana a las seis.' },
  { nivel: 'Coloquial', quien: 'La mayoría de los hablantes (el habla familiar).', rasgos: 'Gran expresividad; muletillas y léxico poco preciso; oraciones inacabadas; diminutivos y apelativos cariñosos.', ejemplo: '¿Qué quieres que te diga…? ¡Anda que tú…!' },
  { nivel: 'Vulgar', quien: 'Personas poco instruidas.', rasgos: 'Altera la norma: errores de pronunciación, de palabras, de formas verbales y de construcción; palabras malsonantes.', ejemplo: 'Me se ha caído y está to tirao.' },
]

/** Vulgarismos de la hoja de la profesora, con su forma correcta y el nivel de la lengua al que afectan. */
export const VULGARISMOS: [string, string, string][] = [
  ['na', 'nada', 'fónico'],
  ['acabao', 'acabado', 'fónico'],
  ['un taxis', 'un taxi', 'léxico'],
  ['almóndiga', 'albóndiga', 'léxico'],
  ['andé', 'anduve', 'morfológico'],
  ['conducí', 'conduje', 'morfológico'],
  ['yo me parece', 'a mí me parece', 'sintáctico'],
  ['me se cayó', 'se me cayó', 'sintáctico'],
  ['nojotros', 'nosotros', 'fónico'],
  ['en ca la Luisa', 'en casa de Luisa', 'sintáctico'],
]

export const JERGAS: [string, string][] = [
  ['peluco', 'reloj'],
  ['tronco', 'amigo'],
  ['body', 'cuerpo'],
  ['piltra', 'cama'],
  ['catre', 'cama'],
]

/** Libro, página 34, actividad 4 y 5; página 35, el telescopio. [texto, nivel, por qué] */
export const TEXTOS_NIVEL: [string, string, string][] = [
  ['El cólera es una enfermedad epidémica, contagiosa, que se caracteriza por una grave sintomatología gastrointestinal y general.', 'Culto', 'Lenguaje científico-técnico: tecnicismos (epidémica, sintomatología, gastrointestinal).'],
  ['—Entonces, ¿le parece bien que pase a recoger el pedido esta tarde? —Sí, de acuerdo, pero haga el favor de llamar cuando vaya usted a salir, no vaya a ser que no estemos.', 'Estándar', 'Correcto y educado (usted), sin cultismos: el habla correcta de todos los días.'],
  ['Venga, espabila, que te se hace tarde. Y no dejes todo por ahí tirao, ¿eh?', 'Vulgar', 'Vulgarismos: «te se» (por «se te») y «tirao» (por «tirado»).'],
  ['A palabras necias, oídos sordos.', 'Coloquial', 'Un refrán: lengua popular y sencilla.'],
  ['A vocablos poco meditados y sin sentido, pabellón auricular y trompas de Eustaquio en perfecto estado de catalepsia.', 'Culto', 'Dice lo mismo que el refrán, pero con cultismos y tecnicismos (vocablos, pabellón auricular, catalepsia): es una parodia del nivel culto.'],
  ['Los telescopios situados en el espacio pueden proporcionarnos respuestas a algunos de los misterios más grandes que nos ofrece el cosmos.', 'Culto', 'Lenguaje científico-técnico: astronomía, órbita, cosmos, galaxia, años luz.'],
]

// ——— Relaciones semánticas (Casals, páginas 158 y 159) ———

export const RELACIONES: [string, string, string][] = [
  ['Sinonimia', 'Dos o más palabras tienen el mismo significado.', 'acabar, terminar, finalizar'],
  ['Antonimia', 'Dos palabras tienen significados opuestos.', 'caliente / frío'],
  ['Hiperonimia', 'Una palabra de significado más amplio (hiperónimo) incluye a otras (hipónimos).', 'árbol → pino, tilo, cedro, sauce'],
  ['Monosemia', 'Una palabra tiene un solo significado (propio de los tecnicismos).', 'citoplasma, cátodo'],
  ['Polisemia', 'Una palabra tiene varios significados (acepciones).', 'laguna: masa de agua; lo que no se recuerda; espacio vacío'],
  ['Homonimia', 'Palabras de origen distinto que han llegado a coincidir en la forma.', 'vino (bebida) / vino (verbo venir)'],
]

export const ANTONIMOS_TIPOS: [string, string, string][] = [
  ['Pura (gradual)', 'Admiten grados intermedios.', 'caliente / frío (templado), alto / bajo'],
  ['Complementaria', 'La oposición es total: decir una es negar la otra.', 'vivir / morir, hombre / mujer'],
  ['Recíproca', 'Una implica a la otra.', 'comprar / vender, tío / sobrino'],
]

/** Actividad 31: verbos sinónimos. */
export const SINONIMOS_31: [string, string][] = [
  ['bailar', 'danzar'],
  ['acaecer', 'ocurrir'],
  ['adelantar', 'anticipar'],
  ['agradar', 'gustar'],
  ['apelar', 'llamar'],
  ['rechazar', 'repudiar'],
  ['fallecer', 'morir'],
  ['calmar', 'apaciguar'],
  ['costear', 'pagar'],
]

/** Actividad 33: tipo de antónimos (quedan fuera limpiar/ensuciar e ir/venir, ver el informe). */
export const ANTONIMOS_33: [string, string][] = [
  ['fácil / difícil', 'Pura (gradual)'],
  ['completo / incompleto', 'Complementaria'],
  ['enviar / recibir', 'Recíproca'],
  ['padre / hijo', 'Recíproca'],
  ['nacional / extranjero', 'Complementaria'],
  ['suave / áspero', 'Pura (gradual)'],
  ['transparente / opaco', 'Pura (gradual)'],
  ['propio / ajeno', 'Complementaria'],
  ['alegría / tristeza', 'Pura (gradual)'],
  ['presencia / ausencia', 'Complementaria'],
  ['valiente / cobarde', 'Pura (gradual)'],
  ['caro / barato', 'Pura (gradual)'],
]

/** Actividad 35: homónimas (varias entradas en el diccionario) o polisémicas (una entrada con varias acepciones). Queda fuera «marco». */
export const HOMO_POLI_35: [string, 'Homónima' | 'Polisémica', string][] = [
  ['clase', 'Polisémica', 'grupo de alumnos, aula, tipo…'],
  ['inclinación', 'Polisémica', 'postura torcida, tendencia o afición'],
  ['coma', 'Homónima', 'signo de puntuación / estado de pérdida de conciencia'],
  ['mes', 'Polisémica', 'parte del año, sueldo de un mes…'],
  ['polo', 'Homónima', 'polo de la Tierra / deporte a caballo / helado'],
  ['pasta', 'Polisémica', 'masa, macarrones, dinero…'],
  ['cabeza', 'Polisémica', 'parte del cuerpo, persona que dirige, inteligencia…'],
  ['duelo', 'Homónima', 'combate entre dos / dolor por una muerte'],
  ['arco', 'Polisémica', 'arma, parte de un edificio, porción de curva…'],
  ['sereno', 'Homónima', 'tranquilo / vigilante nocturno'],
]

/** Actividad 37: monosémicas o polisémicas. */
export const MONO_POLI_37: [string, 'Monosémica' | 'Polisémica', string][] = [
  ['columna', 'Polisémica', 'pilar, columna vertebral, columna de un periódico…'],
  ['colcha', 'Monosémica', 'cobertura de la cama'],
  ['collar', 'Polisémica', 'adorno del cuello, aro del perro…'],
  ['sirena', 'Polisémica', 'ser mitológico / aparato que suena'],
  ['soneto', 'Monosémica', 'poema de catorce versos'],
  ['élitro', 'Monosémica', 'ala dura de algunos insectos'],
  ['embargar', 'Polisémica', 'retener bienes por una deuda / dominar una emoción'],
  ['escoliosis', 'Monosémica', 'desviación lateral de la columna'],
  ['pozo', 'Polisémica', 'hoyo con agua, mina, lo que se acumula en el juego…'],
  ['antera', 'Monosémica', 'parte de la flor que tiene el polen'],
]

/** Actividad 39: hipónimos de cada hiperónimo. */
export const HIPONIMOS_39: [string, string[]][] = [
  ['frutos secos', ['almendra', 'nuez', 'avellana', 'pistacho', 'castaña']],
  ['especias', ['pimienta', 'canela', 'azafrán', 'clavo', 'pimentón']],
  ['minerales', ['cuarzo', 'pirita', 'mica', 'feldespato', 'yeso']],
]

export const HOMOFONOS: [string, string][] = [
  ['asta / hasta', 'Homófonos'],
  ['vaca / baca', 'Homófonos'],
  ['hola / ola', 'Homófonos'],
  ['vino (bebida) / vino (verbo venir)', 'Homógrafos'],
  ['cubo (recipiente) / cubo (figura)', 'Homógrafos'],
  ['tubo / tuvo', 'Homófonos'],
]

// ——— Funciones del lenguaje: las actividades ———

/** Libro (Casals), página 45, actividad 1. */
export const FUNCIONES_45: [string, string][] = [
  ['La Tierra pertenece al sistema solar.', 'Referencial'],
  ['Miguel, deberías cuidar más tu aspecto.', 'Apelativa o conativa'],
  ['En abril, aguas mil.', 'Poética'],
  ['El femenino de «sacerdote» es «sacerdotisa».', 'Metalingüística'],
  ['Sí, sí, te oigo perfectamente.', 'Fática'],
  ['Estoy contentísima de que hayas venido.', 'Expresiva o emotiva'],
  ['Por favor, cierra la puerta.', 'Apelativa o conativa'],
  ['Me ha gustado muchísimo esta película.', 'Expresiva o emotiva'],
  ['Vale, ¡hasta la vuelta!', 'Fática'],
  ['¡Oh, ciprés verdinegro, el jardín te engalana!', 'Poética'],
  ['No se dice «andé», sino «anduve».', 'Metalingüística'],
  ['La reunión se celebrará a las seis.', 'Referencial'],
]

/** Actividad 2: frases del texto de Platero y la función que cumplen. */
export const PLATERO: [string, string][] = [
  ['¡Hola, mamá!', 'Fática'],
  ['En clase hemos leído hoy un fragmento del libro «Platero y yo», de Juan Ramón Jiménez.', 'Referencial'],
  ['Me ha gustado mucho.', 'Expresiva o emotiva'],
  ['Mira, escucha, te lo leo.', 'Apelativa o conativa'],
  ['Dulce Platero trotón, burrillo mío, que llevaste mi alma tantas veces…', 'Poética'],
  ['«Pacer» significa ‘comer el ganado la hierba del campo’.', 'Metalingüística'],
]

/** Esquema de Algaida: cada función y el elemento de la comunicación en el que se centra (la del código es la metalingüística). */
export const FUNCION_ELEMENTO: [string, string][] = [
  ['Expresiva o emotiva', 'Emisor'],
  ['Referencial o representativa', 'Referente'],
  ['Apelativa o conativa', 'Receptor'],
  ['Poética o estética', 'Mensaje'],
  ['Metalingüística', 'Código'],
  ['Fática o de contacto', 'Canal'],
]

// ——— El resumen ———

export const RESUMEN_PASOS: [string, string[]][] = [
  ['1. Lectura', ['En silencio y con concentración.', 'Dos o tres veces.', 'Busca el significado de las palabras que no conoces.']],
  ['2. Subrayar', ['Palabras clave.', 'Omite lo irrelevante.', 'La idea principal de cada párrafo.', 'Pregúntate: ¿a qué se refiere?, ¿es fundamental?']],
  ['3. Esquema de ideas', ['¿En cuántas partes se divide? Introducción, desarrollo y conclusión.', 'Localiza entre 2 y 5 contenidos importantes.', 'Ideas principales y secundarias.']],
]

export const RESUMEN_SI = ['Elaboración propia: no se copian frases ni párrafos.', 'Es personal, pero NO se opina.', 'Breve: no más de 1/3 del texto.', 'Mejor en un único párrafo.', 'Presente de indicativo y 3.ª persona del singular: no se narra, se explica.', 'Usa conectores: además, por último, por otra parte, también…']
export const RESUMEN_NO = ['Reproducir el esquema de las ideas principales.', 'Describir el texto.', 'Citar textualmente.', 'Repetir palabras, usar sinónimos o aclaraciones innecesarias.', 'Incluir valoraciones.', 'Usar la primera persona.', 'Enumeraciones y coloquialismos.', 'Empezar con «Este texto…».']

/** Textos para elegir el mejor resumen: el bueno y los malos, con su fallo. */
export const RESUMENES: { texto: string; bueno: string; malos: [string, string][] }[] = [
  {
    texto:
      'Situar telescopios en órbita es quizá la contribución más valiosa del programa espacial a la astronomía. Desde el espacio pueden ayudarnos a responder grandes preguntas: cuándo comenzó el universo o qué tamaño tiene. Cuando contemplamos el espacio, miramos al pasado: si una galaxia está a cinco mil millones de años luz, su luz tarda cinco mil millones de años en llegar, y la vemos como era entonces. Un telescopio es una máquina del tiempo.',
    bueno: 'Los telescopios espaciales son la mayor aportación del programa espacial a la astronomía, porque ayudan a resolver los grandes enigmas del universo. Además, como la luz de las galaxias lejanas tarda millones de años en llegar, permiten observar el pasado.',
    malos: [
      ['Este texto habla de los telescopios. Primero dice que son valiosos, después que responden preguntas y por último que son máquinas del tiempo.', 'Empieza con «Este texto…» y describe el texto en vez de resumirlo.'],
      ['Los telescopios espaciales me parecen el mejor invento de la historia y ojalá pudiera tener uno para ver galaxias.', 'Opina y usa la primera persona.'],
      ['Situar telescopios en órbita es quizá la contribución más valiosa del programa espacial a la astronomía. Un telescopio es una máquina del tiempo.', 'Copia frases del texto.'],
    ],
  },
  {
    texto:
      'Las ciudades tienen grandes dificultades para eliminar la basura que generan. Pueden acumularla en vertederos, pero estos se llenan y hay que buscar otros. También pueden quemarla, aunque los gases contaminan la atmósfera. Otras ciudades intentan reciclarla: los restos orgánicos se convierten en abono y el papel se transforma en papel nuevo. Para ello, los ciudadanos deben separar los residuos.',
    bueno: 'Las ciudades buscan cómo deshacerse de la basura. Los vertederos se saturan y la incineración contamina, por lo que el reciclaje resulta la mejor opción, siempre que los ciudadanos separen los residuos.',
    malos: [
      ['Vertederos. Incineración. Reciclaje. Separar residuos.', 'Es una enumeración, un esquema de ideas, no un resumen.'],
      ['Ayer las ciudades tuvieron muchos problemas con la basura y la quemaron, y luego la reciclaron.', 'Narra en pasado; el resumen explica en presente.'],
      ['Las ciudades tienen un montón de basura, tío, y no saben qué hacer con ella, así que la reciclan y ya está.', 'Usa coloquialismos.'],
    ],
  },
]
