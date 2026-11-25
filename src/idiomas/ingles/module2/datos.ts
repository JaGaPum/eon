// Inglés de 2.º ESO, Module 2: lo que va en los cuadros azules (Past Simple, la página 31; Present y Past Simple
// Passive; used to). Las formas de los verbos están escritas a mano, como en la lista de irregulares del libro, y las
// frases salen de aquí tanto para la web como para el cuadernillo en PDF.

// ---------- Verbos ----------

/** Cómo se forma el pasado de un verbo regular (las reglas de ortografía del cuadro azul). */
export type Ortografia = 'ed' | 'd' | 'ied' | 'doble'

export interface VerboPasado {
  base: string
  past: string
  /** Participio (past participle), el que va en la pasiva. */
  pp: string
  es: string
  /** Regular: con qué regla de ortografía. Sin este campo, es irregular. */
  regla?: Ortografia
}

const reg = (base: string, past: string, regla: Ortografia, es: string): VerboPasado => ({ base, past, pp: past, es, regla })
const irr = (base: string, past: string, pp: string, es: string): VerboPasado => ({ base, past, pp, es })

export const REGULARES: VerboPasado[] = [
  reg('work', 'worked', 'ed', 'trabajar'),
  reg('watch', 'watched', 'ed', 'ver'),
  reg('help', 'helped', 'ed', 'ayudar'),
  reg('clean', 'cleaned', 'ed', 'limpiar'),
  reg('play', 'played', 'ed', 'jugar, tocar'),
  reg('stay', 'stayed', 'ed', 'quedarse'),
  reg('visit', 'visited', 'ed', 'visitar'),
  reg('wash', 'washed', 'ed', 'lavar'),
  reg('cook', 'cooked', 'ed', 'cocinar'),
  reg('open', 'opened', 'ed', 'abrir'),
  reg('check', 'checked', 'ed', 'revisar'),
  reg('paint', 'painted', 'ed', 'pintar'),
  reg('start', 'started', 'ed', 'empezar'),
  reg('talk', 'talked', 'ed', 'hablar'),
  reg('walk', 'walked', 'ed', 'caminar'),
  reg('listen', 'listened', 'ed', 'escuchar'),
  reg('want', 'wanted', 'ed', 'querer'),
  reg('invent', 'invented', 'ed', 'inventar'),
  reg('live', 'lived', 'd', 'vivir'),
  reg('use', 'used', 'd', 'usar'),
  reg('dance', 'danced', 'd', 'bailar'),
  reg('love', 'loved', 'd', 'encantar'),
  reg('arrive', 'arrived', 'd', 'llegar'),
  reg('decide', 'decided', 'd', 'decidir'),
  reg('close', 'closed', 'd', 'cerrar'),
  reg('like', 'liked', 'd', 'gustar'),
  reg('prepare', 'prepared', 'd', 'preparar'),
  reg('serve', 'served', 'd', 'servir'),
  reg('invite', 'invited', 'd', 'invitar'),
  reg('create', 'created', 'd', 'crear'),
  reg('try', 'tried', 'ied', 'intentar'),
  reg('study', 'studied', 'ied', 'estudiar'),
  reg('carry', 'carried', 'ied', 'llevar'),
  reg('cry', 'cried', 'ied', 'llorar'),
  reg('tidy', 'tidied', 'ied', 'ordenar'),
  reg('worry', 'worried', 'ied', 'preocuparse'),
  reg('stop', 'stopped', 'doble', 'parar'),
  reg('plan', 'planned', 'doble', 'planear'),
  reg('chat', 'chatted', 'doble', 'charlar'),
  reg('drop', 'dropped', 'doble', 'dejar caer'),
  reg('shop', 'shopped', 'doble', 'ir de compras'),
]

