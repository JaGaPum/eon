// Galego 2.º ESO, proba de aula 1: acentuación (apuntes da profesora e exercicios 2 e 3 de ogalego.gal).
import { Clasifica, ParadaPrimaria, Proba, Tarxetas, Une, VerdadeiroFalso, barallar, type Pregunta, type Tarxeta, type Xogo, Xogos } from '../../primaria/pezas'
import { elixe } from '../../primaria/paisaxes/preguntas'
import { senTil } from '../../lib/til'
import { FRASES_OGALEGO, PALABRAS_OGALEGO } from './ogalego'
import { FrasesTil } from './FraseTil'

const b = (t: string) => <b className="text-violet-800">{t}</b>
const S = ({ children }: { children: string }) => <i className="font-semibold text-slate-800">{children}</i>

// ===================================================================================================
// 5. Regras de acentuación
// ===================================================================================================

type Tipo = 'Aguda' | 'Grave' | 'Esdrúxula'
// Palabras para clasificar, coa súa sílaba tónica.
const TIPOS: [string, Tipo, string][] = [
  ['café', 'Aguda', 'ca-FÉ'],
  ['Ramón', 'Aguda', 'Ra-MÓN'],
  ['mandís', 'Aguda', 'man-DÍS'],
  ['xamóns', 'Aguda', 'xa-MÓNS'],
  ['cantar', 'Aguda', 'can-TAR'],
  ['nariz', 'Aguda', 'na-RIZ'],
  ['xardín', 'Aguda', 'xar-DÍN'],
  ['papel', 'Aguda', 'pa-PEL'],
  ['camión', 'Aguda', 'ca-MIÓN'],
  ['túnel', 'Grave', 'TÚ-nel'],
  ['carácter', 'Grave', 'ca-RÁC-ter'],
  ['tórax', 'Grave', 'TÓ-rax'],
  ['bíceps', 'Grave', 'BÍ-ceps'],
  ['lapis', 'Grave', 'LA-pis'],
  ['casa', 'Grave', 'CA-sa'],
  ['móbil', 'Grave', 'MÓ-bil'],
  ['fácil', 'Grave', 'FÁ-cil'],
  ['cadeira', 'Grave', 'ca-DEI-ra'],
  ['esdrúxula', 'Esdrúxula', 'es-DRÚ-xu-la'],
  ['simpático', 'Esdrúxula', 'sim-PÁ-ti-co'],
  ['bágoa', 'Esdrúxula', 'BÁ-go-a'],
  ['árbore', 'Esdrúxula', 'ÁR-bo-re'],
  ['páxaro', 'Esdrúxula', 'PÁ-xa-ro'],
  ['lámpada', 'Esdrúxula', 'LÁM-pa-da'],
  ['médico', 'Esdrúxula', 'MÉ-di-co'],
]

