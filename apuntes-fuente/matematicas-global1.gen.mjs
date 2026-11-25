// Genera «matematicas-global1.html»: cuadernillo de repaso para el global de Matemáticas (temas 1, 2 y 3).
// Los enunciados están aquí; las soluciones y sus pasos los calculan los motores de la web (src/lib/), y el
// programa se para si alguna no coincide con la que se espera.
// Uso, desde la raíz del repositorio: node apuntes-fuente/matematicas-global1.gen.mjs
import { writeFileSync } from 'node:fs'
import { createServer } from 'vite'

const server = await createServer({ configFile: false, server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })
const L = (p) => server.ssrLoadModule(p)
const M = await L('/src/lib/mates.ts')
const E = await L('/src/lib/expresion.ts')
const F = await L('/src/lib/fracciones.ts')
const X = await L('/src/lib/exprFr.ts')
const P = await L('/src/lib/potencias.ts')

// ---------- Comprobar ----------
const fallos = []
const espera = (que, dado, bueno) => {
  if (String(dado) !== String(bueno)) fallos.push(`${que}: sale ${dado} y se esperaba ${bueno}`)
}

// ---------- Escribir ----------
const esc0 = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
// Los exponentes que trae el motor en caracteres volados (2²·³) pasan a <sup>, para que el «·» no parezca una coma.
const VOL = '⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁽⁾'
const NOR = '0123456789+−()'
const esc = (s) =>
  esc0(s).replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁽⁾]+(?:·[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁽⁾]+)*/g, (m) => `<sup>${[...m].map((c) => (VOL.includes(c) ? NOR[VOL.indexOf(c)] : c)).join('')}</sup>`)
/** Número a la española: coma decimal, signo «−» y espacio de miles a partir de cinco cifras. */
function num(x) {
  const neg = x < 0
  const [e, d] = Math.abs(x).toLocaleString('en-US', { useGrouping: false, maximumFractionDigits: 20 }).split('.')
  const ent = e.length > 4 ? e.replace(/\B(?=(\d{3})+(?!\d))/g, '&#8239;') : e
  return `${neg ? '−' : ''}${ent}${d ? ',' + d : ''}`
}
const sup = (e) => `<sup>${String(e).replace('-', '−')}</sup>`
const fr = (v) => (v.d === 1 ? num(v.n) : `${v.n < 0 ? '−' : ''}<span class="fr"><span>${num(Math.abs(v.n))}</span><span>${num(v.d)}</span></span>`)
const frs = (a, b) => `<span class="fr"><span>${esc(a)}</span><span>${esc(b)}</span></span>`
function toks(ts) {
  return ts
    .map((t) => {
      if (t.k === 'fr') return t.paren ? `(${fr(t.v)})` : fr(t.v)
      if (t.k === 'frs') return frs(t.arriba, t.abajo)
      if (t.k === 'rad') return `<span class="rad">√<span>${toks(t.toks)}</span></span>`
      return esc(t.s)
    })
    .join('')
    .replace(/  +/g, ' ')
}
const ex = (s) => `<span class="ex">${toks(X.tokens(X.analizarFr(s)))}</span>`
const cien = (c) => `${num(c.m)} · 10${sup(c.e)}`
const periodo = (ent, ante, per) => `${ent},${ante}<span class="per">${per}</span>`

/** Pasos de una combinada con fracciones, potencias o raíces: una línea por paso, con la cuenta al lado. */
function cadenaFr(s) {
  const r = X.resolverFr(s)
  const lineas = [`<div class="paso"><span class="ex">${toks(r.inicial)}</span></div>`]
  for (const p of r.pasos) lineas.push(`<div class="paso">= <span class="ex">${toks(p.despues)}</span><span class="cta">${toks(p.cuenta)}</span></div>`)
  return { html: `<div class="cadena">${lineas.join('')}</div>`, res: r.resultado }
}
/** Una expresión de enteros escrita como en el cuaderno, sin quitar paréntesis: (−6) · (+4). */
const zTexto = (s) =>
  s
    .replace(/([\d)\]])-/g, '$1 − ')
    .replace(/([\d)\]])\+/g, '$1 + ')
    .replace(/-/g, '−')
    .replace(/\*/g, ' · ')
    .replace(/\//g, ' : ')

/** Lo mismo con enteros (tema 1). */
function cadenaZ(s) {
  const r = E.resolver(s)
  r.inicial = zTexto(s)
  const lineas = [`<div class="paso">${esc(r.inicial)}</div>`]
  for (const p of r.pasos) lineas.push(`<div class="paso">= ${esc(p.despues)}<span class="cta">${esc(p.cuenta)}</span></div>`)
  return { html: `<div class="cadena">${lineas.join('')}</div>`, res: r.resultado, inicial: r.inicial }
}
const potHTML = (s) => esc(P.escribirP(P.analizarP(s)))
const primosHTML = (m) => [...m].map(([p, e]) => `${p}${e === 1 ? '' : sup(e)}`).join(' · ') || '1'
function escalera(n) {
  const filas = M.descomponer(n).map((s) => `<tr><td>${num(s.n)}</td><td>${s.primo}</td></tr>`)
  return `<table class="esc">${filas.join('')}<tr><td>1</td><td></td></tr></table>`
}
const factoriza = (n) => primosHTML(new Map(M.agrupar(M.factores(n))))

// ---------- Contenido ----------
const temas = []
let nEj = 0
const tema = (clase, titulo) => {
  const t = { clase, titulo, bloques: [] }
  temas.push(t)
  return t
}
const bloque = (t, titulo, como, ejemplo) => {
  const b = { titulo, como, ejemplo, ejs: [] }
  t.bloques.push(b)
  return b
}
const ej = (b, nivel, enunciado, solucion) => b.ejs.push({ n: ++nEj, nivel, enunciado, solucion })
const partes = (xs) => `<div class="partes">${xs.map((x, i) => `<div><b>${'abcdefgh'[i]})</b> ${x}</div>`).join('')}</div>`
const solPartes = (xs, dos = false) => `<div class="${dos ? 'dos' : ''}">${xs.map((x, i) => `<div class="sp"><b>${'abcdefgh'[i]})</b> ${x}</div>`).join('')}</div>`

// ===================== TEMA 1 =====================
const t1 = tema('t1', 'Tema 1 · Números enteros y divisibilidad')

