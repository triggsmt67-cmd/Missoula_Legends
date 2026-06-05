import { getPayload } from 'payload'
import config from '@payload-config'
import Image from 'next/image'
import Link from 'next/link'
import { RichText } from '@/components/RichText'
import { NewsletterForm } from '@/components/NewsletterForm'
import { seedArticles, seedDirectory } from '../../data/seedData.js'

function getPlainText(data: any): string {
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

export const dynamic = 'force-dynamic'

export default async function Home() {
  let articles = []
  let directoryListings = []

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

  // Slice data for precise section mapping
  const featuredArticle = articles[0]
  const secondaryArticle = articles[1]
  const guideListings = directoryListings.slice(0, 3)

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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-emerald-100 dark:selection:bg-emerald-950 selection:text-emerald-900 dark:selection:text-emerald-300 transition-colors duration-300">
      {/* Header Navigation */}
      <header className="sticky top-0 z-40 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl tracking-tight hover:text-emerald-800 dark:hover:text-emerald-400 transition-colors hover-draw-underline">
            MISSOULA <span className="font-mono text-slate-400 dark:text-slate-500 font-normal">LEGENDS</span>
          </Link>
          <nav className="flex items-center gap-8 text-sm font-medium tracking-wide">
            <Link href="/directory" className="text-slate-600 dark:text-slate-400 hover:text-emerald-800 dark:hover:text-emerald-400 transition-colors hover-draw-underline">
              Explore Directory
            </Link>
            <Link
              href="#featured"
              className="bg-emerald-800 text-white px-5 py-2.5 rounded-full hover:bg-emerald-900 active:scale-[0.98] hover:scale-[1.01] transition-all font-medium shadow-sm hover:shadow"
            >
              Get Featured
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-[1400px] mx-auto px-6 pt-24 pb-20 md:pt-36 md:pb-28 animate-fade-in">
        <div className="max-w-4xl">
          <span className="font-mono text-xs uppercase tracking-widest text-emerald-800 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-3.5 py-1.5 rounded-full border border-emerald-100/50 dark:border-emerald-900/30">
            Local Curation
          </span>
          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter leading-none text-slate-950 dark:text-white mt-8 font-sans">
            The Definitive Guide to Missoula.
          </h1>
          <p className="text-lg md:text-2xl text-slate-500 dark:text-slate-400 font-light leading-relaxed mt-6 max-w-[55ch]">
            An editorial registry highlighting the local makers, cultural cornerstones, and historic neighborhoods that define the Garden City.
          </p>
          <div className="mt-10">
            <Link
              href="/directory"
              className="group inline-flex items-center gap-3 text-emerald-800 dark:text-emerald-400 hover:text-emerald-950 dark:hover:text-emerald-300 font-semibold tracking-wide transition-colors"
            >
              Explore the Local Directory
              <span className="group-hover:translate-x-1.5 transition-transform duration-300">
                &rarr;
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 1: Editorial Showcase & Sidebar */}
      <section className="bg-white dark:bg-slate-900/40 border-y border-slate-200/60 dark:border-slate-800/60 py-24">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-20">
            
            {/* Left Side: Large Featured Article & Events Grid (2/3 width) */}
            <div className="lg:col-span-2 flex flex-col gap-16">
              
              {/* Featured Article */}
              {featuredArticle && (
                <article className="group flex flex-col">
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800 rounded-3xl mb-8 border border-slate-200/20 dark:border-slate-800/40">
                    <Image
                      src={featuredArticle.heroImage?.sizes?.featureHero?.url || featuredArticle.heroImage?.url || '/media/placeholder.jpg'}
                      alt={featuredArticle.heroImage?.alt || featuredArticle.title}
                      fill
                      priority
                      className="object-cover image-zoom-hover"
                    />
                  </div>
                  <div>
                    <span className="font-mono text-xs uppercase tracking-widest text-amber-900 dark:text-amber-500 font-bold block mb-3">
                      COMMUNITY SPOTLIGHT | CRAFTSMANSHIP
                    </span>
                    <h2 className="font-serif text-3xl md:text-5xl font-bold text-slate-950 dark:text-white tracking-tight leading-tight mb-6 hover:text-emerald-850 dark:hover:text-emerald-450 transition-colors">
                      <span className="hover-draw-underline">{featuredArticle.title}</span>
                    </h2>
                    
                    <RichText data={featuredArticle.content} className="mb-8 [&_a]:hover-draw-underline" />

                    {featuredArticle.relatedBusiness?.[0] && (
                      <div className="border-t border-slate-100 dark:border-slate-800/60 pt-6 mt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 dark:bg-slate-950/60 p-6 rounded-2xl border border-slate-200/30 dark:border-slate-800/30 hover-magnetic">
                        <div>
                          <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 block mb-1">
                            Featured Business
                          </span>
                          <span className="font-bold text-slate-900 dark:text-slate-100 text-base">
                            {featuredArticle.relatedBusiness[0].businessName}
                          </span>
                          <span className="text-xs font-mono uppercase bg-slate-200/60 dark:bg-slate-800 px-2.5 py-1 rounded text-slate-500 dark:text-slate-400 ml-2">
                            {featuredArticle.relatedBusiness[0].neighborhood}
                          </span>
                        </div>
                        {featuredArticle.relatedBusiness[0].contactInfo?.website && (
                          <a
                            href={featuredArticle.relatedBusiness[0].contactInfo.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-semibold text-emerald-800 dark:text-emerald-450 hover:text-emerald-950 dark:hover:text-emerald-300 underline underline-offset-4 transition-colors hover-draw-underline"
                          >
                            Visit Website &rarr;
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              )}

              {/* Event Listings Sub-section */}
              <div className="border-t border-slate-200/60 dark:border-slate-800/60 pt-16">
                <h3 className="font-serif text-3xl font-bold text-slate-950 dark:text-white mb-10">
                  Missoula Events You Don't Want To Miss
                </h3>
                <div className="flex flex-col gap-8">
                  {mockEvents.map((event) => (
                    <div key={event.id} className="flex flex-col sm:flex-row gap-6 items-start group cursor-pointer">
                      <div className="relative w-full sm:w-44 aspect-[4/3] sm:aspect-square overflow-hidden bg-slate-150 dark:bg-slate-800 rounded-2xl flex-shrink-0">
                        <Image
                          src={event.imageSrc}
                          alt={event.title}
                          fill
                          className="object-cover image-zoom-hover"
                        />
                      </div>
                      <div className="flex-grow">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-amber-900 dark:text-amber-500 font-bold block mb-1.5">
                          {event.date}
                        </span>
                        <h4 className="font-serif text-lg font-bold text-slate-950 dark:text-white leading-tight mb-2 group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition-colors">
                          <span className="hover-draw-underline">{event.title}</span>
                        </h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-light leading-relaxed">
                          {event.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Side: Curator Spotlight & Secondary Articles Stack (1/3 width) */}
            <div className="flex flex-col gap-12 lg:border-l lg:border-slate-200/60 lg:dark:border-slate-800/60 lg:pl-12">
              
              {/* Curator Spotlight */}
              <div className="bg-[#fdfbf7] dark:bg-slate-900/20 border border-slate-250/30 dark:border-slate-800/50 p-8 rounded-[2rem] text-center lg:text-left flex flex-col items-center lg:items-start hover-magnetic group">
                <div className="relative w-32 h-32 rounded-full overflow-hidden mb-6 border-2 border-amber-900/20 dark:border-amber-800/40">
                  <Image
                    src="/media/missoula-curator.jpg"
                    alt="Sarah Jenkins"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="font-serif text-2xl font-bold text-slate-950 dark:text-white">
                  Sarah Jenkins
                </h3>
                <span className="font-mono text-[10px] uppercase tracking-widest text-amber-900 dark:text-amber-555 font-bold mt-1 mb-4 block">
                  Missoula Curator • Local Historian
                </span>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-light leading-relaxed text-center lg:text-left">
                  Sarah has been documenting Missoula's cultural cornerstones, historical landmarks, and independent craft scenes for over a decade. A native Montanan who believes the best local stories are found off the beaten path.
                </p>
                <div className="w-full border-t border-slate-200/40 dark:border-slate-800/60 my-6"></div>
                <Link
                  href="mailto:sarah@missoulalegends.com"
                  className="text-xs font-mono uppercase font-bold tracking-widest text-emerald-800 dark:text-emerald-450 hover:text-emerald-950 dark:hover:text-emerald-350 transition-colors hover-draw-underline"
                >
                  Contact Curator &rarr;
                </Link>
              </div>

              {/* Secondary Article Stack */}
              {secondaryArticle && (
                <div className="flex flex-col gap-6 group">
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200/20 dark:border-slate-800/40">
                    <Image
                      src={secondaryArticle.heroImage?.sizes?.featureHero?.url || secondaryArticle.heroImage?.url || '/media/placeholder.jpg'}
                      alt={secondaryArticle.heroImage?.alt || secondaryArticle.title}
                      fill
                      className="object-cover image-zoom-hover"
                    />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-amber-900 dark:text-amber-500 font-bold block mb-2">
                      HISTORIC HIP STRIP | LIFESTYLE
                    </span>
                    <h3 className="font-serif text-xl md:text-2xl font-bold text-slate-950 dark:text-white leading-tight mb-4 group-hover:text-emerald-850 dark:group-hover:text-emerald-400 transition-colors">
                      <span className="hover-draw-underline">{secondaryArticle.title}</span>
                    </h3>
                    <RichText data={secondaryArticle.content} className="text-sm line-clamp-4" />
                    <Link
                      href="/directory"
                      className="inline-block mt-4 text-xs font-mono uppercase font-bold tracking-widest text-emerald-850 dark:text-emerald-450 hover:text-emerald-950 dark:hover:text-emerald-300 underline underline-offset-4 hover-draw-underline"
                    >
                      Visit Neighborhood &rarr;
                    </Link>
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2: Explore Missoula Categories */}
      <section className="bg-slate-50 dark:bg-slate-950 py-24 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-[1400px] mx-auto px-6">
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-center text-slate-950 dark:text-white mb-16 animate-fade-in">
            Explore Missoula
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            
            {/* Category 1: Food & Drink */}
            <div className="text-center flex flex-col items-center justify-between p-6 rounded-3xl hover-magnetic bg-transparent hover:bg-white dark:hover:bg-slate-900/20 border border-transparent hover:border-slate-200/40 dark:hover:border-slate-800/40 transition-all duration-300 group">
              <div>
                <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-950/20 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
                  {/* Fork & Knife SVG */}
                  <svg className="w-8 h-8 text-amber-900 dark:text-amber-500" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-8.03c2.09-.13 3.75-1.85 3.75-3.97V2h-2v7zm10-5c-1 0-2 .9-2 2v5c0 1.66 1.34 3 3 3v9h2v-9c1.66 0 3-1.34 3-3V6c0-1.1-.9-2-2-2h-4z"/>
                  </svg>
                </div>
                <h3 className="font-serif text-xl font-bold text-slate-950 dark:text-white mb-3">
                  Food & Drink
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-light leading-relaxed max-w-[25ch] mb-6">
                  Best bites, wood-fired bakeries, craft distilleries, and neighborhood tables.
                </p>
              </div>
              <Link
                href="/directory?category=food-drink"
                className="group/btn bg-amber-900 text-white font-mono text-xs uppercase tracking-widest px-6 py-3 rounded hover:bg-amber-950 active:scale-[0.98] transition-all font-bold cursor-pointer inline-flex items-center gap-2"
              >
                EXPLORE
                <span className="group-hover/btn:translate-x-1 transition-transform duration-300">&rarr;</span>
              </Link>
            </div>

            {/* Category 2: Shopping */}
            <div className="text-center flex flex-col items-center justify-between p-6 rounded-3xl hover-magnetic bg-transparent hover:bg-white dark:hover:bg-slate-900/20 border border-transparent hover:border-slate-200/40 dark:hover:border-slate-800/40 transition-all duration-300 group">
              <div>
                <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-950/20 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
                  {/* Shopping Bag SVG */}
                  <svg className="w-8 h-8 text-amber-900 dark:text-amber-500" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C9.24 2 7 4.24 7 7v1H4v14h16V8h-3V7c0-2.76-2.24-5-5-5zm-3 6c0-1.66 1.34-3 3-3s3 1.34 3 3v1H9V8zm9 12H6V10h12v10z"/>
                  </svg>
                </div>
                <h3 className="font-serif text-xl font-bold text-slate-950 dark:text-white mb-3">
                  Shopping
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-light leading-relaxed max-w-[25ch] mb-6">
                  Legendary record stores, independent bookshops, and boutique makers.
                </p>
              </div>
              <Link
                href="/directory?category=shopping"
                className="group/btn bg-amber-900 text-white font-mono text-xs uppercase tracking-widest px-6 py-3 rounded hover:bg-amber-950 active:scale-[0.98] transition-all font-bold cursor-pointer inline-flex items-center gap-2"
              >
                EXPLORE
                <span className="group-hover/btn:translate-x-1 transition-transform duration-300">&rarr;</span>
              </Link>
            </div>

            {/* Category 3: Local Legends */}
            <div className="text-center flex flex-col items-center justify-between p-6 rounded-3xl hover-magnetic bg-transparent hover:bg-white dark:hover:bg-slate-900/20 border border-transparent hover:border-slate-200/40 dark:hover:border-slate-800/40 transition-all duration-300 group">
              <div>
                <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-950/20 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
                  {/* Two Users SVG */}
                  <svg className="w-8 h-8 text-amber-900 dark:text-amber-500" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                  </svg>
                </div>
                <h3 className="font-serif text-xl font-bold text-slate-950 dark:text-white mb-3">
                  Local Legends
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-light leading-relaxed max-w-[25ch] mb-6">
                  People, places, and history that shape our town and community.
                </p>
              </div>
              <Link
                href="/directory"
                className="group/btn bg-amber-900 text-white font-mono text-xs uppercase tracking-widest px-6 py-3 rounded hover:bg-amber-950 active:scale-[0.98] transition-all font-bold cursor-pointer inline-flex items-center gap-2"
              >
                EXPLORE
                <span className="group-hover/btn:translate-x-1 transition-transform duration-300">&rarr;</span>
              </Link>
            </div>

            {/* Category 4: Lifestyle */}
            <div className="text-center flex flex-col items-center justify-between p-6 rounded-3xl hover-magnetic bg-transparent hover:bg-white dark:hover:bg-slate-900/20 border border-transparent hover:border-slate-200/40 dark:hover:border-slate-800/40 transition-all duration-300 group">
              <div>
                <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-950/20 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
                  {/* Calendar SVG */}
                  <svg className="w-8 h-8 text-amber-900 dark:text-amber-500" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"/>
                  </svg>
                </div>
                <h3 className="font-serif text-xl font-bold text-slate-950 dark:text-white mb-3">
                  Lifestyle & Things
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-light leading-relaxed max-w-[25ch] mb-6">
                  Events, wellness, shopping, seasonal fun, and local life.
                </p>
              </div>
              <Link
                href="/directory?category=lifestyle"
                className="group/btn bg-amber-900 text-white font-mono text-xs uppercase tracking-widest px-6 py-3 rounded hover:bg-amber-950 active:scale-[0.98] transition-all font-bold cursor-pointer inline-flex items-center gap-2"
              >
                EXPLORE
                <span className="group-hover/btn:translate-x-1 transition-transform duration-300">&rarr;</span>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 3: Missoula Dining & Shopping Guide */}
      <section className="bg-white dark:bg-slate-900/20 py-24 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-[1400px] mx-auto px-6 animate-fade-in">
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-center text-slate-950 dark:text-white mb-4">
            Missoula Dining Guide: Best Places To Eat
          </h2>
          <div className="w-20 h-0.5 bg-amber-900 dark:bg-amber-500 mx-auto mb-16"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {guideListings.map((listing: any) => {
              const imageSrc =
                listing.featuredImage?.sizes?.thumbnail?.url || listing.featuredImage?.url || '/media/placeholder.jpg'
              const categoryLabel = listing.category === 'food-drink' ? 'MISSOULA RESTAURANTS | FOOD & DRINK' : 'MISSOULA BUSINESSES | SHOPPING'

              return (
                <div
                  key={listing.id}
                  className="bg-[#fdfbf7] dark:bg-slate-900/40 border border-slate-200/40 dark:border-slate-800/80 rounded-[1.5rem] overflow-hidden flex flex-col justify-between hover-magnetic shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.03)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] transition-all duration-300 group"
                >
                  <div>
                    {/* Landscape Thumbnail */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-50 dark:bg-slate-800 border-b border-slate-200/20 dark:border-slate-800/40">
                      <Image
                        src={imageSrc}
                        alt={listing.featuredImage?.alt || listing.businessName}
                        fill
                        className="object-cover image-zoom-hover"
                      />
                    </div>
                    {/* Content padding */}
                    <div className="p-7">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-amber-900 dark:text-amber-500 font-bold block mb-2">
                        {categoryLabel}
                      </span>
                      <h3 className="font-serif text-xl md:text-2xl font-bold text-slate-950 dark:text-white tracking-tight leading-snug mb-3">
                        <span className="hover-draw-underline">{listing.businessName}</span>
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-light line-clamp-3">
                        {getPlainText(listing.description)}
                      </p>
                    </div>
                  </div>

                  {/* Card bottom details */}
                  <div className="p-7 pt-0 border-t border-slate-100/50 dark:border-slate-800/50 mt-4 flex justify-between items-center">
                    {listing.contactInfo?.website && (
                      <a
                        href={listing.contactInfo.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono uppercase font-bold text-emerald-800 dark:text-emerald-450 hover:text-emerald-950 dark:hover:text-emerald-350 underline underline-offset-4 hover-draw-underline"
                      >
                        Explore Website &rarr;
                      </a>
                    )}
                    <span className="text-[10px] font-mono uppercase tracking-wide text-slate-400 dark:text-slate-500">
                      {listing.neighborhood}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="max-w-[1400px] mx-auto px-6 py-24 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-emerald-800 dark:text-emerald-400 font-semibold">
              Weekly Digest
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-950 dark:text-white mt-4">
              Get Missoula stories delivered.
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-4 max-w-[45ch] leading-relaxed text-lg font-light">
              Receive deep-dive interviews, neighborhood guides, and curated recommendations for the best local food, drinks, and shops directly in your inbox.
            </p>
          </div>
          <div>
            <NewsletterForm />
            <span className="text-xs text-slate-400 dark:text-slate-500 mt-3 block pl-2 font-light">
              No spam. Unsubscribe anytime.
            </span>
          </div>
        </div>
      </section>

      {/* Business Owner CTA */}
      <section id="featured" className="bg-slate-900 dark:bg-slate-950 text-white py-24 md:py-32 border-t border-slate-800">
        <div className="max-w-[1400px] mx-auto px-6 text-center lg:text-left lg:flex lg:items-center lg:justify-between lg:gap-12">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
              Get Featured.<br />Let's tell your story.
            </h2>
            <p className="text-slate-400 dark:text-slate-400 text-lg md:text-xl font-light leading-relaxed mt-6 max-w-[45ch]">
              Are you a local coffee roaster, retail boutique, or neighborhood bistro? We want to highlight your business in the next guide.
            </p>
          </div>
          <div className="mt-10 lg:mt-0">
            <Link
              href="mailto:hello@missoulalegends.com"
              className="inline-block bg-white text-slate-950 hover:bg-slate-100 font-bold px-8 py-5 rounded-2xl active:scale-[0.98] hover:scale-[1.01] transition-all shadow-lg cursor-pointer"
            >
              Get In Touch &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950 py-12">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-slate-400 dark:text-slate-500 font-light">
            &copy; {new Date().getFullYear()} Missoula Legends. All rights reserved.
          </p>
          <div className="flex gap-8 text-sm text-slate-400 dark:text-slate-500 font-light">
            <Link href="/directory" className="hover:text-emerald-800 dark:hover:text-emerald-400 transition-colors hover-draw-underline">
              Directory
            </Link>
            <Link href="/" className="hover:text-emerald-800 dark:hover:text-emerald-400 transition-colors hover-draw-underline">
              Editorial
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
