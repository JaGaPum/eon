// Datos do global de Lingua Galega da 1.ª avaliación (unidade 2): boletíns, apuntes e vocabularios de Classroom.
// Tamén os usa o caderno en PDF (apuntes-fuente/galego-global1.gen.mjs).
import type { Grao } from '../../../lib/adxectivos'

// ——— Tipos de texto e de descrición ———

export const TIPOS_DESCRICION: [string, string][] = [
  ['Prosopografía', 'Descrición de trazos físicos dunha persoa.'],
  ['Etopea', 'Descrición de calidades morais, costumes, carácter ou crenzas (o psicolóxico).'],
  ['Retrato', 'Descrición de trazos físicos e psicolóxicos á vez.'],
  ['Autorretrato', 'Retrato que a persoa autora fai de si mesma.'],
  ['Caricatura', 'Descrición esaxerada ou distorsionada dos trazos dun personaxe.'],
  ['Topografía', 'Descrición detallada dun lugar, interior (unha estancia) ou exterior (unha paisaxe).'],
  ['Pragmatografía', 'Descrición de obxectos.'],
]

/** Exemplos curtos para recoñecer o tipo de descrición. */
export const EXEMPLOS_DESCRICION: [string, string][] = [
  ['Era alta e delgada, de pelo castaño e longo, cuns ollos verdes enormes e unha cicatriz no queixo.', 'Prosopografía'],
  ['O meu avó era xeneroso e paciente; nunca perdía os nervios e sempre tiña tempo para escoitar.', 'Etopea'],
  ['Marta é baixiña e ten os ollos negros; é tan alegre e faladora que enche calquera cuarto.', 'Retrato'],
  ['Son alto, levo lentes e teño o pelo rizo. Son algo tímido, pero cando collo confianza non calo.', 'Autorretrato'],
  ['Tiña un nariz tan longo que entraba na cociña dous minutos antes ca el, e unhas orellas coma dúas antenas parabólicas.', 'Caricatura'],
  ['A praia é unha area branca e fina entre dúas penas; ao fondo vense as illas e un piñeiral baixa ata a auga.', 'Topografía'],
  ['O cuarto era pequeno: unha cama pegada á fiestra, un armario de madeira escura e un escritorio cheo de libros.', 'Topografía'],
  ['O reloxo é de prata, redondo, coa esfera branca e uns números romanos de cor dourada.', 'Pragmatografía'],
  ['A mochila é azul, ten dous petos laterais, unha cremalleira grande e as asas acolchadas.', 'Pragmatografía'],
  ['O seu tío era un home bo e traballador, desconfiado cos estraños pero fiel aos amigos.', 'Etopea'],
]

export const TIPOS_TEXTO: [string, string][] = [
  ['Descritivo', 'Di como é unha persoa, un animal, un obxecto, un lugar ou un sentimento.'],
  ['Narrativo', 'Conta uns feitos que lles pasan a uns personaxes nun lugar e nun tempo.'],
  ['Expositivo', 'Informa e explica un tema de forma clara e ordenada.'],
  ['Instrutivo', 'Dá pasos ou ordes para facer algo (receitas, instrucións).'],
  ['Argumentativo', 'Defende unha opinión (tese) con razóns (argumentos).'],
]

/** Os textos da «Práctica tipos de textos» (só o comezo) e o seu tipo. */
export const TEXTOS_PRACTICA: { tipo: string; comezo: string; xenero?: string }[] = [
  { tipo: 'Descritivo', comezo: 'O oeste de Texas divide a fronteira entre México e Novo México. É moi bela pero áspera, e chea de cactus…', xenero: 'Guía de viaxes ou folleto turístico' },
  { tipo: 'Narrativo', comezo: 'Un tigre que de cachorro fora capturado por humanos, foi liberado logo de varios anos de vida doméstica…' },
  { tipo: 'Expositivo', comezo: 'Xeralmente, as cidades teñen grandes dificultades para destruír as grandes cantidades de lixo que xeran cada día os seus habitantes…' },
  { tipo: 'Instrutivo', comezo: 'Para ingresar ao caixeiro pase o cartón pola ranura que se atopa xunto á porta… Agarde a que se acenda a luz e empuxe a porta.' },
  { tipo: 'Argumentativo', comezo: 'Por que Lionel Messi é o mellor xogador do mundo? É moi sinxelo falar de Messi… cando é o xogador que máis goles anota…' },
]

