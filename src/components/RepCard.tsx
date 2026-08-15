import { useState } from 'react'
import type { Representative } from '../types'
import { dossierFor, latestProjects } from '../lib/measures'
import { politicalProfile } from '../lib/profile'
import { initials, telHref } from '../lib/text'
import { electionFor, formatVotes, voteLine } from '../lib/votes'

type Props = {
  rep: Representative
  selected: boolean
  onSelect: () => void
}

export function RepCard({ rep, selected, onSelect }: Props) {
  const [brokenPhoto, setBrokenPhoto] = useState(false)
  const showPhoto = Boolean(rep.photoUrl) && !brokenPhoto
  const profile = politicalProfile(rep)
  const dossier = dossierFor(rep.id)
  const preview = latestProjects(rep.id, 4)
  const election = electionFor(rep.id)

  return (
    <article
      id={`rep-${rep.id}`}
      className={`rep-card${selected ? ' is-selected' : ''}`}
      data-party={rep.party}
      onClick={onSelect}
    >
      <div className="rep-photo" aria-hidden={showPhoto ? undefined : true}>
        {showPhoto ? (
          <img
            src={rep.photoUrl!}
            alt=""
            loading="lazy"
            onError={() => setBrokenPhoto(true)}
          />
        ) : (
          <span className="rep-initials">{initials(rep.name)}</span>
        )}
      </div>
      <div className="rep-body">
        <p className="rep-seat">
          {rep.districtLabel}
          {rep.municipalities.length > 0 ? ` · ${rep.municipalities.join(', ')}` : ''}
        </p>
        <h2>{rep.name}</h2>
        {rep.role ? <p className="rep-role">{rep.role}</p> : null}
        <p className={`party-pill party-${rep.party.toLowerCase()}`}>
          {rep.party} · {profile.statusLabel}
        </p>
        <p className="rep-profile">{profile.text}</p>
        {election ? (
          <p className="rep-votes">
            <a
              href={election.sourceUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(event) => event.stopPropagation()}
            >
              {election.eventLabel}
            </a>
            {': '}
            {voteLine(election)}
            {election.runnerUp && election.runnerUpVotes !== null
              ? ` contra ${election.runnerUp} (${formatVotes(election.runnerUpVotes)}).`
              : ''}
          </p>
        ) : null}
        {dossier ? (
          <section className="rep-bills" aria-label={`Proyectos de ${rep.name}`}>
            <p className="rep-bills-count">
              {dossier.counts.PC} {dossier.counts.PC === 1 ? 'proyecto de ley' : 'proyectos de ley'}
              {' · '}
              {dossier.counts.RC + dossier.counts.RCC + dossier.counts.RKC} resoluciones
            </p>
            {preview.length > 0 ? (
              <ol>
                {preview.map((bill) => (
                  <li key={bill.code}>
                    <a href={bill.url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
                      {bill.code}
                    </a>
                    <span> {bill.title}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="party-empty">SUTRA no le lista proyectos de ley todavía.</p>
            )}
            <a
              className="rep-sutra"
              href={dossier.sutraUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              Ver el expediente en SUTRA
            </a>
          </section>
        ) : (
          <p className="party-empty">No encontramos su expediente en SUTRA.</p>
        )}
        <ul className="rep-contact">
          {rep.email ? (
            <li>
              <a href={`mailto:${rep.email}`} onClick={(event) => event.stopPropagation()}>
                {rep.email}
              </a>
            </li>
          ) : null}
          {rep.phone ? (
            <li>
              <a href={telHref(rep.phone)} onClick={(event) => event.stopPropagation()}>
                {rep.phone}
              </a>
            </li>
          ) : null}
          <li>
            <a
              href={rep.profileUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(event) => event.stopPropagation()}
            >
              Ficha oficial
            </a>
          </li>
        </ul>
      </div>
    </article>
  )
}
