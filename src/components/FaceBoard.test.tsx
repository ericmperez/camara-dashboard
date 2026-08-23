import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { REPRESENTATIVES } from '../data/representatives'
import { FACE_LAYOUT, faceBoardFitsPhoneViewport } from '../lib/faceLayout'
import { maxProjectCount } from '../lib/strength'
import { FaceBoard } from './FaceBoard'

describe('FaceBoard compacto', () => {
  it('muestra 53 fichas delgadas bajo el contrato de una pantalla', () => {
    expect(faceBoardFitsPhoneViewport(REPRESENTATIVES.length)).toBe(true)
    const maxProjects = maxProjectCount(REPRESENTATIVES.map((rep) => rep.id))
    render(
      <FaceBoard
        reps={REPRESENTATIVES}
        maxProjects={maxProjects}
        selectedId={null}
        onSelect={() => {}}
      />,
    )
    const board = screen.getByLabelText(/caras: quién es cada uno/i)
    expect(board).toHaveAttribute('data-face-layout', 'one-screen')
    expect(board).toHaveAttribute('data-face-cols', String(FACE_LAYOUT.phoneColumns))
    expect(board).toHaveAttribute('data-face-card-max-h', String(FACE_LAYOUT.cardMaxHeight))
    expect(board).toHaveAttribute('data-face-gap', String(FACE_LAYOUT.gap))
    const cards = within(board).getAllByRole('article')
    expect(cards).toHaveLength(53)
    expect(cards.every((card) => card.classList.contains('face-card'))).toBe(true)
    expect(within(cards[0]).getByRole('heading').textContent?.length).toBeGreaterThan(0)
    expect(within(board).getAllByText('Azul').length).toBeGreaterThan(0)
    expect(within(board).getByText(/fuerza 100/i)).toBeInTheDocument()
  })
})
