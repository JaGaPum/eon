// Frases sen tiles: tócase a palabra que o leva e despois a vogal. Ao comprobar márcanse as que están mal.
import { useMemo, useState } from 'react'
import { Burbulla, barallar } from '../../primaria/pezas'
import { esVogal, ondeTil, ponTil, senTil, trocear } from '../../lib/til'

/** Unha frase para acentuar. `solucion` é a frase ben escrita; as palabras «a/b» non se usan aquí. */
function UnhaFrase({ solucion, seguinte, ultima }: { solucion: string; seguinte: () => void; ultima: boolean }) {
  const trozos = useMemo(() => trocear(solucion), [solucion])
  const [tiles, setTiles] = useState<Record<number, number>>({})
  const [elixida, setElixida] = useState<number | null>(null)
  const [revisada, setRevisada] = useState(false)
  const [solucionVista, setSolucionVista] = useState(false)

  const forma = (k: number) => ponTil(trozos[k].texto, tiles[k] ?? -1)
  const mal = trozos.map((t, k) => t.palabra && forma(k) !== t.texto)
  const fallos = mal.filter(Boolean).length
  const faltan = trozos.filter((t, k) => t.palabra && ondeTil(t.texto) >= 0 && mal[k]).length
  const sobran = trozos.filter((t, k) => t.palabra && ondeTil(t.texto) < 0 && mal[k]).length
  const ben = revisada && fallos === 0

  return (
    <div className="space-y-4">
      <Burbulla ton={revisada ? (ben ? 'ben' : 'mal') : 'normal'}>
        {!revisada
          ? 'Toca cada palabra que leve til e despois a vogal onde vai. Cando remates, comproba.'
          : ben
            ? 'Perfecto! Todos os tiles no seu sitio.'
            : `Hai ${fallos} ${fallos === 1 ? 'palabra' : 'palabras'} mal (en vermello)${faltan ? `: faltan ${faltan} tiles` : ''}${sobran ? `${faltan ? ' e' : ':'} sobran ${sobran}` : ''}. Corríxeas e volve comprobar.`}
      </Burbulla>
      <p className="rounded-2xl border-2 border-violet-200 bg-white p-4 text-2xl leading-loose" lang="gl">
        {trozos.map((t, k) =>
          t.palabra ? (
            <button
              key={k}
              onClick={() => setElixida(k)}
              className={`cursor-pointer rounded-md px-0.5 transition ${elixida === k ? 'bg-violet-600 text-white' : revisada && mal[k] ? 'bg-rose-100 text-rose-800 underline decoration-wavy' : tiles[k] >= 0 ? 'bg-violet-100' : 'hover:bg-violet-50'}`}
            >
              {solucionVista ? t.texto : forma(k)}
            </button>
          ) : (
            <span key={k}>{t.texto}</span>
          ),
        )}
      </p>
      {elixida !== null && !solucionVista && (
        <div className="flex flex-wrap items-end justify-center gap-1 rounded-2xl bg-violet-50 p-3">
          {senTil(trozos[elixida].texto)
            .split('')
            .map((c, i) => (
              <button
                key={i}
                disabled={!esVogal(c)}
                onClick={() => {
                  setTiles({ ...tiles, [elixida]: tiles[elixida] === i ? -1 : i })
                  setRevisada(false)
                }}
                className={`h-14 min-w-10 rounded-xl border-2 px-1 text-3xl font-bold ${tiles[elixida] === i ? 'border-violet-600 bg-violet-600 text-white' : esVogal(c) ? 'cursor-pointer border-violet-200 bg-white' : 'border-transparent text-slate-500'}`}
              >
                {tiles[elixida] === i ? ponTil(c, 0) : c}
              </button>
            ))}
          <button className="btn ml-2" onClick={() => setTiles({ ...tiles, [elixida]: -1 })}>
            Sen til
          </button>
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {!ben && !solucionVista && (
          <button className="btn btn-primario min-h-12 flex-1 border-violet-600 bg-violet-600 text-lg hover:bg-violet-700" onClick={() => (setRevisada(true), setElixida(null))}>
            Comprobar
          </button>
        )}
        {revisada && !ben && !solucionVista && (
          <button className="btn min-h-12 text-lg" onClick={() => setSolucionVista(true)}>
            Ver a solución
          </button>
        )}
        {(ben || solucionVista) && (
          <button className="btn btn-primario min-h-12 flex-1 border-violet-600 bg-violet-600 text-lg hover:bg-violet-700" onClick={seguinte}>
            {ultima ? 'Rematar' : 'Seguinte frase →'}
          </button>
        )}
      </div>
    </div>
  )
}

/** Unha serie de frases ao chou. */
export function FrasesTil({ frases, cantas = 5, acabar }: { frases: string[]; cantas?: number; acabar: () => void }) {
  const lista = useMemo(() => barallar(frases).slice(0, cantas), [frases, cantas])
  const [k, setK] = useState(0)
  if (k >= lista.length) return <Burbulla ton="ben">Remataches as {lista.length} frases. Podes xogar outra vez con outras.</Burbulla>
  return (
    <div className="space-y-2">
      <p className="text-center text-sm font-semibold text-slate-500">
        Frase {k + 1} de {lista.length}
      </p>
      <UnhaFrase
        key={k}
        solucion={lista[k]}
        ultima={k + 1 === lista.length}
        seguinte={() => {
          if (k + 1 === lista.length) acabar()
          setK(k + 1)
        }}
      />
    </div>
  )
}