// ——— A narración ———

export const TIGRE =
  'Un tigre que de cachorro fora capturado por humanos foi liberado logo de varios anos de vida doméstica. En canto o liberaron, correu á selva. Xa na espesura, os seus irmáns preguntáronlle: «Que aprendiches?». O tigre meditou sen présa. «Aprendín isto: non somos inmortais…», dixo por fin. Os outros tigres non o deixaron terminar: abalanzáronse sobre el e mordéronlle o pescozo ata que morreu. «É o problema dos enfermos de morte —dixo un dos felinos—: tórnanse resentidos e queren contaxiar a todos.»'

/** Fragmentos curtos para recoñecer o narrador. */
export const NARRADORES: [string, string, string][] = [
  ['Aquel verán eu tiña doce anos e pasaba as tardes na eira co meu avó.', 'Interno protagonista (1.ª persoa)', 'Conta a súa propia historia en primeira persoa.'],
  ['O meu amigo Brais entrou no portal tremendo. Eu vino desde a fiestra e non dixen nada.', 'Interno testemuña (1.ª persoa)', 'Fala en primeira persoa, pero a historia é doutro: el só a ve.'],
  ['Uxía pechou a porta. Por dentro sentía un medo que non lle contara a ninguén.', 'Externo omnisciente (3.ª persoa)', 'Fala en terceira persoa e sabe o que sente e pensa a personaxe.'],
  ['O home sentou no banco, mirou o reloxo dúas veces e marchou.', 'Externo obxectivo (3.ª persoa)', 'Fala en terceira persoa e só conta o que se ve, coma unha cámara.'],
  ['Ah!, pensou o tigre para os seus adentros, ese é un pensamento que os sorprenderá.', 'Externo omnisciente (3.ª persoa)', 'Sabe o que pensa o tigre por dentro.'],
  ['Eu chámome Balbino e son un neno labrego.', 'Interno protagonista (1.ª persoa)', 'Así comeza a contar a súa vida o protagonista de «Memorias dun neno labrego».'],
]

// ——— Variedades da lingua ———

export const VARIEDADES: [string, string, string][] = [
  ['Diastráticas', 'O nivel cultural do falante', 'Niveis: culto, medio e vulgar'],
  ['Diafásicas', 'A situación comunicativa', 'Rexistros: formal e coloquial'],
  ['Diatópicas', 'A zona xeográfica de onde procede o falante', 'Bloques dialectais: occidental, central e oriental'],
  ['Diacrónicas', 'O tempo no que se produce (hoxe, hai cen anos…)', 'O galego medieval, o de hoxe…'],
]

export const FRASES_FEITAS: [string, string][] = [
  ['Estar cunha man diante e outra detrás', 'Non ter nada de diñeiro'],
  ['Custar ferro e fariña', 'Custar moito esforzo'],
  ['Todo o que vén á rede é peixe', 'Todo serve para algo'],
  ['Falar coma un libro aberto', 'Falar moi ben, a xeito'],
  ['Ter un foguete no cu', 'Ser moi inquedo, non parar'],
  ['Cando mexen as galiñas', 'Nunca'],
  ['Ser baixo coma un repolo', 'Ser moi baixo'],
  ['Ser un falabarato', 'Falar máis do conveniente, prometer máis do que se vai cumprir'],
  ['Fuxir co rabo entre as pernas', 'Marchar avergoñado ou humillado'],
  ['Andar coa mosca detrás da orella', 'Sospeitar algo'],
]

