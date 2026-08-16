import { useState } from 'react'
import { fichaFor, hasVerifiedBody } from '../lib/dossiers'
import { dossierFor, latestProjects } from '../lib/measures'
import { PARTY_META } from '../lib/profile'
import { initials, telHref } from '../lib/text'
import { electionFor, formatVotes, voteLine } from '../lib/votes'
import type { Representative } from '../types'

type Props = {
  rep: Representative
}

export function Ficha({ rep }: Props) {
  const [brokenPhoto, setBrokenPhoto] = useState(false)
  const showPhoto = Boolean(rep.photoUrl) && !brokenPhoto
  const partyMeta = PARTY_META[rep.party]
  const dossier = fichaFor(rep.id)
  const measures = dossierFor(rep.id)
  const preview = latestProjects(rep.id, 4)
  const election = electionFor(rep.id)

  return (
    <section className="ficha" id="ficha" aria-label={`Ficha de ${rep.name}`}>
      <header className="ficha-head">
        <div className="ficha-photo" aria-hidden={showPhoto ? undefined : true}>
          {showPhoto ? (
            <img
              src={rep.photoUrl!}
              alt=""
              onError={() => setBrokenPhoto(true)}
            />
          ) : (
            <span className="rep-initials">{initials(rep.name)}</span>
          )}
        </div>
        <div>
          <p className="rep-seat">
            {rep.districtLabel}
            {rep.municipalities.length > 0 ? ` · ${rep.municipalities.join(', ')}` : ''}
          </p>
          <h2>{rep.name}</h2>
          {rep.role ? <p className="rep-role">{rep.role}</p> : null}
          <p className={`party-pill party-${rep.party.toLowerCase()}`}>
            {rep.party} · {partyMeta.statusLabel}
          </p>
        </div>
      </header>

      <div className="ficha-grid">
        <section>
          <h3>Biografía</h3>
          {dossier?.bio ? <p>{dossier.bio}</p> : <p className="party-empty">Sin biografía verificada.</p>}
        </section>
        <section>
          <h3>Trayectoria</h3>
          {dossier && dossier.career.length > 0 ? (
            <ul>
              {dossier.career.map((item) => (
                <li key={item}>
                  {item.startsWith('INFERENCIA') ? (
                    <span className="kind-badge kind-inference">INFERENCIA</span>
                  ) : null}{' '}
                  {item.replace(/^INFERENCIA\s*(\([^)]+\))?:\s*/i, '')}
                </li>
              ))}
            </ul>
          ) : (
            <p className="party-empty">Sin trayectoria citada.</p>
          )}
        </section>
        <section>
          <h3>Aspiraciones</h3>
          {dossier && dossier.aspirations.length > 0 ? (
            <ul>
              {dossier.aspirations.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="party-empty">Sin aspiraciones verificadas.</p>
          )}
        </section>
        <section>
          <h3>Comisiones</h3>
          {dossier && dossier.committees.length > 0 ? (
            <ul>
              {dossier.committees.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="party-empty">Sin comisiones verificadas.</p>
          )}
        </section>
      </div>

      {election ? (
        <section className="ficha-block">
          <h3>Votos (CEE)</h3>
          <p className="rep-votes">
            <a href={election.sourceUrl} target="_blank" rel="noreferrer">
              {election.eventLabel}
            </a>
            {': '}
            {voteLine(election)}
            {election.runnerUp && election.runnerUpVotes !== null
              ? ` contra ${election.runnerUp} (${formatVotes(election.runnerUpVotes)}).`
              : ''}
          </p>
        </section>
      ) : (
        <section className="ficha-block">
          <h3>Votos (CEE)</h3>
          <p className="party-empty">Sin recuento CEE en el harvest.</p>
        </section>
      )}

      {measures ? (
        <section className="rep-bills ficha-block" aria-label={`Proyectos de ${rep.name}`}>
          <h3>Proyectos (SUTRA)</h3>
          <p className="rep-bills-count">
            {measures.counts.PC} {measures.counts.PC === 1 ? 'proyecto de ley' : 'proyectos de ley'}
            {' · '}
            {measures.counts.RC + measures.counts.RCC + measures.counts.RKC} resoluciones
          </p>
          {preview.length > 0 ? (
            <ol>
              {preview.map((bill) => (
                <li key={bill.code}>
                  <a href={bill.url} target="_blank" rel="noreferrer">
                    {bill.code}
                  </a>
                  <span> {bill.title}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="party-empty">SUTRA no le lista proyectos de ley todavía.</p>
          )}
          <a className="rep-sutra" href={measures.sutraUrl} target="_blank" rel="noreferrer">
            Ver el expediente en SUTRA
          </a>
        </section>
      ) : (
        <section className="ficha-block">
          <h3>Proyectos (SUTRA)</h3>
          <p className="party-empty">No encontramos su expediente en SUTRA.</p>
        </section>
      )}

      <section className="ficha-block ficha-sources">
        <h3>Fuentes</h3>
        {dossier && dossier.sources.length > 0 ? (
          <ul>
            {dossier.sources.map((source) => (
              <li key={source.url}>
                <a href={source.url} target="_blank" rel="noreferrer">
                  {source.label}
                </a>
                {source.published ? ` · ${source.published}` : ''}
              </li>
            ))}
          </ul>
        ) : (
          <p className="party-empty">Sin fuentes citadas.</p>
        )}
        {dossier && !hasVerifiedBody(dossier) ? (
          <p className="conn-note">
            Vacío a propósito: no hay biografía, trayectoria ni comisiones verificadas
            más allá del directorio oficial.
          </p>
        ) : null}
      </section>

      <ul className="rep-contact">
        {rep.email ? (
          <li>
            <a href={`mailto:${rep.email}`}>{rep.email}</a>
          </li>
        ) : null}
        {rep.phone ? (
          <li>
            <a href={telHref(rep.phone)}>{rep.phone}</a>
          </li>
        ) : null}
        <li>
          <a href={rep.profileUrl} target="_blank" rel="noreferrer">
            Ficha oficial
          </a>
        </li>
      </ul>
    </section>
  )
}
