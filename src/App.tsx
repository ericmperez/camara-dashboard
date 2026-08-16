import { useEffect, useMemo, useState } from 'react'
import { FaceBoard } from './components/FaceBoard'
import { Ficha } from './components/Ficha'
import { Hemicycle } from './components/Hemicycle'
import { PartyBlock } from './components/PartyBlock'
import { RankBoard } from './components/RankBoard'
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
import { PARTIES } from './types'
import type { SeatKind } from './types'

type ChamberView = 'caras' | 'hemiciclo' | 'ranking' | 'ficha'

const VIEW_OPTIONS: { value: ChamberView; label: string }[] = [
  { value: 'caras', label: 'Caras' },
  { value: 'hemiciclo', label: 'Hemiciclo' },
  { value: 'ranking', label: 'Ranking' },
  { value: 'ficha', label: 'Ficha' },
]

const SEAT_OPTIONS: { value: SeatKind; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'distrito', label: 'Por distrito' },
  { value: 'acumulacion', label: 'Acumulación' },
]

function App() {
  const [filters, setFilters] = useState(emptyFilters)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [view, setView] = useState<ChamberView>('caras')

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

  function selectRep(id: string) {
    setSelectedId(id)
    setView('ficha')
  }

  useEffect(() => {
    if (!selectedId || view !== 'ficha') return
    document.getElementById('ficha')?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
      block: 'start',
    })
  }, [selectedId, view])

  return (
    <div className="page">
      <header className="masthead">
        <p className="eyebrow">Cámara de Representantes de Puerto Rico</p>
        <h1>Quién está sentado ahora</h1>
        <p className="lede">
          {ASSEMBLY} · cuatrienio {TERM}. {REPRESENTATIVES.length} representantes
          en el directorio oficial.
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
        {view === 'hemiciclo' ? (
          <Hemicycle
            reps={sorted}
            selectedId={selectedId}
            onSelect={selectRep}
            maxProjects={maxProjects}
          />
        ) : null}
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

      {view === 'ficha' ? (
        selected ? (
          <Ficha rep={selected} onSelect={selectRep} />
        ) : (
          <div className="empty" role="status">
            <p>Elige un representante para abrir su ficha.</p>
            <p>Las caras, el hemiciclo o el ranking llevan a la biografía citada, no inventada.</p>
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
          se inventa la parte electoral. Las fichas solo publican hechos
          citados; el solape de pueblos es inferencia, no alianza.
        </p>
      </footer>
    </div>
  )
}

export default App
