// Lingua Galega de 3.º (Olivia), unidade 2 «Somos o que comemos»: o conto e a noticia, o dicionario, o son K, as
// sílabas e as clases de palabras. As respostas de ortografía (son K, derivados, dígrafos) e de sílabas calcúlaas o
// código.
import type { ReactNode } from 'react'
import { Clasifica, Ordena, Proba, Une, VerdadeiroFalso, barallar, type Pregunta } from '../pezas'
import { elixe } from '../paisaxes/preguntas'
import { Parada } from '../../historia/parcial1/roma'
import { derivadoEiro, digrafos, diminutivoK, huecosK, type GrafiaK } from '../../lib/ortografia'
import { grupos, separar, silabas, tonica } from '../../lib/silabas'
import {
  ACURTADAS,
  ARBORES,
  CLASES,
  COCIÑAS,
  DIMINUTIVOS,
  EN_EIRO,
  ENTRADAS,
  FORMAS_DICIONARIO,
  INTRUSAS,
  NOME_ABREVIATURA,
  PALABRAS_CON_K,
  PALABRAS_DIGRAFOS,
  PALABRAS_K,
  PALABRAS_SILABAS,
  SEN_K,
  type Abreviatura,
  type Clase,
} from './datos'

type PropsParada = { ruta: string; modo?: string }
const U = 'comemos'
const Practica = ({ preguntas, acabar }: { preguntas: Pregunta[]; acabar: () => void }) => <Proba practica cantas={8} preguntas={preguntas} acabar={acabar} />
const azar = <T,>(xs: readonly T[], n: number) => barallar(xs).slice(0, n)
const Caixa = ({ children, cor = 'border-violet-200 bg-white' }: { children: ReactNode; cor?: string }) => <div className={`rounded-2xl border-2 p-3 ${cor}`}>{children}</div>
const debuxo = (e?: string) =>
  e ? (
    <span className="block text-center text-7xl" aria-hidden="true">
      {e}
    </span>
  ) : undefined
const Oco = ({ antes, despois }: { antes: string; despois: string }) => (
  <span className="font-mono tracking-wider">
    {antes}＿{despois}
  </span>
)

// ===================================================================================================
// 1. O conto «Espinacas con perexil» e a noticia
// ===================================================================================================

const CONTO_PREG: Pregunta[] = [
  elixe('Onde ocorre a historia de «Espinacas con perexil»?', 'Nun anaco do patio da escola', ['Nunha granxa', 'Na casa da avoa'], 'A escola ten un patio moi grande, e nun anaco de terra fan a horta.'),
  elixe('Quen conta a historia?', 'Unha nena ou un neno de terceiro', ['Carme, a directora', 'Guillerme, o mestre'], 'Fala en primeira persoa: «a nosa escola», «a nosa horta».'),
  elixe('De quen foi a idea de facer unha horta?', 'De Carme, a directora', ['De Guillerme, o mestre', 'Dos máis vellos da escola'], 'Carme colleu o micrófono e deulles a sorpresa.'),
  elixe('Como reaccionaron os nenos e as nenas?', 'Gustoulles moito e aplaudiron', ['Non lles gustou nada', 'Quedaron calados'], 'O comedor enteiro aplaudiu.'),
  elixe('Que lles advirte Carme?', 'Que unha horta dá traballo e hai que coidala todos os días', ['Que xa non poderán xogar no patio', 'Que as plantas non precisan auga'], '«Unha horta dá traballo e hai que coidala todos os días.»'),
  elixe('Quen organizou os horarios da horta?', 'Un grupo de mestres', ['O alumnado de terceiro', 'Os cociñeiros'], 'Un grupo de mestres encargouse de organizar os horarios.'),
  elixe('Por que non poden traballar todos á vez na horta?', 'Porque a horta é pequeniña', ['Porque non hai ferramentas', 'Porque chove moito'], '«A nosa horta é pequeniña e non podemos traballar todos á vez!»'),
  elixe('Quen preparou a terra?', 'Os máis vellos da escola', ['Os nenos e nenas de terceiro', 'A directora'], 'Cando os máis vellos xa prepararan a terra, tocoulles a eles botar sementes.'),
  elixe('Que acordaron botar os de terceiro?', 'Espinacas e perexil', ['Patacas e amorodos', 'Árbores e flores'], 'Ao final puxéronse de acordo para botar espinacas e perexil.'),
  elixe('Por que escolleron as espinacas?', 'Porque medran á présa', ['Porque teñen unha cor moi alegre', 'Porque son as máis grandes'], 'Facíalles ilusión que a horta comezase a producir.'),
  elixe('Por que escolleron o perexil?', 'Porque ten unha cor moi alegre e dá moi bo olor', ['Porque medra á présa', 'Porque é o máis doce'], 'Fixáronse na cor e no olor.'),
  elixe('Para que fixeron un espantallo?', 'Para que os paxaros non comesen as sementes', ['Para adornar o patio', 'Para regar a horta'], 'Fixérono cun pau de vasoira e roupa vella.'),
  elixe('Que facían cada día na horta co mestre Guillerme?', 'Regala, arrincar as malas herbas e vixiar os insectos', ['Xogar á mariola', 'Comer espinacas'], 'Ían en grupos e coidábana moito.'),
  elixe('Que fixeron cando chegou a colleita?', 'Unha festa', ['Unha excursión', 'Un exame'], 'Entre cancións e risas, cada clase depositou a súa colleita nun cesto.'),
  elixe('Que significa «algarabía»?', 'Ruído que fai un grupo de persoas que corren, berran, xogan…', ['Unha planta da horta', 'Un silencio moi grande'], 'Está no glosario do conto.'),
  elixe('Que é un espantallo?', 'Un boneco que se pon nas leiras para espantar os paxaros', ['Unha ferramenta para cavar', 'Un insecto da horta'], 'Está no glosario do conto.'),
  elixe('Que quere dicir que o cesto «rebordaba»?', 'Que saía fóra dos límites do cesto', ['Que estaba baleiro', 'Que estaba roto'], 'Estaba tan cheo que rebordaba de espinacas e perexil.'),
  elixe('Que son os primeiros «gromos» da plantación?', 'Os primeiros brotes que saen das sementes', ['Os primeiros froitos maduros', 'As malas herbas'], 'Cando comezaban a poñerse nerviosos viron os primeiros gromos.'),
]