/** O fragmento de «Tanis I o Mocos»: as palabras coloquiais e como dicilas nun rexistro formal. */
export const TANIS: [string, string][] = [
  ['largar un discurso', 'pronunciar un discurso'],
  ['chimpar unhas birras', 'beber unhas cervexas'],
  ['para animarme', 'para darme ánimo'],
  ['unha arenga chachi churri', 'unha arenga excelente'],
  ['deixar a todo o mundo flasheado', 'deixar a todos abraiados'],
  ['os carrozóns do Consello', 'os membros do Consello'],
  ['se algo non lles mola', 'se algo non lles agrada'],
]

// ——— Bloques dialectais (boletín 2) ———

/** Exercicio 1: as palabras e a súa forma estándar. Quedan fóra «cuando», «moito» e «muto/muito» (ver o informe). */
export const PALABRAS_BLOQUES: [string, string][] = [
  ['amigho', 'amigo'],
  ['xamois', 'xamóns'],
  ['ghato', 'gato'],
  ['canciós', 'cancións'],
  ['sincuenta', 'cincuenta'],
  ['canciois', 'cancións'],
  ['camín', 'camiño'],
  ['cancións', 'cancións'],
  ['vecín', 'veciño'],
  ['xamós', 'xamóns'],
  ['irmán', 'irmán'],
  ['xamóns', 'xamóns'],
]

/** Máis palabras, cos exemplos da presentación e do mapa lingüístico (ladróns, ladrós, ladrois). */
export const PALABRAS_BLOQUES_MAIS: [string, string][] = [
  ['ladróns', 'ladróns'],
  ['ladrós', 'ladróns'],
  ['ladrois', 'ladróns'],
  ['lus', 'luz'],
  ['des', 'dez'],
  ['faser', 'facer'],
  ['vesiño', 'veciño'],
  ['cans', 'cans'],
  ['cas', 'cans'],
  ['cais', 'cans'],
  ['avións', 'avións'],
  ['aviós', 'avións'],
  ['aviois', 'avións'],
  ['irmao', 'irmán'],
  ['paxarín', 'paxariño'],
  ['amigho', 'amigo'],
  ['pantalois', 'pantalóns'],
  ['padrín', 'padriño'],
]

/** Exercicio 2: frases para pasar ao estándar. As palabras dialectais e a súa forma estándar. */
export const FRASES_BLOQUES: { frase: string; cambios: Record<string, { estandar: string; nota?: string }> }[] = [
  { frase: 'O meu padrín vendeu os pantalois vellos na feira o domingo', cambios: { padrín: { estandar: 'padriño' }, pantalois: { estandar: 'pantalóns' } } },
  { frase: 'Asende a lus da cosiña, que non se ve ben', cambios: { asende: { estandar: 'acende' }, lus: { estandar: 'luz' }, cosiña: { estandar: 'cociña' } } },
  { frase: 'Foi teu irmao o que meteu mao nos xamós do veciño', cambios: { irmao: { estandar: 'irmán' }, mao: { estandar: 'man' }, xamós: { estandar: 'xamóns' } } },
  {
    frase: 'E logho por onde andabas que non te mirín, a última ves foi en Pasarón',
    cambios: { logho: { estandar: 'logo' }, mirín: { estandar: 'mirei', nota: 'no estándar, o pretérito de «mirar» é «mirei»' }, ves: { estandar: 'vez' } },
  },
]

// ——— O adxectivo ———

/** Exercicio 1: superlativos sintéticos. */
export const ADX_SINTETICOS = ['rico', 'baixo', 'bo', 'antigo', 'cruel', 'sabio', 'quente', 'difícil', 'acre', 'pobre']
/** Exercicio 2: todas as formas de superlativo. */
export const ADX_SUPERLATIVOS = ['bo', 'parvo', 'verde', 'custoso', 'mao', 'fácil', 'branco', 'enfermo', 'groso', 'louco', 'negro', 'canso']

