import { describe, expect, it } from 'vitest'
import { PLAYBOOK } from '../data/playbook'
import { REPRESENTATIVES } from '../data/representatives'
import { playbookOf, playbookVisible } from './playbook'

describe('playbook de inversión y oferta', () => {
  it('tiene 16 fichas con ids del roster, sin huérfanos', () => {
    expect(PLAYBOOK).toHaveLength(16)
    const roster = new Set(REPRESENTATIVES.map((rep) => rep.id))
    const seen = new Set<string>()
    for (const entry of PLAYBOOK) {
      expect(roster.has(entry.id), entry.id).toBe(true)
      expect(seen.has(entry.id), entry.id).toBe(false)
      seen.add(entry.id)
    }
  })

  it('separa invertir, ofrecer y portero', () => {
    expect(playbookOf('wanda-del-valle-correa')?.book).toBe('invertir')
    expect(playbookOf('jose-conny-varela')?.book).toBe('ofrecer')
    expect(playbookOf('carlos-johnny-mendez-nunez')?.book).toBe('portero')
    expect(playbookOf('wanda-del-valle-correa')?.social).toMatch(/wanda_distrito38/)
    expect(playbookOf('jose-conny-varela')?.said).toMatch(/RC 352/)
  })

  it('respeta el filtro del roster', () => {
    const ppd = REPRESENTATIVES.filter((rep) => rep.party === 'PPD')
    const rows = playbookVisible(ppd)
    expect(rows.every((row) => row.rep.party === 'PPD')).toBe(true)
    expect(rows.some((row) => row.entry.id === 'gretchen-hau')).toBe(true)
    expect(rows.some((row) => row.entry.id === 'wanda-del-valle-correa')).toBe(false)
  })
})