{
  const cols = (nums, modo) => M.comunes(nums, modo)
  const b = bloque(
    t1,
    'Divisibilidad, factores primos, m.c.d. y m.c.m.',
    `<table class="crit">
      <tr><th>Entre</th><th>Se puede dividir si…</th><th>Entre</th><th>Se puede dividir si…</th></tr>
      <tr><td><b>2</b></td><td>acaba en 0, 2, 4, 6 u 8</td><td><b>9</b></td><td>la suma de sus cifras es múltiplo de 9</td></tr>
      <tr><td><b>3</b></td><td>la suma de sus cifras es múltiplo de 3</td><td><b>10</b></td><td>acaba en 0</td></tr>
      <tr><td><b>5</b></td><td>acaba en 0 o en 5</td><td><b>11</b></td><td>(suma de las cifras de lugar impar) − (suma de las de lugar par) es 0 o múltiplo de 11</td></tr>
    </table>
    <ol>
      <li><b>Descomponer en factores primos:</b> divide entre el primo más pequeño que se pueda (2, 3, 5, 7, 11…) hasta llegar a 1. Agrupa los repetidos en potencias.</li>
      <li><b>m.c.d.</b> (máximo común divisor): los factores <b>comunes</b> con el <b>menor</b> exponente.</li>
      <li><b>m.c.m.</b> (mínimo común múltiplo): los factores <b>comunes y no comunes</b> con el <b>mayor</b> exponente.</li>
    </ol>
    <div class="truco">💡 En los problemas: si hay que <b>repartir</b> o hacer grupos <b>iguales lo más grandes posible</b> → <b>m.c.d.</b> Si algo <b>vuelve a coincidir</b> o se busca el número <b>más pequeño</b> que es múltiplo de varios → <b>m.c.m.</b></div>`,
    (() => {
      espera('mcd 24 36', M.mcd([24, 36]), 12)
      espera('mcm 24 36', M.mcm([24, 36]), 72)
      return `<div class="g2 grid"><div>${escalera(24)}<p class="c">24 = ${factoriza(24)}</p></div><div>${escalera(36)}<p class="c">36 = ${factoriza(36)}</p></div></div>
        <p><b>m.c.d.(24, 36)</b>: comunes con el menor exponente → 2${sup(2)} · 3 = <b>12</b>.<br>
        <b>m.c.m.(24, 36)</b>: todos con el mayor exponente → 2${sup(3)} · 3${sup(2)} = <b>72</b>.</p>`
    })(),
  )

  const crit = [2, 3, 5, 9, 10, 11].map((d) => {
    const r = M.criterio(2340, d)
    return `<div class="sp"><b>Entre ${d}:</b> ${r.divide ? '<b class="si">sí</b>' : '<b class="no">no</b>'}. ${esc(r.texto)}</div>`
  })
  espera('2340 entre 11', M.criterio(2340, 11).divide, false)
  ej(b, 1, '¿Se puede dividir 2&#8239;340 entre 2, 3, 5, 9, 10 y 11? Usa los criterios, sin hacer la división.', crit.join(''))

  const dsc = [360, 1260, 2156]
  dsc.forEach((n) => espera(`factores ${n}`, M.valor(M.agrupar(M.factores(n))), n))
  ej(
    b,
    1,
    `Descompón en factores primos: ${partes(dsc.map(num))}`,
    `<div class="g3 grid">${dsc.map((n, i) => `<div><b>${'abc'[i]})</b> ${escalera(n)}<p class="c">${num(n)} = ${factoriza(n)}</p></div>`).join('')}</div>`,
  )

  ej(b, 1, 'Escribe todos los divisores de 36.', `${M.divisores(36).join(', ')}. Van por parejas que multiplicadas dan 36: 1·36, 2·18, 3·12, 4·9 y 6·6.`)
  espera('divisores 36', M.divisores(36).join(','), '1,2,3,4,6,9,12,18,36')

  const pares = [[60, 90], [84, 120], [12, 18, 30]]
  ej(
    b,
    1,
    `Calcula el m.c.d. y el m.c.m. de: ${partes(pares.map((p) => p.join(', ')))}`,
    solPartes(
      pares.map((p) => {
        const d = cols(p, 'mcd').filter((c) => c.elegido > 0)
        const m = cols(p, 'mcm')
        const w = (cs) => cs.map((c) => `${c.primo}${c.elegido === 1 ? '' : sup(c.elegido)}`).join(' · ')
        return `${p.map((n) => `${n} = ${factoriza(n)}`).join('; ')}.<br>m.c.d. = ${w(d)} = <b>${M.mcd(p)}</b>. &nbsp; m.c.m. = ${w(m)} = <b>${M.mcm(p)}</b>.`
      }),
    ),
  )
  espera('mcd 60 90', M.mcd([60, 90]), 30)
  espera('mcm 12 18 30', M.mcm([12, 18, 30]), 180)

  const m1 = M.mcm([12, 18])
  espera('autobuses', m1, 36)
  ej(
    b,
    2,
    'Un autobús sale de la estación cada 12 minutos y otro cada 18 minutos. Si a las 8:00 salen los dos a la vez, ¿a qué hora vuelven a salir juntos?',
    `Buscamos cuándo <b>vuelven a coincidir</b> → m.c.m. 12 = 2${sup(2)} · 3; 18 = 2 · 3${sup(2)}; m.c.m. = 2${sup(2)} · 3${sup(2)} = ${m1}. Vuelven a salir juntos dentro de ${m1} minutos: a las <b>8:${m1}</b>.`,
  )
  const d1 = M.mcd([48, 60])
  espera('caramelos', d1, 12)
  ej(
    b,
    2,
    'Tenemos 48 caramelos de fresa y 60 de limón. Queremos hacer bolsas con el mismo número de caramelos, lo más grandes posible y sin mezclar sabores. ¿Cuántos caramelos lleva cada bolsa? ¿Cuántas bolsas salen?',
    `Repartir en grupos <b>iguales lo más grandes posible</b> → m.c.d. 48 = 2${sup(4)} · 3; 60 = 2${sup(2)} · 3 · 5; m.c.d. = 2${sup(2)} · 3 = <b>${d1} caramelos</b> por bolsa. Salen 48 : ${d1} = ${48 / d1} de fresa y 60 : ${d1} = ${60 / d1} de limón: <b>${48 / d1 + 60 / d1} bolsas</b>.`,
  )
}

{
  const ejz = cadenaZ('-3*(4-7)+12/(-4)')
  espera('ejemplo enteros', ejz.res, 6)
  const b = bloque(
    t1,
    'Números enteros y operaciones combinadas',
    `<div class="g2 grid">
      <div class="caixa"><h4>Regla de los signos (· y :)</h4>
        <table class="signos"><tr><td>+ · + = +</td><td>− · − = +</td></tr><tr><td>+ · − = −</td><td>− · + = −</td></tr></table>
        Signos iguales → <b>positivo</b>; distintos → <b>negativo</b>.</div>
      <div class="caixa"><h4>Quitar paréntesis</h4>
        + (+5) = +5 &nbsp; + (−5) = −5<br>− (+5) = −5 &nbsp; <b>− (−5) = +5</b><br>
        Un <b>menos delante</b> del paréntesis cambia el signo de todo lo de dentro.</div>
    </div>
    <ul>
      <li><b>Valor absoluto</b> |−9| = 9: el número sin su signo. <b>Opuesto</b> de −9: 9.</li>
      <li>En la recta, más a la izquierda es más pequeño: −12 &lt; −7 &lt; 0 &lt; 3.</li>
    </ul>
    <div class="f">Orden: 1.º paréntesis y corchetes (de dentro afuera) → 2.º multiplicaciones y divisiones (de izquierda a derecha) → 3.º sumas y restas</div>`,
    ejz.html,
  )

  const lista = [-7, 3, 0, -12, 5, -2]
  ej(
    b,
    1,
    `Ordena de menor a mayor: ${lista.map(num).join(', ')}. Escribe también el opuesto y el valor absoluto de −9.`,
    `${[...lista].sort((a, b) => a - b).map(num).join(' &lt; ')}. El opuesto de −9 es 9 y |−9| = 9.`,
  )

  const sumas = [['-8+(-3)-(-5)+2', -4], ['15-(6-11)-(-4)', 24], ['(-6)*(+4)/(-3)', 8], ['(-2)*(-3)*(-5)', -30]]
  const rs = sumas.map(([s, v]) => {
    const r = cadenaZ(s)
    espera(s, r.res, v)
    return r
  })
  ej(b, 1, `Calcula: ${partes(rs.map((r) => esc(r.inicial)))}`, solPartes(rs.map((r) => r.html), true))

  const comb = [['15-[6-(-4+9)]+(-3)', 11], ['(-2)*[5-3*(-2)]-18/(2-5)', -16], ['20/(-5)-3*[4-(-2)*3]', -34]]
  const rc = comb.map(([s, v]) => {
    const r = cadenaZ(s)
    espera(s, r.res, v)
    return r
  })
  ej(b, 2, `Operaciones combinadas: ${partes(rc.map((r) => esc(r.inicial)))}`, solPartes(rc.map((r) => r.html)))
}