/** As fases do traballo na horta (páxina 26, actividade 3). */
const FASES: { fase: string; que: string }[] = [
  { fase: 'Preparar a terra', que: 'Encárganse os máis vellos.' },
  { fase: 'Sementar', que: 'Tómase unha decisión por acordo.' },
  { fase: 'Regar e coidar', que: 'Vixíase a horta e faise un espantallo.' },
  { fase: 'A colleita', que: 'Faise unha festa para celebralo.' },
]

const NOTICIA_PREG: Pregunta[] = [
  elixe('Con que intención se escribiu a noticia?', 'Informar sobre unha actividade recente da escola', ['Dar instrucións para coidar unha horta', 'Contar un conto inventado'], 'As noticias informan de feitos actuais.'),
  elixe('Como se chama a publicación?', 'Os catro ventos', ['Somos o que comemos', 'A Maía'], '«Os catro ventos», revista mensual de Vilarelle.'),
  elixe('Cal é a data de publicación?', 'Outubro de 2022', ['29 de setembro', 'Xuño de 2022'], 'Vai arriba á dereita: outubro de 2022.'),
  elixe('Cal é o titular da noticia?', 'O alumnado de terceiro visita as hortas locais', ['Somos o que comemos', 'Espinacas con perexil'], 'O titular vai en letras grandes, enriba de todo.'),
  elixe('Quen escribiu a noticia?', 'Alberte Carracedo', ['Sabela Vila', 'Maruxa Castro'], 'O nome do xornalista vai ao comezo do texto.'),
  elixe('Que pasou?', 'O alumnado de 3.º visitou as hortas urbanas', ['Inaugurouse un restaurante', 'Fíxose unha festa da colleita'], 'É o que conta o titular.'),
  elixe('A quen lle pasou?', 'Ao alumnado de 3.º de Primaria do CEIP A Maía', ['Aos mestres de Bertamiráns', 'Ás labregas'], 'Foron os nenos e as nenas de terceiro.'),
  elixe('Cando pasou?', 'O 29 de setembro', ['O 29 de outubro', 'Ao rematar o curso'], '«Visitou o pasado 29 de setembro…»'),
  elixe('Onde pasou?', 'Nas hortas urbanas de Bertamiráns', ['No patio da escola', 'En Vilarelle'], '«…as hortas urbanas de Bertamiráns.»'),
  elixe('Quen explicou as tarefas da horta?', 'Maruxa e Iria Castro, dúas irmás labregas', ['Breixo e Mariña', 'Sabela Vila'], 'Foron as encargadas de explicar paso a paso as tarefas.'),
  elixe('De que proxecto forma parte a actividade?', '«Somos o que comemos»', ['«Os catro ventos»', '«Espinacas con perexil»'], 'O proxecto quere que coñezan a orixe dos alimentos.'),
  elixe('Quen participa no proxecto?', 'Todas as clases de Primaria', ['Só o alumnado de terceiro', 'Só os mestres'], '«Esta iniciativa, en que están implicadas todas as clases de Primaria…»'),
  elixe('Que vai facer a escola ao finalizar o curso?', 'Unha xornada de portas abertas', ['Unha excursión á praia', 'Unha venda de verduras'], '«Manterémosvos informados!»'),
  elixe('Que preguntas responde toda noticia?', 'Que pasou?, a quen?, cando? e onde?', ['Quen gañou e quen perdeu?', 'Que che gusta e que non?'], 'Son as catro preguntas do esquema da páxina 34.'),
  elixe('Que é un pé de foto?', 'Unha frase curta que describe o contido dunha imaxe', ['O nome do fotógrafo', 'A data da foto'], 'Adoita ir na parte inferior da fotografía.'),
  elixe('Unha noticia inclúe a opinión de quen a escribe?', 'Non: conta feitos', ['Si, sempre'], 'As opinións que aparecen son das persoas entrevistadas, entre comiñas.'),
  elixe('Só os xornais poden publicar noticias?', 'Non: tamén revistas, radio, televisión e internet', ['Si, só os xornais'], 'Esta noticia, por exemplo, saíu nunha revista.'),
  ...FASES.map((f, i) => elixe(<>Na horta: «{f.que}» En que fase?</>, `${i + 1}.ª: ${f.fase}`, FASES.filter((x) => x !== f).map((x) => `${FASES.indexOf(x) + 1}.ª: ${x.fase}`), <>A fase {i + 1} é {f.fase.toLowerCase()}.</>)),
]

const PREGUNTAS_XORNALISTA = [
  { palabra: 'Breixo e Mariña', significado: 'Que credes que aprendestes coas labregas?' },
  { palabra: 'Sabela Vila', significado: 'Por que decidistes apostar pola horta escolar?' },
  { palabra: 'Maruxa e Iria Castro', significado: 'Como valorades a experiencia co alumnado?' },
]

const LECTURA_PREG = [...CONTO_PREG, ...NOTICIA_PREG]

