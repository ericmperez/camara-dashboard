import { useState } from 'react'
import type { Representative } from '../types'
import { FACE_LAYOUT } from '../lib/faceLayout'
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
    <div
      className="face-board"
      aria-label="Caras: quién es cada uno"
      data-face-layout="one-screen"
      data-face-cols={FACE_LAYOUT.phoneColumns}
      data-face-card-max-h={FACE_LAYOUT.cardMaxHeight}
      data-face-gap={FACE_LAYOUT.gap}
    >
      {reps.map((rep) => {
        const score = strengthOf(rep, maxProjects)
        const election = electionFor(rep.id)
        const voteBit =
          election?.votes !== null && election?.votes !== undefined
            ? `${formatVotes(election.votes)} votos`
            : 'Sin voto popular'
        return (
          <article
            key={rep.id}
            id={`rep-${rep.id}`}
            className={`face-card party-${rep.party.toLowerCase()}${selectedId === rep.id ? ' is-selected' : ''}`}
            data-party={rep.party}
            title={`${rep.name} · ${rep.districtLabel} · ${rep.party} · ${score.colorLabel} · ${voteBit} · ${score.projects} ${score.projects === 1 ? 'proyecto' : 'proyectos'} · Fuerza ${score.total}`}
            onClick={() => onSelect(rep.id)}
          >
            <div className="face-shot">
              <Face url={rep.photoUrl} name={rep.name} />
            </div>
            <div className="face-body">
              <h2>{rep.name}</h2>
              <p className="face-meta">
                <span className="face-party">{rep.party}</span>
                {' · '}
                <span className="face-seat">{rep.districtLabel}</span>
                {' · '}
                <span className="face-color">{score.colorLabel}</span>
                {' · '}
                <span className="face-force" data-band={score.band}>
                  Fuerza {score.total}
                </span>
                {' · '}
                <span className="face-stat">{voteBit}</span>
                {' · '}
                <span className="face-stat">
                  {score.projects} {score.projects === 1 ? 'proyecto' : 'proyectos'}
                </span>
              </p>
            </div>
          </article>
        )
      })}
    </div>
  )
}
