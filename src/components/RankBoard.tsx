import { useState } from 'react'
import type { Representative } from '../types'
import { rankByStrength, strengthOf } from '../lib/strength'
import { initials } from '../lib/text'
import { electionFor, formatVotes } from '../lib/votes'

type Props = {
  reps: Representative[]
  maxProjects: number
  selectedId: string | null
  onSelect: (id: string) => void
}

export function RankBoard({ reps, maxProjects, selectedId, onSelect }: Props) {
  const ranked = rankByStrength(reps, maxProjects)
  return (
    <ol className="rank-board" aria-label="Ranking por fuerza">
      {ranked.map((rep, index) => {
        const score = strengthOf(rep, maxProjects)
        const election = electionFor(rep.id)
        return (
          <li key={rep.id}>
            <article
              id={`rep-${rep.id}`}
              className={`rank-row party-${rep.party.toLowerCase()}${selectedId === rep.id ? ' is-selected' : ''}`}
              onClick={() => onSelect(rep.id)}
            >
              <span className="rank-pos">{index + 1}</span>
              <RankFace url={rep.photoUrl} name={rep.name} />
              <div className="rank-body">
                <h2>{rep.name}</h2>
                <p>
                  {score.colorLabel} · {rep.districtLabel}
                  {election?.votes != null
                    ? ` · ${formatVotes(election.votes)} votos`
                    : ' · sin voto popular'}
                  {` · ${score.projects} proyectos`}
                </p>
              </div>
              <div className="rank-meter" aria-hidden>
                <span style={{ width: `${score.total}%` }} data-band={score.band} />
              </div>
              <strong className="rank-score">
                {score.total}
                <span>fuerza</span>
              </strong>
            </article>
          </li>
        )
      })}
    </ol>
  )
}

function RankFace({ url, name }: { url: string | null; name: string }) {
  const [broken, setBroken] = useState(false)
  if (url && !broken) {
    return <img className="rank-photo" src={url} alt="" loading="lazy" onError={() => setBroken(true)} />
  }
  return <span className="rank-photo rank-ph">{initials(name)}</span>
}