export function Lectura(p: PropsParada) {
  return (
    <Parada
      {...p}
      unidade={U}
      id="lectura"
      titulo="O conto e a noticia"
      tarxetas={[
        {
          titulo: '«Espinacas con perexil» (Teresa Broseta)',
          texto: (
            <>
              <p>
                <b>Carme, a directora</b>, propón facer unha horta nun anaco do patio. A todos lles gusta, pero dá traballo!
              </p>
              <p>Un grupo de mestres organiza os horarios, porque a horta é pequeniña. Os máis vellos preparan a terra.</p>
              <p>
                Os de terceiro póñense de acordo: <b>espinacas</b> (medran á présa) e <b>perexil</b> (cor alegre e bo olor).
              </p>
            </>
          ),
          visual: debuxo('🥬🌿'),
        },
        {
          titulo: 'As fases da horta',
          texto: (
            <ol className="space-y-2">
              {FASES.map((f, i) => (
                <li key={f.fase} className="rounded-xl bg-white p-2">
                  <b>
                    {i + 1}. {f.fase}:
                  </b>{' '}
                  {f.que}
                </li>
              ))}
            </ol>
          ),
          visual: debuxo('⛏️🌱💧🧺'),
        },
        {
          titulo: 'Palabras do conto',
          texto: (
            <div className="space-y-2">
              <Caixa>
                <b>algarabía:</b> ruído que fai un grupo de persoas que corren, berran, xogan…
              </Caixa>
              <Caixa>
                <b>espantallo:</b> boneco que se pon nas leiras para espantar os paxaros.
              </Caixa>
              <Caixa>
                <b>rebordaba:</b> saía fóra dos límites do cesto.
              </Caixa>
            </div>
          ),
        },
        {
          titulo: 'A noticia: as súas partes',
          texto: (
            <div className="grid gap-2 sm:grid-cols-2">
              <Caixa>
                <b>Publicación:</b> Os catro ventos
              </Caixa>
              <Caixa>
                <b>Data:</b> outubro de 2022
              </Caixa>
              <Caixa>
                <b>Titular:</b> O alumnado de terceiro visita as hortas locais
              </Caixa>
              <Caixa>
                <b>Xornalista:</b> Alberte Carracedo
              </Caixa>
            </div>
          ),
          visual: debuxo('📰'),
        },
        {
          titulo: 'Toda noticia responde catro preguntas',
          texto: (
            <div className="grid gap-2 sm:grid-cols-2">
              <Caixa cor="border-sky-200 bg-sky-50">
                🔍 <b>Que pasou?</b> O alumnado visitou as hortas.
              </Caixa>
              <Caixa cor="border-sky-200 bg-sky-50">
                👤 <b>A quen?</b> Ao alumnado de 3.º do CEIP A Maía.
              </Caixa>
              <Caixa cor="border-sky-200 bg-sky-50">
                ⏳ <b>Cando?</b> O 29 de setembro.
              </Caixa>
              <Caixa cor="border-sky-200 bg-sky-50">
                📍 <b>Onde?</b> Nas hortas urbanas de Bertamiráns.
              </Caixa>
            </div>
          ),
        },
      ]}
      xogos={[
        { id: 'fases', titulo: 'Ordena as fases', icono: '🌱', explica: 'O traballo na horta, en orde.', crear: (acabar) => <Ordena frases={[{ palabras: FASES.map((f) => f.fase), traducion: 'Toca as fases da horta en orde.' }]} acabar={acabar} /> },
        { id: 'xornalista', titulo: 'Quen responde?', icono: '🎙️', explica: 'A quen lle fai cada pregunta o xornalista?', crear: (acabar) => <Une axuda="Toca as persoas e despois a pregunta que lles fai o xornalista." pares={PREGUNTAS_XORNALISTA} acabar={acabar} /> },
        {
          id: 'vf',
          titulo: 'Verdadeiro ou falso',
          icono: '✅',
          explica: 'Sobre o conto e a noticia.',
          crear: (acabar) => (
            <VerdadeiroFalso
              frases={[
                { texto: 'A idea da horta foi de Carme, a directora.', certa: true, explica: 'Deulles a sorpresa no comedor.' },
                { texto: 'Os de terceiro botaron patacas e amorodos.', certa: false, explica: 'Botaron espinacas e perexil.' },
                { texto: 'O espantallo era para que os paxaros non comesen as sementes.', certa: true, explica: 'Fixérono cun pau de vasoira e roupa vella.' },
                { texto: 'As noticias contan feitos actuais que lle interesan a moita xente.', certa: true, explica: 'Por iso se publican.' },
                { texto: 'Unha noticia inclúe a opinión de quen a escribe.', certa: false, explica: 'Conta feitos; as opinións son das persoas entrevistadas.' },
                { texto: 'A visita foi ás hortas urbanas de Bertamiráns.', certa: true, explica: 'O 29 de setembro.' },
              ]}
              acabar={acabar}
            />
          ),
        },
        { id: 'practica', titulo: 'Preguntas', icono: '❓', explica: 'Sobre o conto e a noticia.', crear: (acabar) => <Practica preguntas={LECTURA_PREG} acabar={acabar} /> },
      ]}
      preguntas={LECTURA_PREG}
    />
  )
}

// ===================================================================================================
// 2. O dicionario
// ===================================================================================================

const ABREVIATURAS = Object.keys(NOME_ABREVIATURA) as Abreviatura[]

/** Formas que non son a do dicionario, para as opcións: as outras do libro e o xerundio dos verbos. */
function noDicionario(f: (typeof FORMAS_DICIONARIO)[number]): string[] {
  const outras = f.formas.filter((x) => x !== f.entrada)
  if (f.clase === 'verbo') outras.push(`${f.entrada.slice(0, -1)}ndo`)
  if (f.clase === 'adxectivo' && f.entrada.endsWith('o')) outras.push(`${f.entrada.slice(0, -1)}a`)
  if (f.clase === 'substantivo') outras.push(`${f.entrada}s`)
  return [...new Set(outras)].filter((x) => x !== f.entrada)
}
const REGRA_FORMA: Record<string, string> = { substantivo: 'Os substantivos aparecen en singular.', adxectivo: 'Os adxectivos aparecen en masculino e singular.', verbo: 'Os verbos aparecen en infinitivo (-ar, -er, -ir).' }

