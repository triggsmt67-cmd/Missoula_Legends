/**
 * Canonical links for the site's existing editorial stories.
 *
 * These are read-only rendering safeguards. They do not seed or update Payload.
 * New stories should use the CMS relationships; this map prevents known legacy
 * relationship mistakes from producing incorrect public links while those
 * records are corrected in the CMS.
 */
const BUSINESS_BY_ARTICLE_SLUG: Record<string, string> = {
  'the-shop-on-russell-street-has-been-putting-people-on-fish-for-30-years':
    'blackfoot-river-outfitters',
  'lolo-creek-distillery': 'lolo-creek-distillery',
  'under-the-cow-on-clements-road': 'the-trough-the-olde-dairy',
  'big-dipper-icecream': 'big-dipper-ice-cream',
  'distilling-montana-heritage-montgomery-distillery': 'montgomery-distillery',
  'forty-years-vinyl-weirdness-rockin-rudys': 'rockin-rudy-s',
  'black-coffee-was-building-toward-the-quonset-hut-all-along':
    'black-coffee-roasting-company',
}

const ARTICLE_BY_BUSINESS_SLUG = Object.fromEntries(
  Object.entries(BUSINESS_BY_ARTICLE_SLUG).map(([articleSlug, businessSlug]) => [
    businessSlug,
    articleSlug,
  ]),
) as Record<string, string>

export function getCanonicalBusinessSlug(articleSlug?: string): string | undefined {
  return articleSlug ? BUSINESS_BY_ARTICLE_SLUG[articleSlug] : undefined
}

export function getCanonicalArticleSlug(businessSlug?: string): string | undefined {
  return businessSlug ? ARTICLE_BY_BUSINESS_SLUG[businessSlug] : undefined
}

export function storyCanAppearForBusiness(
  articleSlug: string | undefined,
  businessSlug: string,
): boolean {
  const canonicalBusinessSlug = getCanonicalBusinessSlug(articleSlug)
  return !canonicalBusinessSlug || canonicalBusinessSlug === businessSlug
}