export const IRREGULARES: VerboPasado[] = [
  irr('be', 'was / were', 'been', 'ser, estar'),
  irr('become', 'became', 'become', 'llegar a ser'),
  irr('begin', 'began', 'begun', 'empezar'),
  irr('break', 'broke', 'broken', 'romper'),
  irr('bring', 'brought', 'brought', 'traer'),
  irr('build', 'built', 'built', 'construir'),
  irr('buy', 'bought', 'bought', 'comprar'),
  irr('catch', 'caught', 'caught', 'coger'),
  irr('choose', 'chose', 'chosen', 'elegir'),
  irr('come', 'came', 'come', 'venir'),
  irr('do', 'did', 'done', 'hacer'),
  irr('draw', 'drew', 'drawn', 'dibujar'),
  irr('drink', 'drank', 'drunk', 'beber'),
  irr('drive', 'drove', 'driven', 'conducir'),
  irr('eat', 'ate', 'eaten', 'comer'),
  irr('fall', 'fell', 'fallen', 'caer'),
  irr('feel', 'felt', 'felt', 'sentir'),
  irr('find', 'found', 'found', 'encontrar'),
  irr('fly', 'flew', 'flown', 'volar'),
  irr('forget', 'forgot', 'forgotten', 'olvidar'),
  irr('get', 'got', 'got', 'conseguir'),
  irr('give', 'gave', 'given', 'dar'),
  irr('go', 'went', 'gone', 'ir'),
  irr('have', 'had', 'had', 'tener, tomar'),
  irr('hear', 'heard', 'heard', 'oír'),
  irr('keep', 'kept', 'kept', 'guardar, mantener'),
  irr('know', 'knew', 'known', 'saber, conocer'),
  irr('leave', 'left', 'left', 'dejar, irse'),
  irr('lose', 'lost', 'lost', 'perder'),
  irr('make', 'made', 'made', 'hacer, fabricar'),
  irr('meet', 'met', 'met', 'conocer, quedar'),
  irr('pay', 'paid', 'paid', 'pagar'),
  irr('put', 'put', 'put', 'poner'),
  irr('read', 'read', 'read', 'leer'),
  irr('ride', 'rode', 'ridden', 'montar'),
  irr('run', 'ran', 'run', 'correr'),
  irr('say', 'said', 'said', 'decir'),
  irr('see', 'saw', 'seen', 'ver'),
  irr('sell', 'sold', 'sold', 'vender'),
  irr('send', 'sent', 'sent', 'enviar'),
  irr('sing', 'sang', 'sung', 'cantar'),
  irr('sit', 'sat', 'sat', 'sentarse'),
  irr('sleep', 'slept', 'slept', 'dormir'),
  irr('speak', 'spoke', 'spoken', 'hablar'),
  irr('spend', 'spent', 'spent', 'pasar (tiempo), gastar'),
  irr('steal', 'stole', 'stolen', 'robar'),
  irr('swim', 'swam', 'swum', 'nadar'),
  irr('take', 'took', 'taken', 'coger, llevar'),
  irr('teach', 'taught', 'taught', 'enseñar'),
  irr('tell', 'told', 'told', 'contar, decir'),
  irr('think', 'thought', 'thought', 'pensar'),
  irr('throw', 'threw', 'thrown', 'lanzar'),
  irr('understand', 'understood', 'understood', 'entender'),
  irr('wear', 'wore', 'worn', 'llevar puesto'),
  irr('win', 'won', 'won', 'ganar'),
  irr('write', 'wrote', 'written', 'escribir'),
]

export const VERBOS2 = [...REGULARES, ...IRREGULARES]
export const verbo = (base: string) => {
  const v = VERBOS2.find((x) => x.base === base)
  if (!v) throw new Error(`Falta el verbo «${base}»`)
  return v
}

export const NOMBRE_REGLA: Record<Ortografia, string> = {
  ed: 'se añade ‑ed (play → played)',
  d: 'acaba en ‑e: solo ‑d (live → lived)',
  ied: 'consonante + y: ‑ied (try → tried)',
  doble: 'consonante‑vocal‑consonante: se dobla la última (stop → stopped)',
}

// ---------- Past Simple ----------