/** Exercicio 3: frases para completar co comparativo. `diante`: o que vai despois do segundo oco. */
export const COMPARATIVOS: { antes: string; adx: string; despois: string; grao: Grao; diante: 'nome' | 'verbo' }[] = [
  { antes: 'A Encina sempre tivo moitos', adx: 'cartos', despois: 'el.', grao: 'superioridade', diante: 'nome' },
  { antes: 'O Rubén era', adx: 'fedello', despois: 'o seu curmán.', grao: 'igualdade', diante: 'nome' },
  { antes: 'O Miguel obtivo resultados', adx: 'bos', despois: 'pensaba.', grao: 'inferioridade', diante: 'verbo' },
  { antes: 'O Daniel é case', adx: 'rico', despois: 'o veciño.', grao: 'superioridade', diante: 'nome' },
  { antes: 'A Helena nunca estaba', adx: 'atenta', despois: 'min.', grao: 'inferioridade', diante: 'nome' },
  { antes: 'A Carme ten', adx: 'leiras', despois: 'parece.', grao: 'superioridade', diante: 'verbo' },
  { antes: 'Xamais conduciu', adx: 'ben', despois: 'elas.', grao: 'igualdade', diante: 'nome' },
  { antes: 'Agora é', adx: 'forte', despois: 'o Ricardo.', grao: 'inferioridade', diante: 'nome' },
  { antes: 'O descoñecido sempre será', adx: 'mao', despois: 'o coñecido.', grao: 'igualdade', diante: 'nome' },
  { antes: 'Os perigos son', adx: 'grandes', despois: 'pensabamos.', grao: 'inferioridade', diante: 'verbo' },
  { antes: 'Están', adx: 'abraiados', despois: 'vós.', grao: 'igualdade', diante: 'nome' },
]

/** Exercicio 4: concordancia. Os nomes que en galego teñen outro xénero ca en castelán. */
export const CONCORDANCIA: { frase: string; nome: string; xenero: 'masculino' | 'feminino'; ben: string; mal: string }[] = [
  { frase: 'A marxe do meu caderno é moi ___.', nome: 'a marxe', xenero: 'feminino', ben: 'estreita', mal: 'estreito' },
  { frase: 'Gustáballe tomar leite ___ polas noites.', nome: 'o leite', xenero: 'masculino', ben: 'quente', mal: 'quenta' },
  { frase: 'Gustáballe tomar mel ___ polas noites.', nome: 'o mel', xenero: 'masculino', ben: 'escuro', mal: 'escura' },
  { frase: 'A ponte ___ daquela vila fíxose hai dous anos.', nome: 'a ponte', xenero: 'feminino', ben: 'nova', mal: 'novo' },
  { frase: 'Dende o ___ cumio víase unha paisaxe.', nome: 'o cumio', xenero: 'masculino', ben: 'alto', mal: 'alta' },
  { frase: 'A rapaza viña co seu diadema ___.', nome: 'o diadema', xenero: 'masculino', ben: 'novo', mal: 'nova' },
  { frase: 'O sangue ___ saía pola ferida.', nome: 'o sangue', xenero: 'masculino', ben: 'vermello', mal: 'vermella' },
  { frase: 'Tiña a dor ___ no xeonllo.', nome: 'a dor', xenero: 'feminino', ben: 'forte e aguda', mal: 'forte e agudo' },
]

/** Exercicio 5: explicativo (epíteto) ou especificativo. */
export const EXPLICATIVOS: { adx: string; explicativo: string; especificativo: string }[] = [
  { adx: 'branco', explicativo: 'A branca neve cubría o monte.', especificativo: 'Puxo a camisa branca para a festa.' },
  { adx: 'duro', explicativo: 'O duro diamante risca o vidro.', especificativo: 'Prefiro o pan duro para as torradas.' },
  { adx: 'brillante', explicativo: 'O brillante sol da mañá entraba pola fiestra.', especificativo: 'Compraron a pintura brillante, non a mate.' },
  { adx: 'quente', explicativo: 'O quente lume da lareira.', especificativo: 'Abre a billa da auga quente.' },
  { adx: 'árido', explicativo: 'O árido deserto estendíase ata o horizonte.', especificativo: 'Cultivan nas terras áridas e nas húmidas.' },
]

