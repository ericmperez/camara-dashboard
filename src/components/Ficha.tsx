import { useState } from 'react'
import { PLAYBOOK_BOOK_LABELS } from '../data/playbook'
import { REPEAT_DISCLAIMER } from '../data/repeat-profiles'
import { CURVE_BAND_LABELS, curveOf, formatDelta } from '../lib/curve'
import { playbookOf } from '../lib/playbook'
import { tenureOf } from '../lib/tenure'
import { fichaFor, hasVerifiedBody } from '../lib/dossiers'
import { REPEAT_BAND_LABELS, repeatOf } from '../lib/repeat'
import { districtElections } from '../lib/outlook'
import { formatUsd, oceBalancesUrl, oceFor, oceNote, oceSearchUrl } from '../lib/oce'
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
  const repeat = repeatOf(rep)
  const history = districtElections(rep.district)
  const oce = oceFor(rep.id)
  const play = playbookOf(rep.id)
  const tenure = tenureOf(rep)
  const curve = curveOf(rep)

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

      <section className="ficha-block is-first ficha-repeat" aria-label="Si repite en 2028">
        <h3>Si repite en 2028</h3>
        <p className="repeat-scoreline">
          <strong>{repeat.score}</strong>
          <span> · {REPEAT_BAND_LABELS[repeat.band]}</span>
          {repeat.since ? ` · en el escaño desde ${repeat.since}` : ''}
        </p>
        <p>{repeat.why}</p>
        <p>
          <span className="eyebrow">Redes</span> {repeat.social}
        </p>
        <p className="conn-note">{repeat.socialNote}</p>
        <p className="conn-note">{REPEAT_DISCLAIMER}</p>
      </section>

      <section className="ficha-block" aria-label="Cuatrienios">
        <h3>Cuatrienios</h3>
        <ol className="tenure-line">
          {tenure.blocks.map((block) => (
            <li key={block.label} className={block.current ? 'is-current' : undefined}>
              {block.label}
            </li>
          ))}
        </ol>
        <p>
          {tenure.cited
            ? `En el escaño desde ${tenure.assumed} · ${tenure.count} ${tenure.count === 1 ? 'cuatrienio' : 'cuatrienios'} en esta línea.`
            : tenure.source}
        </p>
        {tenure.cited ? <p className="conn-note">{tenure.source}</p> : null}
      </section>

      <section className="ficha-block" aria-label="Curva CEE">
        <h3>Curva CEE 2020→2024</h3>
        <p className="repeat-scoreline">
          <strong data-band={curve.band}>{formatDelta(curve.delta)}</strong>
          <span> · {CURVE_BAND_LABELS[curve.band]}</span>
        </p>
        <p>{curve.why}</p>
        {curve.priorSourceUrl ? (
          <p>
            <a href={curve.priorSourceUrl} target="_blank" rel="noreferrer">
              {curve.priorSourceLabel ?? 'CEE 2020'}
            </a>
          </p>
        ) : null}
      </section>

      {play ? (
        <section className="ficha-block" aria-label="Invertir u ofrecer">
          <h3>{PLAYBOOK_BOOK_LABELS[play.book]}</h3>
          <p className="playbook-move">{play.move}</p>
          <p>
            <span className="eyebrow">Popularidad</span> {play.popularity}
          </p>
          <p>
            <span className="eyebrow">Redes</span> {play.social}
          </p>
          <p>
            <span className="eyebrow">Qué ha dicho</span> {play.said}
          </p>
          {play.risk ? <p className="conn-note">{play.risk}</p> : null}
        </section>
      ) : null}

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

      <section className="ficha-block" aria-label="Escrutinios del distrito">
        <h3>Escrutinios del distrito</h3>
        {rep.district == null ? (
          <p className="party-empty">Acumulación: no hay escrutinio de distrito.</p>
        ) : (
          <ol>
            {history.map((row) => (
              <li key={row.year}>
                <a href={row.sourceUrl} target="_blank" rel="noreferrer">
                  {row.year}
                  {row.alternate ? ' · fuente alterna' : ''}
                </a>
                {`: ${row.winner} (${formatVotes(row.winnerVotes)}) contra ${row.second} (${formatVotes(row.secondVotes)}). ${row.sourceLabel}`}
              </li>
            ))}
          </ol>
        )}
      </section>

      <section className="ficha-block" aria-label="Recaudos OCE">
        <h3>Recaudos (OCE)</h3>
        {oce ? (
          <>
            <p>
              {oce.committeeName}. Ingresos {formatUsd(oce.income)} · gastos {formatUsd(oce.expenses)}.
            </p>
            <p>
              {oce.event} · {oce.period}
              {oce.filedAt ? ` · radicado ${oce.filedAt}` : ''}.
            </p>
            <p>
              <a href={oce.sourceUrl} target="_blank" rel="noreferrer">
                Informe {oce.reportNumber}
              </a>
            </p>
            <p className="conn-note">{oceNote()}</p>
          </>
        ) : (
          <p className="party-empty">
            Sin cifra automática para este representante. La consulta pública está en{' '}
            <a href={oceSearchUrl()} target="_blank" rel="noreferrer">
              serviciosenlinea.oce.pr.gov
            </a>
            . El balance acumulado sigue en{' '}
            <a href={oceBalancesUrl()} target="_blank" rel="noreferrer">
              el tablero de la OCE
            </a>
            .
          </p>
        )}
      </section>

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
