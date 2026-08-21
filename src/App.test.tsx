import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import App from './App'
import { REPRESENTATIVES } from './data/representatives'

afterEach(() => cleanup())

describe('dashboard de la Cámara', () => {
  it('muestra el hemiciclo, el recuento y a los 53 representantes', () => {
    render(<App />)
    expect(
      screen.getByRole('heading', { name: /quién está sentado ahora/i }),
    ).toBeInTheDocument()
    expect(screen.getByText('53 representantes')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /36\s+PNP/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /méndez/i })).toBeInTheDocument()
    expect(screen.getAllByRole('article')).toHaveLength(53)
    expect(screen.getAllByText('Azul').length).toBeGreaterThan(0)
    expect(screen.getByText(/fuerza 100/i)).toBeInTheDocument()
  })

  it('cambia entre caras, hemiciclo, ranking, ficha y conexiones', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Hemiciclo' }))
    const hemicycle = screen.getByLabelText(/hemiciclo de la cámara/i)
    expect(hemicycle.querySelectorAll('img')).toHaveLength(53)
    await user.click(screen.getByRole('button', { name: 'Ranking' }))
    const ranking = screen.getByLabelText(/ranking por fuerza/i)
    expect(within(ranking).getAllByRole('article')[0]).toHaveTextContent(/méndez/i)
    expect(within(ranking).getAllByRole('article')[0]).toHaveTextContent('100')
    await user.click(screen.getByRole('button', { name: 'Ficha' }))
    expect(screen.getByRole('status')).toHaveTextContent(/elige un representante para ver su ficha/i)
    await user.click(screen.getByRole('button', { name: 'Conexiones' }))
    expect(screen.getByRole('status')).toHaveTextContent(/elige un representante para ver sus conexiones/i)
    await user.click(screen.getByRole('button', { name: 'Caras' }))
    expect(screen.getAllByRole('article')).toHaveLength(53)
  })

  it('busca por pueblo y deja solo al titular de ese distrito', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(
      screen.getByRole('searchbox', { name: /buscar por nombre/i }),
      'Vieques',
    )
    const cards = screen.getAllByRole('article')
    expect(cards).toHaveLength(1)
    expect(within(cards[0]).getByRole('heading')).toHaveTextContent(/Méndez/)
    expect(screen.getByText(/1 de 53/)).toBeInTheDocument()
  })

  it('muestra empty state cuando no hay resultados y permite limpiar', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(
      screen.getByRole('searchbox', { name: /buscar por nombre/i }),
      'xyzzy-no-existe',
    )
    expect(screen.getByRole('status')).toHaveTextContent(/nadie coincide/i)
    await user.click(screen.getByRole('button', { name: /ver a los 53/i }))
    expect(screen.getAllByRole('article')).toHaveLength(53)
  })

  it('filtra por partido desde el recuento', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /3\s+PIP/i }))
    expect(screen.getAllByRole('article')).toHaveLength(3)
    expect(screen.getAllByText(/PIP/).length).toBeGreaterThan(0)
  })

  it('parte los 40 de distrito entre PNP y populares, y deja a PIP y PD en cero', async () => {
    const user = userEvent.setup()
    render(<App />)
    const split = screen.getByLabelText(/40 escaños de distrito por partido/i)
    expect(within(split).getByText('30')).toBeInTheDocument()
    expect(within(split).getByText('Populares')).toBeInTheDocument()
    expect(within(split).getByText('10')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Hemiciclo' }))
    await user.click(screen.getByRole('button', { name: /por distrito/i }))
    expect(screen.getAllByRole('article')).toHaveLength(40)
    expect(screen.getByRole('heading', { name: /partido nuevo progresista/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /populares/i })).toBeInTheDocument()
    expect(screen.getAllByText(/ningún escaño de distrito/i)).toHaveLength(2)
  })

  it('enseña en la ficha por cuántos votos ganó, con enlace al evento de la CEE', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Hemiciclo' }))
    const heading = screen.getByRole('heading', { name: /charbonier/i })
    const card = heading.closest('article') as HTMLElement
    expect(within(card).getByText(/10[.,]?961/)).toBeInTheDocument()
    expect(within(card).getByRole('link', { name: /elecciones generales/i })).toHaveAttribute(
      'href',
      expect.stringContaining('elecciones2024.ceepur.org'),
    )
    const d31 = screen.getByRole('heading', { name: /lópez román/i }).closest('article') as HTMLElement
    expect(within(d31).getByText(/677/)).toBeInTheDocument()
    expect(within(d31).getByRole('link', { name: /especial/i })).toHaveAttribute(
      'href',
      expect.stringContaining('representantedistrito31'),
    )
  })

  it('lista en cada ficha los proyectos de ley sacados de SUTRA', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Hemiciclo' }))
    const heading = screen.getByRole('heading', { name: /méndez/i })
    const card = heading.closest('article') as HTMLElement
    expect(within(card).getByText(/proyectos de ley/i)).toBeInTheDocument()
    expect(within(card).getAllByRole('link', { name: /^PC/i }).length).toBeGreaterThan(0)
    expect(within(card).getByRole('link', { name: /expediente en sutra/i })).toHaveAttribute(
      'href',
      expect.stringContaining('sutra.oslpr.org'),
    )
  })

  it('escribe el perfil político en la ficha, no solo las siglas', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Hemiciclo' }))
    const heading = screen.getByRole('heading', { name: /méndez/i })
    const card = heading.closest('article')
    expect(card).toBeTruthy()
    expect(within(card as HTMLElement).getAllByText(/estadidad/i).length).toBeGreaterThan(0)
    expect(within(card as HTMLElement).getByText(/preside la cámara/i)).toBeInTheDocument()
  })

  it('no inventa un correo cuando el directorio no lo publica', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Hemiciclo' }))
    const gabriel = REPRESENTATIVES.find((r) => r.email === null)!
    const heading = screen.getByRole('heading', { name: gabriel.name })
    const card = heading.closest('article')
    expect(card).toBeTruthy()
    expect(within(card as HTMLElement).queryByRole('link', { name: /@/ })).toBeNull()
    expect(within(card as HTMLElement).getByText(gabriel.phone!)).toBeInTheDocument()
  })

  it('seleccionar en Caras no cambia de vista; Ficha y Conexiones son pestañas', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('heading', { name: /lópez román/i }))
    expect(screen.getAllByRole('article')).toHaveLength(53)
    expect(screen.queryByLabelText(/ficha de/i)).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Ficha' }))
    const ficha = screen.getByLabelText(/ficha de/i)
    expect(ficha).toHaveTextContent(/Vimarie Peña Dávila/)
    expect(ficha).toHaveTextContent(/677/)
    expect(within(ficha).getByRole('link', { name: /escrutinio CEE/i })).toHaveAttribute(
      'href',
      expect.stringContaining('representantedistrito31'),
    )
    expect(within(ficha).getByRole('link', { name: /WIPR/i })).toHaveAttribute(
      'href',
      expect.stringContaining('wipr.pr'),
    )
    expect(within(ficha).getByRole('link', { name: /expediente en sutra/i })).toHaveAttribute(
      'href',
      expect.stringContaining('sutra.oslpr.org'),
    )
    expect(ficha).toHaveTextContent(/Trabajo y Asuntos Laborales/)
    expect(within(ficha).getByText('INFERENCIA')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Conexiones' }))
    const red = screen.getByLabelText(/^conexiones de/i)
    expect(within(red).getAllByText('INFERENCIA').length).toBeGreaterThan(0)
    expect(within(red).getAllByText(/pueblos en común/i).length).toBeGreaterThan(0)
    expect(within(red).getByLabelText(/grafo de conexiones/i)).toBeInTheDocument()
  })

  it('deja vacía la ficha si no hay hecho verificado', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('heading', { name: /swanny/i }))
    await user.click(screen.getByRole('button', { name: 'Ficha' }))
    const ficha = screen.getByLabelText(/ficha de/i)
    expect(within(ficha).getByText(/sin biografía verificada/i)).toBeInTheDocument()
    expect(within(ficha).getByText(/sin trayectoria citada/i)).toBeInTheDocument()
    expect(within(ficha).getByText(/vacío a propósito/i)).toBeInTheDocument()
  })

  it('no inventa un porcentaje para escaños de minorías sin voto', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('heading', { name: /adriana gutiérrez/i }))
    await user.click(screen.getByRole('button', { name: 'Ficha' }))
    const ficha = screen.getByLabelText(/ficha de/i)
    const votes = within(ficha).getByRole('heading', { name: /votos \(cee\)/i }).parentElement as HTMLElement
    expect(votes).toHaveTextContent(/ley de minorías/i)
    expect(votes).not.toHaveTextContent(/%/)
  })

  it('el atajo de distrito 1 no arrastra al 10 ni al 11', async () => {
    const user = userEvent.setup()
    render(<App />)
    const strip = screen.getByRole('region', { name: /ir a un distrito/i })
    await user.click(within(strip).getByRole('button', { name: '1' }))
    const cards = screen.getAllByRole('article')
    expect(cards).toHaveLength(1)
    expect(within(cards[0]).getAllByText(/Distrito 1/).length).toBeGreaterThan(0)
    expect(within(cards[0]).queryByText(/Distrito 10/)).not.toBeInTheDocument()
    expect(within(cards[0]).getByRole('heading')).toHaveTextContent(/Charbonier/)
  })
})