// ——— Relacións semánticas ———

export const FALSOS_AMIGOS: { palabra: string; castelan: string; galego: string }[] = [
  { palabra: 'rubio', castelan: 'cor de pelo próxima ao amarelo (en galego, loiro)', galego: 'cor de pelo próxima ao vermello' },
  { palabra: 'largo', castelan: 'longo, de moita lonxitude', galego: 'ancho, de moita anchura' },
  { palabra: 'no', castelan: 'adverbio de negación (en galego, non)', galego: 'contracción de en + o («no cuarto»)' },
  { palabra: 'niño', castelan: 'neno, rapaz', galego: 'casa que fan as aves para os ovos' },
  { palabra: 'ola', castelan: 'onda do mar', galego: 'pota grande para cociñar' },
  { palabra: 'rato', castelan: 'anaco de tempo', galego: 'animal roedor pequeno (en castelán, ratón)' },
]

export const PARES_TIL: [string, string][] = [
  ['maza', 'ferramenta pesada para golpear'],
  ['mazá', 'froita da maceira'],
  ['venta', 'cada un dos buratos do nariz'],
  ['ventá', 'fiestra'],
  ['saia', 'peza de roupa que cae desde a cintura'],
  ['saía', 'forma do verbo saír (eu/el saía)'],
  ['pais', 'plural de pai (o pai e a nai)'],
  ['país', 'nación, territorio'],
  ['seria', 'feminino de serio'],
  ['sería', 'forma do verbo ser (condicional)'],
]

export const PARES_BV: [string, string, string, string][] = [
  ['baca', 'portaequipaxes do teito do coche', 'vaca', 'femia do touro'],
  ['barro', 'lama, terra con auga', 'varro', 'forma do verbo varrer (eu varro)'],
  ['boa', 'feminino de bo; serpe grande', 'voa', 'forma do verbo voar (el voa)'],
  ['bacilar', 'relativo aos bacilos (bacterias)', 'vacilar', 'dubidar, tremer'],
  ['basto', 'groseiro, tosco', 'vasto', 'moi amplo, extenso'],
  ['botar', 'lanzar, tirar', 'votar', 'dar o voto nunha elección'],
  ['balor', 'mofo, fungos da humidade', 'valor', 'valentía; o que vale algo'],
  ['cabo', 'extremo; punta de terra que entra no mar', 'cavo', 'forma do verbo cavar (eu cavo)'],
  ['rebelar', 'sublevarse, levantarse contra alguén', 'revelar', 'descubrir un segredo; revelar fotos'],
  ['nabal', 'terreo sementado de nabos', 'naval', 'relativo aos barcos e á navegación'],
]

// ——— Vocabulario ———

/** Partes do corpo (lámina de Classroom), co nome en castelán para preguntar. */
export const CORPO: [string, string][] = [
  ['a cabeza', 'la cabeza'], ['o cabelo', 'el pelo'], ['a fronte', 'la frente'], ['a cella', 'la ceja'], ['a pestana', 'la pestaña'],
  ['o ollo', 'el ojo'], ['a orella', 'la oreja'], ['o nariz', 'la nariz'], ['as ventas', 'las fosas nasales'], ['a boca', 'la boca'],
  ['os beizos', 'los labios'], ['a dentadura', 'la dentadura'], ['a lingua', 'la lengua'], ['o queixo', 'la barbilla'], ['a meixela', 'la mejilla'],
  ['o pescozo', 'el cuello'], ['o ombreiro', 'el hombro'], ['o peito', 'el pecho'], ['o lombo', 'la espalda'], ['a cintura', 'la cintura'],
  ['o embigo', 'el ombligo'], ['a cadeira', 'la cadera'], ['o brazo', 'el brazo'], ['o cóbado / cotobelo', 'el codo'], ['o antebrazo', 'el antebrazo'],
  ['o pulso', 'la muñeca'], ['a man', 'la mano'], ['a palma', 'la palma'], ['o polgar', 'el pulgar'], ['o índice', 'el índice'],
  ['a uña', 'la uña'], ['a perna', 'la pierna'], ['a coxa', 'el muslo'], ['o xeonllo', 'la rodilla'], ['a canela', 'la espinilla'],
  ['o papo da perna', 'la pantorrilla'], ['o nocello', 'el tobillo'], ['o calcañar', 'el talón'], ['o pé', 'el pie'], ['as dedas', 'los dedos del pie'],
  ['a uña do pé', 'la uña del pie'], ['a pel', 'la piel'], ['a barba', 'la barba'], ['o bigote', 'el bigote'], ['a axila', 'la axila'],
]