const DICIONARIO_PREG: Pregunta[] = [
  elixe(<>No dicionario: «regar (v.) Botarlle auga a unha planta». Que indica a «v.»?</>, 'É un verbo', ['É un substantivo', 'É un adxectivo'], 'v. = verbo.'),
  ...ABREVIATURAS.map((a) => elixe(<>Que quere dicir «{a}» no dicionario?</>, NOME_ABREVIATURA[a], ABREVIATURAS.filter((x) => x !== a).map((x) => NOME_ABREVIATURA[x]), <>«{a}» = {NOME_ABREVIATURA[a]}.</>)),
  ...ENTRADAS.map((e) => elixe(<>«{e.palabra}: {e.definicion}» Que abreviatura leva?</>, e.abreviatura, ABREVIATURAS.filter((x) => x !== e.abreviatura), <>«{e.palabra}» é un {NOME_ABREVIATURA[e.abreviatura]}.</>)),
  ...ENTRADAS.map((e) => elixe(<>Que palabra significa: «{e.definicion}»?</>, e.palabra, azar(ENTRADAS.filter((x) => x !== e), 2).map((x) => x.palabra), <>É «{e.palabra}».</>)),
  ...FORMAS_DICIONARIO.flatMap((f) =>
    f.formas
      .filter((x) => x !== f.entrada)
      .map((x) => elixe(<>Buscas «{x}» no dicionario. Como aparece?</>, f.entrada, noDicionario(f).filter((y) => y !== f.entrada), <>{REGRA_FORMA[f.clase]} Búscase «{f.entrada}».</>)),
  ),
  elixe('Como aparecen os verbos no dicionario?', 'En infinitivo: sementar, regar', ['Como «sementaba»', 'Como «sementando»'], REGRA_FORMA.verbo),
  elixe('Como aparecen os adxectivos no dicionario?', 'En masculino singular: tenro', ['En feminino: tenra', 'En plural: tenras'], REGRA_FORMA.adxectivo),
  elixe('Como aparecen os substantivos no dicionario?', 'En singular: cesto', ['En plural: cestos', 'Como queiras'], REGRA_FORMA.substantivo),
  elixe('Que informa o dicionario ademais do significado?', 'A clase de palabra e, nos substantivos, se é masculino ou feminino', ['Como se pronuncia en inglés', 'Cantas veces se usa'], 's., adx., v.… e m. ou f.'),
]

export function Dicionario(p: PropsParada) {
  return (
    <Parada
      {...p}
      unidade={U}
      id="dicionario"
      titulo="O dicionario"
      tarxetas={[
        {
          titulo: 'Unha entrada de dicionario',
          texto: (
            <>
              <Caixa cor="border-pink-200 bg-pink-50">
                <b>regar</b> <span className="rounded-full border-2 border-sky-500 px-1.5">v.</span> Botarlle auga a unha planta para que medre.
              </Caixa>
              <p>O dicionario dinos o significado e a clase de palabra:</p>
              <div className="grid grid-cols-2 gap-2">
                {ABREVIATURAS.map((a) => (
                  <Caixa key={a}>
                    <b>{a}</b> = {NOME_ABREVIATURA[a]}
                  </Caixa>
                ))}
              </div>
            </>
          ),
          visual: debuxo('📖'),
        },
        {
          titulo: 'En que forma aparecen as palabras?',
          texto: (
            <div className="space-y-2">
              <Caixa>
                <b>Substantivos:</b> en singular. cestos → <b>cesto</b>
              </Caixa>
              <Caixa>
                <b>Adxectivos:</b> en masculino singular. tenras → <b>tenro</b>
              </Caixa>
              <Caixa>
                <b>Verbos:</b> en infinitivo. sementaba → <b>sementar</b>
              </Caixa>
            </div>
          ),
        },
        {
          titulo: 'Entradas do libro',
          texto: (
            <div className="space-y-2">
              {ENTRADAS.slice(0, 6).map((e) => (
                <Caixa key={e.palabra}>
                  <b>{e.palabra}</b> <i>{e.abreviatura}</i> {e.definicion}
                </Caixa>
              ))}
            </div>
          ),
        },
      ]}
      xogos={[
        {
          id: 'clase',
          titulo: 'Que abreviatura leva?',
          icono: '🏷️',
          explica: 'Cada palabra na súa caixa.',
          crear: (acabar) => (
            <Clasifica
              caixas={ABREVIATURAS.map((a, i) => ({ id: a, nome: `${a} (${NOME_ABREVIATURA[a]})`, cor: ['border-sky-300 bg-sky-100', 'border-pink-300 bg-pink-100', 'border-amber-300 bg-amber-100', 'border-emerald-300 bg-emerald-100'][i] }))}
              elementos={ENTRADAS.map((e) => ({ texto: e.palabra, caixa: e.abreviatura }))}
              acabar={acabar}
            />
          ),
        },
        { id: 'significado', titulo: 'Une co significado', icono: '🔗', explica: 'Cada palabra coa súa definición.', crear: (acabar) => <Une pares={azar(ENTRADAS, 5).map((e) => ({ palabra: e.palabra, significado: e.definicion }))} acabar={acabar} /> },
        { id: 'practica', titulo: 'Busca no dicionario', icono: '✏️', explica: 'En que forma aparece cada palabra?', crear: (acabar) => <Practica preguntas={DICIONARIO_PREG} acabar={acabar} /> },
      ]}
      preguntas={DICIONARIO_PREG}
    />
  )
}

// ===================================================================================================
// 3. O son K
// ===================================================================================================

const REGRA_K: Record<GrafiaK, string> = { c: 'Diante de a, o, u escríbese c.', qu: 'Diante de e, i escríbese qu.', k: 'A k vai en palabras que veñen doutras linguas.' }
const OPCIONS_K: GrafiaK[] = ['c', 'qu']

/** Unha pregunta por cada son K da palabra: ca＿is → qu. */
const ocosK = (palabra: string, d?: string): Pregunta[] =>
  huecosK(palabra)
    .filter((h) => h.grafia !== 'k')
    .map((h) =>
      elixe(
        <>
          c ou qu? <Oco antes={h.antes} despois={h.despues} />
        </>,
        h.grafia,
        OPCIONS_K.filter((x) => x !== h.grafia),
        <>
          Escríbese «{palabra}». {REGRA_K[h.grafia]}
        </>,
        debuxo(d),
      ),
    )

