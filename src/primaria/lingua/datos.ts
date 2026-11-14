// Lingua Galega de 3.º (Olivia), unidade 2 «Somos o que comemos»: as palabras do libro (páxinas 22 a 37), da
// libreta e das fichas da mestra.

// ——— O son K (páxinas 28, 29 e 36, e os ditados) ———

/** Palabras co son K e o seu debuxo, se hai un claro. */
export const PALABRAS_K: { palabra: string; debuxo?: string }[] = [
  { palabra: 'áncora', debuxo: '⚓' },
  { palabra: 'esquío', debuxo: '🐿️' },
  { palabra: 'cabaza', debuxo: '🎃' },
  { palabra: 'queixo', debuxo: '🧀' },
  { palabra: 'cullerón', debuxo: '🥄' },
  { palabra: 'raqueta', debuxo: '🎾' },
  { palabra: 'paquete', debuxo: '📦' },
  { palabra: 'brócoli', debuxo: '🥦' },
  { palabra: 'mosquito', debuxo: '🦟' },
  { palabra: 'caramelos', debuxo: '🍬' },
  { palabra: 'coco', debuxo: '🥥' },
  { palabra: 'escudo', debuxo: '🛡️' },
  { palabra: 'cubertos', debuxo: '🍴' },
  { palabra: 'requeixo' },
  { palabra: 'cazola', debuxo: '🍲' },
  { palabra: 'coitelo', debuxo: '🔪' },
  { palabra: 'capa' },
  { palabra: 'cova' },
  { palabra: 'curso' },
  { palabra: 'queixada' },
  { palabra: 'branca' },
  { palabra: 'mesquita' },
  { palabra: 'albaricoque' },
  { palabra: 'caquis' },
  { palabra: 'época' },
  { palabra: 'caseira' },
  { palabra: 'cociñeiro' },
  { palabra: 'exquisitos' },
  { palabra: 'alcachofas' },
  { palabra: 'lacón' },
  { palabra: 'riquísimas' },
  { palabra: 'cunca', debuxo: '🥣' },
  { palabra: 'escumadeira' },
]

/** Palabras con c que non soa K (diante de e, i) ou sen son K: para distinguilas. */
export const SEN_K = ['cervo', 'fociño', 'cebola', 'cidade', 'cear', 'doce', 'perexil', 'horta', 'leituga']

/** Palabras con k que veñen doutras linguas (páxina 29). */
export const PALABRAS_CON_K: { palabra: string; lingua: string; debuxo?: string }[] = [
  { palabra: 'smóking', lingua: 'inglés', debuxo: '🤵' },
  { palabra: 'póker', lingua: 'inglés', debuxo: '🃏' },
  { palabra: 'karaoke', lingua: 'xaponés', debuxo: '🎤' },
  { palabra: 'karateka', lingua: 'xaponés', debuxo: '🥋' },
  { palabra: 'kiwi', lingua: 'inglés', debuxo: '🥝' },
]

/** Para os diminutivos en -iña (páxina 29, actividade 4). */
export const DIMINUTIVOS = ['cunca', 'foca', 'boneca', 'barca', 'mosca', 'vaca', 'roca', 'barco', 'saco', 'pico']
/** Para os derivados en -eiro (páxina 29, actividade 5). */
export const EN_EIRO = ['banco', 'zoco', 'vaca', 'arco', 'barca']

// ——— O dicionario (páxinas 27 e 36) ———

export type Abreviatura = 's. m.' | 's. f.' | 'adx.' | 'v.'
export const NOME_ABREVIATURA: Record<Abreviatura, string> = { 's. m.': 'substantivo masculino', 's. f.': 'substantivo feminino', 'adx.': 'adxectivo', 'v.': 'verbo' }

/** Entradas de dicionario do libro e do conto. */
export const ENTRADAS: { palabra: string; abreviatura: Abreviatura; definicion: string }[] = [
  { palabra: 'regar', abreviatura: 'v.', definicion: 'Botarlle auga a unha planta para que medre.' },
  { palabra: 'aderezar', abreviatura: 'v.', definicion: 'Preparar con adobos un alimento para cociñalo.' },
  { palabra: 'escumadeira', abreviatura: 's. f.', definicion: 'Culler grande e plana, con buratos, para escorrer alimentos.' },
  { palabra: 'horta', abreviatura: 's. f.', definicion: 'Terreo onde se cultivan hortalizas e árbores froiteiras.' },
  { palabra: 'podar', abreviatura: 'v.', definicion: 'Cortar as pólas dunha árbore para que medren con máis forza.' },
  { palabra: 'interesante', abreviatura: 'adx.', definicion: 'Que interesa.' },
  { palabra: 'algarabía', abreviatura: 's. f.', definicion: 'Ruído que fai un grupo de persoas que corren, berran, xogan…' },
  { palabra: 'espantallo', abreviatura: 's. m.', definicion: 'Boneco que se pon nas leiras para espantar os paxaros.' },
]

