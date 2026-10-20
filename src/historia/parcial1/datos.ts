// Xeografía e Historia 2.º ESO, parcial da 1.ª avaliación (26 de outubro de 2026): Roma + tema 1 (Bizancio, o Islam
// e o Imperio carolinxio). Datos dos apuntamentos e das presentacións do profesor. As fechas van como números
// (negativos antes de Cristo) para que as liñas do tempo e as preguntas de «que foi antes» as ordene o código.

export interface Feito {
  id: string
  ano: number
  /** Nome curto para os xogos de ordenar. */
  curto: string
  /** Como se escribe a data: «753 a.C.», «s. VI». */
  data: string
  texto: string
}

/** «753 a.C.» ou «476 d.C.» a partir do ano. */
export const dataDe = (ano: number) => (ano < 0 ? `${-ano} a.C.` : `${ano} d.C.`)

const f = (id: string, ano: number, curto: string, texto: string, data = dataDe(ano)): Feito => ({ id, ano, curto, data, texto })

export const FEITOS_ROMA: Feito[] = [
  f('fundacion', -753, 'Fundación de Roma', 'Fundación lendaria de Roma por Rómulo: comeza a Monarquía'),
  f('republica', -509, 'Comeza a República', 'Expulsan ao último rei, Tarquinio o Soberbio: comeza a República'),
  f('hispania', -218, 'Chegada a Hispania', 'Os romanos chegan a Hispania durante as Guerras Púnicas'),
  f('numancia', -133, 'Caída de Numancia', 'Caída de Numancia, despois dun longo asedio'),
  f('cesar', -44, 'Morte de Xulio César', 'Asasinato de Xulio César'),
  f('augusto', -27, 'Augusto emperador', 'Octavio Augusto, primeiro emperador: comeza o Imperio'),
  f('cantabros', -19, 'Fin da conquista de Hispania', 'Roma vence a cántabros e ástures: remata a conquista de Hispania'),
  f('division', 395, 'División do Imperio', 'División definitiva do Imperio á morte de Teodosio'),
  f('caida', 476, 'Caída de Occidente', 'Caída do Imperio romano de Occidente'),
]

export const FEITOS_MEDIEVO: Feito[] = [
  f('xustiniano', 550, 'Xustiniano', 'Máximo esplendor de Bizancio con Xustiniano', 's. VI'),
  f('hexira', 622, 'A héxira', 'A héxira: Mahoma foxe da Meca a Medina'),
  f('mahoma', 632, 'Morte de Mahoma', 'Morte de Mahoma: comezan os califas ortodoxos'),
  f('omeia', 661, 'Califato omeia', 'Califato omeia, con capital en Damasco'),
  f('poitiers', 732, 'Batalla de Poitiers', 'Batalla de Poitiers: os francos frean aos musulmáns'),
  f('abasi', 750, 'Califato abasí', 'Califato abasí, con capital en Bagdad'),
  f('carlomagno', 800, 'Coroación de Carlomagno', 'Coroación de Carlomagno como emperador'),
  f('verdun', 843, 'Tratado de Verdún', 'Tratado de Verdún: o Imperio carolinxio pártese en tres'),
  f('cisma', 1054, 'Cisma de Oriente', 'Cisma de Oriente: Igrexa ortodoxa e Igrexa católica', 's. XI'),
  f('constantinopla', 1453, 'Caída de Constantinopla', 'Os turcos conquistan Constantinopla'),
]

/** Os feitos de máis antigo a máis recente. */
export const enOrde = (fs: Feito[]) => [...fs].sort((a, b) => a.ano - b.ano)

/** As etapas de Roma, cos seus anos de comezo e fin. */
export const ETAPAS_ROMA = [
  { id: 'monarquia', nome: 'Monarquía', dende: -753, ata: -509, cor: '#f97316' },
  { id: 'republica', nome: 'República', dende: -509, ata: -27, cor: '#eab308' },
  { id: 'imperio', nome: 'Imperio', dende: -27, ata: 476, cor: '#ef4444' },
] as const

/** A etapa de Roma na que cae un ano. */
export const etapaDe = (ano: number) => ETAPAS_ROMA.find((e) => ano >= e.dende && ano < e.ata)?.nome

/** Os períodos da Idade Media, en séculos. */
export const PERIODOS_MEDIEVO = [
  { nome: 'Alta Idade Media', dende: 5, ata: 10 },
  { nome: 'Plena Idade Media', dende: 11, ata: 13 },
  { nome: 'Baixa Idade Media', dende: 14, ata: 15 },
] as const

/** O século dun ano despois de Cristo (o 476 é o século V). */
export const seculo = (ano: number) => Math.floor((ano - 1) / 100) + 1

const ROMANOS: [number, string][] = [
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I'],
]
/** Número romano ata o XX, para os séculos. */
export function romano(n: number): string {
  let s = ''
  for (const [v, r] of ROMANOS) while (n >= v) ((s += r), (n -= v))
  return s
}

/** O período medieval dun século. */
export const periodoDe = (s: number) => PERIODOS_MEDIEVO.find((p) => s >= p.dende && s <= p.ata)?.nome

/** O cursus honorum co que o profesor indica a idade mínima de cada cargo. */
export const CARGOS_IDADE = [
  { cargo: 'Cuestura', idade: 31 },
  { cargo: 'Tribunado', idade: 34 },
  { cargo: 'Edilidade', idade: 37 },
  { cargo: 'Pretura', idade: 40 },
  { cargo: 'Consulado', idade: 43 },
]
