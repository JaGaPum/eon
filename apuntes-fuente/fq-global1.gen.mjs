// Genera «fisica-quimica-global1.html»: cuadernillo de repaso para el global de Física y Química de 2.º ESO
// (1.ª evaluación). Los datos y las soluciones salen de los mismos ficheros que usa la web (src/ciencias/fq2/datos.ts,
// src/lib/fisica.ts y src/lib/materia.ts) y el programa se para si alguna solución no coincide con la del libro.
// Uso, desde la raíz del repositorio: node apuntes-fuente/fq-global1.gen.mjs
import { writeFileSync } from 'node:fs'
import { createServer } from 'vite'

const server = await createServer({ configFile: false, server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })
const D = await server.ssrLoadModule('/src/ciencias/fq2/datos.ts')
const F = await server.ssrLoadModule('/src/lib/fisica.ts')
const M = await server.ssrLoadModule('/src/lib/materia.ts')
await server.close()

const fallos = []
const espera = (que, dado, bueno) => {
  if (String(dado) !== String(bueno)) fallos.push(`${que}: sale «${dado}» y se esperaba «${bueno}»`)
}
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const n = (x, d = 2) => F.escribe(x, d)
const sub = M.conSubindices

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
const taboa = (cab, filas) => `<table><tr>${cab.map((c) => `<th>${c}</th>`).join('')}</tr>${filas.map((f) => `<tr>${f.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</table>`
const def = (xs) => ul(xs.map(([t, d]) => `<b>${esc(t)}</b>: ${esc(d)}`))
const [N, P] = PARTES
const L = F.LEYES_GASES

// Comprobaciones con los resultados que da el libro.
espera('Ejemplo 2, T₂ (°C)', D.EJEMPLO2.T2C, 393)
espera('Ejemplo 2, T₃ (°C)', D.EJEMPLO2.T3C, 1059)
espera('Ejemplo 1, V₂ (L)', F.boyle(2, 3, 4, null), 1.5)
for (const c of ['T', 'V', 'p']) espera(`Tabla de ${L[c].ley}`, F.cumpleLey(c, D.TABLAS_GASES[c]), true)

// ============================== LO NUEVO ==============================

{
  const b = bloque(
    N,
    'Las leyes de los gases',
    `${taboa(['Constante', 'Ley', 'Fórmula', 'Relación', 'Gráfica'], ['T', 'V', 'p'].map((c) => [`<b>${c} = cte.</b>`, L[c].ley, L[c].formula, `${L[c].varian}: ${L[c].relacion}`, L[c].grafica]))}
    <div class="truco"><b>Pasos:</b> 1) escribe los datos de los dos estados; 2) mira qué magnitud no cambia → esa es la ley; 3) en Gay-Lussac y Charles pasa la temperatura a kelvin: <b>T (K) = T (°C) + 273</b>; 4) despeja; 5) si te piden °C, resta 273.</div>
    <div class="ollo">Con Gay-Lussac y Charles, nunca en °C: de 20 °C a 40 °C la presión no se duplica.</div>`,
  )
  ej(b, 1, 'Pasa a kelvin: 27 °C, −73 °C, 100 °C y 60 °C. Pasa a °C: 300 K y 666 K.', `${[27, -73, 100, 60].map((t) => `${t} + 273 = <b>${F.kelvin(t)} K</b>`).join('; ')}. ${[300, 666].map((T) => `${T} − 273 = <b>${F.celsius(T)} °C</b>`).join('; ')}.`)
  ej(b, 1, '¿Qué ley se aplica en cada caso? a) Un gas se calienta en una bombona cerrada. b) Se comprime un gas en una jeringa sin cambiar la temperatura. c) Un globo se calienta al sol y la presión no cambia.', lista([`V = cte. → <b>${L.V.ley}</b>.`, `T = cte. → <b>${L.T.ley}</b>.`, `p = cte. → <b>${L.p.ley}</b>.`]))
  const a14 = D.ACT14
  espera('Actividad 14', a14.p2, 2)
  ej(b, 1, `Actividad 14. En un recipiente de ${a14.V1} L hay nitrógeno a ${a14.p1} atm. ¿Cómo variará la presión si el volumen se duplica sin variar la temperatura?`, `T = cte. → Boyle-Mariotte: p₁·V₁ = p₂·V₂ → p₂ = ${a14.p1} · ${a14.V1} / ${a14.V2} = <b>${n(a14.p2)} atm</b>. Se reduce a la mitad.`)
  const a15 = D.ACT15
  ej(b, 2, `Actividad 15. Se introduce oxígeno en un recipiente de ${a15.V} L a ${a15.p1} atm y ${a15.T1C} °C. ¿Cuál será su presión si la temperatura pasa a ser de ${a15.T2C} °C sin variar el volumen?`, `V = cte. → Gay-Lussac. T₁ = ${a15.T1C} + 273 = ${F.kelvin(a15.T1C)} K; T₂ = ${F.kelvin(a15.T2C)} K. p₂ = p₁ · T₂ / T₁ = ${a15.p1} · ${F.kelvin(a15.T2C)} / ${F.kelvin(a15.T1C)} = <b>${n(a15.p2)} atm</b>.`)
  const E = D.EJEMPLO2
  ej(b, 2, 'Ejemplo resuelto 2. En un recipiente de 3 L hay un gas a 60 °C y 2 atm. a) ¿A qué temperatura ejercerá 4 atm sin que varíe el volumen? b) Manteniendo los 4 atm, ¿cuál será su temperatura si el volumen llega a 6 L?', lista([`V = cte. → Gay-Lussac: T₂ = p₂ · T₁ / p₁ = 4 · ${E.T1} / 2 = ${E.T2} K = <b>${E.T2C} °C</b>.`, `p = cte. → Charles: T₃ = V₃ · T₂ / V₂ = 6 · ${E.T2} / 3 = ${E.T3} K = <b>${E.T3C} °C</b>.`]))
  const v = F.charles(2, 300, null, 450)
  ej(b, 2, 'Un gas ocupa 2 L a 27 °C. ¿Qué volumen ocupará a 177 °C si la presión no cambia?', `p = cte. → Charles. T₁ = 300 K, T₂ = 450 K. V₂ = 2 · 450 / 300 = <b>${n(v)} L</b>.`)
  const pg = F.gayLussac(0.5, 200, null, 1000)
  ej(b, 1, `Con la tabla de Gay-Lussac del libro (${D.TABLAS_GASES.V.map(([p, T]) => `${T} K → ${n(p)} atm`).join('; ')}): a) ¿cuánto vale p/T? b) ¿qué presión habría a 1000 K? c) ¿cómo es la gráfica?`, lista([`p/T = 0,5 / 200 = <b>${n(0.5 / 200, 4)} atm/K</b> en todas las filas.`, `p = ${n(0.5 / 200, 4)} · 1000 = <b>${n(pg)} atm</b>.`, `<b>${L.V.grafica}</b>: son directamente proporcionales.`]))
}

{
  const tab = taboa(['Sustancia', 'Fusión (°C)', 'Ebullición (°C)'], F.SUSTANCIAS.map((s) => [s.nombre, s.fusion, s.ebullicion]))
  const b = bloque(
    N,
    'Fusión, ebullición y evaporación',
    `<div class="g2 grid"><div>${tab}</div><div>
    <div class="caixa"><h4>Fusión y solidificación</h4>Sólido ⇄ líquido. Se producen a la misma temperatura: el <b>punto de fusión</b> (agua: 0 °C).</div>
    <div class="caixa"><h4>Vaporización y condensación (licuación)</h4>Líquido ⇄ gas. A la <b>temperatura de ebullición</b> (agua: 100 °C a 1 atm).</div>
    <div class="caixa"><h4>Mientras cambia de estado</h4>La temperatura <b>no varía</b> aunque sigamos calentando: tramo horizontal en la gráfica.</div>
    </div></div>
    ${taboa(['Evaporación', 'Ebullición'], D.EVAPORACION.map((e, i) => [esc(e), esc(D.EBULLICION[i])]))}
    <div class="truco">Por debajo de la fusión: sólido. Entre fusión y ebullición: líquido. Por encima de la ebullición: gas.</div>`,
  )
  const alc = F.sustancia('alcohol')
  ej(b, 1, `Actividad 26. ¿En qué estado está el alcohol a 1 atm y ${D.ACT26.map((T) => `${T} °C`).join(', ')}?`, lista(D.ACT26.map((T) => `${T} °C: <b>${F.estadoA(alc, T)}</b>`)))
  const r27 = D.ACT27.map(([e, T]) => F.queSustancias(e, T))
  espera('Actividad 27', JSON.stringify(r27), JSON.stringify([['oxígeno'], ['hierro', 'diamante'], ['aluminio'], ['alcohol'], ['mercurio', 'agua'], ['hierro']]))
  ej(
    b,
    2,
    `Actividad 27. Identifica la sustancia que a 1 atm: ${D.ACT27.map(([e, T], i) => `${'abcdef'[i]}) está en estado ${e === 'gas' ? 'gaseoso' : e} a ${T} °C`).join('; ')}.`,
    lista(
      r27.map(
        (s) =>
          `<b>${s.join(' y ')}</b>${s.length > 1 ? ' (valen las dos)' : ''}: ${s
            .map((x) => {
              const q = F.sustancia(x)
              return `${x} funde a ${q.fusion} °C y hierve a ${q.ebullicion} °C`
            })
            .join('; ')}.`,
      ),
    ),
  )
  ej(b, 1, 'Di tres diferencias entre la evaporación y la ebullición. ¿Qué tres cosas hacen más rápida la evaporación?', `${lista(D.EVAPORACION.map((e, i) => `Evaporación: ${esc(e)} — Ebullición: ${esc(D.EBULLICION[i])}`))}Más rápida: dando calor, aumentando la superficie y con viento.`)
}

{
  const b = bloque(
    N,
    'Cómo se presenta la materia',
    `<p><b>Materia</b>: todo lo que tiene masa y ocupa un volumen.</p>
    <div class="g2 grid">
      <div class="caixa"><h4>Según su aspecto</h4><b>Homogéneo</b>: toda la materia muestra el mismo aspecto.<br><b>Heterogéneo</b>: algunas partes muestran distinto aspecto.</div>
      <div class="caixa"><h4>Según su composición</h4><b>Sustancia pura</b>: una única sustancia.<br><b>Mezcla</b>: dos o más sustancias.</div>
      <div class="caixa"><h4>Sustancias simples y compuestos</h4><b>Simples</b>: átomos de un único tipo (O₂, Au). <b>Compuestos</b>: átomos de dos o más tipos (H₂O, NaCl).</div>
      <div class="caixa"><h4>Mezclas</h4><b>Homogéneas</b>: no se distinguen sus componentes ni con microscopio (suero fisiológico). <b>Heterogéneas</b>: se distinguen algunos (granito; la leche, al microscopio).</div>
    </div>`,
  )
  ej(b, 1, `Actividad 1. Clasifica según su aspecto y su composición: ${D.EJEMPLOS_58.map((e) => e.nombre.toLowerCase()).join(', ')}.`, taboa(['Materia', 'Aspecto', 'Composición', 'Por qué'], D.EJEMPLOS_58.map((e) => [e.nombre, e.aspecto ?? '(se ven burbujas, pero es una disolución)', e.composicion, esc(e.porque)])))
  ej(b, 1, `Actividad 2. ¿Homogéneo o heterogéneo? ${D.ACT2.map(([x]) => x.toLowerCase()).join(', ')}.`, lista(D.ACT2.map(([x, a, p]) => `${x}: <b>${a}</b>. ${esc(p)}`)))
  ej(b, 1, 'Actividad 5. Echas cubitos de hielo a un vaso de agua. ¿Son correctas? ' + D.ACT5.map(([f], i) => `${'abc'[i]}) «${esc(f)}»`).join(' '), lista(D.ACT5.map(([, v, p]) => `<b>${v ? 'Correcta' : 'Incorrecta'}</b>. ${esc(p)}`)))
  const fs = ['O2', 'Au', 'H2O', 'NaCl', 'O3', 'C2H6O']
  ej(b, 1, `¿Sustancia simple o compuesto? ${fs.map(sub).join(', ')}.`, lista(fs.map((f) => `${sub(f)}: <b>${M.clase(f)}</b> (${Object.keys(M.atomos(f)).join(', ')})`)))
}

{
  const y = M.mezclar(D.ALCOHOL_YODADO)
  const py = M.papeles(y)
  espera('Actividad 10, disolvente', py.disolvente.nombre, 'alcohol')
  const b = bloque(
    N,
    'Disoluciones',
    `<div class="g2 grid">
      <div class="caixa"><h4>Disolvente, soluto y disolución</h4><b>Disolvente</b>: el componente en mayor proporción. <b>Soluto</b>: el que está en menor proporción. <b>Disolución</b>: mezcla homogénea de dos o más componentes.</div>
      <div class="caixa"><h4>Diluida y concentrada</h4><b>Diluida</b>: poco soluto respecto al disolvente. <b>Concentrada</b>: mucho soluto (si tiene color, color más intenso).</div>
      <div class="caixa"><h4>Estado</h4>El soluto y el disolvente pueden estar en cualquier estado; la disolución tiene <b>el estado del disolvente</b>. El aire es una disolución de gases.</div>
      <div class="caixa"><h4>Aleaciones</h4>Disoluciones <b>sólidas</b> de dos o más metales, o de un metal y otra sustancia, para mejorar alguna propiedad. Acero: hierro (disolvente) + carbono (soluto). Se mezclan en estado líquido.</div>
    </div>`,
  )
  ej(b, 1, 'Actividad 9. Dos infusiones de manzanilla, A (clara) y B (oscura). a) ¿Disolvente y soluto? b) ¿Estados? c) ¿Cuál es más diluida y cuál más concentrada? ¿Cómo se comprueba?', lista(['Disolvente: el <b>agua</b>. Soluto: la <b>manzanilla</b>.', 'Disolvente líquido, soluto sólido, disolución <b>líquida</b> (como el disolvente).', 'A es la más <b>diluida</b> y B la más <b>concentrada</b>. Se comprueba por el color (más intenso) y por el sabor.']))
  ej(b, 2, 'Actividad 10. El alcohol yodado se prepara con un 98 % de alcohol de 70° (70 % de alcohol y 30 % de agua) y un 2 % de yodo. ¿Cada componente es soluto o disolvente?', `${lista(y.map((c) => `${c.nombre}: ${n(c.porcentaje, 1)} % → <b>${c === py.disolvente ? 'disolvente' : 'soluto'}</b>`))}El de mayor proporción es el disolvente.`)
  ej(b, 1, `Actividad 11. Estado del soluto y del disolvente: ${D.ACT11.map(([m]) => m.toLowerCase()).join(', ')}.`, taboa(['Mezcla', 'Soluto', 'Disolvente'], D.ACT11.map(([m, so, eso, di, edi]) => [m, `${so}: <b>${eso}</b>`, `${di}: <b>${edi}</b>`])))
  const pa = M.papeles(D.AIRE)
  ej(b, 1, 'Actividad 12. Composición del aire: a) ¿disolvente y solutos? b) ¿estados?', lista([`Disolvente: <b>${pa.disolvente.nombre}</b> (${pa.disolvente.porcentaje} %). Solutos: ${pa.solutos.map((c) => `${c.nombre} (${n(c.porcentaje)} %)`).join(', ')}.`, `Todos <b>gas</b>, y la disolución también (${M.estadoDisolucion(D.AIRE)}).`]))
  ej(b, 2, 'Actividad 13. Bronce, latón y oro blanco: composición, disolvente, uso y en qué es mejor que su metal principal.', taboa(['Aleación', 'Composición', 'Uso', 'Mejor que el metal puro'], D.ALEACIONES.slice(0, 3).map((a) => [a.nombre, `<b>${a.disolvente}</b> (disolvente) + ${a.solutos}`, a.uso, a.mejor])))
}

{
  const orden = [...D.MODELOS].sort((a, b) => a.año - b.año)
  const b = bloque(
    N,
    'De qué está formada la materia',
    `<p>Toda la materia está formada por <b>átomos</b>, y estos por partículas más pequeñas: ${D.PARTICULAS.map(([p, d]) => `<b>${p.toLowerCase()}</b> (${esc(d.toLowerCase().replace(/\.$/, ''))})`).join(', ')}.</p>
    ${taboa(['Modelo', 'Año', 'Idea'], orden.map((m) => [`<b>${m.nombre}</b>`, m.año, esc(m.idea)]))}
    <p class="gris">El libro escribe «Thompson»; el científico se llamaba Thomson.</p>
    <div class="g2 grid">
      <div class="caixa"><h4>Elemento químico</h4>Los átomos con el <b>mismo número de protones</b>. Se conocen 118, ordenados en la tabla periódica.</div>
      <div class="caixa"><h4>Cómo se presentan</h4><b>Átomos aislados</b>: solo los gases nobles (He). <b>Moléculas</b>: grupos de átomos concretos (H₂, O₃, H₂O, C₂H₆O). <b>Cristales</b>: millones de átomos ordenados (diamante C, sal NaCl).</div>
    </div>
    <div class="truco">Agua (compuesto): cada molécula tiene 1 O y 2 H unidos, siempre en esa proporción. Mezcla de H₂ y O₂: moléculas separadas, en cualquier proporción.</div>`,
  )
  ej(b, 1, 'Ordena los modelos atómicos y explica cada uno: Bohr, Dalton, Rutherford, Thomson.', lista(orden.map((m) => `<b>${m.nombre} (${m.año})</b>: ${esc(m.idea)}`)))
  const sel = D.SUSTANCIAS_66.filter((s) => ['He', 'H2', 'O3', 'H2O', 'C2H6O', 'C', 'NaCl'].includes(s.formula))
  ej(b, 1, `Para cada sustancia di si es simple o compuesto, cómo se presenta y, si forma moléculas, cuántos átomos tiene cada una: ${sel.map((s) => `${s.nombre} (${sub(s.formula)})`).join(', ')}.`, lista(sel.map((s) => `${s.nombre}: <b>${M.clase(s.formula)}</b>, ${s.agrupacion}${s.agrupacion === 'moléculas' ? ` de ${M.totalAtomos(s.formula)} átomos` : ''}.`)))
  const sol17 = D.ACT17.map(([t, cumple]) => [t, ['A', 'B', 'C', 'D'].filter((k) => cumple(D.DIBUJOS_67[k], M.clase(D.DIBUJOS_67[k].formulas[0])))])
  espera('Actividad 17', sol17.map(([, k]) => k.join('')).join(''), 'CBDA')
  ej(b, 2, 'Actividad 17 (página 67). En los dibujos: A, cristal de átomos de hierro y oxígeno; B, moléculas de un átomo de carbono y dos de oxígeno; C, cristal de átomos de carbono; D, moléculas de dos átomos de oxígeno. ¿Cuál es a) un cristal que es sustancia simple, b) un compuesto formado por moléculas, c) una sustancia simple formada por moléculas, d) un cristal que es un compuesto? Escribe sus fórmulas.', lista(sol17.map(([, [k]]) => `<b>${k}</b>: ${M.describe(D.DIBUJOS_67[k])}`)))
}

{
  const pos = (s) => M.posicion(M.elemento(s).z)
  const b = bloque(
    N,
    'La tabla periódica (lo subrayado)',
    `${def(D.TABLA_IDEAS)}
    <div class="caixa"><h4>Los símbolos</h4>${def(D.SIMBOLOS_REGLAS)}</div>`,
  )
  const es = ['Na', 'Cl', 'Fe', 'Ne', 'Hg', 'C']
  espera('Hierro', JSON.stringify(pos('Fe')), JSON.stringify({ periodo: 4, grupo: 8 }))
  ej(b, 1, `Escribe el nombre, el número de protones, el periodo y el grupo de: ${es.join(', ')}. (Números atómicos: ${es.map((s) => `${s} = ${M.elemento(s).z}`).join(', ')}.)`, taboa(['Símbolo', 'Nombre', 'Protones (Z)', 'Periodo', 'Grupo'], es.map((s) => [s, M.elemento(s).nombre, M.elemento(s).z, pos(s).periodo, pos(s).grupo])))
  ej(b, 1, 'Actividad 21. Escribe cinco elementos cuyo símbolo tenga una sola letra.', M.ELEMENTOS.filter((e) => e.simbolo.length === 1).slice(0, 8).map((e) => `${e.simbolo} (${e.nombre})`).join(', ') + '…')
  ej(b, 2, '¿Por qué el helio es He y el mercurio Hg? ¿Por qué se llaman «nobles» los gases del grupo 18? ¿Qué tienen en común el litio, el sodio y el potasio?', lista(['He: la H ya es el hidrógeno, así que se añade una segunda letra en minúscula. Hg: de su nombre en latín, <i>hydrargyrum</i>, «agua de plata».', 'Son muy estables y casi nunca se combinan con otros, como la nobleza, que no se mezclaba con otras clases sociales.', `Están en el mismo grupo (${pos('Li').grupo}): tienen propiedades semejantes.`]))
}

// ============================== REPASO DEL PARCIAL ==============================

{
  const b = bloque(
    P,
    'Lo que entraba en el parcial',
    `${ul([
      '<b>Factores de conversión</b>: la unidad que se quiere quitar va en el lado contrario para tacharse. 82 km/h · (1000 m / 1 km) · (1 h / 3600 s) = 22,78 m/s.',
      '<b>Densidad</b>: d = m / V; m = d · V; V = m / d. Unidad del SI: kg/m³ (1 g/cm³ = 1000 kg/m³).',
      '<b>Cambios de estado</b>: progresivos (fusión, vaporización, sublimación) y regresivos (solidificación, condensación, sublimación inversa).',
      '<b>Gráficas</b>: tramos inclinados, un estado; tramos horizontales, cambio de estado. El primero, fusión; el segundo, ebullición.',
      '<b>Boyle-Mariotte</b>: a T constante, p₁·V₁ = p₂·V₂.',
    ])}<p class="gris">Están en la web: Física e Química → Primer parcial, y en sus apuntes.</p>`,
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
<title>Repaso global Física y Química</title>
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
  .como { border: 0.4mm solid #c7d2fe; background: #f8faff; border-radius: 2mm; padding: 2mm 3mm; margin: 1.5mm 0 2.5mm; break-inside: avoid; }
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
<h1>Física y Química · Repaso del global</h1>
<p class="sub">1.ª evaluación, 2.º ESO. Entra todo lo de la evaluación: lo nuevo y lo del parcial.</p>
<div class="portada">
  <b>Cómo usar este cuadernillo:</b> en cada apartado lee el recuadro <b>«Cómo se hace»</b> y después haz los ejercicios en el cuaderno, primero los <span class="nv n1">★ Básico</span> y luego los <span class="nv n2">★★ Avanzado</span>. Las <b>soluciones están al final</b>. Muchos ejercicios son las actividades del libro.
</div>
${cuerpo}

<h2>Antes del examen, sé…</h2>
<ul class="check">
  <li>Decir qué ley de los gases se aplica (qué magnitud es constante) y resolver problemas pasando la temperatura a kelvin.</li>
  <li>Reconocer las gráficas: hipérbola (Boyle) y rectas que pasan por el (0, 0) (Gay-Lussac y Charles).</li>
  <li>Usar las tablas de fusión y ebullición para decir en qué estado está una sustancia; diferenciar evaporación y ebullición.</li>
  <li>Clasificar la materia: homogénea o heterogénea, sustancia pura o mezcla, sustancia simple o compuesto.</li>
  <li>Identificar soluto y disolvente, disolución diluida o concentrada, y explicar qué es una aleación.</li>
  <li>Ordenar los modelos atómicos (Dalton, Thomson, Rutherford, Bohr) y distinguir átomos aislados, moléculas y cristales.</li>
  <li>Tabla periódica: periodos y grupos, número atómico, cómo se escriben los símbolos y los gases nobles.</li>
  <li>Lo del parcial: factores de conversión, densidad, cambios de estado, gráficas y Boyle-Mariotte.</li>
</ul>
<p class="pe">Para practicar y hacer el simulacro con nota: Eón → Mateo → 2.º ESO → Física e Química → Global 1.ª evaluación → «Simulacro del global».</p>

<h1 class="salto">Soluciones</h1>
${soluciones}
</body>
</html>
`

if (fallos.length) {
  console.error('Hay soluciones que no cuadran:\n' + fallos.join('\n'))
  process.exit(1)
}
writeFileSync(new URL('./fisica-quimica-global1.html', import.meta.url), html)
console.log(`Hecho: ${nEj} ejercicios.`)