/** Sujeto y si es plural (para was / were). */
export const SUJETOS2: [string, boolean][] = [
  ['I', false],
  ['You', true],
  ['He', false],
  ['She', false],
  ['We', true],
  ['They', true],
  ['My sister', false],
  ['My friends', true],
]
export const wasWere = (suj: string, plural: boolean) => (suj === 'I' || !plural ? 'was' : 'were')

/** Frases para el Past Simple: verbo, lo que va detrás y la expresión de tiempo. */
export const FRASES_PASADO: [string, string, string][] = [
  ['watch', 'a film', 'last night'],
  ['visit', 'my grandparents', 'last weekend'],
  ['play', 'tennis', 'yesterday'],
  ['study', 'for the test', 'yesterday evening'],
  ['clean', 'the kitchen', 'on Saturday'],
  ['stop', 'the car', 'a minute ago'],
  ['live', 'in London', 'in 2015'],
  ['try', 'sushi', 'last summer'],
  ['go', 'to the cinema', 'last Friday'],
  ['eat', 'pizza', 'yesterday'],
  ['buy', 'a new phone', 'last month'],
  ['write', 'an email', 'this morning'],
  ['see', 'a concert', 'last year'],
  ['have', 'pasta for lunch', 'yesterday'],
  ['drive', 'a taxi', 'last year'],
  ['win', 'the match', 'last Sunday'],
  ['make', 'a cake', 'two days ago'],
  ['take', 'a lot of photos', 'on holiday'],
  ['meet', 'my friends', 'after school'],
  ['read', 'a book', 'last week'],
  ['swim', 'in the sea', 'last August'],
  ['chat', 'with my cousin', 'last night'],
]

/** Formas válidas del hueco en Past Simple (sin el sujeto). */
export function pasado(v: VerboPasado, neg: boolean): string[] {
  if (neg) return [`didn't ${v.base}`, `did not ${v.base}`]
  return v.past.split(' / ')
}

// Ejercicio 8 de la página 31: los verbos y los huecos, con su solución.
export const EJ8_P31: { frase: string; huecos: string[][] }[] = [
  { frase: 'She ___ painting for many years and last year ___ several exhibitions of her paintings.', huecos: [['studied'], ['there were']] },
  { frase: 'They ___ the match last night because they ___ very badly.', huecos: [["didn't win", 'did not win'], ['played']] },
  { frase: 'They ___ the floor last night because it ___ dirty.', huecos: [["didn't wash", 'did not wash'], ["wasn't", 'was not']] },
  { frase: 'He ___ many books and they ___ very popular.', huecos: [['wrote'], ['became']] },
  { frase: 'She ___ over Rome because ___ a storm.', huecos: [["didn't fly", 'did not fly'], ['there was']] },
]
export const EJ8_VERBOS = 'not wash • study • play • not fly • not be • not win • write • become'

// Ejercicio 9 de la página 31: preguntas con las palabras dadas.
export const EJ9_P31: [string, string, string[]][] = [
  ['how many / friends / you / talk to / at the weekend', 'How many friends did you talk to at the weekend?', ['How many friends did you talked to at the weekend?', 'How many friends you talked to at the weekend?', 'How many friends do you talk to at the weekend?']],
  ['an English test / last week', 'Was there an English test last week?', ['Were there an English test last week?', 'There was an English test last week?', 'Did there an English test last week?']],
  ['what / you / have / for lunch / yesterday', 'What did you have for lunch yesterday?', ['What did you had for lunch yesterday?', 'What you had for lunch yesterday?', 'What do you have for lunch yesterday?']],
  ['any guests / at your house / last weekend', 'Were there any guests at your house last weekend?', ['Was there any guests at your house last weekend?', 'There were any guests at your house last weekend?', 'Did there any guests at your house last weekend?']],
  ['when / you / go to bed / last night', 'When did you go to bed last night?', ['When did you went to bed last night?', 'When you went to bed last night?', 'When were you go to bed last night?']],
]