const ACENTO_TARXETAS: Tarxeta[] = [
  {
    titulo: 'O til',
    texto: (
      <>
        <p>
          Nalgunhas palabras, o acento represéntase na escrita cun {b('til')} (acento gráfico) sobre a vogal da {b('sílaba tónica')}, a que soa máis forte.
        </p>
        <p>Segundo onde estea a sílaba tónica, as palabras son:</p>
        <ul className="space-y-1">
          <li>
            {b('Agudas')}: tónica na última sílaba (ca-FÉ).
          </li>
          <li>
            {b('Graves')}: na penúltima (TÚ-nel).
          </li>
          <li>
            {b('Esdrúxulas')}: na antepenúltima (BÁ-go-a).
          </li>
        </ul>
      </>
    ),
  },
  {
    titulo: 'As tres regras',
    texto: (
      <ul className="space-y-3">
        <li>
          {b('Agudas')}: levan til cando teñen máis dunha sílaba e rematan en {b('vogal')} (<S>café</S>), en {b('-n')} (<S>Ramón</S>), en {b('-s')} (<S>mandís</S>) ou en {b('-ns')} (<S>xamóns</S>).
        </li>
        <li>
          {b('Graves')}: levan til cando rematan en {b('consoante distinta de -n ou -s')} (<S>túnel</S>, <S>carácter</S>, <S>tórax</S>) ou no grupo culto {b('-ps')} (<S>bíceps</S>).
        </li>
        <li>
          {b('Esdrúxulas')}: levan til {b('sempre')} (<S>esdrúxula</S>, <S>simpático</S>, <S>bágoa</S>).
        </li>
      </ul>
    ),
  },
  {
    titulo: 'Truco: as graves son o contrario das agudas',
    texto: (
      <>
        <p>Fíxate: as agudas levan til precisamente cando as graves non o levan.</p>
        <table className="w-full text-lg">
          <tbody>
            <tr className="border-b">
              <td className="py-1">Remata en vogal, -n, -s, -ns</td>
              <td>aguda: <b>si</b> (café)</td>
              <td>grave: non (casa, lapis)</td>
            </tr>
            <tr>
              <td className="py-1">Remata noutra consoante</td>
              <td>aguda: non (cantar, nariz)</td>
              <td>grave: <b>si</b> (túnel, móbil)</td>
            </tr>
          </tbody>
        </table>
        <p className="text-base text-slate-600">
          💡 Ollo: as agudas rematadas en ditongo decrecente (-ei, -eu, -ou, -iu, -ai…) non levan til: <S>papeis</S>, <S>colleu</S>, <S>mesturei</S>, <S>recibiu</S>, <S>axudou</S>. Sae moito nos exercicios de ogalego.gal.
        </p>
      </>
    ),
  },
  {
    titulo: 'Os hiatos',
    texto: (
      <>
        <p>
          As vogais {b('i, u tónicas')} levan til cando van xunto a outra vogal para indicar que van en {b('sílabas distintas')} (hiato): <S>baúl</S>, <S>miúdo</S>, <S>constrúe</S>.
        </p>
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            Dúas vogais abertas (a, e, o): seguen as regras xerais. <S>a-é-re-o</S>
          </li>
          <li>
            Aberta + pechada tónica (í, ú): {b('levan til sempre')}. <S>dí-a</S>, <S>ra-íz</S>, <S>lú-a</S>, <S>ba-úl</S>
          </li>
          <li>
            Dúas pechadas (i, u): til na segunda, se é tónica. <S>ru-í-do</S>, <S>mi-ú-do</S>
          </li>
        </ol>
      </>
    ),
  },
  {
    titulo: 'Casos especiais',
    texto: (
      <ul className="list-disc space-y-2 pl-5">
        <li>
          {b('Monosílabos')}: non levan til, agás os diacríticos. <S>fe</S>, <S>son</S>, <S>ben</S>.
        </li>
        <li>
          {b('Verbos con pronomes enclíticos')}: cóntanse como unha soa palabra. <S>traen</S> / <S>tráeno</S>, <S>dixeron</S> / <S>dixéronlle</S>.
        </li>
        <li>
          {b('Adverbios en -mente')}: non levan til (son graves rematadas en vogal). <S>velozmente</S>, <S>axilmente</S>.
        </li>
        <li>
          {b('Palabras compostas')} escritas xuntas: como unha soa palabra. <S>cabodano</S>, <S>lucecú</S>.
        </li>
        <li>
          {b('Interrogativos e exclamativos')}: non levan til. <S>Que dis!</S>, <S>Cando volves?</S>
        </li>
        <li>
          {b('Estranxeirismos')}: as mesmas regras. <S>iglú</S>, <S>neceser</S>, <S>béisbol</S>.
        </li>
      </ul>
    ),
  },
]

/** As formas válidas dunha palabra de ogalego («área/area» vale de dúas maneiras). */
const formas = (s: string) => s.split('/')
const tilQ = (sol: string, texto = 'Pon o til se o precisa:'): Pregunta => ({ tipo: 'til', texto, palabra: senTil(formas(sol)[0]), respostas: formas(sol) })

