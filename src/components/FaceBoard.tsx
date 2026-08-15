import { useState } from 'react'
import type { Representative } from '../types'
import { strengthOf } from '../lib/strength'
import { initials } from '../lib/text'
import { electionFor, formatVotes } from '../lib/votes'

type Props = {
  reps: Representative[]
  maxProjects: number
  selectedId: string | null
  onSelect: (id: string) => void
}

function Face({ url, name }: { url: string | null; name: string }) {
  const [broken, setBroken] = useState(false)
  if (url && !broken) {
    return <img src={url} alt="" loading="lazy" onError={() => setBroken(true)} />
  }
  return <span className="face-initials">{initials(name)}</span>
}

export function FaceBoard({ reps, maxProjects, selectedId, onSelect }: Props) {
  return (
    <div className="face-board" aria-label="Caras: quién es cada uno">
      {reps.map((rep) => {
        const score = strengthOf(rep, maxProjects)
        const election = electionFor(rep.id)
        return (
          <article
            key={rep.id}
            id={`rep-${rep.id}`}
            className={`face-card party-${rep.party.toLowerCase()}${selectedId === rep.id ? ' is-selected' : ''}`}
            data-party={rep.party}
            onClick={() => onSelect(rep.id)}
          >
            <div className="face-shot">
              <Face url={rep.photoUrl} name={rep.name} />
              <span className="face-color">{score.colorLabel}</span>
            </div>
            <div className="face-body">
              <p className="face-seat">{rep.districtLabel}</p>
              <h2>{rep.name}</h2>
              <p className="face-party">
                {rep.party} · {score.colorLabel}
              </p>
              <p className="face-stat">
                {election?.votes !== null && election?.votes !== undefined
                  ? `${formatVotes(election.votes)} votos${election.margin !== null ? ` · +${formatVotes(election.margin)}` : ''}`
                  : 'Sin voto popular'}
              </p>
              <p className="face-stat">
                {score.projects} {score.projects === 1 ? 'proyecto' : 'proyectos'}
              </p>
              <p className="face-force" data-band={score.band}>
                Fuerza {score.total}
              </p>
            </div>
          </article>
        )
      })}
    </div>
  )
}