/** Como se escribiría mal unha palabra con k: con c ou con qu. */
const sinK = (w: string) => w.replace(/k(?=[ei])/g, 'qu').replace(/k/g, 'c')

const dobreK = PALABRAS_K.map((x) => x.palabra).filter((w) => huecosK(w).length === 2)
const unK = PALABRAS_K.map((x) => x.palabra).filter((w) => huecosK(w).length === 1)

const SONK_PREG: Pregunta[] = [
  ...PALABRAS_K.flatMap((x) => ocosK(x.palabra, x.debuxo)),
  elixe('No ditado escribiuse «cacis». Como se escribe?', 'caquis', ['cacis', 'cakis'], 'Diante de i, o son K escríbese qu: ca-quis.'),
  elixe(
    <>
      Como se pode escribir <Oco antes="" despois="ilogramo" />?
    </>,
    'Con qu ou con k: quilogramo e kilogramo',
    ['Só con c: cilogramo', 'Só con k: kilogramo'],
    'Valen as dúas: quilogramo e kilogramo.',
  ),
  ...PALABRAS_CON_K.map((x) => elixe('Como se escribe?', x.palabra, [sinK(x.palabra)], <>«{x.palabra}» vén do {x.lingua}: por iso leva k.</>, debuxo(x.debuxo))),
  ...PALABRAS_CON_K.map((x) => elixe(<>De que lingua vén «{x.palabra}»?</>, x.lingua, ['inglés', 'xaponés', 'francés'].filter((l) => l !== x.lingua), <>«{x.palabra}» vén do {x.lingua}.</>)),
  ...DIMINUTIVOS.map((w) => {
    const bo = diminutivoK(w)
    const raiz = w.slice(0, -2)
    const fin = w.endsWith('a') ? 'ña' : 'ño'
    return elixe(<>{w} → ? (como cunca → cunquiña)</>, bo, [`${raiz}ci${fin}`, `${raiz}qui${fin === 'ña' ? 'na' : 'no'}`], <>Diante de i o son K escríbese qu: {bo}.</>)
  }),
  ...EN_EIRO.map((w) => {
    const bo = derivadoEiro(w)
    const raiz = w.slice(0, -2)
    return elixe(<>{w} → ? (como banco → banqueiro)</>, bo, [`${raiz}ceiro`, `${raiz}keiro`], <>Diante de e o son K escríbese qu: {bo}.</>)
  }),
  ...SEN_K.map((w) => elixe('Cal destas palabras ten o son K?', azar(unK, 1)[0], [w], <>A c diante de e, i non soa K: «{w}» non o ten.</>)),
  ...azar(dobreK, 4).map((w) => elixe('Cal destas palabras ten dúas veces o son K?', w, azar(unK, 2), <>«{w}» ten dous sons K.</>)),
  elixe('Cal destas palabras comeza por qu?', 'queixo', ['cabaza', 'coitelo', 'cazola'], 'que-ixo: comeza por qu.'),
  elixe('En «cervo», a c soa coma K?', 'Non', ['Si'], 'Diante de e, i, a c soa distinto: cervo, fociño.'),
  elixe('En «branca», a c soa coma K?', 'Si', ['Non'], 'Diante de a, a c soa K.'),
]

export function SonK(p: PropsParada) {
  const ocos = SONK_PREG.filter((q) => q.tipo === 'elixe' && OPCIONS_K.includes(q.correcta as GrafiaK))
  return (
    <Parada
      {...p}
      unidade={U}
      id="sonk"
      titulo="O son K"
      tarxetas={[
        {
          titulo: 'c ou qu?',
          texto: (
            <>
              <p>O son K pódese escribir con c ou con qu:</p>
              <Caixa cor="border-pink-200 bg-pink-50">
                <b className="text-rose-600">c</b> diante de <b>a, o, u</b>: capa, cova, curso.
              </Caixa>
              <Caixa cor="border-amber-200 bg-amber-50">
                <b className="text-rose-600">qu</b> diante de <b>e, i</b>: queixada, esquío.
              </Caixa>
            </>
          ),
          visual: debuxo('🎃🧀'),
        },
        {
          titulo: 'Coidado!',
          texto: (
            <>
              <Caixa>
                A <b>c</b> diante de <b>e, i</b> non soa K: cervo, fociño.
              </Caixa>
              <Caixa>
                No ditado: «caquis», non «cacis». Diante de <b>i</b>, qu.
              </Caixa>
              <Caixa>
                Ao facer palabras novas cambia a letra: cun<b>c</b>a → cun<b>qu</b>iña, ban<b>c</b>o → ban<b>qu</b>eiro, bone<b>c</b>a → bone<b>qu</b>iña (con ñ!).
              </Caixa>
            </>
          ),
        },
        {
          titulo: 'Unha letra pouco común: a k',
          texto: (
            <>
              <p>Moitas palabras con k veñen doutras linguas:</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {PALABRAS_CON_K.map((x) => (
                  <Caixa key={x.palabra}>
                    <span className="text-3xl">{x.debuxo}</span> <b>{x.palabra}</b>
                    <br />
                    <span className="text-slate-500">{x.lingua}</span>
                  </Caixa>
                ))}
              </div>
              <p>«Quilogramo» pódese escribir tamén «kilogramo».</p>
            </>
          ),
        },
      ]}
      xogos={[
        {
          id: 'clasifica',
          titulo: 'Con c ou con qu',
          icono: '🗂️',
          explica: 'As palabras da páxina 28.',
          crear: (acabar) => (
            <Clasifica
              caixas={[
                { id: 'c', nome: 'Escríbense con c', cor: 'border-pink-300 bg-pink-100' },
                { id: 'qu', nome: 'Escríbense con qu', cor: 'border-amber-300 bg-amber-100' },
              ]}
              elementos={['áncora', 'esquío', 'cabaza', 'queixo', 'cullerón', 'raqueta', 'paquete', 'cazola', 'requeixo', 'coitelo'].map((w) => ({ texto: w, caixa: huecosK(w)[0].grafia, pista: `Mira que vogal vai despois do son K en «${w}».` }))}
              acabar={acabar}
            />
          ),
        },
        { id: 'ocos', titulo: 'Completa', icono: '🧩', explica: 'c ou qu?', crear: (acabar) => <Practica preguntas={ocos} acabar={acabar} /> },
        { id: 'palabras', titulo: 'Palabras novas', icono: '🐮', explica: 'cunca → cunquiña, vaca → vaqueiro.', crear: (acabar) => <Practica preguntas={SONK_PREG.filter((q) => q.tipo === 'elixe' && /iña|iño|eiro/.test(q.correcta))} acabar={acabar} /> },
        {
          id: 'k',
          titulo: 'Palabras con k',
          icono: '🥝',
          explica: 'De que lingua veñen?',
          crear: (acabar) => (
            <Clasifica
              caixas={[
                { id: 'inglés', nome: 'Do inglés', cor: 'border-sky-300 bg-sky-100' },
                { id: 'xaponés', nome: 'Do xaponés', cor: 'border-rose-300 bg-rose-100' },
              ]}
              elementos={PALABRAS_CON_K.map((x) => ({ texto: x.palabra, caixa: x.lingua }))}
              acabar={acabar}
            />
          ),
        },
      ]}
      preguntas={SONK_PREG}
    />
  )
}

