import { PLAYBOOK_BANNER, PLAYBOOK_BOOK_LABELS, PLAYBOOK_NEXT, PLAYBOOK_RULE } from '../data/playbook'
import type { PlaybookBook } from '../data/playbook'
import { playbookVisible } from '../lib/playbook'
import type { Representative } from '../types'

type Props = {
  reps: Representative[]
  selectedId: string | null
  onSelect: (id: string) => void
}

const BOOKS: PlaybookBook[] = ['invertir', 'ofrecer', 'portero']

export function Playbook({ reps, selectedId, onSelect }: Props) {
  const rows = playbookVisible(reps)
  return (
    <div className="playbook" aria-label="A quién invertir y a quién ofrecer">
      <p className="whip-banner" role="note">
        {PLAYBOOK_BANNER}
      </p>
      <p className="playbook-rule">{PLAYBOOK_RULE}</p>
      {rows.length === 0 ? (
        <p className="party-empty" role="status">
          Nadie de esta lista coincide con el filtro.
        </p>
      ) : null}
      {BOOKS.map((book) => {
        const group = rows.filter((row) => row.entry.book === book)
        if (group.length === 0) return null
        return (
          <section key={book} className="playbook-book" aria-label={PLAYBOOK_BOOK_LABELS[book]}>
            <h2>{PLAYBOOK_BOOK_LABELS[book]}</h2>
            <ul>
              {group.map(({ rep, entry }) => (
                <li key={rep.id}>
                  <article
                    id={`rep-${rep.id}`}
                    className={`playbook-card party-${rep.party.toLowerCase()}${selectedId === rep.id ? ' is-selected' : ''}`}
                    data-book={entry.book}
                    onClick={() => onSelect(rep.id)}
                  >
                    <p className="playbook-kicker">
                      {PLAYBOOK_BOOK_LABELS[entry.book]} · {rep.districtLabel} · {rep.party}
                    </p>
                    <h3>{rep.name}</h3>
                    <p>
                      <span className="eyebrow">Popularidad</span> {entry.popularity}
                    </p>
                    <p>
                      <span className="eyebrow">Redes</span> {entry.social}
                    </p>
                    <p>
                      <span className="eyebrow">Qué ha dicho</span> {entry.said}
                    </p>
                    <p className="playbook-move">{entry.move}</p>
                    {entry.risk ? <p className="conn-note">{entry.risk}</p> : null}
                  </article>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
      <p className="playbook-next">{PLAYBOOK_NEXT}</p>
    </div>
  )
}
