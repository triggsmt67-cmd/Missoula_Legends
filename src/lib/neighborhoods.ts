export const NEIGHBORHOOD_OPTIONS = [
  { label: 'Downtown', value: 'downtown' },
  { label: 'Hip Strip', value: 'hip-strip' },
  { label: 'Slant Streets', value: 'slant-streets' },
  { label: 'University District', value: 'university-district' },
  { label: 'Northside', value: 'northside' },
  { label: 'Westside', value: 'westside' },
  { label: 'Rattlesnake', value: 'rattlesnake' },
  { label: 'Grant Creek', value: 'grant-creek' },
  { label: 'Orchard Homes / Target Range', value: 'orchard-homes-target-range' },
  { label: 'Rose Park', value: 'rose-park' },
  { label: 'Miller Creek / Linda Vista', value: 'miller-creek-linda-vista' },
  { label: 'South Hills', value: 'south-hills' },
  { label: 'East Missoula', value: 'east-missoula' },
  { label: 'Bonner-Milltown', value: 'bonner-milltown' },
  { label: 'Lolo', value: 'lolo' },
  { label: 'Wye', value: 'wye' },
  { label: 'Southgate Triangle', value: 'southgate-triangle' },
  { label: 'Midtown', value: 'midtown' },
  { label: 'Franklin to the Fort', value: 'franklin-to-the-fort' },
  { label: 'Airport', value: 'airport' },
  { label: 'Greater Missoula / Regional', value: 'greater-missoula' },
  { label: 'Victor', value: 'victor' },
  { label: 'Regional Montana', value: 'regional-montana' },
]

export const NEIGHBORHOOD_LABELS: Record<string, string> = Object.fromEntries(
  NEIGHBORHOOD_OPTIONS.map(({ value, label }) => [value, label]),
)

const aliases: Record<string, string> = {
  'lower rattlesnake': 'rattlesnake', 'upper rattlesnake': 'rattlesnake',
  'orchard homes': 'orchard-homes-target-range', 'target range': 'orchard-homes-target-range',
  'miller creek': 'miller-creek-linda-vista', 'linda vista': 'miller-creek-linda-vista',
  'bonner': 'bonner-milltown', 'milltown': 'bonner-milltown',
  'greater missoula': 'greater-missoula', 'missoula service area': 'greater-missoula',
}
const candidates = [
  ...Object.entries(aliases),
  ...NEIGHBORHOOD_OPTIONS.flatMap(({ label, value }) => [[label, value], [value, value]]),
].map(([label, value]) => ({ label: normalize(label), value }))
function normalize(value: string): string {
  return value.toLowerCase().replace(/[-–—/]+/g, ' ').replace(/\s+/g, ' ').trim()
}
// For composite text, use the first explicitly named neighborhood. Never infer from ZIP/service area.
export function mapNeighborhood(value: string): string | undefined {
  const normalized = normalize(value)
  const exact = candidates.find(({ label }) => label === normalized)
  if (exact) return exact.value
  const matches = candidates.flatMap(({ label, value }) => {
    const index = normalized.indexOf(label)
    if (index < 0 || (index > 0 && /[a-z]/.test(normalized[index - 1])) ||
        /[a-z]/.test(normalized[index + label.length] || '')) return []
    return [{ index, label, value }]
  }).sort((a, b) => a.index - b.index || b.label.length - a.label.length)
  return matches[0]?.value
}