// ===================================================================================================
// 4. As sílabas
// ===================================================================================================

const NOME_N = ['', 'monosílaba', 'bisílaba', 'trisílaba', 'polisílaba']
const tipoN = (n: number) => NOME_N[Math.min(n, 4)]
const silabaTonica = (w: string) => {
  const ss = silabas(w)
  return ss[ss.length - 1 - tonica(w)]
}
const conTonica = (w: string) => {
  const ss = silabas(w)
  const t = ss.length - 1 - tonica(w)
  return ss.map((s, i) => (i === t ? s.toUpperCase() : s)).join('-')
}
const tenDitongo = (w: string) => grupos(w).some((g) => g.tipo === 'diptongo')

/** Separacións mal feitas para as opcións: xuntar dúas sílabas ou pasar unha consoante á sílaba de antes. */
function malSeparada(w: string): string[] {
  const ss = silabas(w)
  const r = new Set<string>()
  if (ss.length > 1) r.add([ss[0] + ss[1], ...ss.slice(2)].join('-'))
  const k = ss.findIndex((s, i) => i > 0 && /^[^aeiouáéíóú]/i.test(s) && s.length > 1)
  if (k > 0) r.add([...ss.slice(0, k - 1), ss[k - 1] + ss[k][0], ss[k].slice(1), ...ss.slice(k + 1)].join('-'))
  r.delete(separar(w))
  return [...r]
}

const CONTAR_PREG: Pregunta[] = PALABRAS_SILABAS.map((w) => {
  const n = silabas(w).length
  return elixe(<>Cantas sílabas ten «{w}»?</>, String(n), ['1', '2', '3', '4', '5'].filter((x) => x !== String(n)).slice(0, 3), <>{separar(w)}: {n === 1 ? 'unha sílaba' : `${n} sílabas`}.</>)
})
const SEPARA_PREG: Pregunta[] = PALABRAS_SILABAS.filter((w) => silabas(w).length > 1).map((w) => elixe(<>Como se separa «{w}» en sílabas?</>, separar(w), malSeparada(w), <>{separar(w)}</>))
const TONICA_PREG: Pregunta[] = PALABRAS_SILABAS.filter((w) => silabas(w).length > 1).map((w) =>
  elixe(<>Cal é a sílaba tónica de «{w}»?</>, silabaTonica(w), [...new Set(silabas(w))].filter((s) => s !== silabaTonica(w)), <>{conTonica(w)}: a que se pronuncia con máis forza.</>),
)

const SILABAS_PREG: Pregunta[] = [
  ...CONTAR_PREG,
  ...SEPARA_PREG,
  ...PALABRAS_SILABAS.map((w) => {
    const t = tipoN(silabas(w).length)
    return elixe(<>«{w}» é…</>, t, NOME_N.slice(1).filter((x) => x !== t), <>{separar(w)}: {t}.</>)
  }),
  ...TONICA_PREG,
  ...['leituga', 'hórreo', 'froiteiro', 'receita', 'avioneta', 'científica', 'xouba', 'ceo', 'ponte', 'elefante'].map((w) =>
    elixe(<>«{w}» ten unha sílaba con ditongo?</>, tenDitongo(w) ? 'Si' : 'Non', [tenDitongo(w) ? 'Non' : 'Si'], tenDitongo(w) ? <>Si: {grupos(w).filter((g) => g.tipo === 'diptongo').map((g) => g.vocales).join(', ')} van na mesma sílaba ({separar(w)}).</> : <>Non: {separar(w)}.</>),
  ),
  ...ARBORES.flatMap((a) => [
    elixe(
      <>Xunta as sílabas tónicas de {a.pistas.map((w) => `«${w}»`).join(', ')}. Que árbore froiteira sae?</>,
      a.pistas.map((w) => silabaTonica(w).toUpperCase()).join(''),
      ARBORES.filter((x) => x !== a).map((x) => x.arbore).concat(['CEREIXEIRA']),
      <>{a.pistas.map(conTonica).join(' · ')}</>,
    ),
  ]),
  ...ACURTADAS.map(([longa, curta]) => {
    const menos = silabas(longa).length - silabas(curta).length
    return elixe(<>Dicimos «{curta}» por «{longa}». Cantas sílabas menos ten?</>, String(menos), ['1', '2', '3', '4'].filter((x) => x !== String(menos)), <>{separar(longa)} ({silabas(longa).length}) → {separar(curta)} ({silabas(curta).length}).</>)
  }),
  elixe('Que é unha sílaba?', 'O son ou grupo de sons que pronunciamos nun só golpe de voz', ['Unha letra soa', 'Unha palabra moi curta'], 'As palabras pódense dividir en sílabas.'),
  elixe('Que é a sílaba tónica?', 'A que se pronuncia con máis intensidade', ['A primeira de todas', 'A última de todas'], 'As outras son átonas.'),
  elixe('As polisílabas teñen…', 'máis de tres sílabas', ['unha sílaba', 'dúas sílabas', 'tres sílabas'], 'ca-me-ri-no, or-de-na-dor.'),
]