const CASOS: [string, boolean, string][] = [
  ['Os monosílabos levan til se son tónicos.', false, 'Non levan til, agás os diacríticos: fe, son, ben.'],
  ['«Velozmente» non leva til.', true, 'Os adverbios en -mente son graves rematados en vogal.'],
  ['«Tráeno» leva til porque, co pronome, é esdrúxula.', true, 'Os verbos con pronomes enclíticos acentúanse como unha soa palabra.'],
  ['En «Cando volves?», «cando» leva til porque é interrogativo.', false, 'Os interrogativos e exclamativos non levan til.'],
  ['Os estranxeirismos seguen as regras do galego: iglú, béisbol.', true, 'Si: iglú é aguda en vogal e béisbol, grave en -l.'],
  ['As esdrúxulas levan til sempre.', true, 'Sempre: bágoa, simpático.'],
  ['As graves rematadas en -s levan til.', false, 'As graves en -n ou -s non o levan: lapis, cantan.'],
  ['«Bíceps» leva til porque é grave rematada no grupo -ps.', true, 'É a excepción das graves en -s.'],
  ['En «día» o i leva til porque está en hiato cunha vogal aberta.', true, 'Aberta + pechada tónica: til sempre.'],
  ['«Cantar» leva til porque é aguda.', false, 'É aguda pero remata en -r: non leva.'],
]

const ACENTO_PREG: Pregunta[] = [
  ...TIPOS.map(([p, t, sil]) => elixe(<>Que tipo de palabra é <b>{p}</b>?</>, t, (['Aguda', 'Grave', 'Esdrúxula'] as const).filter((x) => x !== t), <>A tónica é a sílaba en maiúsculas: {sil}.</>)),
  ...PALABRAS_OGALEGO.map((p) => tilQ(p)),
  ...CASOS.map(([f, v, e]) => elixe(<>Verdadeiro ou falso? {f}</>, v ? 'Verdadeiro' : 'Falso', [v ? 'Falso' : 'Verdadeiro'], e)),
  ...['ruído', 'miúdo', 'baúl', 'raíz', 'lúa', 'saía', 'aínda', 'constrúe', 'egoísmo', 'xuízo'].map((p) => tilQ(p, 'Hiato. Pon o til:')),
]

const ACENTO_XOGOS: Xogo[] = [
  {
    id: 'tipo',
    titulo: 'Aguda, grave ou esdrúxula?',
    icono: '🗂️',
    explica: 'Clasifica segundo a sílaba tónica.',
    crear: (acabar) => (
      <Clasifica
        caixas={[
          { id: 'Aguda', nome: 'Aguda', cor: 'border-sky-300 bg-sky-100' },
          { id: 'Grave', nome: 'Grave', cor: 'border-amber-300 bg-amber-100' },
          { id: 'Esdrúxula', nome: 'Esdrúxula', cor: 'border-pink-300 bg-pink-100' },
        ]}
        elementos={barallar(TIPOS)
          .slice(0, 12)
          .map(([p, t, s]) => ({ texto: p, caixa: t, pista: `Dina en voz alta: ${s}.` }))}
        acabar={acabar}
      />
    ),
  },
  {
    id: 'palabras',
    titulo: 'Pon o til (ogalego.gal, apartado 2)',
    icono: '✍️',
    explica: '10 palabras ao chou das 168 do exercicio.',
    crear: (acabar) => <Proba practica cantas={10} preguntas={PALABRAS_OGALEGO.map((p) => tilQ(p))} acabar={acabar} />,
  },
  {
    id: 'hiatos',
    titulo: 'Hiatos',
    icono: '🔀',
    explica: 'O í e o ú tónicos xunto a outra vogal.',
    crear: (acabar) => <Proba practica cantas={8} preguntas={ACENTO_PREG.filter((q) => q.tipo === 'til' && q.texto === 'Hiato. Pon o til:')} acabar={acabar} />,
  },
  {
    id: 'casos',
    titulo: 'Casos especiais',
    icono: '⭐',
    explica: 'Monosílabos, -mente, enclíticos, interrogativos…',
    crear: (acabar) => <VerdadeiroFalso frases={CASOS.map(([texto, certa, explica]) => ({ texto, certa, explica }))} acabar={acabar} />,
  },
]