// ===================== TEMA 2 =====================
const t2 = tema('t2', 'Tema 2 · Fracciones y decimales')

{
  const e = cadenaFr('2/3 + 5/4 - 1/6')
  espera('ejemplo fr', F.texto(e.res), '7/4')
  const b = bloque(
    t2,
    'Fracciones: simplificar, comparar y operar',
    `<ul>
      <li><b>Simplificar:</b> divide numerador y denominador por el mismo número (lo más rápido, por su m.c.d.) hasta que no se pueda más: la <b>irreducible</b>.</li>
      <li><b>Número mixto:</b> 17/5 → 17 : 5 = 3 y sobran 2 → 3 enteros y 2/5.</li>
      <li><b>Comparar u ordenar:</b> se reducen a <b>común denominador</b> (el m.c.m. de los denominadores) y se comparan los numeradores.</li>
    </ul>
    <div class="g4 grid">
      <div class="caixa"><h4>Sumar y restar</h4>Común denominador (m.c.m.) y se suman o restan los numeradores.</div>
      <div class="caixa"><h4>Multiplicar «en línea»</h4>${frs('a', 'b')} · ${frs('c', 'd')} = ${frs('a · c', 'b · d')}</div>
      <div class="caixa"><h4>Dividir «en cruz»</h4>${frs('a', 'b')} : ${frs('c', 'd')} = ${frs('a · d', 'b · c')}</div>
      <div class="caixa"><h4>Potencia</h4>(${frs('a', 'b')})${sup('n')} = ${frs('aⁿ', 'bⁿ')}</div>
    </div>
    <div class="truco">💡 Simplifica siempre el resultado final. Y antes de multiplicar, si puedes, tacha factores de arriba con los de abajo: los números son más pequeños.</div>`,
    `<p class="gris">El m.c.m. de 3, 4 y 6 es 12.</p>${e.html}`,
  )

  const sim = [[36, 48], [84, 126], [150, 225]]
  const mx = F.mixto(F.fr(17, 5))
  espera('mixto 17/5', `${mx.ent} ${mx.n}/${mx.d}`, '3 2/5')
  ej(
    b,
    1,
    `Simplifica hasta la fracción irreducible: ${partes([...sim.map(([n, d]) => fr({ n, d })), `Escribe ${fr({ n: 17, d: 5 })} como número mixto.`])}`,
    solPartes([
      ...sim.map(([n, d]) => {
        const k = F.mcdDe(n, d)
        return `m.c.d.(${n}, ${d}) = ${k} → ${frs(`${n} : ${k}`, `${d} : ${k}`)} = <b>${fr(F.fr(n, d))}</b>`
      }),
      `17 : 5 = ${mx.ent} y sobran ${mx.n} → <b>${mx.ent} ${fr({ n: mx.n, d: mx.d })}</b>`,
    ]),
  )

  const ord = [F.fr(3, 4), F.fr(5, 6), F.fr(7, 12), F.fr(2, 3)]
  const m = F.mcmLista(ord.map((f) => f.d))
  const ordenadas = [...ord].sort(F.comparar)
  ej(
    b,
    1,
    `Ordena de menor a mayor: ${ord.map(fr).join(', &nbsp;')}`,
    `m.c.m.(4, 6, 12, 3) = ${m}: ${ord.map((f) => `${fr(f)} = ${fr({ n: (f.n * m) / f.d, d: m })}`).join('; ')}.<br>Se ordenan por el numerador: <b>${ordenadas.map(fr).join(' &lt; ')}</b>`,
  )
  espera('orden', ordenadas.map(F.texto).join(' '), '7/12 2/3 3/4 5/6')

  const ops = [['5/6 - 3/4 + 1/2', '7/12'], ['(-3/5)·10/9', '-2/3'], ['4/7 : 8/21', '3/2'], ['(-2/3)^3', '-8/27']]
  const ro = ops.map(([s, v]) => {
    const r = cadenaFr(s)
    espera(s, F.texto(r.res), v)
    return [s, r]
  })
  ej(b, 1, `Calcula y simplifica: ${partes(ro.map(([s]) => ex(s)))}`, solPartes(ro.map(([, r]) => r.html), true))
}

{
  const e = cadenaFr('2/3 - 1/2·(5/3 - 1)')
  espera('ejemplo comb fr', F.texto(e.res), '1/3')
  const b = bloque(
    t2,
    'Operaciones combinadas y problemas con fracciones',
    `<div class="f">Mismo orden que con enteros: paréntesis → potencias → · y : (de izquierda a derecha) → + y −</div>
    <ul>
      <li>Haz <b>una sola cosa en cada paso</b> y copia el resto igual. Simplifica cada resultado antes de seguir.</li>
      <li>Un número entero es una fracción con denominador 1: 1 = ${frs('1', '1')} = ${frs('3', '3')}.</li>
      <li><b>Problemas:</b> «los ${frs('2', '5')} de 30» es ${frs('2', '5')} · 30 = 12. «Lo que queda»: si se gasta ${frs('2', '5')}, quedan ${frs('3', '5')}. «${frs('1', '3')} de lo que queda» es ${frs('1', '3')} · ${frs('3', '5')}.</li>
    </ul>`,
    e.html,
  )

  const bas = [['(3/4 - 1/2) : (1 + 1/3)', '3/16'], ['1/2 + 2/3·3/4', '1']]
  const rb = bas.map(([s, v]) => {
    const r = cadenaFr(s)
    espera(s, F.texto(r.res), v)
    return [s, r]
  })
  ej(b, 1, `Calcula: ${partes(rb.map(([s]) => ex(s)))}`, solPartes(rb.map(([, r]) => r.html), true))

  const av = [['1 - 2/5·[1/2 + (3/4 - 1)^2]', '31/40'], ['(1/2 - 2/3)^2 : 5/36 + 3/4·(-2)', '-13/10'], ['5/6 - (4/7)^2·[3/5 - 1/10:(-2)^3]', null]]
  const ra = av.map(([s, v]) => {
    const r = cadenaFr(s)
    if (v) espera(s, F.texto(r.res), v)
    return [s, r]
  })
  ej(b, 2, `Calcula (el c es de la hoja de clase): ${partes(ra.map(([s]) => ex(s)))}`, solPartes(ra.map(([, r]) => r.html), true))

  // Problema de la paga: se gasta 2/5 y luego 1/3 de lo que queda; sobran 12 €.
  const queda1 = F.resta(F.fr(1), F.fr(2, 5))
  const comic = F.mul(F.fr(1, 3), queda1)
  const sobra = F.resta(queda1, comic)
  const paga = F.div(F.fr(12), sobra)
  espera('paga', F.texto(paga), '30')
  ej(
    b,
    2,
    'Mateo se gasta ${frs("2","5")} de su paga en un libro y ${frs("1","3")} de lo que le queda en un cómic. Si todavía le sobran 12 €, ¿cuánto dinero tenía?'.replace(/\$\{frs\("(\d)","(\d)"\)\}/g, (_, a, c) => frs(a, c)),
    `Después del libro le queda 1 − ${frs('2', '5')} = ${fr(queda1)}. El cómic: ${frs('1', '3')} · ${fr(queda1)} = ${fr(comic)} de la paga.<br>
     Le sobra ${fr(queda1)} − ${fr(comic)} = ${fr(sobra)} de la paga, que son 12 €. Si ${fr(sobra)} son 12 €, ${fr({ n: 1, d: sobra.d })} son 12 : ${sobra.n} = ${12 / sobra.n} € y la paga entera, ${12 / sobra.n} · ${sobra.d} = <b>${F.texto(paga)} €</b>.<br>
     Comprobación: libro ${(30 * 2) / 5} €, quedan 18 €; cómic 18 : 3 = 6 €; sobran 12 € ✓`,
  )

  const lleno = F.mul(F.fr(3, 4), F.fr(600))
  const gasta = F.mul(F.fr(2, 5), lleno)
  const quedan = F.resta(lleno, gasta)
  espera('deposito', F.texto(quedan), '270')
  ej(
    b,
    2,
    `Un depósito de 600 litros está lleno hasta los ${frs('3', '4')}. Se gastan los ${frs('2', '5')} del agua que tiene. ¿Cuántos litros quedan? ¿Qué fracción del depósito está llena ahora?`,
    `Tiene ${frs('3', '4')} · 600 = ${F.texto(lleno)} L. Se gastan ${frs('2', '5')} · ${F.texto(lleno)} = ${F.texto(gasta)} L. Quedan ${F.texto(lleno)} − ${F.texto(gasta)} = <b>${F.texto(quedan)} L</b>.<br>
     Fracción del depósito: ${frs(F.texto(quedan), '600')} = <b>${fr(F.fr(quedan.n, 600))}</b>.`,
  )
}

