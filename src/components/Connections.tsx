import { connectionsOf, fichaFor, repById } from '../lib/dossiers'
import type { DossierConnection, Representative } from '../types'
import { ConnectionGraph } from './ConnectionGraph'

type Props = {
  rep: Representative
  onSelect: (id: string) => void
}

function KindBadge({ kind }: { kind: DossierConnection['kind'] }) {
  return (
    <span className={`kind-badge kind-${kind}`}>
      {kind === 'fact' ? 'HECHO' : 'INFERENCIA'}
    </span>
  )
}

export function Connections({ rep, onSelect }: Props) {
  const connections = connectionsOf(rep.id)
  const facts = connections.filter((c) => c.kind === 'fact')
  const inferences = connections.filter((c) => c.kind === 'inference')
  const dossier = fichaFor(rep.id)

  return (
    <section className="ficha" id="conexiones" aria-label={`Conexiones de ${rep.name}`}>
      <header className="ficha-head">
        <div>
          <p className="rep-seat">{rep.districtLabel}</p>
          <h2>{rep.name}</h2>
          <p className={`party-pill party-${rep.party.toLowerCase()}`}>{rep.party}</p>
        </div>
      </header>

      <section className="ficha-block is-first">
        <h3>Lista</h3>
        {connections.length === 0 ? (
          <p className="party-empty">Sin conexiones de hecho ni inferencias de pueblo.</p>
        ) : (
          <ul className="conn-list">
            {facts.concat(inferences).map((connection) => {
              const other = repById(connection.toId)
              return (
                <li key={`${connection.kind}-${connection.toId}-${connection.label}`}>
                  <KindBadge kind={connection.kind} />
                  <button type="button" onClick={() => onSelect(connection.toId)}>
                    {other?.name ?? connection.toId}
                  </button>
                  <span> — {connection.label}</span>
                  {connection.note ? <p className="conn-note">{connection.note}</p> : null}
                  {connection.sources.length > 0 ? (
                    <ul className="conn-sources">
                      {connection.sources.map((source) => (
                        <li key={source.url}>
                          <a href={source.url} target="_blank" rel="noreferrer">
                            {source.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="conn-note">INFERENCIA: no hay URL de hecho.</p>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </section>

      <section className="ficha-block">
        <h3>Grafo</h3>
        <ConnectionGraph center={rep} onSelect={onSelect} />
        <p className="conn-legend">
          HECHO = línea continua y fuente citada. INFERENCIA = línea punteada por
          pueblos en común; no es alianza.
        </p>
      </section>

      {dossier && dossier.sources.length > 0 ? (
        <section className="ficha-block ficha-sources">
          <h3>Fuentes de los hechos</h3>
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
        </section>
      ) : null}
    </section>
  )
}
