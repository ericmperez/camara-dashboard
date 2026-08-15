const ACCENTS: Record<string, string> = {
  á: 'a',
  é: 'e',
  í: 'i',
  ó: 'o',
  ú: 'u',
  ü: 'u',
  ñ: 'n',
  à: 'a',
  è: 'e',
  ì: 'i',
  ò: 'o',
  ù: 'u',
}

export function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[áéíóúüñàèìòù]/g, (char) => ACCENTS[char] ?? char)
    .replace(/['’«»"".,]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function initials(name: string): string {
  const parts = name
    .replace(/[''].*?['']/g, ' ')
    .split(/\s+/)
    .filter((part) => part.length > 1 && part !== 'de' && part !== 'del')
  const first = parts[0]?.[0] ?? '?'
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return `${first}${last}`.toUpperCase()
}

export function telHref(phone: string): string {
  const digits = phone.replace(/[^\d]/g, '')
  return `tel:+1${digits}`
}