{
  const g = F.generatriz(2, '1', '5')
  espera('ejemplo generatriz', F.texto(g.f), '97/45')
  const b = bloque(
    t2,
    'Decimales, fracción generatriz y aproximaciones',
    `<div class="g3 grid">
      <div class="caixa"><h4>Exacto</h4>Se acaban las cifras: 0,75. Pasa si el denominador de la irreducible solo tiene doses y cincos.</div>
      <div class="caixa"><h4>Periódico puro</h4>El período empieza justo después de la coma: ${periodo(1, '', '3')} = 1,333…</div>
      <div class="caixa"><h4>Periódico mixto</h4>Hay cifras antes del período (anteperíodo): ${periodo(2, '1', '5')} = 2,1555…</div>
    </div>
    <table>
      <tr><th>Fracción generatriz</th><th>Arriba</th><th>Abajo</th></tr>
      <tr><td>Exacto: 2,15</td><td>el número sin coma: 215</td><td>un 1 y tantos ceros como decimales: 100</td></tr>
      <tr><td>Puro: ${periodo(1, '', '3')}</td><td>número sin coma − parte entera: 13 − 1</td><td>tantos 9 como cifras tiene el período: 9</td></tr>
      <tr><td>Mixto: ${periodo(2, '1', '5')}</td><td>número sin coma − lo que no es período: 215 − 21</td><td>un 9 por cada cifra del período y un 0 por cada una del anteperíodo: 90</td></tr>
    </table>
    <p>Al final, <b>simplifica</b>. ${periodo(1, '', '3')} = ${frs('12', '9')} = ${fr(F.fr(12, 9))}.</p>
    <ul>
      <li><b>Truncar:</b> cortar sin más. <b>Redondear:</b> mirar la primera cifra que quitas; si es <b>5 o más</b>, se suma 1 a la última que se queda.</li>
      <li><b>Error absoluto</b> = |valor exacto − aproximación|. <b>Error relativo</b> = error absoluto : valor exacto (cuanto más pequeño, mejor es la aproximación).</li>
    </ul>`,
    `<p>Generatriz de ${periodo(2, '1', '5')}: ${frs(`${g.sinComa} − ${g.noPer}`, String(g.den))} = ${frs(String(g.num), String(g.den))} = <b>${fr(g.f)}</b></p>`,
  )

  const tipos = [[7, 8], [5, 9], [7, 12]]
  ej(
    b,
    1,
    `Haz la división y di si el decimal es exacto, periódico puro o periódico mixto: ${partes(tipos.map(([n, d]) => fr({ n, d })))}`,
    solPartes(
      tipos.map(([n, d]) => {
        const x = F.expansion(n, d)
        const t = F.tipoDe(x)
        return `${fr({ n, d })} = ${x.per ? periodo(x.ent, x.ante, x.per) : `${x.ent},${x.ante}`} → <b>${F.NOMBRE_TIPO[t].toLowerCase()}</b>`
      }),
    ),
  )
  espera('tipo 7/12', F.tipoDe(F.expansion(7, 12)), 'mixto')

  const gens = [[0, '75', ''], [1, '', '3'], [0, '4', '6'], [0, '', '12']]
  ej(
    b,
    1,
    `Halla la fracción generatriz: ${partes(gens.map(([e, a, p]) => (p ? periodo(e, a, p) : `${e},${a}`)))}`,
    solPartes(
      gens.map(([e, a, p]) => {
        const x = F.generatriz(e, a, p)
        return p
          ? `${frs(`${x.sinComa} − ${x.noPer}`, String(x.den))} = ${frs(String(x.num), String(x.den))} = <b>${fr(x.f)}</b>`
          : `${frs(String(x.sinComa), String(x.den))} = <b>${fr(x.f)}</b>`
      }),
    ),
  )
  espera('gen 0,4(6)', F.texto(F.generatriz(0, '4', '6').f), '7/15')
  espera('gen 0,(12)', F.texto(F.generatriz(0, '', '12').f), '4/33')

  const v = '3,14159'
  ej(
    b,
    1,
    `Trunca y redondea ${v} a las centésimas y a las milésimas.`,
    [2, 3]
      .map((c) => {
        const r = F.redondear(v, c)
        return `<div class="sp"><b>${c === 2 ? 'Centésimas' : 'Milésimas'}:</b> truncado ${F.truncar(v, c)}; redondeado ${r.r} (la cifra que se quita es ${r.decide}${r.decide >= 5 ? ', 5 o más: se sube' : ', menos de 5: se deja'}).</div>`
      })
      .join(''),
  )
  espera('redondeo milesimas', F.redondear(v, 3).r, '3,142')

  const er = F.errores(F.fr(2, 3), F.fr(67, 100))
  espera('ea', F.texto(er.eabs), '1/300')
  espera('er', F.texto(er.erel), '1/200')
  ej(
    b,
    2,
    `Aproximamos ${frs('2', '3')} = ${periodo(0, '', '6')} por 0,67. ¿Es por exceso o por defecto? Calcula el error absoluto y el error relativo.`,
    `0,67 es mayor que 0,666…: por <b>exceso</b>.<br>
     Error absoluto = |${frs('2', '3')} − ${frs('67', '100')}| = |${frs('200 − 201', '300')}| = <b>${fr(er.eabs)}</b> ≈ 0,0033.<br>
     Error relativo = ${fr(er.eabs)} : ${frs('2', '3')} = <b>${fr(er.erel)}</b> = 0,005 (un 0,5 %).`,
  )
}

// ===================== TEMA 3 =====================
const t3 = tema('t3', 'Tema 3 · Potencias y raíces')

