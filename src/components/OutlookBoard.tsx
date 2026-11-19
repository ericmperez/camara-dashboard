import {
  OUTLOOK_BAND_LABELS,
  OUTLOOK_FLAG_LABELS,
  outlookOf,
  rankOutlook,
} from '../lib/outlook'
import type { Representative } from '../types'

type Props = {
  reps: Representative[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function OutlookBoard({ reps, selectedId, onSelect }: Props) {
  const ranked = rankOutlook(reps)
  return (
    <div className="outlook-board">
      <p className="whip-banner" role="note">
        Probabilidad de repetir el escaño en 2028 si corre. Sale del margen de 2024,
        un cuarto del swing 2020 y los términos citados. No es encuesta. Solo PNP.
      </p>
      <ol className="rank-board" aria-label="Pronóstico 2028 del PNP">
        {ranked.map((rep, index) => {
          const read = outlookOf(rep)
          return (
            <li key={rep.id}>
              <article
                id={`rep-${rep.id}`}
                className={`rank-row party-${rep.party.toLowerCase()}${selectedId === rep.id ? ' is-selected' : ''}`}
                data-band={read.band}
                onClick={() => onSelect(rep.id)}
              >
                <span className="rank-pos">{index + 1}</span>
                <div className="rank-body">
                  <h2>{rep.name}</h2>
                  <p>
                    {rep.districtLabel}
                    {` · ${read.probability}% · ${OUTLOOK_BAND_LABELS[read.band]}`}
                    {` · margen ${read.margin.toFixed(1)}`}
                    {` · ajustado ${read.adjustedMargin.toFixed(1)}`}
                    {read.swing == null ? '' : ` · swing ${read.swing > 0 ? '+' : ''}${read.swing.toFixed(1)}`}
                  </p>
                  {read.flags.length > 0 ? (
                    <p>
                      {read.flags.map((flag) => (
                        <span key={flag} className="kind-badge kind-inference">
                          {OUTLOOK_FLAG_LABELS[flag]}
                        </span>
                      ))}
                    </p>
                  ) : null}
                </div>
              </article>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
