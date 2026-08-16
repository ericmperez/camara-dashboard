import { connectionsOf, repById } from '../lib/dossiers'
import type { DossierConnection, Representative } from '../types'

type Props = {
  center: Representative
  onSelect: (id: string) => void
}

type Node = {
  id: string
  name: string
  party: Representative['party']
  x: number
  y: number
  connection: DossierConnection
}

const WIDTH = 640
const HEIGHT = 420
const CX = WIDTH / 2
const CY = HEIGHT / 2
const RADIUS = 150

function layout(connections: DossierConnection[]): Node[] {
  if (connections.length === 0) return []
  return connections.map((connection, index) => {
    const angle = (2 * Math.PI * index) / connections.length - Math.PI / 2
    const other = repById(connection.toId)
    return {
      id: connection.toId,
      name: other?.name ?? connection.toId,
      party: other?.party ?? 'PNP',
      x: CX + RADIUS * Math.cos(angle),
      y: CY + RADIUS * Math.sin(angle),
      connection,
    }
  })
}

export function ConnectionGraph({ center, onSelect }: Props) {
  const connections = connectionsOf(center.id)
  const nodes = layout(connections)

  if (nodes.length === 0) {
    return (
      <p className="party-empty">
        Sin conexiones verificadas ni pueblos en común con otro escaño de distrito.
      </p>
    )
  }

  return (
    <div className="conn-graph-wrap">
      <svg
        className="conn-graph"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label={`Grafo de conexiones de ${center.name}`}
      >
        {nodes.map((node) => (
          <line
            key={`e-${node.id}-${node.connection.kind}-${node.connection.label}`}
            x1={CX}
            y1={CY}
            x2={node.x}
            y2={node.y}
            className={`conn-edge conn-edge-${node.connection.kind}`}
          />
        ))}
        <g className={`conn-node party-${center.party.toLowerCase()}`}>
          <circle cx={CX} cy={CY} r="28" />
          <text x={CX} y={CY + 4} textAnchor="middle">
            {center.name.split(' ')[0]}
          </text>
        </g>
        {nodes.map((node) => (
          <g
            key={`n-${node.id}-${node.connection.kind}`}
            className={`conn-node is-link party-${node.party.toLowerCase()}`}
            onClick={() => onSelect(node.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                onSelect(node.id)
              }
            }}
          >
            <circle cx={node.x} cy={node.y} r="22" />
            <text x={node.x} y={node.y + 4} textAnchor="middle">
              {node.name.split(' ')[0]}
            </text>
          </g>
        ))}
      </svg>
      <p className="conn-legend">
        Línea continua = hecho citado. Línea punteada = inferencia por pueblos en común.
      </p>
    </div>
  )
}
