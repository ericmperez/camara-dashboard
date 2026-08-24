import { useState } from 'react'
import { REPEAT_DISCLAIMER } from '../data/repeat-profiles'
import { REPEAT_BAND_LABELS, rankByRepeat, repeatOf } from '../lib/repeat'
import { initials } from '../lib/text'
import { formatVotes } from '../lib/votes'
import type { Representative } from '../types'

type Props = {
  reps: Representative[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function RepeatBoard({ reps, selectedId, onSelect }: Props) {
  const ranked = rankByRepeat(reps)
  return (
    <div className="repeat-board">
      <p className="whip-banner" role="note">
        {REPEAT_DISCLAIMER}
      </p>
      <ol className="rank-board" aria-label="Quién está sólido para repetir en 2028">
        {ranked.map((rep, index) => {
          const read = repeatOf(rep)
          return (
            <li key={rep.id}>
              <article
                id={`rep-${rep.id}`}
                className={`rank-row party-${rep.party.toLowerCase()}${selectedId === rep.id ? ' is-selected' : ''}`}
                data-band={read.band}
                onClick={() => onSelect(rep.id)}
              >
                <span className="rank-pos">{index + 1}</span>
                <RepeatFace url={rep.photoUrl} name={rep.name} />
                <div className="rank-body">
                  <h2>{rep.name}</h2>
                  <p>
                    {rep.districtLabel}
                    {read.margin != null ? ` · margen ${formatVotes(read.margin)}` : ''}
                    {read.pct != null ? ` · ${read.pct}%` : ''}
                    {read.since ? ` · desde ${read.since}` : ''}
                  </p>
                  <p className="repeat-social">{read.social}</p>
                </div>
                <div className="rank-meter" aria-hidden>
                  <span style={{ width: `${read.score}%` }} data-band={read.band} />
                </div>
                <strong className="rank-score">
                  {read.score}
                  <span>{REPEAT_BAND_LABELS[read.band]}</span>
                </strong>
              </article>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

function RepeatFace({ url, name }: { url: string | null; name: string }) {
  const [broken, setBroken] = useState(false)
  if (url && !broken) {
    return <img className="rank-photo" src={url} alt="" loading="lazy" onError={() => setBroken(true)} />
  }
  return <span className="rank-photo rank-ph">{initials(name)}</span>
}
