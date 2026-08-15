import { useState } from 'react'
import type { Representative } from '../types'
import { layoutHemicycle } from '../lib/hemicycle'
import { initials } from '../lib/text'
import { strengthOf } from '../lib/strength'
import { electionFor, voteLine } from '../lib/votes'

type Props = {
  reps: Representative[]
  selectedId: string | null
  onSelect: (id: string) => void
  maxProjects: number
}

const WIDTH = 720
const HEIGHT = 380

function SeatFace({ rep }: { rep: Representative }) {
  const [broken, setBroken] = useState(false)
  const show = Boolean(rep.photoUrl) && !broken
  if (show) {
    return (
      <img
        src={rep.photoUrl!}
        alt=""
        loading="lazy"
        onError={() => setBroken(true)}
      />
    )
  }
  return <span className="seat-initials">{initials(rep.name)}</span>
}

export function Hemicycle({ reps, selectedId, onSelect, maxProjects }: Props) {
  const seats = layoutHemicycle(reps, WIDTH, HEIGHT)

  return (
    <figure className="hemicycle" aria-label="Hemiciclo de la Cámara: 53 escaños con foto">
      <div className="hemicycle-stage" style={{ aspectRatio: `${WIDTH} / ${HEIGHT}` }}>
        {seats.map((seat) => {
          const selected = seat.id === selectedId
          const result = electionFor(seat.id)
          const score = strengthOf(seat.rep, maxProjects)
          const label = [
            seat.rep.name,
            score.colorLabel,
            seat.rep.districtLabel,
            result ? voteLine(result) : '',
            `${score.projects} proyectos`,
            `fuerza ${score.total}`,
          ]
            .filter(Boolean)
            .join(', ')
          return (
            <button
              key={seat.id}
              type="button"
              className={`seat-photo seat-${seat.rep.party.toLowerCase()}${selected ? ' is-selected' : ''}`}
              style={{
                left: `${(seat.x / WIDTH) * 100}%`,
                top: `${(seat.y / HEIGHT) * 100}%`,
              }}
              aria-label={label}
              aria-pressed={selected}
              title={label}
              onClick={() => onSelect(seat.id)}
            >
              <SeatFace rep={seat.rep} />
              <span className="seat-force">{score.total}</span>
            </button>
          )
        })}
        <p className="hemicycle-rostrum">Presidencia</p>
      </div>
    </figure>
  )
}
