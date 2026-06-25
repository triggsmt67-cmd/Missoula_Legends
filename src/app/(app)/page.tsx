
import { getPayload } from 'payload'
import config from '@payload-config'
import Image from 'next/image'
import Link from 'next/link'
import { RichText } from '@/components/RichText'
import { NewsletterForm } from '@/components/NewsletterForm'
import { PillarCard } from '@/components/PillarCard'
import { BusinessOwnerCTA } from '@/components/BusinessOwnerCTA'
import { ScrollReveal } from '@/components/ScrollReveal'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { seedArticles, seedDirectory } from '../../data/seedData.js'
import { HeroDynamic } from '@/components/Hero3D/HeroDynamic'
import { ScrollProgressBar } from '@/components/ScrollProgressBar'

import { getPlainText } from '@/lib/schema-utils'

function getWordSnippet(data: any, wordLimit: number = 50): string {
  const plainText = getPlainText(data)
  const words = plainText.trim().split(/\s+/)
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(' ') + '...'
  }
  return plainText.trim()
}

function get100WordSnippet(data: any): string {
  return getWordSnippet(data, 100)
}

function decodeUrl(url?: string): string | undefined {
  if (!url) return undefined
  return url
}

const verifiedLogos = [
  {
    name: "Rockin' Rudy's",
    src: "/media/logo-rockin-rudys.png",
    alt: "Rockin' Rudy's Logo - Missoula's legendary independent record and gift shop since 1982"
  },
  {
    name: "The Roxy Theater",
    src: "/media/logo-roxy-theater.png",
    alt: "The Roxy Theater Logo - Community cinema and art house on Hip Strip"
  },
  {
    name: "Big Dipper Ice Cream",
    src: "/media/logo-big-dipper.png",
    alt: "Big Dipper Ice Cream Logo - Hand-crafted local ice cream made in Missoula"
  },
  {
    name: "Le Petit Outre",
    src: "/media/logo-le-petit-outre.png",
    alt: "Le Petit Outre Logo - Artisan bakery and espresso bar"
  },
  {
    name: "Runner's Edge",
    src: "/media/logo-runners-edge.png",
    alt: "Runner's Edge Logo - Locally owned running specialty store"
  },
  {
    name: "Radius Gallery",
    src: "/media/logo-radius-gallery.png",
    alt: "Radius Gallery Logo - Contemporary fine art gallery in downtown Missoula"
  }
]

export const revalidate = 14400