{
  const u = P.unicaPotencia('(2^5·2^3):(2^2)^3')
  espera('ejemplo unica', P.clavePot(u.pot), '2^2')
  const b = bloque(
    t3,
    'Potencias: el signo y las propiedades',
    `<p>a${sup('n')} = a · a · … · a (n veces). <b>a</b> es la base y <b>n</b>, el exponente.</p>
    <div class="g2 grid">
      <div class="caixa"><h4>El signo</h4>Base negativa con exponente <b>par</b> → positivo: (−2)${sup(4)} = 16.<br>Base negativa con exponente <b>impar</b> → negativo: (−2)${sup(3)} = −8.</div>
      <div class="ollo"><b>¡Ojo con el paréntesis!</b> (−2)${sup(4)} = (−2)·(−2)·(−2)·(−2) = 16, pero −2${sup(4)} = −(2·2·2·2) = −16: sin paréntesis el exponente solo afecta al 2.</div>
    </div>
    <table>
      <tr><th>Misma base</th><th>Mismo exponente</th><th>Potencia de potencia</th></tr>
      <tr><td>a${sup('m')} · a${sup('n')} = a${sup('m+n')} (se <b>suman</b>)<br>a${sup('m')} : a${sup('n')} = a${sup('m−n')} (se <b>restan</b>)</td>
          <td>a${sup('n')} · b${sup('n')} = (a · b)${sup('n')}<br>a${sup('n')} : b${sup('n')} = (a : b)${sup('n')}</td>
          <td>(a${sup('m')})${sup('n')} = a${sup('m·n')} (se <b>multiplican</b>)</td></tr>
    </table>
    <div class="truco">💡 Si las bases son distintas (8, 4, 2…), escríbelas en <b>factores primos</b>: 8 = 2${sup(3)}, 4 = 2${sup(2)}, 9 = 3${sup(2)}, 27 = 3${sup(3)}, 6 = 2 · 3. Luego aplica las propiedades.</div>
    <div class="ollo">No hay propiedad para sumar: 2${sup(3)} + 2${sup(2)} = 8 + 4 = 12, <b>no</b> 2${sup(5)}.</div>`,
    `<p>${potHTML('(2^5·2^3):(2^2)^3')}</p>${u.pasos.map((p) => `<div class="paso">${esc(p.linea)}<span class="cta">${esc(p.porque)}</span></div>`).join('')}`,
  )

  const sg = [['(−2)', 4], ['−2', 4], ['(−3)', 3], ['−(−1)', 7], ['(2/3)', 2]]
  const vals = [P.potencia(F.fr(-2), 4), F.fr(-(2 ** 4)), P.potencia(F.fr(-3), 3), F.mul(F.fr(-1), P.potencia(F.fr(-1), 7)), P.potencia(F.fr(2, 3), 2)]
  espera('signo', vals.map(F.texto).join(' '), '16 -16 -27 1 4/9')
  const enun = ['(−2)' + sup(4), '−2' + sup(4), '(−3)' + sup(3), '−(−1)' + sup(7), `(${frs('2', '3')})${sup(2)}`]
  const expl = [
    'base negativa y exponente par: positivo',
    'sin paréntesis: −(2·2·2·2)',
    'base negativa y exponente impar: negativo',
    '(−1)⁷ = −1 y el menos de delante lo cambia: −(−1)',
    'arriba y abajo al cuadrado: 2²/3²',
  ]
  void sg
  ej(b, 1, `Calcula: ${partes(enun)}`, solPartes(vals.map((v, i) => `${enun[i]} = <b>${fr(v)}</b> (${expl[i]})`)))

  const un = [['2^3·2^5', '2^8'], ['(-3)^7:(-3)^4', '-3^3'], ['(5^2)^3', '5^6'], ['4^3·5^3', '20^3'], ['12^5:4^5', '3^5']]
  const ru = un.map(([s, v]) => {
    const r = P.unicaPotencia(s)
    espera(s, P.clavePot(r.pot), v)
    return [s, r]
  })
  ej(
    b,
    1,
    `Escribe como una sola potencia: ${partes(ru.map(([s]) => potHTML(s)))}`,
    solPartes(ru.map(([, r]) => `${r.pasos.map((p) => esc(p.linea)).join('<br>')} &nbsp;<span class="gris">(${esc(r.pasos.at(-1).porque)})</span>`)),
  )

  const pr = [['8^2·4^3:2^5', '2⁷'], ['27^2·9^3:3^8', '3⁴'], ['(6^4·9^2):(2^3·3^5)', '2 · 3³']]
  const descom = {
    0: `8${sup(2)} · 4${sup(3)} : 2${sup(5)} = (2${sup(3)})${sup(2)} · (2${sup(2)})${sup(3)} : 2${sup(5)} = 2${sup(6)} · 2${sup(6)} : 2${sup(5)} = 2${sup('6+6−5')}`,
    1: `27${sup(2)} · 9${sup(3)} : 3${sup(8)} = (3${sup(3)})${sup(2)} · (3${sup(2)})${sup(3)} : 3${sup(8)} = 3${sup(6)} · 3${sup(6)} : 3${sup(8)} = 3${sup('6+6−8')}`,
    2: `6${sup(4)} = 2${sup(4)} · 3${sup(4)} y 9${sup(2)} = 3${sup(4)} → (2${sup(4)} · 3${sup(4)} · 3${sup(4)}) : (2${sup(3)} · 3${sup(5)}) = 2${sup('4−3')} · 3${sup('4+4−5')}`,
  }
  ej(
    b,
    2,
    `Pasa a factores primos y simplifica. Da el resultado como potencias de primos: ${partes(pr.map(([s]) => potHTML(s)))}`,
    solPartes(
      pr.map(([s, v], i) => {
        const w = P.escribirPrimos(P.primosDe(s))
        espera(s, w, v)
        return `${descom[i]} = <b>${primosHTML(P.primosDe(s))}</b>`
      }),
    ),
  )
}

{
  const b = bloque(
    t3,
    'Exponente cero y exponente negativo',
    `<div class="g3 grid">
      <div class="caixa"><h4>Exponente 0</h4>a${sup(0)} = <b>1</b> (si a ≠ 0). Porque a${sup(3)} : a${sup(3)} = a${sup(0)} y también = 1.</div>
      <div class="caixa"><h4>Exponente negativo</h4>a${sup('−n')} = ${frs('1', 'aⁿ')}. Se da la vuelta a la base y el exponente pasa a positivo: 2${sup(-3)} = ${frs('1', '2³')} = ${frs('1', '8')}.</div>
      <div class="caixa"><h4>Fracción con exponente negativo</h4>(${frs('a', 'b')})${sup('−n')} = (${frs('b', 'a')})${sup('n')}: (${frs('2', '3')})${sup(-2)} = (${frs('3', '2')})${sup(2)} = ${frs('9', '4')}.</div>
    </div>
    <div class="ollo">El exponente negativo <b>no</b> hace negativo el resultado: 2${sup(-3)} = ${frs('1', '8')}, no −8.</div>
    <p>Las propiedades funcionan igual con exponentes negativos: 3${sup(-2)} · 3${sup(5)} = 3${sup('−2+5')} = 3${sup(3)}.</p>`,
    '',
  )
  const vs = [[F.fr(5), 0], [F.fr(2), -3], [F.fr(2, 3), -2], [F.fr(-1, 2), -3], [F.fr(10), -2]]
  const en = ['5' + sup(0), '2' + sup(-3), `(${frs('2', '3')})${sup(-2)}`, `(−${frs('1', '2')})${sup(-3)}`, '10' + sup(-2)]
  const rv = vs.map(([bb, e]) => P.potencia(bb, e))
  espera('negativos', rv.map(F.texto).join(' '), '1 1/8 9/4 -8 1/100')
  const ex2 = ['todo número elevado a 0 es 1', `${frs('1', '2³')}`, `(${frs('3', '2')})${sup(2)}`, `(−${frs('2', '1')})${sup(3)} = (−2)${sup(3)}`, `${frs('1', '10²')} = 0,01`]
  ej(b, 1, `Calcula: ${partes(en)}`, solPartes(rv.map((v, i) => `${en[i]} = ${ex2[i]} = <b>${fr(v)}</b>`)))

  const un = [['3^-2·3^5', '3^3'], ['(2^-3)^2', '2^-6'], ['5^4:5^-2', '5^6'], ['(1/2)^3·(1/2)^-5', '1/2^-2']]
  const ru = un.map(([s, v]) => {
    const r = P.unicaPotencia(s)
    espera(s, P.clavePot(r.pot), v)
    return [s, r]
  })
  ej(
    b,
    2,
    `Escribe como una sola potencia: ${partes(ru.map(([s]) => potHTML(s)))}`,
    solPartes(ru.map(([s, r], i) => `${r.pasos.map((p) => esc(p.linea)).join('<br>')}${i === 2 ? ' &nbsp;<span class="gris">(restar un negativo es sumar: 4 − (−2) = 6)</span>' : ''}`)),
  )
}

