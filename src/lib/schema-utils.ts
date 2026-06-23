export function stripMarkdown(text: string): string {
  if (!text) return ''
  return text
    .replace(/^#+\s+/gm, '') // headings
    .replace(/^\s*[-*+]\s+/gm, '') // lists
    .replace(/^\s*>\s*/gm, '') // blockquotes
    .replace(/---/g, '') // horizontal rules
    .replace(/\*\*(.*?)\*\*/g, '$1') // bold
    .replace(/\*(.*?)\*/g, '$1') // italic
    .replace(/__(.*?)__/g, '$1') // bold
    .replace(/_(.*?)_/g, '$1') // italic
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1') // links
    .replace(/`([^`]+)`/g, '$1') // code inline
    .replace(/\n+/g, ' ') // newlines to spaces
    .replace(/\s+/g, ' ') // normalize spaces
    .trim()
}

export function getPlainText(data: any): string {
  if (!data) return ''
  if (typeof data === 'string') {
    const trimmed = data.trim()
    if (trimmed.startsWith('{"root"') || trimmed.startsWith('{"children"')) {
      try {
        const parsed = JSON.parse(trimmed)
        return getPlainText(parsed)
      } catch (e) {
        // Fallback to stripMarkdown if parse fails
      }
    }
    return stripMarkdown(data)
  }
  
  try {
    let text = ''
    const traverse = (node: any) => {
      if (!node) return
      if (node.text && typeof node.text === 'string') {
        text += node.text
      }
      if (Array.isArray(node.children)) {
        node.children.forEach(traverse)
      }
    }
    
    if (data.root) {
      traverse(data.root)
    } else if (Array.isArray(data.children)) {
      data.children.forEach(traverse)
    }
    return text.trim()
  } catch (e) {
    console.error('Error extracting plain text from richText:', e)
    return ''
  }
}

export function decodeUrl(url?: string): string | undefined {
  if (!url) return undefined
  try {
    return decodeURIComponent(url)
  } catch (e) {
    return url
  }
}

export function getBusinessSchemaType(category: string): string {
  switch (category) {
    case 'food-drink': return 'FoodEstablishment'
    case 'shopping': return 'Store'
    case 'automotive': return 'AutoRepair'
    case 'auto-repair': return 'AutoRepair'
    case 'towing': return 'AutoRepair'
    case 'plumbing-hvac': return 'PlumbingService'
    case 'electrical': return 'Electrician'
    case 'septic-excavation': return 'HomeAndConstructionBusiness'
    case 'welding-fabrication': return 'HomeAndConstructionBusiness'
    case 'professional-services': return 'ProfessionalService'
    case 'health-wellness': return 'HealthAndBeautyBusiness'
    case 'home-lodging': return 'LodgingBusiness'
    case 'arts-culture': return 'EntertainmentBusiness'
    default: return 'LocalBusiness'
  }
}

export interface OpeningHoursSpec {
  '@type': 'OpeningHoursSpecification'
  dayOfWeek: string[]
  opens: string
  closes: string
}

export function parseOpeningHours(hoursStr?: string): OpeningHoursSpec | undefined {
  if (!hoursStr) return undefined
  
  try {
    const normalized = hoursStr.toLowerCase().replace(/\s+/g, '')
    // Match common format: mon-fri8:00am-5:00pm or mon–fri8:00am–5:00pm
    const match = normalized.match(/^(mon|tue|wed|thu|fri|sat|sun)[-–](mon|tue|wed|thu|fri|sat|sun)(\d{1,2}):?(\d{2})?(am|pm)[-–](\d{1,2}):?(\d{2})?(am|pm)$/)
    
    if (match) {
      const startDay = match[1]
      const endDay = match[2]
      const startHour = parseInt(match[3])
      const startMin = match[4] || '00'
      const startAmpm = match[5]
      const endHour = parseInt(match[6])
      const endMin = match[7] || '00'
      const endAmpm = match[8]

      const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
      const dayAbbrs = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
      
      const startIdx = dayAbbrs.indexOf(startDay)
      const endIdx = dayAbbrs.indexOf(endDay)
      
      if (startIdx === -1 || endIdx === -1) return undefined
      
      const dayOfWeek: string[] = []
      let curr = startIdx
      while (curr !== (endIdx + 1) % 7) {
        dayOfWeek.push(days[curr].charAt(0).toUpperCase() + days[curr].slice(1))
        curr = (curr + 1) % 7
        if (curr === startIdx) break
      }

      const formatTime = (hour: number, min: string, ampm: string) => {
        let h = hour
        if (ampm === 'pm' && h < 12) h += 12
        if (ampm === 'am' && h === 12) h = 0
        return `${h.toString().padStart(2, '0')}:${min}`
      }

      return {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek,
        opens: formatTime(startHour, startMin, startAmpm),
        closes: formatTime(endHour, endMin, endAmpm),
      }
    }
  } catch (e) {
    console.warn('Error parsing opening hours:', e)
  }
  return undefined
}