export function Acentuacion({ ruta, modo }: { ruta: string; modo?: string }) {
  return (
    <ParadaPrimaria
      ruta={ruta}
      titulo="Regras de acentuación"
      modo={modo}
      paneis={{
        descubre: <Tarxetas tarxetas={ACENTO_TARXETAS} xoga={`${ruta}/xoga`} />,
        xoga: <Xogos xogos={ACENTO_XOGOS} proba={`${ruta}/proba`} />,
        proba: <Proba id="galego1/acentuacion" preguntas={ACENTO_PREG} />,
      }}
    />
  )
}

// ===================================================================================================
// 6. O til diacrítico
// ===================================================================================================

interface Par {
  con: string
  conSignif: string
  sen: string
  senSignif: string
  /** Unha frase para cada forma, con «__» no oco. */
  fraseCon: string
  fraseSen: string
}

// A lista da profesora, na mesma orde, partida en tres días como no seu plan de traballo.
export const PARES: Par[] = [
  { con: 'á', conSignif: 'a + a (artigo); substantivo', sen: 'a', senSignif: 'artigo, pronome, preposición', fraseCon: 'Mañá imos __ praia.', fraseSen: 'Colle __ mochila.' },
  { con: 'ás', conSignif: 'a + as (artigo); substantivo', sen: 'as', senSignif: 'artigo, pronome', fraseCon: 'Chegou __ catro da tarde.', fraseSen: 'Trae __ chaves.' },
  { con: 'bóla', conSignif: 'esfera', sen: 'bola', senSignif: 'peza de pan', fraseCon: 'Xogamos cunha __ de praia.', fraseSen: 'Merquei unha __ de pan.' },
  { con: 'chá', conSignif: 'plana', sen: 'cha', senSignif: 'che + a', fraseCon: 'Vivimos nunha terra __.', fraseSen: 'A mochila, xa __ devolvín.' },
  { con: 'chás', conSignif: 'planas', sen: 'chas', senSignif: 'che + as', fraseCon: 'Son terras __ e fértiles.', fraseSen: 'As chaves, xa __ dei.' },
  { con: 'cómpre', conSignif: 'é preciso', sen: 'compre', senSignif: 'merque', fraseCon: '__ estudar todos os días.', fraseSen: 'Quero que __ o pan.' },
  { con: 'cómpren', conSignif: 'son precisos', sen: 'compren', senSignif: 'merquen', fraseCon: '__ máis cadeiras para a festa.', fraseSen: 'Dilles que __ froita.' },
  { con: 'dá', conSignif: 'verbo dar', sen: 'da', senSignif: 'de + a', fraseCon: 'O sol __ luz e calor.', fraseSen: 'A porta __ casa está aberta.' },
  { con: 'dás', conSignif: 'verbo dar', sen: 'das', senSignif: 'de + as', fraseCon: 'Ti sempre me __ ánimos.', fraseSen: 'Falamos __ vacacións.' },
  { con: 'dó', conSignif: 'compaixón', sen: 'do', senSignif: 'de + o', fraseCon: 'Teño __ do can abandonado.', fraseSen: 'É o libro __ profesor.' },
  { con: 'é', conSignif: 'verbo ser', sen: 'e', senSignif: 'conxunción', fraseCon: 'O mar __ azul.', fraseSen: 'Quero pan __ leite.' },
  { con: 'fóra', conSignif: 'adverbio', sen: 'fora', senSignif: 'verbo ser ou ir', fraseCon: 'Os nenos xogan __ da casa.', fraseSen: 'Xa __ alí antes ca ti.' },
  { con: 'má', conSignif: 'adxectivo (ruín)', sen: 'ma', senSignif: 'me + a', fraseCon: 'Foi unha idea __.', fraseSen: 'A carta, non __ deu.' },
  { con: 'más', conSignif: 'adxectivo (ruíns)', sen: 'mas', senSignif: 'me + as', fraseCon: 'Tiveron notas __.', fraseSen: 'As fotos, non __ ensinou.' },
  { con: 'máis', conSignif: 'adverbio e pronome', sen: 'mais', senSignif: 'conxunción (pero)', fraseCon: 'Quero __ auga, por favor.', fraseSen: 'Estudei, __ non aprobei.' },
  { con: 'nó', conSignif: 'atadura', sen: 'no', senSignif: 'en + o', fraseCon: 'Fixen un __ na corda.', fraseSen: 'O gato está __ cuarto.' },
  { con: 'nós', conSignif: 'pronome tónico', sen: 'nos', senSignif: 'pronome átono; en + os', fraseCon: '__ imos ao cine.', fraseSen: 'Non __ viron.' },
  { con: 'óso', conSignif: 'do corpo', sen: 'oso', senSignif: 'animal', fraseCon: 'Rompeu un __ do brazo.', fraseSen: 'O __ come mel.' },
  { con: 'pé', conSignif: 'parte do corpo', sen: 'pe', senSignif: 'letra', fraseCon: 'Dóeme o __ dereito.', fraseSen: '«Papel» empeza por __.' },
  { con: 'póla', conSignif: 'rama', sen: 'pola', senSignif: 'galiña; por + a', fraseCon: 'O paxaro pousou nunha __.', fraseSen: 'Pasei __ rúa maior.' },
  { con: 'pór', conSignif: 'poñer', sen: 'por', senSignif: 'preposición', fraseCon: 'Axúdame a __ a mesa.', fraseSen: 'Fíxeno __ ti.' },
  { con: 'présa', conSignif: 'apuro', sen: 'presa', senSignif: 'presada, prendida; encoro', fraseCon: 'Vou con moita __.', fraseSen: 'A __ do encoro está chea.' },
  { con: 'sé', conSignif: 'sede eclesiástica; imperativo de ser', sen: 'se', senSignif: 'conxunción, pronome', fraseCon: 'Visitamos a __ de Santiago.', fraseSen: '__ chove, quedo na casa.' },
  { con: 'só', conSignif: 'adverbio; adxectivo', sen: 'so', senSignif: 'preposición (debaixo de)', fraseCon: 'Estou __ na casa.', fraseSen: 'Durmiu __ a ponte.' },
  { con: 'té', conSignif: 'infusión', sen: 'te', senSignif: 'pronome; letra', fraseCon: 'Tomei un __ quente.', fraseSen: 'Xa __ vin onte.' },
  { con: 'vén', conSignif: 'presente de vir', sen: 'ven', senSignif: 'presente de ver', fraseCon: 'O autobús xa __ cara aquí.', fraseSen: 'Eles non __ ben sen lentes.' },
  { con: 'vés', conSignif: 'presente de vir', sen: 'ves', senSignif: 'presente de ver', fraseCon: 'Ti __ comigo ao concerto?', fraseSen: '__ aquel monte do fondo?' },
  { con: 'vós', conSignif: 'pronome tónico', sen: 'vos', senSignif: 'pronome átono', fraseCon: '__ sodes os mellores.', fraseSen: 'Xa __ dixen que non.' },
]