/** Como aparece cada palabra no dicionario: substantivos en singular, adxectivos en masculino singular e verbos en infinitivo. */
export const FORMAS_DICIONARIO: { formas: string[]; entrada: string; clase: 'substantivo' | 'adxectivo' | 'verbo' }[] = [
  { formas: ['cesto', 'cestos'], entrada: 'cesto', clase: 'substantivo' },
  { formas: ['tenra', 'tenras', 'tenro'], entrada: 'tenro', clase: 'adxectivo' },
  { formas: ['sementando', 'sementar', 'sementaba'], entrada: 'sementar', clase: 'verbo' },
  { formas: ['rebordaba'], entrada: 'rebordar', clase: 'verbo' },
  { formas: ['medran'], entrada: 'medrar', clase: 'verbo' },
  { formas: ['xogan'], entrada: 'xogar', clase: 'verbo' },
  { formas: ['espinacas'], entrada: 'espinaca', clase: 'substantivo' },
  { formas: ['contentos'], entrada: 'contento', clase: 'adxectivo' },
  { formas: ['sementes'], entrada: 'semente', clase: 'substantivo' },
  { formas: ['nerviosos'], entrada: 'nervioso', clase: 'adxectivo' },
  { formas: ['botar', 'botamos'], entrada: 'botar', clase: 'verbo' },
  { formas: ['alegre', 'alegres'], entrada: 'alegre', clase: 'adxectivo' },
]

// ——— As sílabas (páxina 30 e as fichas) ———

/** As palabras da páxina 30 e das fichas da mestra (sen as que están en castelán). */
export const PALABRAS_SILABAS = [
  'leituga', 'hórreo', 'froiteiro', 'receita', 'elefante', 'avioneta', 'campesiño', 'científica', 'xouba', 'ceo', 'ponte',
  'sol', 'mesa', 'flor', 'pelota', 'pan', 'zapato', 'ordenador', 'tren', 'camiseta', 'gato', 'luz', 'chocolate',
  'camión', 'animal', 'pedra', 'ben', 'mar', 'cama', 'amigo', 'carpeta', 'camerino', 'horta', 'perexil', 'espinacas', 'cesto',
]

/** As dúas árbores froiteiras da páxina 30: cada debuxo dá a súa sílaba tónica. */
export const ARBORES: { arbore: string; pistas: string[] }[] = [
  { arbore: 'PEREIRA', pistas: ['espello', 'floreira', 'araña'] },
  { arbore: 'MACEIRA', pistas: ['mapa', 'aceite', 'maracas'] },
]

/** Palabras que acurtamos ao falar (páxina 31). */
export const ACURTADAS: [string, string][] = [
  ['colexio', 'cole'],
  ['autobús', 'bus'],
  ['bicicleta', 'bici'],
  ['televisor', 'tele'],
  ['fotografía', 'foto'],
]

// ——— As clases de palabras (páxinas 31 e 34) ———

export type Clase = 'substantivo' | 'adxectivo' | 'verbo'
export const CLASES: Record<Clase, string[]> = {
  substantivo: ['touro', 'automóbil', 'mestre', 'cesta', 'horta', 'espinacas', 'perexil', 'espantallo', 'escola', 'patio', 'cociña', 'sementes', 'paraugas', 'amorodos', 'tomates'],
  adxectivo: ['útil', 'fermoso', 'saborosa', 'incrible', 'tenro', 'grande', 'alegre', 'magnífico', 'azul', 'pequeniña', 'contentos', 'vella'],
  verbo: ['cociñar', 'bater', 'durmir', 'camiñar', 'regar', 'sementar', 'podar', 'xogar', 'ferver', 'fritir', 'corta', 'tritura'],
}

/** A palabra intrusa de cada grupo da páxina 31. */
export const INTRUSAS: { grupo: string[]; clase: Clase }[] = [
  { grupo: ['cociñar', 'bater', 'incrible', 'durmir'], clase: 'verbo' },
  { grupo: ['touro', 'automóbil', 'mestre', 'camiñar'], clase: 'substantivo' },
  { grupo: ['útil', 'fermoso', 'cesta', 'saborosa'], clase: 'adxectivo' },
]

/** Palabras con e sen dígrafo (páxina 34, actividade 6 B, e o conto). */
export const PALABRAS_DIGRAFOS = ['traballo', 'ferramentas', 'enriquecedora', 'labregas', 'nunha', 'preguntas', 'perexil', 'espantallo', 'leituga', 'cociña', 'chea', 'unha', 'arroz', 'algunhas', 'queixo', 'guiso', 'cesto', 'horta']

// ——— A cociña do mundo (páxina 35) ———

export const COCIÑAS: { cociña: string; pratos: string[]; intrusa: string; de: string }[] = [
  { cociña: 'asiática', pratos: ['suxi', 'musaca', 'ramen', 'samosa'], intrusa: 'musaca', de: 'Europa (Grecia)' },
  { cociña: 'americana', pratos: ['pizza', 'cebiche', 'tamal', 'hamburguesa'], intrusa: 'pizza', de: 'Europa (Italia)' },
  { cociña: 'africana', pratos: ['cuscús', 'fondue', 'tagín', 'matoke'], intrusa: 'fondue', de: 'Europa (Suíza)' },
]
