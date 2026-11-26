// Genera «lengua-global1.html»: cuadernillo de repaso para el global de Lengua Castellana de 2.º ESO (1.ª evaluación).
// Los datos salen de los mismos ficheros que usa la web (src/lengua/global1/datos.ts) y el programa se para si algo
// no coincide con lo esperado.
// Uso, desde la raíz del repositorio: node apuntes-fuente/lengua-global1.gen.mjs
import { writeFileSync } from 'node:fs'
import { createServer } from 'vite'

const server = await createServer({ configFile: false, server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })
const D = await server.ssrLoadModule('/src/lengua/global1/datos.ts')
await server.close()

const fallos = []
const espera = (que, dado, bueno) => {
  if (String(dado) !== String(bueno)) fallos.push(`${que}: sale «${dado}» y se esperaba «${bueno}»`)
}
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

let nEj = 0
const parte = (clase, titulo) => ({ clase, titulo, bloques: [] })
const PARTES = [parte('t1', 'Lo nuevo del global'), parte('t2', 'Repaso del parcial')]
const bloque = (p, titulo, como) => {
  const b = { titulo, como, ejs: [] }
  p.bloques.push(b)
  return b
}
const ej = (b, nivel, enunciado, solucion) => b.ejs.push({ n: ++nEj, nivel, enunciado, solucion })
const lista = (xs) => `<ol class="items">${xs.map((x) => `<li>${x}</li>`).join('')}</ol>`
const ul = (xs) => `<ul>${xs.map((x) => `<li>${x}</li>`).join('')}</ul>`
const bancoP = (xs) => `<div class="banco">${xs.map(esc).join(' • ')}</div>`
const taboa = (cab, filas) => `<table><tr>${cab.map((c) => `<th>${c}</th>`).join('')}</tr>${filas.map((f) => `<tr>${f.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</table>`
const def = (xs) => ul(xs.map(([t, d]) => `<b>${esc(t)}</b>: ${esc(d)}`))
const [N, P] = PARTES

// ============================== LO NUEVO ==============================

{
  const b = bloque(
    N,
    'Lenguaje, lengua y habla. Las lenguas de España',
    `<div class="g2 grid">
      <div class="caixa"><h4>Lenguaje, lengua y habla</h4>${def(D.LLH)}<p class="gris">La lengua tiene variedades territoriales (dialectos) y sociales (niveles: culto, estándar, coloquial, vulgar; y jergas).</p></div>
      <div class="caixa"><h4>Historia</h4>${def(D.HISTORIA)}</div>
      <div class="caixa"><h4>Las lenguas de España</h4>${ul(D.LENGUAS_ESPANA.map((l) => `<b>${l.lengua}</b>: ${esc(l.donde)} (${l.origen === 'romance' ? 'romance, del latín' : 'prerromana, de origen desconocido'})`))}<p class="gris">Guerra Civil y dictadura: gallego, vasco, catalán y valenciano reducidos a un uso familiar y rural. Democracia: cooficiales.</p></div>
      <div class="caixa"><h4>El castellano</h4>${def(D.CASTELLANO)}<b>Variedades</b>: ${D.VARIEDADES_CASTELLANO.map(([v, d]) => `<b>${v}</b> (${esc(d)})`).join('; ')}</div>
    </div>
    <div class="caixa"><h4>Idioma y dialecto. Bilingüismo y diglosia</h4>${def(D.CONCEPTOS)}</div>`,
  )
  ej(b, 1, `Define: lenguaje, lengua, habla, dialecto, bilingüismo y diglosia.`, def([...D.LLH, ...D.CONCEPTOS.slice(1, 4)]))
  ej(b, 1, `Ordena y explica: invasión musulmana, llegada de los romanos, pueblos prerromanos, invasiones germánicas.`, lista(D.HISTORIA.map(([e, d]) => `<b>${e}</b>: ${esc(d)}`)))
  ej(b, 2, `¿Qué lenguas son cooficiales en España y dónde? ¿Cuál no es romance y por qué?`, `${ul(D.LENGUAS_ESPANA.slice(1).map((l) => `${l.lengua}: ${esc(l.donde)}`))}El <b>vasco o euskera</b> no es romance: es prerromano (más antiguo que el latín) y de origen desconocido.`)
}

{
  const b = bloque(
    N,
    'El español en el mundo y el español de América',
    `${taboa(['Rasgo', 'Qué es', 'Ejemplo'], D.RASGOS_AMERICA.map(([r, d, e]) => [`<b>${r}</b>`, esc(d), esc(e)]))}
    <p>Palabras precolombinas que se usan también en España: ${D.PRECOLOMBINAS_ESPANA.join(', ')}. Lenguas indígenas: ${D.LENGUAS_INDIGENAS.map(([l, p]) => `${l} (${p})`).join(', ')}.</p>
    <div class="caixa"><h4>Quinientos millones de castellanohablantes</h4>${def(D.MUNDO)}</div>`,
  )
  ej(b, 1, `Explica con un ejemplo: seseo, yeísmo y voseo.`, lista(D.RASGOS_AMERICA.slice(0, 3).map(([r, d, e]) => `<b>${r}</b>: ${esc(d)} (${esc(e)}).`)))
  ej(b, 1, `¿Dónde se hablan el quechua, el guaraní, el náhuatl, el maya-quiché, el aimara y el araucano?`, lista(D.LENGUAS_INDIGENAS.map(([l, p]) => `${l}: <b>${p}</b>`)))
  ej(b, 2, `¿Cuál es la situación del español en Filipinas, Marruecos, Guinea Ecuatorial y Estados Unidos? ¿Qué es el sefardí? ¿Para qué se creó el Instituto Cervantes?`, ul(D.MUNDO.filter(([l]) => ['Filipinas', 'Marruecos', 'Guinea Ecuatorial', 'Estados Unidos', 'Judíos sefardíes', 'Instituto Cervantes'].includes(l)).map(([l, d]) => `<b>${l}</b>: ${esc(d)}`)))
}

{
  const b = bloque(
    N,
    'Los niveles del lenguaje y las jergas',
    `${taboa(['Nivel', 'Quién lo usa', 'Rasgos'], D.NIVELES.map((n) => [`<b>${n.nivel}</b>`, esc(n.quien), esc(n.rasgos)]))}
    <p>Dentro del culto: el <b>lenguaje científico-técnico</b> (tecnicismos: termodinámica, airbag, web) y el <b>literario</b> (cuida la forma). El vulgar afecta al nivel fónico (na, acabao), léxico (almóndiga), morfológico (andé, conducí) y sintáctico (yo me parece, me se cayó).</p>
    <p><b>Jergas</b>: formas de hablar de grupos con algo en común (${D.JERGAS.map(([j, s]) => `${j} = ${s}`).join(', ')}). <b>Argots</b>: jergas de grupos marginales.</p>
    <div class="truco">El libro junta estándar y coloquial; la hoja de la profesora distingue cuatro niveles. Usa los cuatro.</div>`,
  )
  const vf = [
    ['El habla familiar pertenece al nivel culto.', 'F (es coloquial)'],
    ['La riqueza de vocabulario es una característica del lenguaje culto.', 'V'],
    ['El lenguaje científico-técnico y el literario pertenecen al nivel culto.', 'V'],
    ['El habla familiar está cargada de matices afectivos.', 'V'],
    ['La desorganización en el contenido es una característica del nivel culto.', 'F (es del vulgar)'],
  ]
  ej(b, 1, `Página 34, actividad 1. Verdadero o falso:${lista(vf.map(([f]) => esc(f)))}`, lista(vf.map(([, r]) => `<b>${r}</b>`)))
  ej(b, 1, `Páginas 34 y 35. ¿A qué nivel corresponde cada texto y por qué?${lista(D.TEXTOS_NIVEL.map(([t]) => `<i>${esc(t)}</i>`))}`, lista(D.TEXTOS_NIVEL.map(([, n, e]) => `<b>${n}</b>. ${esc(e)}`)))
  ej(b, 1, `Corrige los vulgarismos y di a qué nivel de la lengua afectan: ${D.VULGARISMOS.map(([v]) => v).join(', ')}.`, lista(D.VULGARISMOS.map(([v, c, n]) => `${esc(v)} → <b>${esc(c)}</b> (${n})`)))
}

{
  const b = bloque(
    N,
    'Relaciones semánticas',
    `${taboa(['Relación', 'Qué es', 'Ejemplo'], D.RELACIONES.map(([r, d, e]) => [`<b>${r}</b>`, esc(d), esc(e)]))}
    <div class="g2 grid">
      <div class="caixa"><h4>Antonimia</h4>${ul(D.ANTONIMOS_TIPOS.map(([t, d, e]) => `<b>${t}</b>: ${esc(d)} (${esc(e)})`))}</div>
      <div class="caixa"><h4>Homonimia</h4><b>Homófonos</b>: suenan igual y se escriben distinto (asta / hasta, vaca / baca). <b>Homógrafos</b>: suenan y se escriben igual (vino / vino, cubo / cubo).<br><b>¿Homónima o polisémica?</b> En el diccionario, la polisémica tiene una entrada con varias acepciones; las homónimas, varias entradas.</div>
    </div>`,
  )
  const verbos = D.SINONIMOS_31.map(([v]) => v)
  ej(b, 1, `Actividad 31. Relaciona cada verbo con su sinónimo.${bancoP(verbos)}${bancoP([...D.SINONIMOS_31.map(([, s]) => s)].sort())}`, D.SINONIMOS_31.map(([v, s]) => `${v} → <b>${s}</b>`).join('; ') + '.')
  ej(b, 1, `Actividad 33. Clasifica los antónimos (pura, complementaria o recíproca): ${D.ANTONIMOS_33.map(([p]) => p).join('; ')}.`, taboa(['Clase', 'Parejas'], D.ANTONIMOS_TIPOS.map(([t]) => [`<b>${t}</b>`, D.ANTONIMOS_33.filter(([, x]) => x === t).map(([p]) => p).join('; ')])))
  ej(b, 2, `Actividad 35. ¿Homónimas o polisémicas? ${D.HOMO_POLI_35.map(([p]) => p).join(', ')}.`, ul(['Homónima', 'Polisémica'].map((t) => `<b>${t}s</b>: ${D.HOMO_POLI_35.filter(([, x]) => x === t).map(([p, , e]) => `${p} (${esc(e)})`).join('; ')}`)))
  ej(b, 1, `Actividad 37. ¿Monosémicas o polisémicas? ${D.MONO_POLI_37.map(([p]) => p).join(', ')}.`, ul(['Monosémica', 'Polisémica'].map((t) => `<b>${t}s</b>: ${D.MONO_POLI_37.filter(([, x]) => x === t).map(([p, , e]) => `${p} (${esc(e)})`).join('; ')}`)))
  ej(b, 1, `Actividad 39. Escribe hipónimos de: frutos secos, especias, minerales.`, ul(D.HIPONIMOS_39.map(([h, xs]) => `<b>${h}</b>: ${xs.join(', ')}`)))
}

{
  const b = bloque(
    N,
    'Funciones del lenguaje: las actividades',
    `${taboa(['Elemento', 'Función'], D.FUNCION_ELEMENTO.map(([f, e]) => [e, `<b>${f}</b>`]))}
    <div class="ollo">En el esquema de la fotocopia, la función del <b>código</b> pone «referencial» por error: es la <b>metalingüística</b> (lo avisó la profesora en Classroom).</div>
    <div class="truco">Las funciones suelen aparecer juntas, pero hay una predominante: «¡Qué mala suerte que vaya a empeorar el tiempo!» → expresiva (y también referencial).</div>`,
  )
  espera('código', D.FUNCION_ELEMENTO.find(([, e]) => e === 'Código')[0], 'Metalingüística')
  ej(b, 1, `Página 45, actividad 1. ¿Qué función predomina?${lista(D.FUNCIONES_45.map(([f]) => esc(f)))}`, lista(D.FUNCIONES_45.map(([, c]) => `<b>${c}</b>`)))
  ej(b, 2, `Página 45, actividad 2. Localiza en el texto de Platero una frase de cada función.`, ul(D.PLATERO.map(([f, c]) => `<b>${c}</b>: «${esc(f)}»`)))
}

{
  const b = bloque(
    N,
    'Cómo hacer un buen resumen',
    `<div class="g2 grid">
      <div class="caixa"><h4>Antes de resumir</h4>${D.RESUMEN_PASOS.map(([t, xs]) => `<b>${t}</b>: ${xs.map(esc).join(' ')}`).join('<br>')}</div>
      <div class="caixa"><h4>Redacción</h4><b>Sí</b>: ${D.RESUMEN_SI.map(esc).join(' ')}<br><b>Evita</b>: ${D.RESUMEN_NO.map(esc).join(' ')}</div>
    </div>
    <div class="ollo">En Lengua <b>no</b> se empieza con «Este texto…» (en Galego sí: no los mezcles).</div>`,
  )
  const r = D.RESUMENES[1]
  ej(b, 1, `Resume este texto: <i>${esc(r.texto)}</i>`, `<i>${esc(r.bueno)}</i> <span class="gris">(Vale otro con palabras propias, en presente, sin opinar y de menos de un tercio.)</span>`)
  ej(b, 2, `¿Qué falla en cada uno de estos resúmenes?${lista(D.RESUMENES.flatMap((x) => x.malos).map(([m]) => `<i>${esc(m)}</i>`))}`, lista(D.RESUMENES.flatMap((x) => x.malos).map(([, f]) => esc(f))))
}

// ============================== REPASO DEL PARCIAL ==============================

{
  const b = bloque(
    P,
    'Lo que entraba en el parcial',
    `${ul([
      '<b>Funciones del lenguaje</b>: referencial, expresiva, apelativa o conativa, fática, poética y metalingüística.',
      '<b>La sílaba</b>: diptongo (vocal abierta + cerrada o dos cerradas: cie-lo, ciu-dad), triptongo (buey) e hiato (dos abiertas o cerrada tónica + abierta: le-ón, dí-a).',
      '<b>Unidades de la lengua</b>: fonema, morfema, palabra, enunciado y texto.',
      '<b>Acentuación</b>: agudas con tilde en vocal, -n o -s; llanas con tilde si no acaban en vocal, -n o -s; esdrújulas siempre; el hiato con cerrada tónica lleva tilde (día, baúl).',
      '<b>Significado</b>: denotativo y connotativo, literal y figurado, monosémicas y polisémicas.',
    ])}<p class="gris">Están en la web: Lengua Castellana → Parcial · Unidades 1 y 2.</p>`,
  )
  b.etq = 'Recuerda'
}

// ---------- Página ----------
const NIVEL = { 1: '<span class="nv n1">★ Básico</span>', 2: '<span class="nv n2">★★ Avanzado</span>' }
const cuerpo = PARTES.map(
  (p) => `<h2 class="${p.clase}">${p.titulo}</h2>
${p.bloques.map((b) => `<h3>${b.titulo}</h3><div class="como"><div class="etq">${b.etq ?? 'Cómo se hace'}</div>${b.como}</div>${b.ejs.map((e) => `<div class="ej"><span class="num">${e.n}</span> ${NIVEL[e.nivel]} ${e.enunciado}</div>`).join('')}`).join('')}`,
).join('')
const soluciones = PARTES.filter((p) => p.bloques.some((b) => b.ejs.length))
  .map((p) => `<h2 class="${p.clase}">Soluciones · ${p.titulo}</h2>${p.bloques.flatMap((b) => b.ejs).map((e) => `<div class="sol"><span class="num">${e.n}</span><div>${e.solucion}</div></div>`).join('')}`)
  .join('')

const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>Repaso global Lengua</title>
<style>
  @page { size: A4; margin: 13mm 12mm 13mm 12mm; }
  * { box-sizing: border-box; }
  body { font-family: "Segoe UI", Arial, sans-serif; font-size: 10.4pt; line-height: 1.4; color: #1e293b; margin: 0; }
  h1 { font-size: 21pt; margin: 0 0 1.5mm; color: #312e81; }
  h2 { font-size: 14pt; margin: 5mm 0 2.5mm; padding: 1.5mm 3mm; border-radius: 2mm; color: #fff; background: #4338ca; break-after: avoid; }
  h2.t1 { background: #0f766e; } h2.t2 { background: #1d4ed8; }
  h3 { font-size: 12pt; margin: 4mm 0 1.5mm; color: #312e81; break-after: avoid; border-bottom: 0.4mm solid #c7d2fe; padding-bottom: 0.5mm; }
  p { margin: 1mm 0 1.5mm; } ul, ol { margin: 1mm 0 1.5mm; padding-left: 5mm; } li { margin: 0.6mm 0; }
  .sub { color: #475569; font-size: 10pt; margin-bottom: 3mm; }
  .grid { display: grid; gap: 2.5mm; } .g2 { grid-template-columns: 1fr 1fr; }
  .como { border: 0.4mm solid #c7d2fe; background: #f8faff; border-radius: 2mm; padding: 2mm 3mm; margin: 1.5mm 0 2.5mm; }
  .etq { font-size: 8.5pt; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; color: #4338ca; margin-bottom: 1mm; }
  .caixa { border: 0.4mm solid #ddd6fe; border-radius: 2mm; padding: 1.8mm 2.5mm; background: #fff; break-inside: avoid; }
  .caixa h4 { margin: 0 0 1mm; font-size: 10.2pt; color: #5b21b6; }
  .truco { background: #fef3c7; border-left: 1.2mm solid #f59e0b; padding: 1.5mm 3mm; border-radius: 1mm; margin: 2mm 0; break-inside: avoid; }
  .ollo { background: #fee2e2; border-left: 1.2mm solid #dc2626; padding: 1.5mm 3mm; border-radius: 1mm; margin: 2mm 0; break-inside: avoid; }
  table { border-collapse: collapse; width: 100%; margin: 1.5mm 0 2mm; break-inside: avoid; font-size: 9.8pt; }
  th, td { border: 0.3mm solid #cbd5e1; padding: 1mm 2mm; text-align: left; vertical-align: top; }
  th { background: #e0e7ff; color: #312e81; }
  .ej { margin: 2mm 0 3mm; break-inside: avoid; }
  .num { display: inline-flex; align-items: center; justify-content: center; min-width: 6.5mm; height: 6.5mm; border-radius: 50%; background: #312e81; color: #fff; font-weight: 800; font-size: 9.5pt; margin-right: 1mm; }
  .nv { font-size: 8pt; font-weight: 800; border-radius: 1mm; padding: 0.3mm 1.5mm; margin-right: 1mm; }
  .n1 { background: #dcfce7; color: #166534; } .n2 { background: #fee2e2; color: #991b1b; }
  ol.items { margin: 1mm 0 0 8mm; } ol.items li { margin: 1mm 0; }
  .hueco { display: inline-block; min-width: 16mm; border-bottom: 0.3mm solid #334155; margin: 0 1mm; height: 1em; }
  .banco { margin: 1.5mm 0 1mm 8mm; padding: 1mm 2.5mm; border: 0.3mm dashed #94a3b8; border-radius: 1.5mm; display: inline-block; font-size: 9.6pt; }
  .ficha { margin: 1.5mm 0 1mm 8mm; padding: 1.5mm 3mm; background: #f5f3ff; border: 0.3mm solid #ddd6fe; border-radius: 2mm; font-size: 9.6pt; }
  .gris { color: #64748b; font-size: 9pt; } .mal { color: #b91c1c; }
  .sol { display: flex; gap: 2mm; margin: 1.5mm 0; padding-bottom: 1.5mm; border-bottom: 0.3mm solid #e2e8f0; break-inside: avoid; }
  .sol > div { flex: 1; } .sol ol.items { margin-left: 5mm; } .sol ol.items li { margin: 0.3mm 0; }
  .salto { break-before: page; }
  .check li { list-style: "☐  "; }
  .pe { font-size: 8.5pt; color: #64748b; margin-top: 4mm; border-top: 0.3mm solid #e2e8f0; padding-top: 1.5mm; }
  .portada { border: 0.5mm solid #c7d2fe; border-radius: 3mm; padding: 3mm 4mm; background: #eef2ff; margin-bottom: 3mm; }
</style>
</head>
<body>
<h1>Lengua Castellana · Repaso del global</h1>
<p class="sub">1.ª evaluación, 2.º ESO. Entra todo lo de la evaluación: lo nuevo y lo del parcial.</p>
<div class="portada">
  <b>Cómo usar este cuadernillo:</b> en cada apartado lee el recuadro <b>«Cómo se hace»</b> y después haz los ejercicios en el cuaderno, primero los <span class="nv n1">★ Básico</span> y luego los <span class="nv n2">★★ Avanzado</span>. Las <b>soluciones están al final</b>. Muchos ejercicios son las actividades del libro y de las fotocopias.
</div>
${cuerpo}

<h2>Antes del examen, sé…</h2>
<ul class="check">
  <li>Definir lenguaje, lengua y habla, dialecto, bilingüismo y diglosia.</li>
  <li>Contar la historia de las lenguas de España y decir cuáles son cooficiales y cuál no es romance.</li>
  <li>Explicar los rasgos del español de América y la situación del español en el mundo.</li>
  <li>Reconocer los niveles culto, estándar, coloquial y vulgar, corregir vulgarismos y explicar qué es una jerga.</li>
  <li>Distinguir sinónimos, antónimos (puros, complementarios y recíprocos), hiperónimos, monosemia, polisemia y homonimia.</li>
  <li>Decir qué función del lenguaje predomina en un mensaje (y que la del código es la metalingüística).</li>
  <li>Hacer un resumen: breve, propio, en presente, sin opinar y sin empezar por «Este texto».</li>
  <li>Lo del parcial: sílabas, diptongos e hiatos, unidades, acentuación y significado.</li>
</ul>
<p class="pe">Para practicar y hacer el simulacro con nota: Eón → Mateo → 2.º ESO → Lengua Castellana → Global 1.ª evaluación → «Simulacro del global».</p>

<h1 class="salto">Soluciones</h1>
${soluciones}
</body>
</html>
`

if (fallos.length) {
  console.error('Hay soluciones que no cuadran:\n' + fallos.join('\n'))
  process.exit(1)
}
writeFileSync(new URL('./lengua-global1.html', import.meta.url), html)
console.log(`Hecho: ${nEj} ejercicios.`)
