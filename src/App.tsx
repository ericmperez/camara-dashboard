import { useEffect, useMemo, useState } from 'react'
import { Connections } from './components/Connections'
import { FaceBoard } from './components/FaceBoard'
import { Ficha } from './components/Ficha'
import { Hemicycle } from './components/Hemicycle'
import { PartyBlock } from './components/PartyBlock'
import { RankBoard } from './components/RankBoard'
import { CurveBoard } from './components/CurveBoard'
import { Playbook } from './components/Playbook'
import { RepeatBoard } from './components/RepeatBoard'
import { WhipLeverage } from './components/WhipLeverage'
import {
  ASSEMBLY,
  REPRESENTATIVES,
  SOURCE_LABEL,
  SOURCE_URL,
  TERM,
  UPDATED_LABEL,
} from './data/representatives'
import {
  countByParty,
  emptyFilters,
  filterRepresentatives,
  hasActiveFilters,
  sortRepresentatives,
} from './lib/filter'
import { countDistrictsByParty, groupByParty, splitDistrictsByParty } from './lib/group'
import { maxProjectCount } from './lib/strength'
import {
  NEED_FOR_MAJORITY,
  WHIP_STATUS_LABELS,
  WHIP_STATUSES,
  emptyWhipBoard,
  needForMajority,
  setSeatStatus,
  statusBreakdown,
  statusOf,
  yesCount,
} from './lib/whip'
import {
  WHIP_BANNER,
  browserStorage,
  loadActiveBoard,
  persistBoard,
  switchMeasure,
} from './lib/whip-store'
import { PARTIES } from './types'
import type { SeatKind, WhipStatus } from './types'

type ChamberView =
  | 'caras'
  | 'hemiciclo'
  | 'ranking'
  | 'repite'
  | 'curva'
  | 'oferta'
  | 'ficha'
  | 'conexiones'
  | 'voto'

const VIEW_OPTIONS: { value: ChamberView; label: string }[] = [
  { value: 'caras', label: 'Caras' },
  { value: 'hemiciclo', label: 'Hemiciclo' },
  { value: 'ranking', label: 'Ranking' },
  { value: 'repite', label: 'Repite' },
  { value: 'curva', label: 'Curva' },
  { value: 'oferta', label: 'Oferta' },
  { value: 'ficha', label: 'Ficha' },
  { value: 'conexiones', label: 'Conexiones' },
  { value: 'voto', label: 'Voto' },
]

const ROSTER_IDS = REPRESENTATIVES.map((rep) => rep.id)

const SEAT_OPTIONS: { value: SeatKind; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'distrito', label: 'Por distrito' },
  { value: 'acumulacion', label: 'Acumulación' },
]