/** O pé e a perna (lámina de Classroom). */
export const PE_PERNA: [string, string][] = [
  ['o arco do pé', 'el arco del pie'], ['a articulación do pé', 'la articulación del pie'], ['a barriga ou papo da perna', 'la pantorrilla'],
  ['o calcañar', 'el talón'], ['a canela', 'la espinilla'], ['a coxa', 'el muslo'], ['a deda', 'el dedo del pie'], ['a deda grande', 'el dedo gordo del pie'],
  ['a deda pequena', 'el dedo meñique del pie'], ['a empeña', 'el empeine'], ['o nocello', 'el tobillo'], ['o pé', 'el pie'], ['a perna', 'la pierna'],
  ['a planta do pé', 'la planta del pie'], ['a uña da deda', 'la uña del dedo del pie'], ['o xeonllo', 'la rodilla'],
]

/** Aves de Galiza (guía de Classroom). */
export const AVES: [string, string][] = [
  ['pardal', 'gorrión'], ['merlo', 'mirlo'], ['paporroibo', 'petirrojo'], ['ferreiro real', 'carbonero común'], ['ferreiriño', 'herrerillo'],
  ['pega', 'urraca'], ['gaivota', 'gaviota'], ['pomba', 'paloma'], ['lavandeira', 'lavandera'], ['carriza', 'chochín'],
  ['pimpín', 'pinzón'], ['xílgaro', 'jilguero'], ['estorniño', 'estornino'], ['corvo', 'cuervo'], ['gaio', 'arrendajo'],
  ['anduriña', 'golondrina'], ['moucho', 'mochuelo'], ['curuxa', 'lechuza'], ['garza', 'garza'], ['miñato', 'ratonero'],
  ['bubela', 'abubilla'], ['cuco', 'cuco'], ['martiño peixeiro', 'martín pescador'], ['peto real', 'pájaro carpintero'], ['corvo mariño cristado', 'cormorán moñudo'],
]

/** Os 20 castelanismos máis frecuentes (artigo de Gloria Montenegro en GCiencia, 26/11/2024, que mandou ler a profesora). [castelanismo, forma correcta]. */
export const CASTELANISMOS: [string, string][] = [
  ['aportar', 'achegar'],
  ['buzón', 'caixa do correo'],
  ['lexos', 'lonxe'],
  ['plantexar', 'expoñer'],
  ['pobo (por vila ou aldea)', 'vila ou aldea'],
  ['soer', 'adoitar ou acostumar'],
  ['xove (por persoa nova)', 'novo ou nova'],
  ['casilla', 'casa (dun cadro)'],
  ['chicle', 'goma de mascar'],
  ['conlevar', 'implicar ou supor'],
  ['cumpreanos', 'aniversario'],
  ['enterarse', 'decatarse'],
  ['espalda', 'costas ou lombo'],
  ['gafas', 'lentes ou anteollos'],
  ['grifo', 'billa da auga'],
  ['orquesta', 'orquestra'],
  ['pegatina', 'adhesivo'],
  ['plantilla', 'cadro, soleta ou modelo'],
  ['sen embargo', 'porén ou con todo'],
  ['ubicar', 'situar ou localizar'],
]