{
  const ejm = P.operarCientifica({ m: 3, e: 5 }, '·', { m: 4, e: 3 })
  espera('ejemplo cientifica', P.escribirCientifica(ejm.r), '1,2 · 10⁹')
  const b = bloque(
    t3,
    'Notación científica',
    `<div class="f">a · 10<sup>n</sup> &nbsp; con <b>una sola cifra, que no sea 0, delante de la coma</b> (1 ≤ a &lt; 10)</div>
    <div class="g2 grid">
      <div class="caixa"><h4>Números grandes → exponente positivo</h4>45&#8239;000&#8239;000 = 4,5 · 10${sup(7)}: la coma se corre 7 lugares a la izquierda.</div>
      <div class="caixa"><h4>Números pequeños → exponente negativo</h4>0,00032 = 3,2 · 10${sup(-4)}: la coma se corre 4 lugares a la derecha.</div>
    </div>
    <ul>
      <li><b>Multiplicar:</b> se multiplican los números y se <b>suman</b> los exponentes. <b>Dividir:</b> se dividen los números y se <b>restan</b> los exponentes.</li>
      <li><b>Sumar o restar:</b> primero se pone la misma potencia de 10 en los dos; luego se suman los números.</li>
      <li>Si al final delante de la coma quedan dos cifras (12 · 10${sup(8)}), se reajusta: 1,2 · 10${sup(9)}. Si queda 0,6 · 10${sup(11)}, es 6 · 10${sup(10)}.</li>
      <li><b>Comparar:</b> manda el exponente; si es el mismo, el número de delante.</li>
    </ul>`,
    `${ejm.pasos.map((p) => `<div class="paso">${esc(p.linea)}<span class="cta">${esc(p.porque)}</span></div>`).join('')}`,
  )

  const aEsc = [['45000000', 45000000], ['0.00032', 0.00032], ['7200000000', 7200000000], ['0.0000005', 0.0000005]]
  const rc = aEsc.map(([s, x]) => [x, P.aCientifica(s)])
  espera('cientificas', rc.map(([, c]) => `${c.m}e${c.e}`).join(' '), '4.5e7 3.2e-4 7.2e9 5e-7')
  ej(
    b,
    1,
    `Escribe en notación científica: ${partes(rc.map(([x]) => num(x)))}`,
    solPartes(rc.map(([x, c]) => `${num(x)} = <b>${cien(c)}</b> (coma ${Math.abs(c.e)} lugares a la ${c.e > 0 ? 'izquierda' : 'derecha'})`)),
  )

  const aDec = [{ m: 3.08, e: 6 }, { m: 4.5, e: -5 }]
  ej(
    b,
    1,
    `Escribe con todas sus cifras: ${partes(aDec.map(cien))}`,
    solPartes(aDec.map((c) => `${cien(c)} = <b>${esc(P.todasLasCifras(c))}</b>`)),
  )
  espera('todas', P.todasLasCifras({ m: 4.5, e: -5 }).replace(/\s/g, ''), '0,000045')

  const ops = [
    [{ m: 3, e: 5 }, '·', { m: 4, e: 3 }, '1,2 · 10⁹'],
    [{ m: 6, e: 8 }, ':', { m: 2, e: -3 }, '3 · 10¹¹'],
    [{ m: 3.5, e: 4 }, '+', { m: 2, e: 3 }, '3,7 · 10⁴'],
    [{ m: 1.2, e: -3 }, '·', { m: 5, e: 7 }, '6 · 10⁴'],
  ]
  const ro = ops.map(([a, op, c, v]) => {
    const r = op === '+' ? P.sumarCientifica(a, '+', c) : P.operarCientifica(a, op, c)
    espera(`cient ${op}`, P.escribirCientifica(r.r), v)
    return [`(${cien(a)}) ${op} (${cien(c)})`, r]
  })
  ej(b, 2, `Opera y da el resultado en notación científica: ${partes(ro.map(([s]) => s))}`, solPartes(ro.map(([, r]) => r.pasos.map((p) => esc(p.linea)).join('<br>'))))

  const t = P.operarCientifica({ m: 1.5, e: 8 }, ':', { m: 3, e: 5 })
  espera('luz', P.valorCientifica(t.r), 500)
  ej(
    b,
    2,
    `La distancia de la Tierra al Sol es de 1,5 · 10${sup(8)} km y la luz recorre 3 · 10${sup(5)} km cada segundo. ¿Cuántos segundos tarda la luz del Sol en llegar a la Tierra? ¿Cuántos minutos son, más o menos?`,
    `Tiempo = distancia : velocidad = (1,5 · 10${sup(8)}) : (3 · 10${sup(5)})<br>${t.pasos.map((p) => esc(p.linea)).join('<br>')}<br>= <b>500 segundos</b>, que son 8 minutos y 20 segundos.`,
  )
}

