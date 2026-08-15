import type { Party, Representative } from '../types'
import { PARTY_META } from '../lib/profile'
import { RepCard } from './RepCard'

type Props = {
  party: Party
  members: Representative[]
  selectedId: string | null
  onSelect: (id: string) => void
  showEmpty: boolean
}

export function PartyBlock({ party, members, selectedId, onSelect, showEmpty }: Props) {
  if (members.length === 0 && !showEmpty) return null

  const meta = PARTY_META[party]
  const title =
    party === 'PPD' ? `${meta.name} — populares` : meta.name

  return (
    <section
      className={`party-block party-${party.toLowerCase()}`}
      aria-label={title}
    >
      <header className="party-block-head">
        <h2>
          {title}
          <span>
            {members.length} {members.length === 1 ? 'escaño' : 'escaños'}
          </span>
        </h2>
        <p>
          {meta.statusLabel} · {meta.bloc}
        </p>
      </header>
      {members.length === 0 ? (
        <p className="party-empty">Ningún escaño de distrito. Están por acumulación.</p>
      ) : (
        <div className="directory">
          {members.map((rep) => (
            <RepCard
              key={rep.id}
              rep={rep}
              selected={rep.id === selectedId}
              onSelect={() => onSelect(rep.id)}
            />
          ))}
        </div>
      )}
    </section>
  )
}
