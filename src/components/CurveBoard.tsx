import { useState } from 'react'
import { CURVE_BANNER, CURVE_BAND_LABELS, curveOf, formatDelta, rankByCurve } from '../lib/curve'
import { initials } from '../lib/text'
import type { Representative } from '../types'

type Props = {
  reps: Representative[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function CurveBoard({ reps, selectedId, onSelect }: Props) {
  const ranked = rankByCurve(reps)
  return (
    <div className="curve-board">
      <p className="whip-banner" role="note">
        {CURVE_BANNER}
      </p>
      <ol className="rank-board" aria-label="Curva CEE 2020 a 2024">
        {ranked.map((rep, index) => {
          const read = curveOf(rep)
          return (
            <li key={rep.id}>
              <article
                id={`rep-${rep.id}`}
                className={`rank-row party-${rep.party.toLowerCase()}${selectedId === rep.id ? ' is-selected' : ''}`}
                data-band={read.band}
                onClick={() => onSelect(rep.id)}
              >
                <span className="rank-pos">{index + 1}</span>
                <CurveFace url={rep.photoUrl} name={rep.name} />
                <div className="rank-body">
                  <h2>{rep.name}</h2>
                  <p>
                    {rep.districtLabel} · {CURVE_BAND_LABELS[read.band]}
                    {read.comparable
                      ? ` · ${read.priorPct}% → ${read.nowPct}%`
                      : ` · ${read.why}`}
                  </p>
                </div>
                <strong className="rank-score" data-band={read.band}>
                  {formatDelta(read.delta)}
                  <span>pts</span>
                </strong>
              </article>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

function CurveFace({ url, name }: { url: string | null; name: string }) {
  const [broken, setBroken] = useState(false)
  if (url && !broken) {
    return <img className="rank-photo" src={url} alt="" loading="lazy" onError={() => setBroken(true)} />
  }
  return <span className="rank-photo rank-ph">{initials(name)}</span>
}