{
  const b = bloque(
    t3,
    'Raíces cuadradas',
    `<p>√a = b quiere decir que b${sup(2)} = a. √49 = 7 porque 7${sup(2)} = 49. Los números negativos no tienen raíz cuadrada.</p>
    <table class="cuad"><tr>${Array.from({ length: 15 }, (_, i) => `<td>${i + 1}${sup(2)} = ${(i + 1) ** 2}</td>`).slice(0, 8).join('')}</tr>
      <tr>${Array.from({ length: 15 }, (_, i) => `<td>${i + 1}${sup(2)} = ${(i + 1) ** 2}</td>`).slice(8).join('')}<td>20${sup(2)} = 400</td></tr></table>
    <ul>
      <li><b>Raíz de una fracción:</b> raíz de arriba entre raíz de abajo: √(${frs('49', '81')}) = ${frs('7', '9')}.</li>
      <li><b>Raíz entera y resto:</b> el número más grande cuyo cuadrado no se pasa. √70: 8${sup(2)} = 64 y 9${sup(2)} = 81 (se pasa) → raíz entera 8, resto 70 − 64 = 6.</li>
      <li><b>Cuadrado perfecto:</b> su raíz es exacta (resto 0). Un cuadrado perfecto nunca acaba en 2, 3, 7 u 8.</li>
      <li>En las combinadas, <b>primero se hace lo de dentro de la raíz</b>: √(5${sup(2)} − 4${sup(2)}) = √(25 − 16) = √9 = 3. ¡No es 5 − 4!</li>
    </ul>`,
    '',
  )
  const rs = [[144, 1], [225, 1], [49, 81], [16, 25]]
  const rr = rs.map(([n, d]) => X.raizFr(F.fr(n, d)))
  espera('raices', rr.map(F.texto).join(' '), '12 15 7/9 4/5')
  ej(
    b,
    1,
    `Calcula: ${partes(rs.map(([n, d]) => (d === 1 ? `√${n}` : `√(${frs(String(n), String(d))})`)))}`,
    solPartes(rs.map(([n, d], i) => (d === 1 ? `√${n} = <b>${fr(rr[i])}</b> porque ${fr(rr[i])}${sup(2)} = ${n}` : `${frs(`√${n}`, `√${d}`)} = <b>${fr(rr[i])}</b>`))),
  )

  const ent = [70, 150, 300]
  ej(
    b,
    1,
    `Calcula la raíz entera y el resto: ${partes(ent.map((n) => `√${n}`))}`,
    solPartes(
      ent.map((n) => {
        const { r, resto } = P.raizEntera(n)
        return `${r}${sup(2)} = ${r * r} y ${r + 1}${sup(2)} = ${(r + 1) ** 2} (se pasa) → raíz entera <b>${r}</b>, resto ${n} − ${r * r} = <b>${resto}</b>`
      }),
    ),
  )
  espera('raiz 300', JSON.stringify(P.raizEntera(300)), JSON.stringify({ r: 17, resto: 11 }))

  const lado = P.raizEntera(196).r
  espera('jardin', lado, 14)
  ej(
    b,
    2,
    'Un jardín cuadrado tiene 196 m² de superficie. ¿Cuánto mide su lado? ¿Cuántos metros de valla hacen falta para rodearlo?',
    `Lado = √196 = <b>${lado} m</b> (${lado}${sup(2)} = 196). Valla = perímetro = 4 · ${lado} = <b>${4 * lado} m</b>.`,
  )

  const bal = P.raizEntera(150)
  const sig = P.cuadradoSiguiente(150)
  espera('baldosas', `${bal.r} ${bal.resto} ${sig.lado} ${sig.faltan}`, '12 6 13 19')
  ej(
    b,
    2,
    'Tenemos 150 baldosas cuadradas y queremos formar el cuadrado más grande posible. ¿Cuántas baldosas tendrá cada lado? ¿Cuántas sobran? ¿Cuántas faltarían para hacer un cuadrado con una fila más?',
    `Raíz entera de 150: ${bal.r} (${bal.r}${sup(2)} = ${bal.r ** 2}). Cuadrado de <b>${bal.r} × ${bal.r}</b> y sobran 150 − ${bal.r ** 2} = <b>${bal.resto}</b>.<br>
     El siguiente, ${sig.lado} × ${sig.lado} = ${sig.lado ** 2} baldosas: faltan ${sig.lado ** 2} − 150 = <b>${sig.faltan}</b>.`,
  )
}

{
  const s0 = '(-3)^2·√16 - (5^2-11):√49 + (10-8)^2'
  const e = cadenaFr(s0)
  espera('ejemplo 36a', F.texto(e.res), '38')
  const b = bloque(
    t3,
    'Operaciones combinadas con potencias y raíces',
    `<div class="f">1.º paréntesis y corchetes → 2.º potencias y raíces → 3.º multiplicaciones y divisiones (de izquierda a derecha) → 4.º sumas y restas</div>
    <ul>
      <li>Dentro de cada paréntesis se sigue el mismo orden.</li>
      <li>Los exponentes negativos se convierten con la inversa: 2${sup(-1)} = ${frs('1', '2')}; (${frs('3', '2')})${sup(-2)} = (${frs('2', '3')})${sup(2)} = ${frs('4', '9')}.</li>
      <li>Cuidado con los signos: (−3)${sup(2)} = 9, pero −3${sup(2)} = −9.</li>
    </ul>`,
    `<p class="gris">Ejercicio 36a de la hoja de clase.</p>${e.html}`,
  )
  const bas = [['2^3 - 3^2 + √25 · (-1)^5', '-6'], ['√64 - (3 - 5)^3 : 2^2', '10']]
  const rb = bas.map(([s, v]) => {
    const r = cadenaFr(s)
    espera(s, F.texto(r.res), v)
    return [s, r]
  })
  ej(b, 1, `Calcula: ${partes(rb.map(([s]) => ex(s)))}`, solPartes(rb.map(([, r]) => r.html), true))

  const av = [
    ['(-2)^4 : 2^3 + √81 - 10^0', '10'],
    ['(1/2)^-2 + (2/3)^2 · 9/4', '5'],
    ['3/4 - (1/2)^2·√(5^2-4^2):(3/2)^-2', null],
    ['4^-1 + √(2/18)·(3^2-2^3·3)·5^-1', null],
  ]
  const ra = av.map(([s, v]) => {
    const r = cadenaFr(s)
    if (v) espera(s, F.texto(r.res), v)
    return [s, r]
  })
  ej(b, 2, `Calcula (el c y el d son el 37b y el 37c de la hoja de clase): ${partes(ra.map(([s]) => ex(s)))}`, solPartes(ra.map(([, r]) => r.html), true))
}

// ---------- Página ----------
const NIVEL = { 1: '<span class="nv n1">★ Básico</span>', 2: '<span class="nv n2">★★ Avanzado</span>' }
const cuerpoEjercicios = temas
  .map(
    (t) => `
<h2 class="${t.clase}">${t.titulo}</h2>
${t.bloques
  .map(
    (b) => `
<h3>${b.titulo}</h3>
<div class="como"><div class="etq">Cómo se hace</div>${b.como}${b.ejemplo ? `<div class="ejemplo"><div class="etq">Ejemplo resuelto</div>${b.ejemplo}</div>` : ''}</div>
${b.ejs.map((e) => `<div class="ej"><span class="num">${e.n}</span> ${NIVEL[e.nivel]} ${e.enunciado}</div>`).join('')}`,
  )
  .join('')}`,
  )
  .join('')

const cuerpoSoluciones = temas
  .map(
    (t) => `
<h2 class="${t.clase}">Soluciones · ${t.titulo}</h2>
${t.bloques.flatMap((b) => b.ejs).map((e) => `<div class="sol"><span class="num">${e.n}</span><div>${e.solucion}</div></div>`).join('')}`,
  )
  .join('')