function App() {
  const [filters, setFilters] = useState(emptyFilters)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [view, setView] = useState<ChamberView>('caras')
  const [board, setBoard] = useState(() => {
    const storage = browserStorage()
    return storage ? loadActiveBoard(ROSTER_IDS, storage) : emptyWhipBoard(ROSTER_IDS, '')
  })
  const [measureInput, setMeasureInput] = useState(board.measureCode)
  const [votoColor, setVotoColor] = useState<'voto' | 'partido'>('voto')

  const sorted = useMemo(() => sortRepresentatives(REPRESENTATIVES), [])
  const visible = useMemo(
    () => filterRepresentatives(sorted, filters),
    [sorted, filters],
  )
  const counts = useMemo(() => countByParty(REPRESENTATIVES), [])
  const districtCounts = useMemo(() => countDistrictsByParty(REPRESENTATIVES), [])
  const groups = useMemo(() => {
    if (filters.seat === 'distrito') return splitDistrictsByParty(visible)
    return groupByParty(visible)
  }, [visible, filters.seat])
  const filtered = hasActiveFilters(filters)
  const maxProjects = useMemo(
    () => maxProjectCount(REPRESENTATIVES.map((rep) => rep.id)),
    [],
  )

  const selected = useMemo(
    () => (selectedId ? sorted.find((rep) => rep.id === selectedId) ?? null : null),
    [selectedId, sorted],
  )

  const yes = yesCount(board)
  const need = needForMajority(board)
  const breakdown = statusBreakdown(board)
  const whipById = useMemo(() => {
    const map: Record<string, WhipStatus> = {}
    for (const [id, seat] of Object.entries(board.seats)) {
      map[id] = seat.status
    }
    return map
  }, [board])

  function selectRep(id: string) {
    setSelectedId(id)
    if (view === 'voto' || view === 'conexiones') {
      const node = document.getElementById(`rep-${id}`)
      if (!node || typeof node.scrollIntoView !== 'function') return
      const reduceMotion =
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      node.scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth',
        block: 'center',
      })
      return
    }
    setView('ficha')
  }

  useEffect(() => {
    const storage = browserStorage()
    if (!storage) return
    persistBoard(board, ROSTER_IDS, storage)
  }, [board])

  function markVote(id: string, status: WhipStatus) {
    setSelectedId(id)
    setBoard((current) => setSeatStatus(current, id, status))
  }

  function commitMeasure() {
    const storage = browserStorage()
    if (!storage) {
      setBoard((current) => ({ ...current, measureCode: measureInput }))
      return
    }
    const next = switchMeasure(board, measureInput, ROSTER_IDS, storage)
    setBoard(next)
    setMeasureInput(next.measureCode)
  }

  function setMeasureTitle(value: string) {
    setBoard((current) => ({ ...current, title: value.trim() ? value : null }))
  }

  return (
    <div className="page">
      <header className="masthead">
        <p className="eyebrow">Cámara de Representantes de Puerto Rico</p>
        <h1>Quién está sentado — y de quién puedo coger el voto</h1>
        <p className="lede">
          {ASSEMBLY} · cuatrienio {TERM}. {REPRESENTATIVES.length} representantes
          en el directorio oficial. Mayoría del cuerpo: {NEED_FOR_MAJORITY} de{' '}
          {REPRESENTATIVES.length}.
        </p>
      </header>

      <section className="chamber" aria-label="Composición del hemiciclo">
        <div className="view-switch" role="group" aria-label="Cómo ver la Cámara">
          {VIEW_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={view === option.value ? 'is-on' : ''}
              aria-pressed={view === option.value}
              onClick={() => setView(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
        {view === 'voto' ? (
          <div className="whip-panel" aria-label="Pizarra de voto">
            <p className="whip-banner" role="note">
              {WHIP_BANNER}
            </p>
            <div className="whip-measure">
              <label>
                Medida
                <input
                  type="text"
                  value={measureInput}
                  onChange={(event) => setMeasureInput(event.target.value)}
                  onBlur={commitMeasure}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.currentTarget.blur()
                    }
                  }}
                  placeholder="PC 1302"
                  autoComplete="off"
                  aria-label="Nombre de la medida"
                />
              </label>
              <label>
                Título
                <input
                  type="text"
                  value={board.title ?? ''}
                  onChange={(event) => setMeasureTitle(event.target.value)}
                  placeholder="Título corto (opcional)"
                  autoComplete="off"
                  aria-label="Título de la medida"
                />
              </label>
            </div>
            <div className="whip-tally" aria-label="Mayoría del cuerpo">
              <p className="whip-yes">Sí {yes} / {NEED_FOR_MAJORITY}</p>
              <p className="whip-need">Faltan {need}</p>
              <p className="whip-break">
                puedo coger {breakdown['voto-que-puedo-coger']} · indeciso{' '}
                {breakdown.indeciso} · no {breakdown.no} · no contactado{' '}
                {breakdown['no-contactado']}
              </p>
            </div>
            <div
              className="whip-chips whip-chips-pinned"
              role="group"
              aria-label={
                selected
                  ? `Estado de ${selected.name}`
                  : 'Estado de voto del escaño seleccionado'
              }
            >
              {WHIP_STATUSES.map((value) => (
                <button
                  key={value}
                  type="button"
                  className={
                    selected && statusOf(board, selected.id) === value ? 'is-on' : ''
                  }
                  aria-pressed={
                    selected ? statusOf(board, selected.id) === value : false
                  }
                  disabled={!selected}
                  onClick={() => {
                    if (selected) markVote(selected.id, value)
                  }}
                >
                  {WHIP_STATUS_LABELS[value]}
                </button>
              ))}
            </div>
          </div>
        ) : null}
        {view === 'hemiciclo' || view === 'voto' ? (
          <Hemicycle
            reps={sorted}
            selectedId={selectedId}
            onSelect={selectRep}
            maxProjects={maxProjects}
            colorBy={view === 'voto' ? votoColor : 'party'}
            whipById={view === 'voto' ? whipById : undefined}
          />
        ) : null}
        {view === 'voto' ? (
          <div className="chips" role="group" aria-label="Color del hemiciclo">
            <button
              type="button"
              className={votoColor === 'voto' ? 'is-on' : ''}
              aria-pressed={votoColor === 'voto'}
              onClick={() => setVotoColor('voto')}
            >
              Ver voto
            </button>
            <button
              type="button"
              className={votoColor === 'partido' ? 'is-on' : ''}
              aria-pressed={votoColor === 'partido'}
              onClick={() => setVotoColor('partido')}
            >
              Ver partido
            </button>
          </div>
        ) : null}
        {view === 'voto' ? null : (
          <>
            <ul className="tally">
              {PARTIES.map((party) => (
                <li key={party}>
                  <button
                    type="button"
                    className={`tally-btn party-${party.toLowerCase()}${filters.party === party ? ' is-on' : ''}`}
                    aria-label={`${counts[party]} ${party}`}
                    aria-pressed={filters.party === party}
                    onClick={() =>
                      setFilters((current) => ({
                        ...current,
                        party: current.party === party ? 'all' : party,
                      }))
                    }
                  >
                    <span className="swatch" aria-hidden />
                    <strong>{counts[party]}</strong>
                    <span>{party}</span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="district-split">De los 40 de distrito</p>
            <ul className="tally tally-district" aria-label="Los 40 escaños de distrito por partido">
              {PARTIES.map((party) => (
                <li key={`d-${party}`}>
                  <span className={`tally-static party-${party.toLowerCase()}`}>
                    <span className="swatch" aria-hidden />
                    <strong>{districtCounts[party]}</strong>
                    <span>{party === 'PPD' ? 'Populares' : party}</span>
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      <section className="toolbar" aria-label="Buscar representante">
        <label className="search">
          <input
            type="search"
            value={filters.query}
            onChange={(event) =>
              setFilters((current) => ({ ...current, query: event.target.value }))
            }
            placeholder="Nombre, pueblo o distrito"
            autoComplete="off"
            enterKeyHint="search"
            aria-label="Buscar por nombre, pueblo o distrito"
          />
        </label>
        <div className="chips" role="group" aria-label="Tipo de escaño">
          {SEAT_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={filters.seat === option.value ? 'is-on' : ''}
              onClick={() => setFilters((current) => ({ ...current, seat: option.value }))}
            >
              {option.label}
            </button>
          ))}
        </div>
        {filtered ? (
          <button type="button" className="clear" onClick={() => setFilters(emptyFilters())}>
            Quitar filtros
          </button>
        ) : null}
      </section>

      <section className="district-strip" aria-label="Ir a un distrito">
        {Array.from({ length: 40 }, (_, i) => i + 1).map((n) => {
          const active = filters.query.trim() === String(n)
          return (
            <button
              key={n}
              type="button"
              className={active ? 'is-on' : ''}
              onClick={() =>
                setFilters((current) => ({
                  ...current,
                  query: active ? '' : String(n),
                  seat: 'distrito',
                }))
              }
            >
              {n}
            </button>
          )
        })}
      </section>

      <p className="result-count" aria-live="polite">
        {visible.length === REPRESENTATIVES.length
          ? `${visible.length} representantes`
          : `${visible.length} de ${REPRESENTATIVES.length}`}
      </p>

      {view === 'ficha' || view === 'conexiones' ? (
        selected ? (
          view === 'ficha' ? (
            <Ficha rep={selected} />
          ) : (
            <Connections rep={selected} onSelect={selectRep} />
          )
        ) : (
          <div className="empty" role="status">
            <p>
              {view === 'ficha'
                ? 'Elige un representante para ver su ficha.'
                : 'Elige un representante para ver sus conexiones.'}
            </p>
            <p>Selecciona en Caras, Hemiciclo, Ranking, Repite, Curva u Oferta. Vacío si no hay fuente citada.</p>
          </div>
        )
      ) : visible.length === 0 ? (
        <div className="empty" role="status">
          <p>Nadie coincide con esa búsqueda.</p>
          <p>Prueba un pueblo, un apellido o un número de distrito del 1 al 40.</p>
          <button type="button" onClick={() => setFilters(emptyFilters())}>
            Ver a los 53
          </button>
        </div>
      ) : view === 'voto' ? (
        <>
          {selected ? (
            <WhipLeverage rep={selected} />
          ) : (
            <p className="party-empty" role="status">
              Elige un escaño para ver partido, cargo y palanca citada.
            </p>
          )}
          <FaceBoard
            reps={visible}
            maxProjects={maxProjects}
            selectedId={selectedId}
            onSelect={selectRep}
            whipById={whipById}
            onSetStatus={markVote}
          />
        </>
      ) : view === 'caras' ? (
        <FaceBoard
          reps={visible}
          maxProjects={maxProjects}
          selectedId={selectedId}
          onSelect={selectRep}
        />
      ) : view === 'ranking' ? (
        <RankBoard
          reps={visible}
          maxProjects={maxProjects}
          selectedId={selectedId}
          onSelect={selectRep}
        />
      ) : view === 'repite' ? (
        <RepeatBoard reps={visible} selectedId={selectedId} onSelect={selectRep} />
      ) : view === 'curva' ? (
        <CurveBoard reps={visible} selectedId={selectedId} onSelect={selectRep} />
      ) : view === 'oferta' ? (
        <Playbook reps={visible} selectedId={selectedId} onSelect={selectRep} />
      ) : (
        <div className="directory-groups" aria-label="Directorio">
          {groups.map((group) => (
            <PartyBlock
              key={group.party}
              party={group.party}
              members={group.members}
              selectedId={selectedId}
              onSelect={selectRep}
              showEmpty={filters.seat === 'distrito'}
            />
          ))}
        </div>
      )}

      <footer className="colophon">
        <p>
          Fuente:{' '}
          <a href={SOURCE_URL} target="_blank" rel="noreferrer">
            {SOURCE_LABEL}
          </a>
          . {UPDATED_LABEL}. Los votos salen del escrutinio certificado de la CEE
          (5 nov 2024) y de la elección especial del distrito 31 (sep 2025). La
          CEE no publica el programa de trabajo; los proyectos salen de SUTRA.
          La fuerza es 0–100: hasta 50 del % de votos, hasta 35 de proyectos
          radicados y hasta 15 del cargo en el hemiciclo. Sin voto popular no
          se inventa la parte electoral. Repite 2028 mezcla margen CEE, años
          en el escaño, cargo y redes públicas; no es encuesta. Curva resta
          el % 2020 (noche) del % 2024 (certificado) solo si el escaño es el
          mismo. Cuatrienios parten del año de asunción citado; si no hay
          año, solo 2025–2028. Oferta es
          capital político (invertir / ofrecer / portero), no dinero. Las
          fichas solo publican hechos citados; el solape de pueblos es
          inferencia, no alianza.
        </p>
      </footer>
    </div>
  )
}

export default App