// Ejercicio 12 de la página 31: la ficha de Simone (preguntas y respuestas sobre la ficha).
export const SIMONE: [string, string, string[]][] = [
  ['When did Simone start primary school?', 'In 2003.', ['In 2009.', 'In 2016.', 'In 2013.']],
  ['Where did she go to secondary school?', 'To Braxton Secondary School.', ['To Green Hill Primary School.', 'To Braxton Zoo.', 'To an animal shelter.']],
  ['How long did she study at Green Hill Primary School?', 'For six years (2003-2009).', ['For seven years.', 'For two years.', 'For three years.']],
  ['What did she do from 2015 to 2017?', 'She was a weekend helper at an animal shelter.', ['She was a salesperson at a pet shop.', 'She was a dog walker.', 'She studied at Green Hill.']],
  ['How long was she a dog walker?', 'For three years (2013-2016).', ['For two years.', 'For six years.', 'For one year.']],
  ['What was her job from 2016 to 2018?', 'She was a salesperson at a pet shop.', ['She was a dog walker.', 'She was a zoo keeper.', 'She was a weekend helper.']],
  ['How did she hear about the volunteer programme?', 'From a friend or a family member.', ['Online.', 'At the zoo.', 'On TV.']],
]

// ---------- La pasiva ----------

/** Frases para la pasiva: sujeto paciente, si es plural, verbo, complemento y quién lo hace (si se dice). */
export const FRASES_PASIVA: { suj: string; plural: boolean; v: string; resto: string; presente: string; pasado: string }[] = [
  { suj: 'The cooking', plural: false, v: 'do', resto: 'in the kitchen', presente: 'every day', pasado: 'yesterday' },
  { suj: 'The rooms', plural: true, v: 'clean', resto: '', presente: 'on Sundays', pasado: 'last Sunday' },
  { suj: 'Vegetables', plural: true, v: 'buy', resto: 'at the market', presente: 'every week', pasado: 'last week' },
  { suj: 'Dinner', plural: false, v: 'prepare', resto: 'by the cook', presente: 'every day', pasado: 'yesterday' },
  { suj: 'The food', plural: false, v: 'eat', resto: 'by my friends', presente: 'at every party', pasado: 'at the party last night' },
  { suj: 'The servants', plural: true, v: 'pay', resto: 'a lot of money', presente: 'today', pasado: 'in the past' },
  { suj: 'My grandparents', plural: true, v: 'invite', resto: 'to the meal', presente: 'every Christmas', pasado: 'last Christmas' },
  { suj: 'The programme', plural: false, v: 'watch', resto: 'by many people', presente: 'every week', pasado: 'last night' },
  { suj: 'English', plural: false, v: 'speak', resto: 'in many countries', presente: 'today', pasado: 'in the 19th century' },
  { suj: 'Cars', plural: true, v: 'make', resto: 'in this factory', presente: 'now', pasado: 'in 1990' },
  { suj: 'The letters', plural: true, v: 'send', resto: 'by post', presente: 'every morning', pasado: 'yesterday' },
  { suj: 'The house', plural: false, v: 'build', resto: '', presente: 'these days', pasado: 'in 1920' },
  { suj: 'The dishes', plural: true, v: 'wash', resto: 'by my brother', presente: 'after dinner', pasado: 'after dinner yesterday' },
  { suj: 'The window', plural: false, v: 'break', resto: 'by a ball', presente: 'every summer', pasado: 'last summer' },
  { suj: 'This song', plural: false, v: 'sing', resto: 'by children', presente: 'every Christmas', pasado: 'at the concert' },
  { suj: 'The bikes', plural: true, v: 'steal', resto: '', presente: 'very often', pasado: 'last night' },
  { suj: 'The photos', plural: true, v: 'take', resto: 'by my dad', presente: 'at every party', pasado: 'at the wedding' },
  { suj: 'The book', plural: false, v: 'write', resto: 'in English', presente: 'today', pasado: 'in 1950' },
]

/** Formas válidas del hueco en pasiva (sin el sujeto). */
export function pasiva(v: VerboPasado, plural: boolean, tiempo: 'presente' | 'pasado', neg: boolean): string[] {
  const aux = tiempo === 'presente' ? (plural ? 'are' : 'is') : plural ? 'were' : 'was'
  return neg ? [`${aux}n't ${v.pp}`, `${aux} not ${v.pp}`] : [`${aux} ${v.pp}`]
}

