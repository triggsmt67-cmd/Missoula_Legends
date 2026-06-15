export function getPlainText(data: any): string {
  if (!data) return ''
  if (typeof data === 'string') return data
  
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