export default async function Home() {
  let articles = []
  let directoryListings = []
  let dynamicEvents: any[] = []
  let curatorProfile: any = null
  let historyStories: any[] = []
  let partnerLogos: any[] = []
  let featuredArticle: any = null

  try {
    const payload = await getPayload({ config })

    // Find the latest article flagged as featured
    const resFeatured = await payload.find({
      collection: 'articles',
      depth: 2,
      where: {
        featured: {
          equals: true,
        },
      },
      sort: '-createdAt',
      limit: 1,
    })
    
    featuredArticle = resFeatured.docs[0]

    // Fallback to the latest article if none is marked as featured
    if (!featuredArticle) {
      const resLatest = await payload.find({
        collection: 'articles',
        depth: 2,
        sort: '-createdAt',
        limit: 1,
      })
      featuredArticle = resLatest.docs[0]
    }

    // Query secondary articles (excluding the featured one)
    const query: any = {
      collection: 'articles',
      depth: 2,
      sort: '-createdAt',
      limit: 5,
    }
    if (featuredArticle) {
      query.where = {
        id: {
          not_equals: featuredArticle.id,
        },
      }
    }
    const resArticles = await payload.find(query)
    articles = resArticles.docs

    const resDirectory = await payload.find({
      collection: 'directory',
      depth: 1,
      limit: 1000,
      where: {
        listingStatus: {
          not_equals: 'unlisted',
        },
      },
    })
    directoryListings = resDirectory.docs

    const resEvents = await payload.find({
      collection: 'events',
      depth: 1,
      limit: 100,
    })
    dynamicEvents = resEvents.docs

    try {
      curatorProfile = await payload.findGlobal({ slug: 'curator-profile', depth: 1 })
    } catch (e) {
      // Global may not exist yet
    }

    try {
      const resHistory = await payload.find({
        collection: 'history',
        depth: 1,
        sort: '-createdAt',
        limit: 1,
      })
      historyStories = resHistory.docs
    } catch (e) {
      // Ignore
    }

    try {
      const resPartners = await payload.find({
        collection: 'partners',
        depth: 1,
        sort: 'order',
        limit: 100,
        where: {
          permissionStatus: {
            in: ['approved', 'licensed', 'public'],
          },
        },
      })
      partnerLogos = resPartners.docs
    } catch (e) {
      // Ignore
    }
  } catch (error: any) {
    console.warn('Database connection failed, falling back to seed data:', error.message)
    // Map seed data to database document shape for local rendering and build-time safety
    articles = seedArticles.map((article, idx) => {
      const generatedSlug = article.relatedBusinessName
        ? article.relatedBusinessName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        : ''
      return {
        id: `article_${idx}`,
        title: article.title,
        slug: article.slug,
        content: article.content,
        heroImage: {
          url: `/media/${article.mediaKey}`,
          alt: article.title,
        },
        relatedBusiness: [
          {
            id: `business_${idx}`,
            businessName: article.relatedBusinessName,
            neighborhood: 'hip-strip',
            slug: generatedSlug,
            contactInfo: {
              website: idx === 0 ? 'https://www.blackcoffeeroasters.com' : 'https://www.rockinrudys.com',
              address: idx === 0 ? '220 W Broadway St, Missoula, MT' : '237 Blaine St, Missoula, MT',
              phone: idx === 0 ? '(406) 541-7400' : '(406) 542-0077',
            },
          },
        ],
      }
    })

    directoryListings = seedDirectory.map((listing, idx) => ({
      id: `directory_${idx}`,
      businessName: listing.businessName,
      category: listing.category,
      neighborhood: listing.neighborhood,
      description: listing.description,
      featuredImage: {
        url: `/media/${listing.mediaKey}`,
        alt: listing.businessName,
      },
      contactInfo: listing.contactInfo,
      status: listing.status || 'listed',
      slug: listing.businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    }))

    featuredArticle = articles[0]
    articles = articles.slice(1)
  }

  const logosToDisplay = partnerLogos.length > 0
    ? partnerLogos.map((p: any) => ({
        name: p.name,
        src: p.logo?.url || '/media/placeholder.jpg',
        alt: p.logo?.alt || `${p.name} Logo`,
      }))
    : verifiedLogos

  // Slice data for precise section mapping
  const secondaryArticles = articles.slice(0, 2)
  const latestHistoryStory = historyStories[0] || {
    title: "The Wilma Theatre: Missoula's Palace of Cinema",
    location: "131 S Higgins Ave, Missoula, MT",
    year: "1921",
    excerpt: "Since 1921, the Wilma Theatre has stood as a monument to arts and culture in downtown Missoula, hosting grand cinema screenings and live performances along the Clark Fork River.",
    heroImage: {
      url: "/media/missoula-history-site.jpg",
      alt: "Historic Wilma Theater Facade and Marquee",
    },
    slug: "the-wilma-theatre-palace-of-cinema",
  }

  // Filter guide listings to only contain 'food-drink' (Dining) establishments for the Dining Guide
  const guideListings = directoryListings
    .filter((listing: any) => listing.category === 'food-drink')
    .slice(0, 3)

  // Local Mock Events (matching Screenshot 1 style)
  const mockEvents = [
    {
      id: 'event_1',
      date: 'SATURDAYS | 8:00 AM - 1:00 PM',
      title: 'Missoula Farmers Market on Circle Square',
      desc: 'Experience the heart of Missoula\'s local food scene. Meet local growers, grab wood-fired baked goods, and enjoy live acoustic street performances.',
      imageSrc: '/media/fact-and-fiction.jpg',
      externalLink: '',
    },
    {
      id: 'event_2',
      date: 'WEDNESDAYS | 11:00 AM - 2:00 PM',
      title: 'Out to Lunch at Caras Park',
      desc: 'Missoula\'s favorite weekday lunch tradition. Enjoy over 20 local food trucks and live outdoor bands right next to the Clark Fork River.',
      imageSrc: '/media/burns-street-bistro.jpg',
      externalLink: '',
    },
    {
      id: 'event_3',
      date: 'FIRST FRIDAY OF EACH MONTH | 5:00 PM - 8:00 PM',
      title: 'Downtown Art Walks & Cider Tastings',
      desc: 'Explore local art galleries, historic boutique spaces, and maker studios. Meet resident artists while enjoying cider and local bites.',
      imageSrc: '/media/montgomery-distillery.jpg',
      externalLink: '',
    },
  ]

  const activeEvents = dynamicEvents.length > 0 
    ? dynamicEvents.map((evt: any) => ({
        id: evt.id,
        date: evt.schedule,
        title: evt.title,
        desc: evt.description,
        imageSrc: evt.featuredImage?.sizes?.thumbnail?.url || evt.featuredImage?.url || '/media/placeholder.jpg',
        externalLink: evt.externalLink || '',
      }))
    : mockEvents

  return (
    <div className="min-h-screen bg-ivory-paper dark:bg-soft-black text-soft-black dark:text-ivory-paper font-sans selection:bg-warm-limestone dark:selection:bg-smoked-olive/40 transition-colors duration-300">
      {/* Schema.org: Website + Organization — for Google Knowledge Graph & AI search */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              'name': 'Missoula Legends',
              'url': 'https://missoulalegends.com',
              'description': 'A local guide and directory highlighting the shops, neighborhood favorites, and history of Missoula, Montana.',
              'potentialAction': {
                '@type': 'SearchAction',
                'target': {
                  '@type': 'EntryPoint',
                  'urlTemplate': 'https://missoulalegends.com/directory?search={search_term_string}'
                },
                'query-input': 'required name=search_term_string'
              }
            },
            {
              '@context': 'https://schema.org',
              '@type': 'Organization',
              'name': 'Missoula Legends',
              'url': 'https://missoulalegends.com',
              'logo': 'https://missoulalegends.com/media/missoula-hero-twilight.png',
              'description': 'Missoula Legends is an independent local guide profiling the local businesses, makers, and neighborhood favorites of Missoula, Montana.',
              'founder': {
                '@type': 'Person',
                'name': 'Trevor Riggs',
                'jobTitle': 'Curator & Editor',
              },
              'areaServed': {
                '@type': 'City',
                'name': 'Missoula',
                'sameAs': 'https://en.wikipedia.org/wiki/Missoula,_Montana',
              },
              'address': {
                '@type': 'PostalAddress',
                'addressLocality': 'Missoula',
                'addressRegion': 'MT',
                'addressCountry': 'US',
              },
              'sameAs': [
                'https://missoulalegends.com',
              ],
            }
          ])
        }}
      />
      {/* Scroll Progress Bar */}
      <ScrollProgressBar />

      {/* Header Navigation */}
      <Header />

      {/* Immersive 3D Hero Section */}
      <section className="relative bg-[#EDE8DF] dark:bg-[#141815] py-20 md:py-36 border-b border-warm-limestone/40 dark:border-warm-limestone/10 overflow-hidden min-h-[85vh] flex items-center">
        {/* Map Background Watermark */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.12] dark:opacity-[0.08] pointer-events-none mix-blend-multiply dark:mix-blend-screen bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("/media/missoula-historical-map-panoramic.png")' }}
        />
        
        {/* 3D Immersive Hero Background */}
        <div className="absolute inset-0 z-0 pointer-events-none lg:pointer-events-auto hidden lg:block">
          <HeroDynamic />
        </div>
        
        {/* Softened background gradient to ensure text readability without darkening too much */}
        <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-r from-[#EDE8DF]/95 via-[#EDE8DF]/50 to-transparent dark:from-[#141815]/90 dark:via-[#141815]/50 dark:to-transparent" />
        
        <div className="relative z-10 max-w-[1320px] mx-auto px-5 sm:px-8 w-full pointer-events-none">
          <div className="max-w-3xl flex flex-col items-start text-left pointer-events-auto">
            <span className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] text-oxblood-brown dark:text-aged-brass font-bold mb-4 sm:mb-6 drop-shadow-sm">
              The Missoula Registry
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-serif text-[#17231D] dark:text-white tracking-tight leading-[1.05] mb-5 md:mb-8 font-normal drop-shadow-sm">
              A Business Directory<br />That Knows Missoula.
            </h1>
            <p className="font-sans text-lg sm:text-[1.15rem] text-deep-spruce/90 dark:text-warm-stone/90 font-medium tracking-wide leading-[1.6] max-w-[38ch] lg:max-w-[45ch] mb-8 md:mb-12 drop-shadow-sm text-left">
              Missoula Legends is where people come to learn the city through the businesses that still matter here: the mechanic everybody trusts, the old bar under the cow, the fabricator other businesses quietly rely on, the places with reputation before they ever had marketing.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-2 w-full sm:w-auto">
              <Link
                href="/directory"
                className="inline-flex items-center justify-center bg-[#23332e] text-[#f7f4ed] hover:bg-aged-brass hover:text-[#23332e] px-8 sm:px-10 py-4 rounded-full font-serif text-[11px] sm:text-xs uppercase tracking-[0.15em] font-bold transition-all duration-500 hover:-translate-y-[2px] hover:shadow-[0_8px_20px_rgba(35,51,46,0.3)] active:scale-[0.98] w-full sm:w-auto shadow-sm"
              >
                Explore the Directory
              </Link>
              <Link
                href={featuredArticle?.slug ? `/articles/${featuredArticle.slug}` : "/articles"}
                className="inline-flex items-center justify-center bg-transparent border border-[#d6ccbd] text-[#23332e] dark:text-[#f7f4ed] dark:border-warm-limestone/40 hover:bg-[#d6ccbd] hover:text-[#23332e] dark:hover:text-[#23332e] hover:border-[#d6ccbd] px-8 sm:px-10 py-4 rounded-full font-serif text-[11px] sm:text-xs uppercase tracking-[0.15em] font-bold transition-all duration-500 hover:-translate-y-[2px] hover:shadow-[0_8px_20px_rgba(214,204,189,0.3)] active:scale-[0.98] w-full sm:w-auto"
              >
                Read Featured Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Explore Missoula Categories */}
      <section className="relative bg-[#FAF7F2] dark:bg-soft-black py-10 md:py-16 border-y border-warm-limestone/40 dark:border-warm-limestone/10 overflow-hidden">
        {/* Map Background Watermark */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.06] dark:opacity-[0.04] pointer-events-none mix-blend-multiply dark:mix-blend-screen bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("/media/missoula-historical-map-panoramic.png")' }}
        />
        
        <ScrollReveal className="relative z-10 max-w-[1320px] mx-auto px-6 sm:px-8">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="font-serif text-3xl md:text-5xl font-normal text-deep-spruce dark:text-ivory-paper animate-fade-in drop-shadow-sm">
              Explore Missoula Pillars
            </h2>
            {/* Mobile Swipe Hint */}
            <div className="md:hidden flex items-center justify-center gap-2 mt-4 text-warm-stone dark:text-slate-400 font-mono text-[9px] uppercase tracking-widest font-bold opacity-80">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Swipe for more categories</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </div>
          
          <div className="flex overflow-x-auto md:overflow-visible snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:[&>*:nth-child(even)]:translate-y-12 pb-8 md:pb-8 lg:pb-16 -mx-6 px-6 sm:-mx-8 sm:px-8 md:mx-0 md:px-0 [&>*]:snap-center [&>*]:min-w-[85vw] sm:[&>*]:min-w-[55vw] md:[&>*]:min-w-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            
            {/* Category 1: Local Tradesmen */}
            <PillarCard
              title="Local Tradesmen"
              desc="The dedicated craftsmen, skilled mechanics, and trusted local services keeping Missoula running strong."
              href="/directory"
              backText="Accessing the Missoula Legends Registry..."
              bgImage="/media/missoula-pillar-registry.png"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  {/* Compass Rose */}
                  <circle cx="12" cy="12" r="9" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M3 12h18" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8l2 4-2 4-2-4z" />
                </svg>
              }
            />

            {/* Category 2: Food & Drink */}
            <PillarCard
              title="Food & Drink"
              desc="Best bites, wood-fired bakeries, craft distilleries, and neighborhood tables."
              href="/directory?category=food-drink"
              backText="Entering the Food & Drink Registry..."
              bgImage="/media/missoula-pillar-steaks.png"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  {/* Stem */}
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 20L20 4" />
                  {/* Twigs */}
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16L6 12" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16L12 18" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 12L10 8" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 12L16 14" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 8L14 4" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 8L20 10" />
                </svg>
              }
            />

            {/* Category 3: Shopping Local */}
            <PillarCard
              title="Shopping Local"
              desc="Legendary record stores, independent bookshops, and boutique makers."
              href="/directory?category=shopping"
              backText="Opening the Local Maker Directory..."
              bgImage="/media/rockin-rudys.jpg"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  {/* Mountain Peak Outlines */}
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 20L10 6L17 20" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 20L16 12L21 20" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6L8 11L11 13" />
                </svg>
              }
            />

            {/* Category 4: Lifestyle */}
            <PillarCard
              title="Lifestyle & Culture"
              desc="Community events, wellness trails, lodging, and local lifestyle."
              href="/directory?category=lifestyle"
              backText="Loading local trails and wellness guides..."
              bgImage="/media/missoula-pillar-people.png"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  {/* Parallel Winding Rivers */}
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2 9c4-2 7 2 10 2s6-4 10-2" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2 15c4-2 7 2 10 2s6-4 10-2" />
                </svg>
              }
            />

          </div>
        </ScrollReveal>
      </section>

      {/* SECTION 1: Editorial Showcase & Sidebar Column with coordinates watermark */}
      <div className="relative w-full overflow-hidden bg-ivory-paper dark:bg-soft-black py-16 md:py-28">
        {/* Map Background Watermark */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.075] dark:opacity-[0.068] pointer-events-none mix-blend-multiply dark:mix-blend-screen bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("/media/missoula-historical-map-panoramic.png")' }}
        />
        {/* Coordinate Grid Overlay */}
        <div className="absolute inset-0 z-0 opacity-[0.015] dark:opacity-[0.01] pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:32px_32px]" />
        
        <ScrollReveal>
          <section className="relative z-10 max-w-[1320px] mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20">
            
            {/* Left Side: Large Featured Article & Events Grid (8/12 width) */}
            <div className="lg:col-span-8 flex flex-col gap-16">
              
              {/* Featured Article */}
              {featuredArticle && (
                <article className="group flex flex-col text-left">
                  {/* Premium Frame */}
                  <div className="relative p-3 bg-[#fcfaf7] dark:bg-blue-black border border-warm-limestone/50 dark:border-warm-limestone/15 rounded-[2.5rem] shadow-lg mb-8">
                    
                    {/* Floating SVG Seal */}
                    <div className="absolute -top-4 -right-2 sm:-top-5 sm:-right-5 md:-top-8 md:-right-8 z-20 w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 drop-shadow-xl pointer-events-none flex items-center justify-center">
                      {/* Rotating Outer Ring */}
                      <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full text-aged-brass fill-current animate-[spin_45s_linear_infinite]">
                        <path id="textPath" d="M 100, 100 m -70, 0 a 70,70 0 1,1 140,0 a 70,70 0 1,1 -140,0" fill="none" />
                        <text className="font-mono text-[14px] uppercase tracking-[0.25em] font-bold" fill="currentColor">
                          <textPath href="#textPath" startOffset="0%">
                            FEATURED LOCAL LEGEND • WESTERN MONTANA • 
                          </textPath>
                        </text>
                        {/* Decorative inner rings */}
                        <circle cx="100" cy="100" r="82" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
                        <circle cx="100" cy="100" r="50" fill="none" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                      {/* Stationary Inner Monogram */}
                      <div className="relative z-10 text-aged-brass flex flex-col items-center justify-center bg-[#fcfaf7] dark:bg-blue-black rounded-full w-[72px] h-[72px] sm:w-[84px] sm:h-[84px] md:w-[96px] md:h-[96px] shadow-inner border border-aged-brass/20">
                        <span className="font-serif text-3xl sm:text-4xl md:text-5xl leading-none font-normal ml-1">ML</span>
                      </div>
                    </div>

                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800 rounded-[2rem]">
                      <Image
                        src={
                          decodeUrl(featuredArticle.heroImage?.sizes?.featureHero?.url) ||
                          decodeUrl(featuredArticle.heroImage?.url) ||
                          '/media/placeholder.jpg'
                        }
                        alt={featuredArticle.heroImage?.alt || featuredArticle.title}
                        fill
                        priority
                        sizes="(max-width: 1024px) 100vw, 900px"
                        className="object-cover image-zoom-hover"
                      />
                    </div>
                  </div>
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-aged-brass font-bold block mb-3">
                      COMMUNITY SPOTLIGHT | CRAFTSMANSHIP
                    </span>
                    <h2 className="font-serif text-4xl md:text-6xl font-normal text-deep-spruce dark:text-ivory-paper tracking-tight leading-[1.1] mb-6 hover:text-oxblood-brown dark:hover:text-aged-brass transition-colors">
                      <Link href={`/articles/${featuredArticle.slug}`}>
                        <span className="hover-draw-underline">{featuredArticle.title}</span>
                      </Link>
                    </h2>
                    
                    <p className="text-base sm:text-lg text-smoked-olive dark:text-warm-stone font-normal leading-relaxed mb-6">
                      {get100WordSnippet(featuredArticle.content)}
                    </p>
                    <Link
                      href={`/articles/${featuredArticle.slug}`}
                      className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest font-bold text-oxblood-brown dark:text-aged-brass hover:text-soft-black dark:hover:text-white transition-colors mb-8 group"
                    >
                      Read More <span className="transform group-hover:translate-x-0.5 transition-transform duration-300">&rarr;</span>
                    </Link>
 

                  </div>
                </article>
              )}
 
              {/* Event Listings Sub-section */}
              <div className="border-t border-warm-limestone/50 dark:border-warm-limestone/10 pt-8 text-left">
                <h3 className="font-serif text-3xl md:text-5xl font-normal text-deep-spruce dark:text-ivory-paper mb-4 flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-aged-brass" />
                  Missoula Events Calendar
                </h3>
                {/* Mobile Swipe Hint */}
                <div className="lg:hidden flex items-center gap-2 mb-8 text-warm-stone dark:text-slate-400 font-mono text-[9px] uppercase tracking-widest font-bold opacity-80">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                  <span>Swipe for more</span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </div>
                <div className="flex overflow-x-auto snap-x snap-mandatory lg:flex-col lg:overflow-visible lg:snap-none gap-6 lg:gap-8 pb-8 lg:pb-0 -mx-6 px-6 sm:-mx-8 sm:px-8 lg:mx-0 lg:px-0 [&>*]:snap-center [&>*]:min-w-[85vw] sm:[&>*]:min-w-[60vw] lg:[&>*]:min-w-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                  {activeEvents.map((event) => (
                    <div key={event.id} className={`relative flex flex-col sm:flex-row gap-6 items-start sm:items-center group border border-warm-limestone/20 lg:border-t-0 lg:border-x-0 lg:border-b dark:border-warm-limestone/10 p-6 lg:p-0 lg:pb-8 rounded-[2rem] lg:rounded-none bg-white/40 dark:bg-soft-black/40 lg:bg-transparent lg:dark:bg-transparent backdrop-blur-md lg:backdrop-blur-none last:border-b-0 lg:last:pb-0 overflow-hidden ${event.externalLink ? 'cursor-pointer hover:bg-white/60 dark:hover:bg-soft-black/60 lg:hover:bg-transparent lg:dark:hover:bg-transparent transition-colors' : 'cursor-default'}`}>
                      {event.externalLink ? (
                        <a 
                          href={event.externalLink} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="relative w-full sm:w-44 aspect-[4/3] sm:aspect-square overflow-hidden bg-slate-150 dark:bg-slate-800 rounded-2xl flex-shrink-0 border border-warm-limestone/30 dark:border-warm-limestone/10 block"
                        >
                          <Image
                            src={decodeUrl(event.imageSrc) || '/media/placeholder.jpg'}
                            alt={event.title}
                            fill
                            sizes="(max-width: 640px) 100vw, 176px"
                            className="object-cover image-zoom-hover"
                          />
                        </a>
                      ) : (
                        <div className="relative w-full sm:w-44 aspect-[4/3] sm:aspect-square overflow-hidden bg-slate-150 dark:bg-slate-800 rounded-2xl flex-shrink-0 border border-warm-limestone/30 dark:border-warm-limestone/10">
                          <Image
                            src={decodeUrl(event.imageSrc) || '/media/placeholder.jpg'}
                            alt={event.title}
                            fill
                            sizes="(max-width: 640px) 100vw, 176px"
                            className="object-cover image-zoom-hover"
                          />
                        </div>
                      )}
                      <div className="flex-grow text-left">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-aged-brass font-bold block mb-2">
                          {event.date}
                        </span>
                        <h4 className="font-serif text-xl sm:text-2xl font-bold text-deep-spruce dark:text-white leading-tight mb-2.5 group-hover:text-oxblood-brown dark:group-hover:text-aged-brass transition-colors">
                          {event.externalLink ? (
                            <a href={event.externalLink} target="_blank" rel="noopener noreferrer" className="hover-draw-underline">
                              {event.title}
                            </a>
                          ) : (
                            <span className="hover-draw-underline">{event.title}</span>
                          )}
                        </h4>
                        <p className="text-sm sm:text-base text-smoked-olive dark:text-warm-stone font-normal leading-relaxed">
                          {event.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
 
            {/* Right Side: Curator Spotlight & Secondary Articles Stack (4/12 width) */}
            <div className="lg:col-span-4 flex flex-col gap-16 lg:pl-12 text-left lg:sticky lg:top-32 self-start h-max z-20">
              
              {/* Secondary Article Stack */}
              {secondaryArticles && secondaryArticles.length > 0 && (
                <>
                  {/* Mobile Swipe Hint */}
                  <div className="lg:hidden flex items-center gap-2 mb-4 text-warm-stone dark:text-slate-400 font-mono text-[9px] uppercase tracking-widest font-bold opacity-80">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    <span>Swipe for more</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </div>
                  <div className="flex overflow-x-auto snap-x snap-mandatory lg:flex-col lg:overflow-visible lg:snap-none gap-6 lg:gap-10 pb-8 lg:pb-0 -mx-6 px-6 sm:-mx-8 sm:px-8 lg:mx-0 lg:px-0 [&>*]:snap-center [&>*]:min-w-[85vw] sm:[&>*]:min-w-[60vw] lg:[&>*]:min-w-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                  {secondaryArticles.map((article: any, index: number) => (
                    <div key={article.id} className="group relative flex flex-col gap-6 p-6 sm:p-8 rounded-[2.5rem] bg-white/40 dark:bg-soft-black/40 backdrop-blur-2xl border border-white/60 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_20px_40px_rgb(0,0,0,0.4)] transition-all duration-500 overflow-hidden">
                      
                      {/* Premium Accent Line */}
                      <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-aged-brass/30 to-transparent" />

                      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.5rem] shadow-inner">
                        <Image
                          src={
                            decodeUrl(article.heroImage?.sizes?.featureHero?.url) ||
                            decodeUrl(article.heroImage?.url) ||
                            '/media/placeholder.jpg'
                          }
                          alt={article.heroImage?.alt || article.title}
                          fill
                          sizes="(max-width: 1024px) 100vw, 450px"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      
                      <div className="relative z-10">
                        <span className="font-mono text-[9px] uppercase tracking-widest text-aged-brass font-bold block mb-3">
                          {index === 0 ? 'HISTORIC DISTRICT | LIFESTYLE' : 'LOCAL TRADITIONS | CRAFTSMANSHIP'}
                        </span>
                        <h3 className="font-serif text-2xl font-normal text-deep-spruce dark:text-white leading-tight mb-4 group-hover:text-aged-brass transition-colors">
                          <Link href={`/articles/${article.slug}`}>
                            <span className="absolute inset-0 z-20" aria-hidden="true"></span>
                            {article.title}
                          </Link>
                        </h3>
                        <p className="text-sm text-smoked-olive dark:text-warm-stone font-normal leading-relaxed mb-6">
                          {getWordSnippet(article.content, 35)}
                        </p>
                        <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest font-bold text-oxblood-brown dark:text-aged-brass transition-colors">
                          Read Feature <span className="transform group-hover:translate-x-1 transition-transform duration-300">&rarr;</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                </>
              )}
 
              {/* Divider Line & Historical Legends Section */}
              <div className="pt-6">
                <h3 className="font-serif text-xs uppercase tracking-widest font-bold text-warm-stone dark:text-slate-500 mb-6 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-aged-brass" />
                  Historical Legends
                </h3>
                {latestHistoryStory && (
                  <Link href={`/history/${latestHistoryStory.slug}`} className="group relative block aspect-[3/4] sm:aspect-[4/5] w-full rounded-[2.5rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.4)] border border-warm-limestone/20 dark:border-white/10 isolate transition-all duration-500">
                    
                    {/* Archival Texture Overlay */}
                    <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none z-10" style={{ backgroundImage: 'url("/media/missoula-historical-map-panoramic.png")' }} />

                    {/* Background Image */}
                    <Image
                      src={
                        decodeUrl(latestHistoryStory.heroImage?.sizes?.featureHero?.url) ||
                        decodeUrl(latestHistoryStory.heroImage?.url) ||
                        '/media/missoula-history-site.jpg'
                      }
                      alt={latestHistoryStory.heroImage?.alt || latestHistoryStory.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 450px"
                      className="object-cover transition-all duration-1000 filter sepia-[.6] contrast-125 grayscale-[.3] group-hover:sepia-0 group-hover:grayscale-0 group-hover:scale-110"
                    />

                    {/* Gradient Overlay for Text Legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111311] via-[#111311]/50 to-transparent pointer-events-none z-10 transition-opacity duration-500" />

                    {/* Photo corner accents */}
                    <div className="absolute top-6 left-6 w-6 h-6 border-t-2 border-l-2 border-white/30 z-10 transition-all duration-500 group-hover:border-white/80 group-hover:scale-110 origin-top-left" />
                    <div className="absolute top-6 right-6 w-6 h-6 border-t-2 border-r-2 border-white/30 z-10 transition-all duration-500 group-hover:border-white/80 group-hover:scale-110 origin-top-right" />
                    <div className="absolute bottom-6 left-6 w-6 h-6 border-b-2 border-l-2 border-white/30 z-10 transition-all duration-500 group-hover:border-white/80 group-hover:scale-110 origin-bottom-left" />
                    <div className="absolute bottom-6 right-6 w-6 h-6 border-b-2 border-r-2 border-white/30 z-10 transition-all duration-500 group-hover:border-white/80 group-hover:scale-110 origin-bottom-right" />
                    
                    {/* Content Area */}
                    <div className="absolute inset-x-0 bottom-0 z-20 p-6 sm:p-8 flex flex-col justify-end transform transition-transform duration-500 group-hover:-translate-y-2">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-mono text-[10px] uppercase tracking-widest text-aged-brass font-bold bg-white/10 px-2.5 py-1 rounded backdrop-blur-md border border-white/20 shadow-sm">
                          {latestHistoryStory.year}
                        </span>
                        <span className="font-mono text-[9px] uppercase tracking-widest text-white/90 bg-white/10 px-2.5 py-1 rounded backdrop-blur-md border border-white/20 shadow-sm">
                          {latestHistoryStory.location}
                        </span>
                      </div>
                      <h4 className="font-serif text-2xl sm:text-3xl italic font-normal text-white leading-tight mb-3 group-hover:text-aged-brass transition-colors drop-shadow-md">
                        {latestHistoryStory.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-ivory-paper/90 font-normal leading-relaxed mb-6 line-clamp-3 drop-shadow">
                        {latestHistoryStory.excerpt}
                      </p>
                      <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest font-bold text-aged-brass transition-transform group-hover:translate-x-2 duration-500">
                        [ Access Archive ]
                      </div>
                    </div>
                  </Link>
                )}
              </div>

            </div>
 
          </div>
          </section>
        </ScrollReveal>
      </div>
 
      <BusinessOwnerCTA />
 
      {/* SECTION 3: Missoula Dining Guide */}
      <section className="relative bg-[#EDE8DF] dark:bg-[#141815] py-16 md:py-28 border-b border-warm-limestone/40 dark:border-warm-limestone/10 overflow-hidden">
        {/* Map Background Watermark */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.08] dark:opacity-[0.05] pointer-events-none mix-blend-multiply dark:mix-blend-screen bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("/media/missoula-historical-map-panoramic.png")' }}
        />
        
        <ScrollReveal className="relative z-10 max-w-[1320px] mx-auto px-6 sm:px-8 text-center">
          <h2 className="font-serif text-3xl md:text-5xl font-normal text-deep-spruce dark:text-white mb-4 drop-shadow-sm">
            Missoula Dining Guide
          </h2>
          <span className="font-serif italic text-warm-stone text-lg block mb-6 drop-shadow-sm">The Garden City’s Finest Eateries, Personally Curated</span>
          
          {/* Mobile Swipe Hint */}
          <div className="md:hidden flex items-center justify-center gap-2 mb-8 text-warm-stone dark:text-slate-400 font-mono text-[9px] uppercase tracking-widest font-bold opacity-80">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            <span>Swipe for more</span>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </div>
          
          <div className="flex overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible md:snap-none gap-6 md:gap-10 pb-8 md:pb-0 -mx-6 px-6 sm:-mx-8 sm:px-8 md:mx-0 md:px-0 [&>*]:snap-center [&>*]:min-w-[85vw] sm:[&>*]:min-w-[55vw] md:[&>*]:min-w-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            {guideListings.map((listing: any) => {
              const imageSrc =
                decodeUrl(listing.featuredImage?.sizes?.thumbnail?.url) ||
                decodeUrl(listing.featuredImage?.url) ||
                '/media/placeholder.jpg'
              const categoryLabel = listing.category === 'food-drink' ? 'DINING & DRINK' : 'SHOPPING LOCAL'
 
              return (
                <div
                  key={listing.id}
                  className="group relative flex flex-col justify-between p-6 sm:p-8 rounded-[2.5rem] bg-white/60 dark:bg-soft-black/40 backdrop-blur-2xl border border-white/60 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_20px_40px_rgb(0,0,0,0.4)] transition-all duration-500 overflow-hidden text-left"
                >
                  {/* Premium Accent Line */}
                  <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-aged-brass/30 to-transparent" />

                  <div className="flex flex-col flex-grow">
                    {/* Landscape Framed Thumbnail */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.5rem] shadow-inner mb-6">
                      <Image
                        src={imageSrc}
                        alt={listing.featuredImage?.alt || listing.businessName}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 450px"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    {/* Content */}
                    <div className="relative z-10 flex-grow">
                      <span className="font-mono text-[9px] uppercase tracking-widest text-aged-brass font-bold block mb-3">
                        {categoryLabel}
                      </span>
                      <h3 className="font-serif text-2xl font-normal text-deep-spruce dark:text-white leading-tight mb-4 group-hover:text-aged-brass transition-colors">
                        <Link href={`/directory/${listing.slug || ''}`}>
                          <span className="absolute inset-0 z-20" aria-hidden="true"></span>
                          {listing.businessName}
                        </Link>
                      </h3>
                      <p className="text-sm text-smoked-olive dark:text-warm-stone font-normal leading-relaxed mb-6">
                        {getWordSnippet(listing.description, 30)}
                      </p>
                    </div>
                  </div>
 
                  {/* Card bottom details */}
                  <div className="relative z-10 pt-5 mt-auto border-t border-dashed border-warm-limestone/40 dark:border-warm-stone/20 flex justify-between items-center text-xs font-mono">
                    <Link
                      href={`/directory/${listing.slug || ''}`}
                      className="text-[10px] uppercase tracking-widest font-bold text-oxblood-brown dark:text-aged-brass transition-colors group-hover:translate-x-1 duration-300 z-30"
                    >
                      View Profile &rarr;
                    </Link>
                    <div className="flex items-center gap-3 z-30">
                      {listing.contactInfo?.website && (
                        <a
                          href={listing.contactInfo.website.startsWith('http') ? listing.contactInfo.website : `https://${listing.contactInfo.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[9px] uppercase tracking-widest text-warm-stone hover:text-aged-brass transition-colors font-bold"
                        >
                          Website ↗
                        </a>
                      )}
                      <span className="text-[9px] uppercase tracking-widest text-warm-stone bg-white/50 dark:bg-black/20 px-2 py-0.5 rounded backdrop-blur-sm">
                        {listing.neighborhood.replace(/-/g, ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollReveal>
      </section>
 
      {/* Newsletter Signup */}
      <ScrollReveal className="max-w-[1320px] mx-auto px-6 sm:px-8 py-16 md:py-28 text-left">
        <div className="relative overflow-hidden bg-[#FAF7F2] dark:bg-blue-black/40 border-2 border-dashed border-warm-limestone/60 dark:border-warm-limestone/20 rounded-[2.5rem] p-10 md:p-16 shadow-inner">
          {/* Map Background Watermark */}
          <div 
            className="absolute inset-0 z-0 opacity-[0.05] dark:opacity-[0.03] pointer-events-none mix-blend-multiply dark:mix-blend-screen bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: 'url("/media/missoula-historical-map-panoramic.png")' }}
          />
          {/* Postmark stamp detail */}
          <div className="absolute top-8 right-8 z-0 opacity-20 pointer-events-none rotate-[15deg] hidden md:block">
            <svg width="120" height="120" viewBox="0 0 100 100" fill="none" stroke="currentColor" className="text-oxblood-brown dark:text-aged-brass">
              <circle cx="50" cy="50" r="45" strokeWidth="1.5" strokeDasharray="4 4" />
              <circle cx="50" cy="50" r="35" strokeWidth="1" />
              <text x="50" y="42" fontSize="10" textAnchor="middle" fill="currentColor" stroke="none" fontFamily="monospace">MISSOULA</text>
              <text x="50" y="65" fontSize="10" textAnchor="middle" fill="currentColor" stroke="none" fontFamily="monospace">MONTANA</text>
              <path d="M 20 50 L 80 50" strokeWidth="1" />
            </svg>
          </div>
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-aged-brass font-bold">
                Weekly Digest
              </span>
              <h2 className="text-3xl md:text-5xl font-serif text-deep-spruce dark:text-white mt-4 font-normal leading-tight">
                Get Missoula stories delivered.
              </h2>
              <p className="text-smoked-olive dark:text-warm-stone mt-4 max-w-[45ch] leading-relaxed text-base sm:text-lg font-normal">
                Receive deep-dive interviews, neighborhood guides, and curated recommendations for local food, drinks, and shops worth knowing directly in your inbox.
              </p>
            </div>
            <div>
              <NewsletterForm />
              <span className="text-[11px] font-mono text-warm-stone/60 mt-3 block pl-2">
                Curated monthly. Unsubscribe anytime.
              </span>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Curator Spotlight - Horizontal Footer Card */}
      <section className="max-w-[1320px] mx-auto px-6 sm:px-8 py-8 border-t border-warm-limestone/20 dark:border-warm-limestone/10">
        <ScrollReveal className="bg-gradient-to-r from-[#faf8f4]/60 to-[#f5f2e9]/60 dark:from-slate-900/20 dark:to-slate-950/20 border border-warm-limestone/40 dark:border-warm-limestone/10 p-8 rounded-[2rem] flex flex-col md:flex-row items-center gap-8 text-left">
          <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-white dark:border-slate-850 shadow-md shrink-0">
            <Image
              src={
                curatorProfile?.photo?.sizes?.thumbnail?.url ||
                curatorProfile?.photo?.url ||
                '/media/missoula-curator.jpg'
              }
              alt={curatorProfile?.name || 'Trevor Riggs'}
              fill
              sizes="80px"
              className="object-cover object-center"
            />
          </div>
          <div className="flex-grow">
            <span className="font-mono text-[9px] uppercase tracking-widest text-aged-brass font-bold block mb-1">
              Curator Spotlight
            </span>
            <h4 className="font-serif text-2xl font-normal text-deep-spruce dark:text-white">
              {curatorProfile?.name || 'Trevor Riggs'}
            </h4>
            <span className="font-mono text-[9px] uppercase tracking-widest text-warm-stone font-bold block mb-2">
              {curatorProfile?.title || 'Missoula Curator • Marketing Strategist'}
            </span>
            <p className="text-sm text-slate-700 dark:text-slate-350 font-serif font-normal leading-relaxed italic max-w-4xl">
              "{curatorProfile?.bio || 'Trevor Riggs has spent years helping Montana businesses tell clearer stories, reach the right people, and turn attention into real customers.'}"
            </p>
          </div>
          <div className="shrink-0 pt-4 md:pt-0">
            <Link
              href={`mailto:${curatorProfile?.contactEmail || 'trevor@missoulalegends.com'}`}
              className="inline-block bg-transparent hover:bg-aged-brass text-deep-spruce dark:text-aged-brass hover:text-soft-black border border-deep-spruce dark:border-aged-brass hover:border-aged-brass px-6 py-3 rounded-lg font-mono text-[10px] uppercase tracking-widest font-bold transition-all duration-500 shadow-sm hover:shadow-[0_0_15px_rgba(204,166,119,0.2)] active:scale-[0.98]"
            >
              Get in Touch &rarr;
            </Link>
          </div>
        </ScrollReveal>
      </section>
 
      {/* Business Owner CTA */}
      <section id="featured" className="relative py-24 md:py-36 border-t border-white/10 text-left overflow-hidden">
        {/* Full Bleed Parallax Background */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: 'url("/media/rockin-rudys.jpg")' }}
        />
        {/* Dark Overlay for Legibility */}
        <div className="absolute inset-0 z-0 bg-deep-spruce/85 dark:bg-black/85 backdrop-blur-[2px] pointer-events-none" />
        
        <ScrollReveal className="relative z-10 max-w-[1320px] mx-auto px-6 sm:px-8 lg:flex lg:items-center lg:justify-between lg:gap-12">
          <div className="max-w-2xl text-white">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-normal leading-[1.1] drop-shadow-md tracking-tight">
              Nominate a business that should be a local legend.
            </h2>
            <p className="text-white/80 text-base sm:text-lg font-normal leading-relaxed mt-6 max-w-[45ch] drop-shadow">
              Know an independent tradesperson, local service provider, or neighborhood contractor? Help us highlight the businesses and craftsmanship that make Missoula special by adding them to the registry.
            </p>
          </div>
          <div className="mt-10 lg:mt-0 flex-shrink-0">
            <Link
              href="/nominate"
              className="group inline-flex items-center justify-center gap-3 bg-white/5 backdrop-blur-md text-aged-brass hover:bg-aged-brass hover:text-soft-black font-mono text-[13px] sm:text-[15px] uppercase tracking-widest font-bold px-10 py-5 sm:px-12 sm:py-7 rounded-xl active:scale-[0.98] transition-all duration-500 shadow-[0_8px_30px_rgb(0,0,0,0.3)] hover:shadow-[0_0_30px_rgba(204,166,119,0.3)] cursor-pointer border border-aged-brass/40 hover:border-aged-brass"
            >
              Nominate a Legend <span className="transform group-hover:translate-x-1 transition-transform duration-300">&rarr;</span>
            </Link>
          </div>
        </ScrollReveal>
      </section>
 
      {/* Footer */}
      <Footer />
    </div>
  )
}