// Ejercicio 13: Present Simple Passive (familias de hoy).
export const EJ13_PASIVA: { frase: string; huecos: string[][] }[] = [
  {
    frase: 'In many families today, housework ___ (do) by the husband, wife, daughters and sons. However, children ___ (not expect) to do as much work as their parents.',
    huecos: [['is done'], ["aren't expected", 'are not expected']],
  },
  { frase: 'Even today, in some countries, houses ___ (clean) and food ___ (cook) by servants.', huecos: [['are cleaned'], ['is cooked']] },
  {
    frase: 'Sometimes, dishes ___ (not wash) by people because there is a dishwasher. But the dishes ___ (take) out of the dishwasher and they ___ (put) in cupboards by people.',
    huecos: [["aren't washed", 'are not washed'], ['are taken'], ['are put']],
  },
  { frase: "But robots ___ (not see) in many houses around the world because they are expensive.", huecos: [["aren't seen", 'are not seen']] },
]

// Ejercicio 14: preguntas en Present Simple Passive.
export const EJ14_PASIVA: [string, string, string[]][] = [
  ['your house / clean / at the weekend / ?', 'Is your house cleaned at the weekend?', ['Does your house cleaned at the weekend?', 'Is your house clean at the weekend?', 'Are your house cleaned at the weekend?']],
  ['when / dinner / serve / in your house / ?', 'When is dinner served in your house?', ['When does dinner served in your house?', 'When is dinner serve in your house?', 'When dinner is served in your house?']],
  ['who / the food / usually / prepare / by / ?', 'Who is the food usually prepared by?', ['Who does the food usually prepare by?', 'Who is the food usually prepare by?', 'Who are the food usually prepared by?']],
  ['where / meals / eat / ?', 'Where are meals eaten?', ['Where is meals eaten?', 'Where are meals eat?', 'Where do meals eaten?']],
  ['computers and telephones / use / during meals / ?', 'Are computers and telephones used during meals?', ['Is computers and telephones used during meals?', 'Do computers and telephones used during meals?', 'Are computers and telephones use during meals?']],
]

// Ejercicio 15: la redacción «Family Life in the Past», en Past Simple Passive.
export const EJ15_PASIVA: { antes: string; verbo: string; respuestas: string[] }[] = [
  { antes: 'For example, before there were smartphones and cable TV, more time', verbo: 'spend', respuestas: ['was spent'] },
  { antes: 'interacting with family members. Messages', verbo: 'not send', respuestas: ["weren't sent", 'were not sent'] },
  { antes: 'by text. Instead, people communicated face to face or phone calls', verbo: 'make', respuestas: ['were made'] },
  { antes: '. Children', verbo: 'give', respuestas: ['were given'] },
  { antes: 'more attention by their parents and, as a result, parents were more involved in their children’s lives. Also, video and computer games', verbo: 'not play', respuestas: ["weren't played", 'were not played'] },
  { antes: ', so kids were outside most of the time. How', verbo: 'keep', respuestas: ['were kids kept'] },
  { antes: 'busy during bad weather? Board games', verbo: 'take out', respuestas: ['were taken out'] },
  { antes: 'of the cupboard and everyone in the family played together. Also, the TV', verbo: 'not leave', respuestas: ["wasn't left", 'was not left'] },
]

