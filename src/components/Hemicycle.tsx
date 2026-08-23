import { useState } from 'react'
import type { Representative, WhipStatus } from '../types'
import { layoutHemicycle } from '../lib/hemicycle'
import { initials } from '../lib/text'
import { strengthOf } from '../lib/strength'
import { electionFor, voteLine } from '../lib/votes'
import { DEFAULT_WHIP_STATUS, WHIP_STATUS_LABELS } from '../lib/whip'

type Props = {
  reps: Representative[]
  selectedId: string | null
  onSelect: (id: string) => void
  maxProjects: number
  colorBy?: 'party' | 'voto'
  whipById?: Record<string, WhipStatus>
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

export function Hemicycle({
  reps,
  selectedId,
  onSelect,
  maxProjects,
  colorBy = 'party',
  whipById,
}: Props) {
  const seats = layoutHemicycle(reps, WIDTH, HEIGHT)
  const byVote = colorBy === 'voto'

  return (
    <figure className="hemicycle" aria-label="Hemiciclo de la Cámara: 53 escaños con foto">
      <div className="hemicycle-stage" style={{ aspectRatio: `${WIDTH} / ${HEIGHT}` }}>
        {seats.map((seat) => {
          const selected = seat.id === selectedId
          const result = electionFor(seat.id)
          const score = strengthOf(seat.rep, maxProjects)
          const status = whipById?.[seat.id] ?? DEFAULT_WHIP_STATUS
          const label = [
            seat.rep.name,
            byVote ? WHIP_STATUS_LABELS[status] : score.colorLabel,
            seat.rep.districtLabel,
            result ? voteLine(result) : '',
            `${score.projects} proyectos`,
            byVote ? null : `fuerza ${score.total}`,
          ]
            .filter(Boolean)
            .join(', ')
          const ring = byVote
            ? `seat-whip-${status}`
            : `seat-${seat.rep.party.toLowerCase()}`
          return (
            <button
              key={seat.id}
              type="button"
              className={`seat-photo ${ring}${selected ? ' is-selected' : ''}`}
              data-whip={byVote ? status : undefined}
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
              {byVote ? null : <span className="seat-force">{score.total}</span>}
            </button>
          )
        })}
        <p className="hemicycle-rostrum">Presidencia</p>
      </div>
    </figure>
  )
}
