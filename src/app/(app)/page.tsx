import { getPayload } from 'payload'
import config from '@payload-config'
import Image from 'next/image'
import Link from 'next/link'
import { RichText } from '@/components/RichText'
import { NewsletterForm } from '@/components/NewsletterForm'
import { PillarCard } from '@/components/PillarCard'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { seedArticles, seedDirectory } from '../../data/seedData.js'

function get100WordSnippet(data: any): string {
  if (!data) return ''
  
  let text = ''
  if (typeof data === 'string') {
    text = data
  } else {
    try {
      const traverse = (node: any) => {
        if (!node) return
        if (node.text && typeof node.text === 'string') {
          text += node.text + ' '
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
    } catch (e) {
      console.error('Error extracting plain text from richText:', e)
      return ''
    }
  }

  const words = text.trim().split(/\s+/)
  if (words.length > 100) {
    return words.slice(0, 100).join(' ') + '...'
  }
  return text.trim()
}

function getWordSnippet(data: any, wordLimit: number = 50): string {
  if (!data) return ''
  
  let text = ''
  if (typeof data === 'string') {
    text = data
  } else {
    try {
      const traverse = (node: any) => {
        if (!node) return
        if (node.text && typeof node.text === 'string') {
          text += node.text + ' '
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
    } catch (e) {
      return ''
    }
  }

  const words = text.trim().split(/\s+/)
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(' ') + '...'
  }
  return text.trim()
}

function decodeUrl(url?: string): string | undefined {
  if (!url) return undefined
  try {
    return decodeURIComponent(url)
  } catch (e) {
    return url
  }
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

export const dynamic = 'force-dynamic'

export default async function Home() {
  let articles = []
  let directoryListings = []
  let dynamicEvents: any[] = []
  let curatorProfile: any = null
  let historyStories: any[] = []
  let partnerLogos: any[] = []

  try {
    const payload = await getPayload({ config })
    const resArticles = await payload.find({
      collection: 'articles',
      depth: 1,
      sort: '-createdAt',
    })
    articles = resArticles.docs

    const resDirectory = await payload.find({
      collection: 'directory',
      depth: 1,
    })
    directoryListings = resDirectory.docs

    const resEvents = await payload.find({
      collection: 'events',
      depth: 1,
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
      })
      partnerLogos = resPartners.docs
    } catch (e) {
      // Ignore
    }
  } catch (error: any) {
    console.warn('Database connection failed, falling back to seed data:', error.message)
    // Map seed data to database document shape for local rendering and build-time safety
    articles = seedArticles.map((article, idx) => ({
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
          contactInfo: {
            website: idx === 0 ? 'https://www.blackcoffeeroasters.com' : 'https://www.rockinrudys.com',
            address: idx === 0 ? '220 W Broadway St, Missoula, MT' : '237 Blaine St, Missoula, MT',
            phone: idx === 0 ? '(406) 541-7400' : '(406) 542-0077',
          },
        },
      ],
    }))

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
    }))
  }

  const logosToDisplay = partnerLogos.length > 0
    ? partnerLogos.map((p: any) => ({
        name: p.name,
        src: p.logo?.url || '/media/placeholder.jpg',
        alt: p.logo?.alt || `${p.name} Logo`,
      }))
    : verifiedLogos

  // Slice data for precise section mapping
  const featuredArticle = articles[0]
  const secondaryArticles = articles.slice(1, 3)
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
    },
    {
      id: 'event_2',
      date: 'WEDNESDAYS | 11:00 AM - 2:00 PM',
      title: 'Out to Lunch at Caras Park',
      desc: 'Missoula\'s favorite weekday lunch tradition. Enjoy over 20 local food trucks and live outdoor bands right next to the Clark Fork River.',
      imageSrc: '/media/burns-street-bistro.jpg',
    },
    {
      id: 'event_3',
      date: 'FIRST FRIDAY OF EACH MONTH | 5:00 PM - 8:00 PM',
      title: 'Downtown Art Walks & Cider Tastings',
      desc: 'Explore local art galleries, historic boutique spaces, and maker studios. Meet resident artists while enjoying cider and local bites.',
      imageSrc: '/media/montgomery-distillery.jpg',
    },
  ]

  const activeEvents = dynamicEvents.length > 0 
    ? dynamicEvents.map((evt: any) => ({
        id: evt.id,
        date: evt.schedule,
        title: evt.title,
        desc: evt.description,
        imageSrc: evt.featuredImage?.sizes?.thumbnail?.url || evt.featuredImage?.url || '/media/placeholder.jpg',
      }))
    : mockEvents

  return (
    <div className="min-h-screen bg-ivory-paper dark:bg-soft-black text-soft-black dark:text-ivory-paper font-sans selection:bg-warm-limestone dark:selection:bg-smoked-olive/40 transition-colors duration-300">
      {/* Scroll Progress Bar */}
      <div 
        id="scroll-progress" 
        className="fixed top-0 left-0 h-[2px] bg-aged-brass z-50 transition-all duration-75"
        style={{ width: '0%' }}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.addEventListener('scroll', () => {
              const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
              const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
              const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
              const progressEl = document.getElementById('scroll-progress');
              if (progressEl) progressEl.style.width = scrolled + '%';
            });
          `
        }}
      />

      {/* Header Navigation */}
      <Header />

      {/* Hero Section - Split Layout with Clean solid background and Flat Lay */}
      <section className="relative bg-[#EDE8DF] dark:bg-[#141815] py-16 md:py-28 border-b border-warm-limestone/40 dark:border-warm-limestone/10 overflow-hidden">
        {/* Map Background Watermark */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.075] dark:opacity-[0.068] pointer-events-none mix-blend-multiply dark:mix-blend-screen bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("/media/missoula-historical-map-panoramic.png")' }}
        />
        
        <div className="relative z-10 max-w-[1320px] mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 items-center">
            {/* Left side: Editorial Typography */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              <h1 className="text-5xl sm:text-7xl md:text-8xl font-serif text-[#17231D] dark:text-white tracking-tight leading-[1.05] mb-8 font-normal">
                The Backbone of Missoula.
              </h1>
              <p className="text-base sm:text-lg text-smoked-olive dark:text-warm-stone font-normal leading-relaxed max-w-[48ch] mb-10">
                We profile the independent makers, trusted trades, and local pioneers who actually build this community. Discover the stories behind the town's defining businesses—and see who made the list.
              </p>
              <Link
                href="/spotlight"
                className="group inline-flex items-center gap-3 bg-[#182625] dark:bg-[#203633] text-white px-8 py-4.5 rounded-lg hover:bg-oxblood-brown dark:hover:bg-ivory-paper dark:hover:text-soft-black border border-transparent dark:border-[#203633] font-mono text-xs uppercase tracking-widest font-bold transition-all shadow-sm hover:shadow active:scale-[0.98]"
              >
                Nominate a Local Legend
                <span className="transform group-hover:translate-x-0.5 transition-transform duration-300">&rarr;</span>
              </Link>
            </div>
            
            {/* Right side: Framed Image */}
            <div className="lg:col-span-5 w-full">
              <div className="p-3 bg-white dark:bg-blue-black border border-warm-limestone/60 dark:border-warm-limestone/15 rounded-[2.5rem] shadow-xl">
                <div className="relative aspect-square w-full overflow-hidden rounded-[2rem] bg-ivory-paper dark:bg-soft-black">
                  <Image
                    src="/media/missoula-hero-workbench.png"
                    alt="Curated collection of contemporary Missoula industry tools and products on a distressed wood workbench"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 450px"
                    className="object-cover object-center scale-100 hover:scale-103 transition-transform duration-1000"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Local Business Scrolling Marquee */}
      <section className="relative w-full bg-[#FCFAF7] dark:bg-[#121613] border-b border-warm-limestone/40 dark:border-warm-limestone/15 py-2 md:py-3 overflow-hidden select-none">
        {/* Map Background Watermark */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.06] dark:opacity-[0.05] pointer-events-none mix-blend-multiply dark:mix-blend-screen bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("/media/missoula-historical-map-panoramic.png")' }}
        />

        {/* Gradient overlays to fade out the logos on the edges */}
        <div className="absolute top-0 left-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-[#FCFAF7] dark:from-[#121613] to-transparent z-20 pointer-events-none" />
        <div className="absolute top-0 right-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-[#FCFAF7] dark:from-[#121613] to-transparent z-20 pointer-events-none" />

        {/* Marquee Inner Flex */}
        <div className="relative z-10 flex w-max animate-marquee-paused">
          {/* First loop of logos */}
          <div className="flex items-center gap-16 md:gap-24 px-8 md:px-12 animate-marquee shrink-0">
            {logosToDisplay.map((logo) => (
              <div
                key={logo.name}
                className="flex items-center justify-center h-16 md:h-20 w-44 md:w-56 relative opacity-60 dark:opacity-40 hover:opacity-100 dark:hover:opacity-90 transition-opacity duration-300"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  fill
                  sizes="(max-width: 768px) 176px, 224px"
                  className="object-contain filter grayscale dark:invert"
                />
              </div>
            ))}
          </div>

          {/* Second loop of logos (clone for seamless scroll) */}
          <div className="flex items-center gap-16 md:gap-24 px-8 md:px-12 animate-marquee shrink-0" aria-hidden="true">
            {logosToDisplay.map((logo) => (
              <div
                key={`${logo.name}-clone`}
                className="flex items-center justify-center h-16 md:h-20 w-44 md:w-56 relative opacity-60 dark:opacity-40 hover:opacity-100 dark:hover:opacity-90 transition-opacity duration-300"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  fill
                  sizes="(max-width: 768px) 176px, 224px"
                  className="object-contain filter grayscale dark:invert"
                />
              </div>
            ))}
          </div>
        </div>
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
        
        <section className="relative z-10 max-w-[1320px] mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20">
            
            {/* Left Side: Large Featured Article & Events Grid (8/12 width) */}
            <div className="lg:col-span-8 flex flex-col gap-16">
              
              {/* Featured Article */}
              {featuredArticle && (
                <article className="group flex flex-col text-left">
                  {/* Premium Frame */}
                  <div className="p-3 bg-[#fcfaf7] dark:bg-blue-black border border-warm-limestone/50 dark:border-warm-limestone/15 rounded-[2.5rem] shadow-lg mb-8">
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
                    <h2 className="font-serif text-3xl md:text-5xl font-bold text-deep-spruce dark:text-ivory-paper tracking-tight leading-tight mb-6 hover:text-oxblood-brown dark:hover:text-aged-brass transition-colors">
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
 
                    {featuredArticle.relatedBusiness?.[0] && (
                      <div className="border border-warm-limestone dark:border-warm-limestone/15 pt-6 mt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-transparent p-6 rounded-2xl hover-magnetic">
                        <div>
                          <span className="font-mono text-[9px] uppercase tracking-widest text-warm-stone block mb-1.5">
                            Featured Business
                          </span>
                          <span className="font-serif font-bold text-deep-spruce dark:text-white text-lg">
                            {featuredArticle.relatedBusiness[0].businessName}
                          </span>
                          <span className="inline-block mt-1 sm:mt-0 sm:ml-3 text-[10px] font-mono uppercase border border-warm-limestone dark:border-warm-limestone/20 px-2 py-0.5 rounded text-warm-stone">
                            {featuredArticle.relatedBusiness[0].neighborhood.replace(/-/g, ' ')}
                          </span>
                        </div>
                        {featuredArticle.relatedBusiness[0].contactInfo?.website && (
                          <a
                            href={featuredArticle.relatedBusiness[0].contactInfo.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-oxblood-brown dark:text-aged-brass hover:text-soft-black dark:hover:text-white transition-colors"
                          >
                            Explore Site &rarr;
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              )}
 
              {/* Event Listings Sub-section */}
              <div className="border-t border-warm-limestone/50 dark:border-warm-limestone/10 pt-16 text-left">
                <h3 className="font-serif text-4xl md:text-5xl font-bold text-deep-spruce dark:text-ivory-paper mb-10 flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-aged-brass" />
                  Missoula Events Calendar
                </h3>
                <div className="flex flex-col gap-8">
                  {activeEvents.map((event) => (
                    <div key={event.id} className="flex flex-col sm:flex-row gap-6 items-start sm:items-center group cursor-pointer border-b border-warm-limestone/20 dark:border-warm-limestone/5 pb-8 last:border-b-0 last:pb-0">
                      <div className="relative w-full sm:w-44 aspect-[4/3] sm:aspect-square overflow-hidden bg-slate-150 dark:bg-slate-800 rounded-2xl flex-shrink-0 border border-warm-limestone/30 dark:border-warm-limestone/10">
                        <Image
                          src={decodeUrl(event.imageSrc) || '/media/placeholder.jpg'}
                          alt={event.title}
                          fill
                          sizes="(max-width: 640px) 100vw, 176px"
                          className="object-cover image-zoom-hover"
                        />
                      </div>
                      <div className="flex-grow">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-aged-brass font-bold block mb-2">
                          {event.date}
                        </span>
                        <h4 className="font-serif text-xl sm:text-2xl font-bold text-deep-spruce dark:text-white leading-tight mb-2.5 group-hover:text-oxblood-brown dark:group-hover:text-aged-brass transition-colors">
                          <Link href="/directory">
                            <span className="hover-draw-underline">{event.title}</span>
                          </Link>
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
            <div className="lg:col-span-4 flex flex-col gap-16 lg:border-l lg:border-warm-limestone/50 lg:dark:border-warm-limestone/10 lg:pl-12 text-left">
              
              {/* Secondary Article Stack */}
              {secondaryArticles && secondaryArticles.length > 0 && (
                <div className="flex flex-col gap-12">
                  {secondaryArticles.map((article: any, index: number) => (
                    <div key={article.id} className="flex flex-col gap-6 group border-b border-warm-limestone/25 dark:border-warm-limestone/5 pb-12 last:border-b-0 last:pb-0">
                      <div className="p-2.5 bg-[#fcfaf7] dark:bg-blue-black border border-warm-limestone/50 dark:border-warm-limestone/15 rounded-[2rem] shadow-md">
                        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[1.5rem]">
                          <Image
                            src={
                              decodeUrl(article.heroImage?.sizes?.featureHero?.url) ||
                              decodeUrl(article.heroImage?.url) ||
                              '/media/placeholder.jpg'
                            }
                            alt={article.heroImage?.alt || article.title}
                            fill
                            sizes="(max-width: 1024px) 100vw, 450px"
                            className="object-cover image-zoom-hover"
                          />
                        </div>
                      </div>
                      <div>
                        <span className="font-mono text-[9px] uppercase tracking-widest text-aged-brass font-bold block mb-2">
                          {index === 0 ? 'HISTORIC DISTRICT | LIFESTYLE' : 'LOCAL TRADITIONS | CRAFTSMANSHIP'}
                        </span>
                        <h3 className="font-serif text-xl md:text-2xl font-bold text-deep-spruce dark:text-white leading-tight mb-4 group-hover:text-oxblood-brown dark:group-hover:text-aged-brass transition-colors">
                          <Link href={`/articles/${article.slug}`}>
                            <span className="hover-draw-underline">{article.title}</span>
                          </Link>
                        </h3>
                        <p className="text-sm text-smoked-olive dark:text-warm-stone font-normal leading-relaxed mb-4">
                          {getWordSnippet(article.content, 45)}
                        </p>
                        <Link
                          href={`/articles/${article.slug}`}
                          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest font-bold text-oxblood-brown dark:text-aged-brass hover:text-soft-black dark:hover:text-white transition-colors group"
                        >
                          Read More <span className="transform group-hover:translate-x-0.5 transition-transform duration-300">&rarr;</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
 
              {/* Divider Line & Historical Legends Section */}
              <div className="border-t border-warm-limestone/50 dark:border-warm-limestone/10 pt-12">
                <h3 className="font-serif text-xs uppercase tracking-widest font-bold text-warm-stone dark:text-slate-500 mb-6 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-aged-brass" />
                  Historical Legends
                </h3>
                {latestHistoryStory && (
                  <div className="flex flex-col gap-6 group">
                    <div className="p-2.5 bg-[#fcfaf7] dark:bg-blue-black border border-warm-limestone/50 dark:border-warm-limestone/15 rounded-[2rem] shadow-md">
                      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[1.5rem]">
                        <Image
                          src={
                            decodeUrl(latestHistoryStory.heroImage?.sizes?.featureHero?.url) ||
                            decodeUrl(latestHistoryStory.heroImage?.url) ||
                            '/media/missoula-history-site.jpg'
                          }
                          alt={latestHistoryStory.heroImage?.alt || latestHistoryStory.title}
                          fill
                          sizes="(max-width: 1024px) 100vw, 450px"
                          className="object-cover image-zoom-hover"
                        />
                      </div>
                    </div>
                    <div>
                      <span className="font-mono text-[9px] uppercase tracking-widest text-aged-brass font-bold block mb-2">
                        {latestHistoryStory.year} | {latestHistoryStory.location}
                      </span>
                      <h4 className="font-serif text-xl font-bold text-deep-spruce dark:text-white leading-tight mb-4 group-hover:text-oxblood-brown dark:group-hover:text-aged-brass transition-colors">
                        <Link href={`/history/${latestHistoryStory.slug}`}>
                          <span className="hover-draw-underline">{latestHistoryStory.title}</span>
                        </Link>
                      </h4>
                      <p className="text-sm text-smoked-olive dark:text-warm-stone font-normal leading-relaxed mb-4">
                        {latestHistoryStory.excerpt}
                      </p>
                      <Link
                        href={`/history/${latestHistoryStory.slug}`}
                        className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest font-bold text-oxblood-brown dark:text-aged-brass hover:text-soft-black dark:hover:text-white transition-colors group"
                      >
                        Read Story &rarr;
                      </Link>
                    </div>
                  </div>
                )}
              </div>

            </div>
 
          </div>
        </section>
      </div>
 
      {/* SECTION 2: Explore Missoula Categories */}
      <section className="bg-[#FAF7F2] dark:bg-soft-black py-16 md:py-28 border-y border-warm-limestone/40 dark:border-warm-limestone/10">
        <div className="max-w-[1320px] mx-auto px-6 sm:px-8">
          <h2 className="font-serif text-3xl md:text-5xl font-normal text-center text-deep-spruce dark:text-ivory-paper mb-16 animate-fade-in">
            Explore Missoula Pillars
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Category 1: Food & Drink */}
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

            {/* Category 2: Shopping Local */}
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

            {/* Category 3: Local Registry */}
            <PillarCard
              title="Local Registry"
              desc="People, places, and historic narratives that define our Montana heritage."
              href="/directory"
              backText="Accessing the Missoula Archive Vault..."
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
        </div>
      </section>
 
      {/* SECTION 3: Missoula Dining Guide */}
      <section className="bg-ivory-paper dark:bg-soft-black py-16 md:py-28 border-b border-warm-limestone/40 dark:border-warm-limestone/10">
        <div className="max-w-[1320px] mx-auto px-6 sm:px-8 text-center">
          <h2 className="font-serif text-3xl md:text-5xl font-medium text-deep-spruce dark:text-white mb-4">
            Missoula Dining Guide
          </h2>
          <span className="font-serif italic text-warm-stone text-lg block mb-12">The Garden City’s Finest Eateries, Personally Curated</span>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {guideListings.map((listing: any) => {
              const imageSrc =
                decodeUrl(listing.featuredImage?.sizes?.thumbnail?.url) ||
                decodeUrl(listing.featuredImage?.url) ||
                '/media/placeholder.jpg'
              const categoryLabel = listing.category === 'food-drink' ? 'DINING & DRINK' : 'SHOPPING LOCAL'
 
              return (
                <div
                  key={listing.id}
                  className="bg-[#faf7f2] dark:bg-blue-black border border-warm-limestone/50 dark:border-warm-limestone/15 rounded-[2.2rem] overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 group text-left"
                >
                  <div>
                    {/* Landscape Framed Thumbnail */}
                    <div className="p-2 bg-white dark:bg-slate-900 border-b border-warm-limestone/30 dark:border-warm-limestone/10">
                      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.8rem]">
                        <Image
                          src={imageSrc}
                          alt={listing.featuredImage?.alt || listing.businessName}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 450px"
                          className="object-cover image-zoom-hover"
                        />
                      </div>
                    </div>
                    {/* Content padding */}
                    <div className="p-8">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-aged-brass font-bold block mb-2.5">
                        {categoryLabel}
                      </span>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-deep-spruce dark:text-white tracking-tight leading-snug mb-3">
                        <span className="hover-draw-underline">{listing.businessName}</span>
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-normal line-clamp-3">
                        {get100WordSnippet(listing.description)}
                      </p>
                    </div>
                  </div>
 
                  {/* Card bottom details */}
                  <div className="p-8 pt-0 border-t border-warm-limestone/20 dark:border-warm-limestone/5 mt-4 flex justify-between items-center">
                    {listing.contactInfo?.website && (
                      <a
                        href={listing.contactInfo.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono uppercase font-bold text-oxblood-brown dark:text-aged-brass hover:text-soft-black dark:hover:text-white underline underline-offset-4 hover-draw-underline"
                      >
                        Explore Site &rarr;
                      </a>
                    )}
                    <span className="text-[10px] font-mono uppercase tracking-wide text-warm-stone">
                      {listing.neighborhood.replace(/-/g, ' ')}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
 
      {/* Newsletter Signup */}
      <section className="max-w-[1320px] mx-auto px-6 sm:px-8 py-16 md:py-28 text-left">
        <div className="bg-[#EBE5D8] dark:bg-blue-black/20 border border-warm-limestone/80 dark:border-warm-limestone/15 rounded-[2.5rem] p-10 md:p-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-aged-brass font-bold">
                Weekly Digest
              </span>
              <h2 className="text-3xl md:text-5xl font-serif text-deep-spruce dark:text-white mt-4 font-normal leading-tight">
                Get Missoula stories delivered.
              </h2>
              <p className="text-smoked-olive dark:text-warm-stone mt-4 max-w-[45ch] leading-relaxed text-base sm:text-lg font-normal">
                Receive deep-dive interviews, neighborhood guides, and curated recommendations for the best local food, drinks, and shops directly in your inbox.
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
      </section>

      {/* Curator Spotlight - Horizontal Footer Card */}
      <section className="max-w-[1320px] mx-auto px-6 sm:px-8 py-8 border-t border-warm-limestone/20 dark:border-warm-limestone/10">
        <div className="bg-gradient-to-r from-[#faf8f4]/60 to-[#f5f2e9]/60 dark:from-slate-900/20 dark:to-slate-950/20 border border-warm-limestone/40 dark:border-warm-limestone/10 p-8 rounded-[2rem] flex flex-col md:flex-row items-center gap-8 text-left">
          <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-white dark:border-slate-850 shadow-md shrink-0">
            <Image
              src={
                decodeUrl(curatorProfile?.photo?.sizes?.thumbnail?.url) ||
                decodeUrl(curatorProfile?.photo?.url) ||
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
            <h4 className="font-serif text-xl font-bold text-deep-spruce dark:text-white">
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
              className="inline-block bg-transparent hover:bg-deep-spruce text-deep-spruce hover:text-white dark:text-aged-brass dark:hover:bg-aged-brass dark:hover:text-soft-black border border-deep-spruce dark:border-aged-brass px-6 py-3 rounded-lg font-mono text-[10px] uppercase tracking-widest font-bold transition-all shadow-sm active:scale-[0.98]"
            >
              Get in Touch &rarr;
            </Link>
          </div>
        </div>
      </section>
 
      {/* Business Owner CTA */}
      <section id="featured" className="bg-deep-spruce text-ivory-paper py-16 md:py-28 border-t border-warm-limestone/10 text-left">
        <div className="max-w-[1320px] mx-auto px-6 sm:px-8 lg:flex lg:items-center lg:justify-between lg:gap-12">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-serif font-normal leading-tight">
              Get Featured.<br />Let's tell your story.
            </h2>
            <p className="text-warm-stone/80 text-base sm:text-lg font-normal leading-relaxed mt-6 max-w-[45ch]">
              Are you a local coffee roaster, retail boutique, or neighborhood bistro? We want to highlight your business in the next guide.
            </p>
          </div>
          <div className="mt-10 lg:mt-0">
            <Link
              href="/spotlight"
              className="inline-block bg-deep-spruce text-ivory-paper hover:bg-oxblood-brown font-mono text-xs uppercase tracking-widest font-bold px-8 py-5 rounded-lg active:scale-[0.98] transition-all shadow-md cursor-pointer border-2 border-aged-brass"
            >
              Become a Legend &rarr;
            </Link>
          </div>
        </div>
      </section>
 
      {/* Footer */}
      <Footer />
    </div>
  )
}