export function Silabas(p: PropsParada) {
  const exemplo = (w: string) => (
    <span key={w} className="rounded-xl bg-white px-3 py-1.5 font-mono text-lg">
      {conTonica(w)}
    </span>
  )
  return (
    <Parada
      {...p}
      unidade={U}
      id="silabas"
      titulo="As sílabas"
      tarxetas={[
        {
          titulo: 'Palabras e sílabas',
          texto: (
            <>
              <p>
                Unha <b>sílaba</b> é o son ou grupo de sons que pronunciamos xuntos nun só golpe de voz. Dá palmadas!
              </p>
              <div className="flex flex-wrap gap-2">{['camión', 'animal', 'pedra'].map(exemplo)}</div>
              <p>
                A sílaba que se pronuncia con máis forza é a <b>tónica</b> (en maiúsculas). As outras son <b>átonas</b>.
              </p>
            </>
          ),
          visual: debuxo('👏'),
        },
        {
          titulo: 'Segundo as súas sílabas',
          texto: (
            <div className="grid gap-2 sm:grid-cols-2">
              <Caixa>
                <b>Monosílabas</b> (1): tren, pan, ben, mar
              </Caixa>
              <Caixa>
                <b>Bisílabas</b> (2): ca-ma, me-sa, ga-to
              </Caixa>
              <Caixa>
                <b>Trisílabas</b> (3): a-mi-go, car-pe-ta, pe-lo-ta
              </Caixa>
              <Caixa>
                <b>Polisílabas</b> (máis de 3): ca-me-ri-no, or-de-na-dor
              </Caixa>
            </div>
          ),
        },
        {
          titulo: 'O ditongo',
          texto: (
            <>
              <p>Toda sílaba ten polo menos unha vogal. Se hai dúas na mesma sílaba, hai ditongo:</p>
              <div className="flex flex-wrap gap-2">{['leituga', 'froiteiro', 'xouba'].map((w) => <span key={w} className="rounded-xl bg-white px-3 py-1.5 font-mono text-lg">{separar(w)}</span>)}</div>
              <p>
                En «ce-o» as dúas vogais van en sílabas distintas: <b>non</b> hai ditongo.
              </p>
            </>
          ),
        },
        {
          titulo: 'As árbores froiteiras',
          texto: (
            <div className="space-y-2">
              {ARBORES.map((a) => (
                <Caixa key={a.arbore}>
                  {a.pistas.map(conTonica).join(' · ')} → <b>{a.arbore}</b>
                </Caixa>
              ))}
            </div>
          ),
          visual: debuxo('🍐🍎'),
        },
      ]}
      xogos={[
        {
          id: 'clasifica',
          titulo: 'Clasifica',
          icono: '🗂️',
          explica: 'Monosílabas, bisílabas, trisílabas e polisílabas.',
          crear: (acabar) => (
            <Clasifica
              caixas={NOME_N.slice(1).map((n, i) => ({ id: n, nome: `${n[0].toUpperCase()}${n.slice(1)}s`, cor: ['border-violet-300 bg-violet-100', 'border-sky-300 bg-sky-100', 'border-emerald-300 bg-emerald-100', 'border-rose-300 bg-rose-100'][i] }))}
              elementos={azar(PALABRAS_SILABAS, 10).map((w) => ({ texto: w, caixa: tipoN(silabas(w).length), pista: `Dá palmadas: ${separar(w)}.` }))}
              acabar={acabar}
            />
          ),
        },
        { id: 'tonica', titulo: 'A sílaba tónica', icono: '💪', explica: 'Cal se di con máis forza?', crear: (acabar) => <Practica preguntas={TONICA_PREG} acabar={acabar} /> },
        { id: 'separa', titulo: 'Separa en sílabas', icono: '✂️', explica: 'Cal está ben separada?', crear: (acabar) => <Practica preguntas={SEPARA_PREG} acabar={acabar} /> },
        { id: 'practica', titulo: 'Practica', icono: '✏️', explica: 'De todo un pouco.', crear: (acabar) => <Practica preguntas={SILABAS_PREG} acabar={acabar} /> },
      ]}
      preguntas={SILABAS_PREG}
    />
  )
}

// ===================================================================================================
// 5. As clases de palabras
// ===================================================================================================

const NOME_CLASE: Record<Clase, string> = { substantivo: 'Substantivo', adxectivo: 'Adxectivo', verbo: 'Verbo' }
const QUE_NOMEA: Record<Clase, string> = { substantivo: 'nomea persoas, animais ou cousas', adxectivo: 'di calidades', verbo: 'indica accións' }
const claseDe = (w: string) => (Object.keys(CLASES) as Clase[]).find((c) => CLASES[c].includes(w))!
const intrusaDe = (g: (typeof INTRUSAS)[number]) => g.grupo.find((w) => claseDe(w) !== g.clase)!
const DIGRAFOS = ['ch', 'll', 'nh', 'rr', 'qu', 'gu']

