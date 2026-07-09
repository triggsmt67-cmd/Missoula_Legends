import { getPayload } from 'payload'
import config from '@payload-config'
import { SafeImage } from '@/components/SafeImage'
import { FeaturedImage } from '@/components/FeaturedImage'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { RichText } from '@/components/RichText'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { getPlainText } from '@/lib/schema-utils'
import { isPayloadConfigured } from '@/lib/runtime-config'

export const revalidate = 14400

const BASE_URL = 'https://www.missoulalegends.com'

const CATEGORY_LABELS: { [key: string]: string } = {
  'food-drink': 'Food & Drink',
  shopping: 'Shopping',
  lifestyle: 'Lifestyle',
  automotive: 'Automotive',
  'professional-services': 'Professional Services',
  'health-wellness': 'Health & Wellness',
  'arts-culture': 'Arts & Culture',
  'home-lodging': 'Home & Lodging',
  'septic-excavation': 'Septic & Excavation',
  'auto-repair': 'Auto Repair',
  'plumbing-hvac': 'Plumbing & HVAC',
  'electrical': 'Electrical',
  'towing': 'Towing',
  'welding-fabrication': 'Welding & Fabrication',
}

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  if (isPayloadConfigured()) {
    try {
      const payload = await getPayload({ config })
      const res = await payload.find({
        collection: 'articles',
        depth: 0,
        limit: 1000,
        where: {
          _status: { equals: 'published' },
        },
      })

      return res.docs
        .map((doc: any) => doc.slug)
        .filter((slug: unknown): slug is string => typeof slug === 'string' && slug.length > 0)
        .map((slug) => ({ slug }))
    } catch (error) {
      console.warn('Unable to pre-render article paths.', error)
    }
  }

  return []
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params

  if (!isPayloadConfigured()) {
    return {
      title: 'Article',
      description: 'Read the latest stories from Missoula Legends.',
    }
  }
  
  try {
    const payload = await getPayload({ config })
    const res = await payload.find({
      collection: 'articles',
      where: { slug: { equals: slug } },
      depth: 1,
      limit: 1,
    })
    
    if (res.docs.length > 0) {
      const article = res.docs[0] as any
      const plainText = getPlainText(article.content)
      const description = plainText.slice(0, 160).trimEnd() + (plainText.length > 160 ? '...' : '')
      const imageUrl = article.heroImage?.url
        ? (article.heroImage.url.startsWith('http') ? article.heroImage.url : `${BASE_URL}${article.heroImage.url}`)
        : `${BASE_URL}/media/missoula-hero-twilight.webp`
      
      return {
        title: article.title,
        description,
        alternates: { canonical: `/articles/${slug}` },
        openGraph: {
          type: 'article',
          url: `${BASE_URL}/articles/${slug}`,
          title: article.title,
          description,
          images: [{ url: imageUrl, width: 1200, height: 630, alt: article.heroImage?.alt || article.title }],
          siteName: 'Missoula Legends',
        },
        twitter: {
          card: 'summary_large_image',
          title: article.title,
          description,
          images: [imageUrl],
        },
      }
    }
  } catch (e) {
    // fall through to generic metadata below
  }

  return {
    title: 'Article',
    description: 'Read the latest stories from Missoula Legends.',
  }
}