export const DIAS = [PARES.slice(0, 10), PARES.slice(10, 19), PARES.slice(19)]

const maiuscula = (s: string, f: string) => (f.startsWith('__') ? s[0].toUpperCase() + s.slice(1) : s)
const fraseQ = (p: Par, con: boolean): Pregunta => {
  const f = con ? p.fraseCon : p.fraseSen
  const a = maiuscula(p.con, f)
  const c = maiuscula(p.sen, f)
  return elixe(<>Completa: «{f.replace('__', '____')}»</>, con ? a : c, [con ? c : a], <>{con ? `«${p.con}»: ${p.conSignif}.` : `«${p.sen}»: ${p.senSignif}.`}</>)
}

const DIACRITICO_TARXETAS: Tarxeta[] = [
  {
    titulo: 'O til diacrítico',
    texto: (
      <>
        <p>
          Úsase para distinguir {b('dúas palabras que se escriben igual')} pero teñen distinto significado.
        </p>
        <p>
          Ponse sempre na palabra que ten {b('vogal aberta')} ou na que é {b('tónica')}: <S>é</S> (verbo) / <S>e</S> (conxunción), <S>nós</S> (pronome tónico) / <S>nos</S> (átono).
        </p>
        <p className="text-base text-slate-600">💡 Plan da profesora: estudar cada día 9 ou 10. Aquí tes os tres días xa preparados.</p>
      </>
    ),
  },
  ...DIAS.map(
    (dia, d): Tarxeta => ({
      titulo: `Día ${d + 1}`,
      texto: (
        <table className="w-full text-lg">
          <tbody>
            {dia.map((p) => (
              <tr key={p.con} className="border-b border-slate-200 last:border-0">
                <td className="py-1.5 pr-2 font-bold text-violet-800">{p.con}</td>
                <td className="py-1.5 pr-4 text-slate-600">{p.conSignif}</td>
                <td className="py-1.5 pr-2 font-bold">{p.sen}</td>
                <td className="py-1.5 text-slate-600">{p.senSignif}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ),
    }),
  ),
  {
    titulo: 'Recorda',
    texto: (
      <ul className="list-disc space-y-2 pl-5">
        <li>
          Cos pronomes enclíticos mantense o diacrítico: <S>dálle</S>, <S>cóntallo</S>.
        </li>
        <li>
          <S>máis</S> (cantidade) / <S>mais</S> (pero): «Quero máis, mais non podo».
        </li>
        <li>
          <S>vén</S> e <S>vés</S> son do verbo <b>vir</b>; <S>ven</S> e <S>ves</S>, do verbo <b>ver</b>.
        </li>
      </ul>
    ),
  },
]

const DIACRITICO_PREG: Pregunta[] = [
  ...PARES.flatMap((p) => [fraseQ(p, true), fraseQ(p, false)]),
  ...PARES.map((p) => elixe(<>Que significa <b>{p.con}</b> (con til)?</>, p.conSignif, barallar(PARES.filter((x) => x !== p)).slice(0, 2).map((x) => x.conSignif), <>E «{p.sen}», sen til: {p.senSignif}.</>)),
]

const xogosDia = (d: number): Xogo => ({
  id: `dia${d + 1}`,
  titulo: `Día ${d + 1}: ${DIAS[d].map((p) => p.con).join(', ')}`,
  icono: ['1️⃣', '2️⃣', '3️⃣'][d],
  explica: 'Completa frases con eses diacríticos.',
  crear: (acabar) => <Proba practica cantas={10} preguntas={DIAS[d].flatMap((p) => [fraseQ(p, true), fraseQ(p, false)])} acabar={acabar} />,
})

const DIACRITICO_XOGOS: Xogo[] = [
  xogosDia(0),
  xogosDia(1),
  xogosDia(2),
  {
    id: 'une',
    titulo: 'Que significa?',
    icono: '🔗',
    explica: 'Une cada diacrítico co seu significado.',
    crear: (acabar) => <Une pares={barallar(PARES).slice(0, 7).map((p) => ({ palabra: p.con, significado: p.conSignif }))} acabar={acabar} />,
  },
  {
    id: 'frases',
    titulo: 'Acentúa frases (ogalego.gal, apartado 3)',
    icono: '📜',
    explica: 'Pon todos os tiles que faltan: regras, hiatos e diacríticos.',
    crear: (acabar) => <FrasesTil frases={FRASES_OGALEGO} cantas={5} acabar={acabar} />,
  },
]

export function Diacriticos({ ruta, modo }: { ruta: string; modo?: string }) {
  return (
    <ParadaPrimaria
      ruta={ruta}
      titulo="O til diacrítico"
      modo={modo}
      paneis={{
        descubre: <Tarxetas tarxetas={DIACRITICO_TARXETAS} xoga={`${ruta}/xoga`} />,
        xoga: <Xogos xogos={DIACRITICO_XOGOS} proba={`${ruta}/proba`} />,
        proba: <Proba id="galego1/diacriticos" preguntas={DIACRITICO_PREG} />,
      }}
    />
  )
}

export const PREGUNTAS_ACENTOS = { acentuacion: ACENTO_PREG, diacriticos: DIACRITICO_PREG }