const CLASES_PREG: Pregunta[] = [
  ...(Object.keys(CLASES) as Clase[]).flatMap((c) =>
    CLASES[c].map((w) => elixe(<>Que clase de palabra é «{w}»?</>, NOME_CLASE[c], (Object.keys(CLASES) as Clase[]).filter((x) => x !== c).map((x) => NOME_CLASE[x]), <>«{w}» {QUE_NOMEA[c]}: é un {NOME_CLASE[c].toLowerCase()}.</>)),
  ),
  ...INTRUSAS.map((g) => {
    const i = intrusaDe(g)
    return elixe(<>Cal é a palabra intrusa? {g.grupo.join(', ')}</>, i, g.grupo.filter((w) => w !== i), <>«{i}» é un {claseDe(i)}; as outras son {g.clase}s.</>)
  }),
  ...(Object.keys(CLASES) as Clase[]).map((c) => elixe(<>Que palabras {QUE_NOMEA[c]}?</>, `Os ${NOME_CLASE[c].toLowerCase()}s`, (Object.keys(CLASES) as Clase[]).filter((x) => x !== c).map((x) => `Os ${NOME_CLASE[x].toLowerCase()}s`), <>Os {NOME_CLASE[c].toLowerCase()}s {QUE_NOMEA[c]}.</>)),
  ...PALABRAS_DIGRAFOS.filter((w) => digrafos(w).length === 1).map((w) => {
    const d = digrafos(w)[0]
    return elixe(<>Que dígrafo ten «{w}»?</>, d, azar(DIGRAFOS.filter((x) => x !== d), 3), <>«{w}» ten o dígrafo {d}: dúas letras que soan coma un só son.</>)
  }),
  ...PALABRAS_DIGRAFOS.filter((w) => digrafos(w).length === 0).map((w) =>
    elixe('Cal destas palabras ten un dígrafo?', azar(PALABRAS_DIGRAFOS.filter((x) => digrafos(x).length > 0), 1)[0], [w], <>«{w}» non ten dígrafo: ningún par de letras soa coma un só son.</>),
  ),
  ...COCIÑAS.map((c) => elixe(<>Cal é o prato intruso da cociña {c.cociña}? {c.pratos.join(', ')}</>, c.intrusa, c.pratos.filter((x) => x !== c.intrusa), <>«{c.intrusa}» é de {c.de}.</>)),
  elixe('Que é un dígrafo?', 'Dúas letras que soan coma un só son', ['Dúas vogais na mesma sílaba', 'Unha letra que non soa'], 'ch, ll, nh, rr, qu, gu.'),
]

export function Clases(p: PropsParada) {
  return (
    <Parada
      {...p}
      unidade={U}
      id="clases"
      titulo="As clases de palabras"
      tarxetas={[
        {
          titulo: 'As palabras agrúpanse en clases',
          texto: (
            <div className="space-y-2">
              <Caixa cor="border-sky-200 bg-sky-50">
                <b>Substantivos:</b> nomean persoas, animais ou cousas. touro, mestre, cesta
              </Caixa>
              <Caixa cor="border-pink-200 bg-pink-50">
                <b>Adxectivos:</b> din calidades. útil, fermoso, saborosa
              </Caixa>
              <Caixa cor="border-emerald-200 bg-emerald-50">
                <b>Verbos:</b> indican accións. cociñar, bater, durmir
              </Caixa>
              <p className="text-base text-slate-600">Hai máis clases: determinantes, pronomes persoais…</p>
            </div>
          ),
        },
        {
          titulo: 'A palabra intrusa',
          texto: (
            <div className="space-y-2">
              {INTRUSAS.map((g) => (
                <Caixa key={g.clase}>
                  {g.grupo.map((w) => (w === intrusaDe(g) ? <s key={w} className="mx-1 text-rose-600">{w}</s> : <span key={w} className="mx-1">{w}</span>))} → {g.clase}s
                </Caixa>
              ))}
            </div>
          ),
        },
        {
          titulo: 'Os dígrafos',
          texto: (
            <>
              <p>Un dígrafo son dúas letras que soan coma un só son:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  ['ch', 'chea'],
                  ['ll', 'traballo'],
                  ['nh', 'nunha'],
                  ['rr', 'ferramentas'],
                  ['qu', 'queixo'],
                  ['gu', 'guiso'],
                ].map(([d, w]) => (
                  <Caixa key={d}>
                    <b className="text-rose-600">{d}</b>: {w}
                  </Caixa>
                ))}
              </div>
            </>
          ),
        },
      ]}
      xogos={[
        {
          id: 'clasifica',
          titulo: 'Clasifica as palabras',
          icono: '🗂️',
          explica: 'Substantivo, adxectivo ou verbo.',
          crear: (acabar) => (
            <Clasifica
              caixas={[
                { id: 'substantivo', nome: 'Substantivos', cor: 'border-sky-300 bg-sky-100' },
                { id: 'adxectivo', nome: 'Adxectivos', cor: 'border-pink-300 bg-pink-100' },
                { id: 'verbo', nome: 'Verbos', cor: 'border-emerald-300 bg-emerald-100' },
              ]}
              elementos={(Object.keys(CLASES) as Clase[]).flatMap((c) => azar(CLASES[c], 3).map((w) => ({ texto: w, caixa: c, pista: `Pensa: «${w}» nomea, di unha calidade ou indica unha acción?` })))}
              acabar={acabar}
            />
          ),
        },
        {
          id: 'digrafos',
          titulo: 'Ten dígrafo?',
          icono: '🔠',
          explica: 'Busca as palabras con dígrafo.',
          crear: (acabar) => (
            <Clasifica
              caixas={[
                { id: 'si', nome: 'Con dígrafo', cor: 'border-amber-300 bg-amber-100' },
                { id: 'non', nome: 'Sen dígrafo', cor: 'border-slate-300 bg-slate-100' },
              ]}
              elementos={azar(PALABRAS_DIGRAFOS, 8).map((w) => ({ texto: w, caixa: digrafos(w).length ? 'si' : 'non' }))}
              acabar={acabar}
            />
          ),
        },
        { id: 'practica', titulo: 'Practica', icono: '✏️', explica: 'Clases, intrusas e dígrafos.', crear: (acabar) => <Practica preguntas={CLASES_PREG} acabar={acabar} /> },
      ]}
      preguntas={CLASES_PREG}
    />
  )
}

export const PREGUNTAS_COMEMOS: Record<string, Pregunta[]> = {
  lectura: LECTURA_PREG,
  dicionario: DICIONARIO_PREG,
  sonk: SONK_PREG,
  silabas: SILABAS_PREG,
  clases: CLASES_PREG,
}
