export type ProfileFAQ = {
  question: string
  answer: string
}

type ProfileSeoOverride = {
  seoTitle?: string
  shortDescription?: string
  fullAddress?: string
  latitude?: number
  longitude?: number
  historyHeading?: string
  historySummary?: string
  supplementalFaqs?: ProfileFAQ[]
}

/**
 * Read-only corrections for researched profiles whose production CMS records
 * are incomplete. CMS values take precedence wherever they are present.
 * Nothing in this file is written to PostgreSQL.
 */
const PROFILE_OVERRIDES: Record<string, ProfileSeoOverride> = {
  'the-trough-the-olde-dairy': {
    seoTitle: 'The Trough & The Olde Dairy | Target Range Restaurant & History',
    shortDescription:
      "The Trough & The Olde Dairy is a restaurant, neighborhood market, and gathering place at 2106 Clements Road in Missoula's Target Range area.",
    fullAddress: '2106 Clements Road, Missoula, MT 59804',
    latitude: 46.850889,
    longitude: -114.0807505,
    historyHeading: "From King's Dairy to The Trough",
    historySummary:
      "The property began as King's Dairy in the 1960s, became Dale's Dairy from 1973 to 2009, briefly operated as Target Range Market, and reopened as The Olde Dairy in 2014. The Trough restaurant followed in 2015. The 15-foot cow installed during the Dale's Dairy era has remained through every transition and is still the neighborhood landmark at Clements Road and North Avenue.",
    supplementalFaqs: [
      {
        question: 'What was The Olde Dairy before it became The Trough?',
        answer:
          "The property began as King's Dairy in the 1960s, operated as Dale's Dairy from 1973 to 2009, and then briefly became Target Range Market. Carter and Susan Beck reopened the market as The Olde Dairy in 2014 and opened The Trough restaurant in 2015.",
      },
      {
        question: 'What is the history of the cow at The Olde Dairy?',
        answer:
          "The 15-foot fiberglass cow was installed during the Dale's Dairy era. It survived each change in ownership and name and remains a Target Range landmark at the corner of Clements Road and North Avenue.",
      },
    ],
  },
}

export function getProfileSeoOverride(slug: string): ProfileSeoOverride | undefined {
  return PROFILE_OVERRIDES[slug]
}

export function mergeProfileFaqs(
  existing: ProfileFAQ[] | null | undefined,
  supplemental: ProfileFAQ[] | null | undefined,
): ProfileFAQ[] {
  const merged = [...(existing || [])]
  const seen = new Set(merged.map((faq) => faq.question.trim().toLowerCase()))

  for (const faq of supplemental || []) {
    const key = faq.question.trim().toLowerCase()
    if (!seen.has(key)) {
      merged.push(faq)
      seen.add(key)
    }
  }

  return merged
}