const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>Repaso global Matemáticas</title>
<style>
  @page { size: A4; margin: 13mm 12mm 13mm 12mm; }
  * { box-sizing: border-box; }
  body { font-family: "Segoe UI", Arial, sans-serif; font-size: 10.4pt; line-height: 1.4; color: #1e293b; margin: 0; }
  h1 { font-size: 21pt; margin: 0 0 1.5mm; color: #312e81; }
  h2 { font-size: 14pt; margin: 5mm 0 2.5mm; padding: 1.5mm 3mm; border-radius: 2mm; color: #fff; background: #4338ca; break-after: avoid; }
  h2.t1 { background: #0f766e; } h2.t2 { background: #1d4ed8; } h2.t3 { background: #7c3aed; }
  h3 { font-size: 12pt; margin: 4mm 0 1.5mm; color: #312e81; break-after: avoid; border-bottom: 0.4mm solid #c7d2fe; padding-bottom: 0.5mm; }
  p { margin: 1mm 0 1.5mm; } ul, ol { margin: 1mm 0 1.5mm; padding-left: 5mm; } li { margin: 0.6mm 0; }
  .sub { color: #475569; font-size: 10pt; margin-bottom: 3mm; }
  .grid { display: grid; gap: 2.5mm; } .g2 { grid-template-columns: 1fr 1fr; } .g3 { grid-template-columns: 1fr 1fr 1fr; } .g4 { grid-template-columns: 1fr 1fr 1fr 1fr; }
  .como { border: 0.4mm solid #c7d2fe; background: #f8faff; border-radius: 2mm; padding: 2mm 3mm; margin: 1.5mm 0 2.5mm; }
  .etq { font-size: 8.5pt; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; color: #4338ca; margin-bottom: 1mm; }
  .ejemplo { border-top: 0.3mm dashed #a5b4fc; margin-top: 2mm; padding-top: 1.5mm; break-inside: avoid; }
  .caixa { border: 0.4mm solid #ddd6fe; border-radius: 2mm; padding: 1.8mm 2.5mm; background: #fff; break-inside: avoid; }
  .caixa h4 { margin: 0 0 1mm; font-size: 10.2pt; color: #5b21b6; }
  .truco { background: #fef3c7; border-left: 1.2mm solid #f59e0b; padding: 1.5mm 3mm; border-radius: 1mm; margin: 2mm 0; break-inside: avoid; }
  .ollo { background: #fee2e2; border-left: 1.2mm solid #dc2626; padding: 1.5mm 3mm; border-radius: 1mm; margin: 2mm 0; break-inside: avoid; }
  .f { font-weight: 700; background: #eef2ff; border-radius: 2mm; padding: 1.5mm 3mm; margin: 1.5mm 0; text-align: center; break-inside: avoid; }
  table { border-collapse: collapse; width: 100%; margin: 1.5mm 0 2mm; break-inside: avoid; font-size: 9.8pt; }
  th, td { border: 0.3mm solid #cbd5e1; padding: 1mm 2mm; text-align: left; vertical-align: middle; }
  th { background: #e0e7ff; color: #312e81; }
  table.signos td, table.cuad td { text-align: center; border-color: #e2e8f0; }
  table.cuad td { font-size: 9pt; padding: 0.8mm 1mm; }
  table.esc { width: auto; margin: 0 auto; border: 0; }
  table.esc td { border: 0; padding: 0 2.5mm; text-align: right; font-variant-numeric: tabular-nums; }
  table.esc td + td { border-left: 0.4mm solid #334155; text-align: left; }
  .c { text-align: center; margin: 1mm 0; }
  .ej { margin: 2mm 0 3mm; break-inside: avoid; }
  .num { display: inline-flex; align-items: center; justify-content: center; min-width: 6.5mm; height: 6.5mm; border-radius: 50%; background: #312e81; color: #fff; font-weight: 800; font-size: 9.5pt; margin-right: 1mm; }
  .nv { font-size: 8pt; font-weight: 800; border-radius: 1mm; padding: 0.3mm 1.5mm; margin-right: 1mm; }
  .n1 { background: #dcfce7; color: #166534; } .n2 { background: #fee2e2; color: #991b1b; }
  .partes { display: flex; flex-wrap: wrap; gap: 1.5mm 9mm; margin: 1.5mm 0 0 8mm; align-items: center; }
  .fr { display: inline-flex; flex-direction: column; vertical-align: middle; text-align: center; line-height: 1.1; margin: 0 0.5mm; font-size: 0.95em; }
  .fr > span:first-child { border-bottom: 0.3mm solid currentColor; padding: 0 0.7mm; }
  .fr > span { white-space: nowrap; }
  .rad { white-space: nowrap; } .rad > span { border-top: 0.3mm solid currentColor; padding: 0.3mm 0.3mm 0; display: inline-block; }
  .per { border-top: 0.35mm solid currentColor; padding-top: 0.2mm; }
  .ex { white-space: normal; }
  sup { font-size: 0.68em; line-height: 0; }
  .cadena { margin: 0.5mm 0 1mm; }
  .paso { padding: 0.5mm 0; display: flex; flex-wrap: wrap; align-items: center; gap: 1mm 3mm; }
  .cta { font-size: 8.6pt; color: #64748b; margin-left: auto; text-align: right; }
  .gris { color: #64748b; font-size: 9pt; }
  .sol { display: flex; gap: 2mm; margin: 2mm 0; padding-bottom: 2mm; border-bottom: 0.3mm solid #e2e8f0; break-inside: avoid; }
  .sol > div { flex: 1; }
  .sp { margin: 0.8mm 0 1.6mm; break-inside: avoid; }
  .dos { display: grid; grid-template-columns: 1fr 1fr; gap: 0 6mm; }
  .dos .paso { display: block; padding: 0.3mm 0; }
  .dos .cta { display: block; font-size: 8pt; text-align: left; margin: 0 0 0.5mm 4mm; }
  .si { color: #15803d; } .no { color: #b91c1c; }
  .salto { break-before: page; }
  .check li { list-style: "☐  "; }
  .pe { font-size: 8.5pt; color: #64748b; margin-top: 4mm; border-top: 0.3mm solid #e2e8f0; padding-top: 1.5mm; }
  .portada { border: 0.5mm solid #c7d2fe; border-radius: 3mm; padding: 3mm 4mm; background: #eef2ff; margin-bottom: 3mm; }
</style>
</head>
<body>
<h1>Matemáticas · Repaso para el global</h1>
<p class="sub">1.ª evaluación, 2.º ESO. Entran los temas 1, 2 y 3: enteros y divisibilidad, fracciones y decimales, y potencias y raíces.</p>
<div class="portada">
  <b>Cómo usar este cuadernillo:</b> en cada apartado lee primero el recuadro <b>«Cómo se hace»</b> y el ejemplo resuelto. Después haz los ejercicios en el cuaderno: primero los <span class="nv n1">★ Básico</span> y luego los <span class="nv n2">★★ Avanzado</span>. Las <b>soluciones, paso a paso, están en las últimas hojas</b>: mírala solo cuando hayas terminado cada ejercicio. Si fallas uno, busca en qué paso te equivocaste.
</div>
${cuerpoEjercicios}

<h2>Antes del examen: compruebo que sé…</h2>
<ul class="check">
  <li>Usar los criterios de divisibilidad, descomponer en factores primos y calcular el m.c.d. y el m.c.m.</li>
  <li>Saber si un problema es de m.c.d. (repartir en grupos iguales) o de m.c.m. (volver a coincidir).</li>
  <li>Quitar paréntesis, la regla de los signos y el orden de las operaciones.</li>
  <li>Simplificar, ordenar fracciones con el m.c.m. y sumar, restar, multiplicar en línea y dividir en cruz.</li>
  <li>Resolver combinadas y problemas con fracciones («de lo que queda»).</li>
  <li>Distinguir decimal exacto, periódico puro y mixto, y sacar la fracción generatriz.</li>
  <li>Truncar, redondear y calcular el error absoluto y el relativo.</li>
  <li>El signo de una potencia y la diferencia entre (−2)${sup(4)} y −2${sup(4)}.</li>
  <li>Las propiedades de las potencias, también con exponente 0 y negativo.</li>
  <li>Escribir y operar en notación científica.</li>
  <li>Raíces exactas, de fracciones, raíz entera con su resto y combinadas con potencias y raíces.</li>
</ul>
<div class="truco">💡 En el examen: copia bien el enunciado, haz una sola operación en cada paso, simplifica siempre el resultado y, si te sobra tiempo, comprueba los problemas.</div>
<p class="pe">Para practicar más con ejercicios nuevos sin límite y hacer un simulacro con nota: Eón → Mateo → 2.º ESO → Matemáticas → «Repaso para el global».</p>

<h1 class="salto">Soluciones</h1>
<p class="sub">Paso a paso. A la derecha, en gris, la cuenta que se hace en cada paso.</p>
${cuerpoSoluciones}
</body>
</html>
`

await server.close()
if (fallos.length) {
  console.error('Hay soluciones que no cuadran:\n' + fallos.join('\n'))
  process.exit(1)
}
// Cada línea de pasos lleva su texto envuelto, para que los <sup> no se separen al repartir la línea.
const final = html.replace(/<div class="paso">([\s\S]*?)(<span class="cta">|<\/div>)/g, '<div class="paso"><span>$1</span>$2')
writeFileSync(new URL('./matematicas-global1.html', import.meta.url), final)
console.log(`Hecho: ${nEj} ejercicios.`)
