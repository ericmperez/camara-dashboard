import { ceeLeverageLine, leverageOf } from '../lib/leverage'
import { repById } from '../lib/dossiers'
import type { DossierConnection, Representative } from '../types'

type Props = {
  rep: Representative
}

function KindBadge({ kind }: { kind: DossierConnection['kind'] }) {
  return (
    <span className={`kind-badge kind-${kind}`}>
      {kind === 'fact' ? 'HECHO' : 'INFERENCIA'}
    </span>
  )
}

export function WhipLeverage({ rep }: Props) {
  const leverage = leverageOf(rep)

  return (
    <section
      className="whip-leverage"
      aria-label={`Palanca pública de ${rep.name}`}
    >
      <h3>Palanca pública</h3>
      <p className={`party-pill party-${rep.party.toLowerCase()}`}>
        {leverage.party} · {leverage.bloc === 'mayoría' ? 'mayoría' : 'minoría'}
      </p>
      <p>
        Cargo: {leverage.role ?? 'Sin cargo de mesa'}
      </p>
      <p>
        Preside:{' '}
        {leverage.chairs.length > 0
          ? leverage.chairs.join(', ')
          : 'Sin presidencia de comisión'}
      </p>
      <p>Margen CEE: {ceeLeverageLine(leverage.cee)}</p>

      <div className="whip-leverage-block">
        <h4>Coautorías citadas</h4>
        {leverage.factCoauthors.length === 0 ? (
          <p className="party-empty">Sin coautorías ni hechos citados.</p>
        ) : (
          <ul>
            {leverage.factCoauthors.map((connection) => {
              const other = repById(connection.toId)
              return (
                <li key={`${connection.toId}-${connection.label}`}>
                  <KindBadge kind="fact" />
                  <span>
                    {other?.name ?? connection.toId} — {connection.label}
                  </span>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <div className="whip-leverage-block">
        <h4>Pueblos en común</h4>
        <p className="conn-note">INFERENCIA: no es alianza.</p>
        {leverage.townOverlap.length === 0 ? (
          <p className="party-empty">Sin solape de municipios en el directorio.</p>
        ) : (
          <ul>
            {leverage.townOverlap.map((connection) => {
              const other = repById(connection.toId)
              return (
                <li key={`${connection.toId}-${connection.label}`}>
                  <KindBadge kind="inference" />
                  <span>
                    {other?.name ?? connection.toId} — {connection.label}
                  </span>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </section>
  )
}