/** De activa a pasiva: [activa, pasiva correcta, otras que parecen buenas]. */
export const ACTIVA_PASIVA: [string, string, string[]][] = [
  ['The cook prepares dinner every day.', 'Dinner is prepared by the cook every day.', ['Dinner prepared by the cook every day.', 'Dinner was prepared by the cook every day.', 'The cook is prepared by dinner every day.']],
  ['Many people watched the programme.', 'The programme was watched by many people.', ['The programme is watched by many people.', 'The programme watched by many people.', 'Many people were watched by the programme.']],
  ['My friends ate all of the food.', 'All of the food was eaten by my friends.', ['All of the food were eaten by my friends.', 'All of the food is eaten by my friends.', 'All of the food was ate by my friends.']],
  ['They clean the rooms on Sundays.', 'The rooms are cleaned on Sundays.', ['The rooms is cleaned on Sundays.', 'The rooms were cleaned on Sundays.', 'The rooms are clean on Sundays.']],
  ['Shakespeare wrote Romeo and Juliet.', 'Romeo and Juliet was written by Shakespeare.', ['Romeo and Juliet is written by Shakespeare.', 'Romeo and Juliet was wrote by Shakespeare.', 'Shakespeare was written by Romeo and Juliet.']],
  ['They sell vegetables at the market.', 'Vegetables are sold at the market.', ['Vegetables are sell at the market.', 'Vegetables is sold at the market.', 'Vegetables were sold at the market.']],
  ['Somebody stole my bike yesterday.', 'My bike was stolen yesterday.', ['My bike is stolen yesterday.', 'My bike was stole yesterday.', 'My bike were stolen yesterday.']],
  ['They make cars in this factory.', 'Cars are made in this factory.', ['Cars is made in this factory.', 'Cars are make in this factory.', 'Cars were made in this factory.']],
  ['They didn’t pay the servants a lot of money.', 'The servants weren’t paid a lot of money.', ['The servants didn’t paid a lot of money.', 'The servants wasn’t paid a lot of money.', 'The servants aren’t paid a lot of money.']],
]

// ---------- used to ----------

/** Frases con used to: sujeto, verbo, complemento, si es negativa y una pista de que ya no es así. */
export const FRASES_USED: { suj: string; v: string; resto: string; neg: boolean }[] = [
  { suj: 'Victorian children', v: 'have', resto: 'calculators', neg: true },
  { suj: 'They', v: 'do', resto: 'maths with an abacus', neg: false },
  { suj: 'Students', v: 'work', resto: 'with computers', neg: true },
  { suj: 'Students', v: 'write', resto: 'on small boards called slates', neg: false },
  { suj: 'Teachers', v: 'be', resto: 'very strict in Victorian schools', neg: false },
  { suj: 'Girls', v: 'study', resto: 'the same subjects as boys', neg: true },
  { suj: 'My grandparents', v: 'watch', resto: 'black-and-white TV', neg: false },
  { suj: 'People', v: 'send', resto: 'letters before email', neg: false },
  { suj: 'My dad', v: 'play', resto: 'football, but now he plays tennis', neg: false },
  { suj: 'I', v: 'like', resto: 'vegetables when I was little, but now I love them', neg: true },
  { suj: 'There', v: 'be', resto: 'a cinema in my town, but it closed', neg: false },
  { suj: 'She', v: 'have', resto: 'long hair, but now it is short', neg: false },
  { suj: 'We', v: 'live', resto: 'in a flat, but now we live in a house', neg: false },
  { suj: 'Children', v: 'wear', resto: 'jeans at school', neg: true },
  { suj: 'My mum', v: 'drink', resto: 'coffee, but now she drinks it every day', neg: true },
  { suj: 'People', v: 'travel', resto: 'by plane in the 19th century', neg: true },
]

export function usedTo(base: string, neg: boolean): string[] {
  return neg ? [`didn't use to ${base}`, `did not use to ${base}`] : [`used to ${base}`]
}

// Preguntas con used to: [frase con hueco, correcta, otras].
export const PREGUNTAS_USED: [string, string, string[]][] = [
  ['___ he use to teach English?', 'Did', ['Does', 'Was', 'Used']],
  ['Did your parents ___ walk to school?', 'use to', ['used to', 'uses to', 'using to']],
  ['Yes, he ___.', 'did', ['used', 'does', 'was']],
  ['Students ___ work with computers.', "didn't use to", ["didn't used to", "don't use to", "weren't use to"]],
  ['I ___ have a small calculator.', 'used to', ['use to', 'was used to', 'used']],
  ['Did children ___ wear uniforms?', 'use to', ['used to', 'were', 'wore']],
]