function decodeUrl(url?: string): string | undefined {
  if (!url) return undefined
  try {
    return decodeURIComponent(url)
  } catch (e) {
    return url
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const { slug } = resolvedParams

  let article: any = null
  let curatorProfile: any = null
  if (!isPayloadConfigured()) {
    notFound()
  }

  try {
    const payload = await getPayload({ config })
    const res = await payload.find({
      collection: 'articles',
      where: {
        slug: {
          equals: slug,
        },
      },
      depth: 2,
    })

    if (res.docs.length > 0) {
      article = res.docs[0]
    }

    try {
      curatorProfile = await payload.findGlobal({ slug: 'curator-profile', depth: 1 })
    } catch (e) {
      // ignore
    }
  } catch (error: any) {
    if (isPayloadConfigured()) {
      console.warn('Unable to load article content.', error.message)
    }
  }

  if (!article) {
    notFound()
  }

  const relatedCategories = Array.from(
    new Set(
      (article.relatedBusiness || [])
        .map((biz: any) => typeof biz === 'object' && biz?.category)
        .filter(Boolean)
    )
  ) as string[]

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Recent'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  // Simple reading time estimator based on RichText structure
  const getReadingTime = (content: any) => {
    try {
      const text = JSON.stringify(content);
      const wordCount = text.split(/\s+/).length || 0;
      return Math.max(3, Math.ceil(wordCount / 240)); // ~240 words per minute, min 3 min
    } catch (e) {
      return 5;
    }
  }

  const minRead = getReadingTime(article.content);

  const articleImageUrl = decodeUrl(article.heroImage?.sizes?.featureHero?.url) ||
    decodeUrl(article.heroImage?.url) ||
    '/media/missoula-hero-twilight.webp'
  const absoluteImageUrl = articleImageUrl.startsWith('http') ? articleImageUrl : `https://www.missoulalegends.com${articleImageUrl}`

  const articleBody = getPlainText(article.content)

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      'headline': article.title,
      'image': absoluteImageUrl,
      'datePublished': article.createdAt || new Date().toISOString(),
      'dateModified': article.updatedAt || article.createdAt || new Date().toISOString(),
      'author': {
        '@type': 'Person',
        'name': curatorProfile?.name || 'Trevor Riggs',
        'jobTitle': curatorProfile?.title || 'Missoula Legends Curator',
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'Missoula Legends',
        'logo': {
          '@type': 'ImageObject',
          'url': 'https://www.missoulalegends.com/media/missoula-historical-map-panoramic.png',
        },
      },
      'description': articleBody.slice(0, 160) + (articleBody.length > 160 ? '...' : ''),
      'articleBody': articleBody,
      'mainEntityOfPage': `https://www.missoulalegends.com/articles/${slug}`,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Home',
          'item': 'https://www.missoulalegends.com',
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': 'Stories',
          'item': 'https://www.missoulalegends.com/stories',
        },
        {
          '@type': 'ListItem',
          'position': 3,
          'name': article.title,
          'item': `https://www.missoulalegends.com/articles/${slug}`,
        },
      ],
    }
  ]

  return (
    <div className="min-h-screen bg-ivory-paper dark:bg-soft-black text-soft-black dark:text-ivory-paper font-sans selection:bg-warm-limestone dark:selection:bg-smoked-olive/40 transition-colors duration-300">
      {/* Schema Markup for Google and Search Engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
            
      {/* Header Navigation */}
      <Header />

      {/* Article Header Section */}
      <section className="relative bg-gradient-to-b from-[#fbf9f4] to-[#f6f2e7] dark:from-slate-900/40 dark:to-slate-950/20 border-b-2 border-double border-warm-limestone/80 dark:border-warm-limestone/25 py-24 md:py-32 text-center overflow-hidden">
        {/* Map Background Watermark */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.075] dark:opacity-[0.068] pointer-events-none mix-blend-multiply dark:mix-blend-screen bg-cover bg-center bg-no-repeat transition-opacity duration-300"
          style={{ backgroundImage: 'url("/media/missoula-historical-map-panoramic.png")' }}
        />
        {/* Subtle coordinate grid overlay */}
        <div className="absolute inset-0 z-0 opacity-[0.015] dark:opacity-[0.01] pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:32px_32px]" />
        
        <div className="relative z-10 max-w-[950px] mx-auto px-6">
          <div className="flex items-center justify-center gap-3 mb-6 animate-fade-in">
            <span className="h-px w-8 bg-aged-brass/30"></span>
            <span className="font-mono text-aged-brass tracking-[0.3em] text-[10px] sm:text-xs uppercase font-bold bg-[#FAF8F5]/80 dark:bg-blue-black/40 border border-warm-limestone/60 dark:border-warm-limestone/15 px-4 py-1.5 rounded-md backdrop-blur-sm shadow-sm">
              LOCAL STORIES
            </span>
            <span className="h-px w-8 bg-aged-brass/30"></span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6.5xl font-serif font-normal tracking-tight text-deep-spruce dark:text-ivory-paper leading-[1.15] max-w-[850px] mx-auto animate-fade-in [animation-delay:50ms]">
            {article.title}
          </h1>
        </div>
      </section>

      {/* Hero Image Section with Photo Frame */}
      <section className="max-w-[1200px] mx-auto px-6 -mt-12 md:-mt-16 relative z-10 animate-fade-in [animation-delay:100ms]">
        <div className="p-3 bg-white dark:bg-blue-black border border-warm-limestone/60 dark:border-warm-limestone/15 rounded-sm shadow-xl">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-none bg-slate-950 border border-warm-limestone/30 dark:border-warm-limestone/10">
            <SafeImage
              src={
                decodeUrl(article.heroImage?.sizes?.featureHero?.url) ||
                decodeUrl(article.heroImage?.url) ||
                '/media/missoula-hero-twilight.webp'
              }
              alt={article.heroImage?.alt || article.title}
              fill
              priority
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-cover object-center scale-100 hover:scale-103 transition-transform duration-1000 ease-out"
              fallbackSrc="/media/missoula-hero-twilight.webp"
            />
            {/* Fine overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/15 via-transparent to-slate-950/5 pointer-events-none" />
          </div>
        </div>
      </section>

      {/* Elegant Editorial Separator */}
      <div className="max-w-[1200px] mx-auto px-6 my-16 md:my-20 flex items-center justify-center gap-4 animate-fade-in [animation-delay:150ms]">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-warm-limestone dark:via-warm-limestone/20 to-warm-limestone dark:to-warm-limestone/10" />
        <span className="text-aged-brass/80 text-xl select-none font-serif leading-none">❦</span>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent via-warm-limestone dark:via-warm-limestone/20 to-warm-limestone dark:to-warm-limestone/10" />
      </div>

      {/* Main Content Layout with Sidebar */}
      <section className="max-w-[1200px] mx-auto px-6 pb-24 md:pb-36 animate-fade-in [animation-delay:200ms]">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Article Body */}
          <div className="flex-1 max-w-[800px] w-full text-left">
            
            {/* Author/Reading Time Meta Row */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-10 border-b border-warm-limestone/60 dark:border-warm-limestone/15 text-warm-stone text-xs font-mono">
              <div className="flex items-center gap-3">
                <span className="uppercase tracking-wider font-semibold text-deep-spruce dark:text-ivory-paper">
                  By Trevor Riggs
                </span>
                <span className="text-warm-limestone dark:text-warm-limestone/25">|</span>
                <span className="text-warm-stone/80">
                  Missoula Legends Curator
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-aged-brass" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="uppercase tracking-wider font-semibold">{minRead} MIN READ</span>
                </div>
              </div>
            </div>

            <div className="prose prose-slate dark:prose-invert prose-lg md:prose-xl font-normal leading-relaxed prose-headings:font-serif prose-headings:font-semibold prose-headings:text-deep-spruce dark:prose-headings:text-ivory-paper prose-p:text-soft-black dark:prose-p:text-warm-stone/95 prose-a:text-oxblood-brown dark:prose-a:text-aged-brass prose-a:underline hover:prose-a:text-deep-spruce dark:hover:prose-a:text-ivory-paper prose-img:rounded-sm prose-img:border prose-img:border-warm-limestone/60 prose-p:first-of-type:first-letter:text-6xl prose-p:first-of-type:first-letter:font-serif prose-p:first-of-type:first-letter:font-normal prose-p:first-of-type:first-letter:float-left prose-p:first-of-type:first-letter:mr-3 prose-p:first-of-type:first-letter:mt-1.5 prose-p:first-of-type:first-letter:text-oxblood-brown dark:prose-p:first-of-type:first-letter:text-aged-brass prose-p:first-of-type:first-letter:leading-none prose-blockquote:border-aged-brass prose-blockquote:font-serif prose-blockquote:italic prose-blockquote:bg-warm-limestone/20 dark:prose-blockquote:bg-blue-black/20 prose-blockquote:px-6 prose-blockquote:py-2 prose-blockquote:rounded-r-sm">
              <RichText data={article.content} />
            </div>

            {/* Editorial Gallery Grid */}
            {article.galleryImages && article.galleryImages.length > 0 && (
              <div className="mt-16 md:mt-24 border-t border-warm-limestone/45 dark:border-warm-limestone/15 pt-12">
                <span className="font-mono text-aged-brass tracking-[0.25em] text-[10px] uppercase font-bold mb-6 block w-fit bg-warm-limestone/30 dark:bg-slate-900/40 px-3 py-1 rounded-full">
                  Interior & Gallery
                </span>
                
                {article.galleryImages.length === 1 && (
                  <div className="p-2.5 bg-white dark:bg-blue-black border border-warm-limestone/60 dark:border-warm-limestone/15 rounded-sm shadow-md">
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-900 border border-warm-limestone/30 dark:border-warm-limestone/10">
                      <SafeImage
                        src={decodeUrl(article.galleryImages[0].url) || '/media/placeholder.jpg'}
                        alt={article.galleryImages[0].alt || 'Gallery image'}
                        fill
                        sizes="(max-width: 800px) 100vw, 800px"
                        className="object-cover image-zoom-hover"
                        fallbackSrc="/media/placeholder.jpg"
                      />
                    </div>
                  </div>
                )}

                {article.galleryImages.length === 2 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {article.galleryImages.map((img: any, idx: number) => (
                      <div key={img.id || idx} className="p-2.5 bg-white dark:bg-blue-black border border-warm-limestone/60 dark:border-warm-limestone/15 rounded-sm shadow-md animate-fade-in">
                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-900 border border-warm-limestone/30 dark:border-warm-limestone/10">
                          <SafeImage
                            src={decodeUrl(img.url) || '/media/placeholder.jpg'}
                            alt={img.alt || 'Gallery image'}
                            fill
                            sizes="(max-width: 600px) 100vw, 400px"
                            className="object-cover image-zoom-hover"
                            fallbackSrc="/media/placeholder.jpg"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {article.galleryImages.length >= 3 && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                    {/* Left Column: Big Feature Photo (2/3 width) */}
                    <div className="md:col-span-8 flex">
                      <div className="p-2.5 bg-white dark:bg-blue-black border border-warm-limestone/60 dark:border-warm-limestone/15 rounded-sm shadow-md w-full flex flex-col justify-between">
                        <div className="relative aspect-[4/3] md:aspect-auto md:h-full w-full min-h-[320px] overflow-hidden bg-slate-100 dark:bg-slate-900 border border-warm-limestone/30 dark:border-warm-limestone/10">
                          <SafeImage
                            src={decodeUrl(article.galleryImages[0].url) || '/media/placeholder.jpg'}
                            alt={article.galleryImages[0].alt || 'Gallery image'}
                            fill
                            sizes="(max-width: 800px) 100vw, 550px"
                            className="object-cover image-zoom-hover"
                            fallbackSrc="/media/placeholder.jpg"
                          />
                        </div>
                      </div>
                    </div>
                    {/* Right Column: Two Stacked Photos (1/3 width) */}
                    <div className="md:col-span-4 flex flex-col gap-6">
                      {article.galleryImages.slice(1, 3).map((img: any, idx: number) => (
                        <div key={img.id || idx} className="p-2.5 bg-white dark:bg-blue-black border border-warm-limestone/60 dark:border-warm-limestone/15 rounded-sm shadow-md flex-1 flex flex-col">
                          <div className="relative aspect-[4/3] w-full flex-grow overflow-hidden bg-slate-100 dark:bg-slate-900 border border-warm-limestone/30 dark:border-warm-limestone/10 min-h-[140px]">
                            <SafeImage
                              src={decodeUrl(img.url) || '/media/placeholder.jpg'}
                              alt={img.alt || 'Gallery image'}
                              fill
                              sizes="(max-width: 600px) 100vw, 250px"
                              className="object-cover image-zoom-hover"
                              fallbackSrc="/media/placeholder.jpg"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}


            {/* Date at the bottom of the article */}
            <div className="mt-12 pt-6 border-t border-warm-limestone/55 dark:border-warm-limestone/15 text-xs font-mono uppercase tracking-wider text-warm-stone flex justify-between items-center">
              <span>Published on {formatDate(article.createdAt)}</span>
              <span className="text-aged-brass/70">❦</span>
            </div>

            {/* Back to Stories link */}
            <div className="mt-8 pt-8 border-t border-warm-limestone/55 dark:border-warm-limestone/15">
              <Link 
                href="/stories" 
                className="group inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest font-bold text-warm-stone hover:text-deep-spruce dark:hover:text-ivory-paper transition-colors"
              >
                <span className="transform group-hover:-translate-x-1 transition-transform duration-300">&larr;</span> Back to Stories
              </Link>
            </div>
          </div>

          {/* Right Column: Sidebar (w-full lg:w-[320px]) */}
          <aside className="w-full lg:w-[320px] shrink-0 lg:sticky lg:top-28 flex flex-col gap-8 animate-fade-in [animation-delay:250ms] text-left">
            
            {/* Sidebar Box 1: Curator Profile Card */}
            <div className="relative bg-[#FAF7F2] dark:bg-blue-black/30 border border-warm-limestone/60 dark:border-warm-limestone/15 p-8 rounded-sm shadow-sm overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none opacity-[0.03] dark:opacity-[0.01]">
                <svg viewBox="0 0 100 100" fill="currentColor">
                  <path d="M0,0 L100,0 L100,100 Z" />
                </svg>
              </div>
              <h3 className="font-mono text-[10px] uppercase tracking-widest font-bold text-warm-stone mb-6 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-aged-brass" />
                Curator Spotlight
              </h3>
              <p className="text-sm text-soft-black dark:text-ivory-paper/78 font-serif font-normal leading-relaxed mb-6 italic">
                "{curatorProfile?.bio || 'Trevor Riggs has spent years helping Montana businesses tell clearer stories, reach the right people, and turn attention into real customers.'}"
              </p>
              <div className="flex items-center gap-4 pt-4 border-t border-warm-limestone/60 dark:border-warm-limestone/15">
                <div className="w-12 h-12 rounded-full overflow-hidden relative border-2 border-white dark:border-slate-800 shadow-md">
                  <SafeImage
                    src={
                      decodeUrl(curatorProfile?.photo?.sizes?.thumbnail?.url) ||
                      decodeUrl(curatorProfile?.photo?.url) ||
                      '/media/missoula-curator.jpg'
                    }
                    alt={curatorProfile?.name || 'Trevor Riggs'}
                    fill
                    sizes="48px"
                    className="object-cover object-center"
                    fallbackSrc="/media/missoula-curator.jpg"
                  />
                </div>
                <div>
                  <div className="text-sm font-semibold text-deep-spruce dark:text-white font-serif">
                    {curatorProfile?.name || 'Trevor Riggs'}
                  </div>
                  <div className="text-[9px] uppercase tracking-widest font-mono text-aged-brass font-bold mt-0.5">
                    {curatorProfile?.title ? curatorProfile.title.split('•')[0].trim() : 'Missoula Curator'}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Box 2: Related Businesses (Featured Places) */}
            {article.relatedBusiness && article.relatedBusiness.length > 0 && (
              <div className="bg-white dark:bg-[#17231D]/10 border border-warm-limestone/60 dark:border-warm-limestone/15 p-8 rounded-sm shadow-sm flex flex-col gap-6">
                <h3 className="font-mono text-[10px] uppercase tracking-widest font-bold text-warm-stone flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-aged-brass" />
                  Featured Places
                </h3>
                <div className="flex flex-col gap-5">
                  {article.relatedBusiness.map((biz: any) => {
                    const bizName = typeof biz === 'string' ? biz : biz.businessName;
                    if (!bizName) return null;
                    const bizId = typeof biz === 'string' ? null : biz.id;
                    const bizCategory = typeof biz === 'string' ? null : biz.category;
                    const bizNeighborhood = typeof biz === 'string' ? null : biz.neighborhood;
                    const bizImgUrl = typeof biz === 'string' ? null : (biz.featuredImage?.sizes?.thumbnail?.url || biz.featuredImage?.url);
                    const bizWebsite = typeof biz === 'string' ? null : biz.contactInfo?.website;
                    const bizSlug = typeof biz === 'string' 
                      ? bizName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') 
                      : (biz.slug || bizName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                    
                    return (
                      <div key={bizId || bizName} className="flex gap-4 items-center group/biz p-2 -mx-2 rounded-sm hover:bg-warm-limestone/25 dark:hover:bg-blue-black/30 transition-all duration-300">
                        <Link href={`/directory/${bizSlug}`} className="w-14 h-14 rounded-sm overflow-hidden relative shrink-0 border border-warm-limestone/60 dark:border-warm-limestone/20 shadow-sm block">
                            <FeaturedImage
                              src={decodeUrl(bizImgUrl) || ''}
                              alt={bizName}
                              businessName={bizName}
                              category={bizCategory || undefined}
                              priority={false}
                              sizes="56px"
                              className="object-cover group-hover/biz:scale-105 transition-transform duration-550"
                            />
                          </Link>
                        <div className="flex-grow min-w-0 text-left">
                          <Link href={`/directory/${bizSlug}`} className="block">
                            <h4 className="text-sm font-serif font-semibold text-deep-spruce dark:text-white truncate group-hover/biz:text-oxblood-brown dark:group-hover/biz:text-aged-brass transition-colors hover:underline">
                              {bizName}
                            </h4>
                          </Link>
                          <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-0.5 items-center">
                            {bizNeighborhood && (
                              <span className="text-[10px] font-mono uppercase tracking-wider text-warm-stone capitalize">
                                {bizNeighborhood.replace(/-/g, ' ')}
                              </span>
                            )}
                            {bizNeighborhood && bizCategory && (
                              <span className="text-[10px] text-warm-stone/50">•</span>
                            )}
                            {bizCategory && (
                              <span className="text-[9px] font-mono text-aged-brass font-bold uppercase tracking-wider">
                                {bizCategory.replace(/-/g, ' ')}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1.5">
                            <Link 
                              href={`/directory/${bizSlug}`}
                              className="inline-flex items-center gap-0.5 text-[10px] font-mono font-bold text-oxblood-brown dark:text-aged-brass hover:underline"
                            >
                              Profile &rarr;
                            </Link>
                            {bizWebsite && (
                              <>
                                <span className="text-[9px] text-warm-stone/40 font-mono">•</span>
                                <a 
                                  href={bizWebsite.startsWith('http') ? bizWebsite : `https://${bizWebsite}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-0.5 text-[10px] font-mono font-bold text-warm-stone hover:text-oxblood-brown dark:hover:text-aged-brass hover:underline"
                                >
                                  Website ↗
                                </a>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sidebar Box: Related Categories */}
            {relatedCategories.length > 0 && (
              <div className="bg-white dark:bg-[#17231D]/10 border border-warm-limestone/60 dark:border-warm-limestone/15 p-8 rounded-sm shadow-sm flex flex-col gap-6">
                <h3 className="font-mono text-[10px] uppercase tracking-widest font-bold text-warm-stone flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-aged-brass" />
                  Related Categories
                </h3>
                <div className="flex flex-wrap gap-2">
                  {relatedCategories.map((catSlug) => {
                    const label = CATEGORY_LABELS[catSlug] || catSlug.replace(/-/g, ' ')
                    return (
                      <Link
                        key={catSlug}
                        href={`/directory/category/${catSlug}`}
                        className="text-xs font-mono uppercase tracking-wider font-semibold text-deep-spruce hover:text-ivory-paper dark:text-ivory-paper dark:hover:text-soft-black border border-warm-limestone hover:border-deep-spruce dark:border-warm-limestone/25 dark:hover:border-aged-brass bg-transparent hover:bg-deep-spruce dark:hover:bg-aged-brass px-3.5 py-2 rounded-sm transition-all duration-300"
                      >
                        {label}
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Sidebar Box 3: Dynamic Custom Sidebar or Registry Notes */}
            <div className="relative bg-white dark:bg-[#17231D]/10 border border-warm-limestone/60 dark:border-warm-limestone/15 p-8 rounded-sm shadow-sm">
              <h3 className="font-mono text-[10px] uppercase tracking-widest font-bold text-warm-stone mb-6 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-aged-brass" />
                {article.sidebar?.title || 'Registry Notes'}
              </h3>
              <p className="text-xs text-soft-black dark:text-ivory-paper/78 leading-relaxed font-normal mb-6">
                {article.sidebar?.text || "This article registry focuses on Missoula's local history and community craftsmanship. Check out the Directory to support independent business owners."}
              </p>
              <Link 
                href={article.sidebar?.linkUrl || '/directory'}
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-widest text-deep-spruce dark:text-aged-brass hover:bg-oxblood-brown hover:text-ivory-paper dark:hover:bg-aged-brass dark:hover:text-soft-black border border-deep-spruce/20 dark:border-aged-brass/35 bg-transparent px-4 py-2.5 rounded-sm transition-all duration-300 w-full justify-center group shadow-sm hover:shadow"
              >
                <span>{article.sidebar?.linkText || 'Local Directory'}</span>
                <span className="transform group-hover:translate-x-0.5 transition-transform duration-300">&rarr;</span>
              </Link>
            </div>
          </aside>

        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
