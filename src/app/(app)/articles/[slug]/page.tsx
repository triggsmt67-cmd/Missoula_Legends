import { getPayload } from 'payload'
import config from '@payload-config'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { RichText } from '@/components/RichText'
import { seedArticles } from '../../../../data/seedData.js'

export const dynamic = 'force-dynamic'

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
    console.warn('Database connection failed, falling back to seed data:', error.message)
    // Fallback to seed data if database fails
    const seedArticle = seedArticles.find(a => a.slug === slug)
    if (seedArticle) {
      article = {
        ...seedArticle,
        heroImage: {
          url: `/media/${seedArticle.mediaKey}`,
          alt: seedArticle.title,
        },
        createdAt: new Date().toISOString()
      }
    }
  }

  if (!article) {
    notFound()
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Recent'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-emerald-100 dark:selection:bg-emerald-950 transition-colors duration-300">
      {/* Header Navigation */}
      <header className="sticky top-0 z-40 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <Link href="/" className="font-bold text-base sm:text-xl tracking-tight hover:text-emerald-800 dark:hover:text-emerald-400 transition-colors hover-draw-underline">
            MISSOULA <span className="hidden min-[380px]:inline font-mono text-slate-400 dark:text-slate-550 font-normal">LEGENDS</span>
          </Link>
          <nav className="flex items-center gap-4 sm:gap-8 text-xs sm:text-sm font-medium tracking-wide">
            <Link href="/" className="text-slate-600 dark:text-slate-400 hover:text-emerald-800 dark:hover:text-emerald-400 transition-colors hover-draw-underline">
              Home
            </Link>
            <Link href="/archives" className="text-slate-600 dark:text-slate-400 hover:text-emerald-800 dark:hover:text-emerald-400 transition-colors hover-draw-underline">
              Archives
            </Link>
            <Link href="/directory" className="text-slate-600 dark:text-slate-400 hover:text-emerald-800 dark:hover:text-emerald-400 transition-colors hover-draw-underline">
              Directory
            </Link>
          </nav>
        </div>
      </header>

      {/* Article Header Section */}
      <section className="relative bg-[#fdfbf7] dark:bg-slate-900/10 border-b border-slate-200/40 dark:border-slate-900/60 py-20 md:py-28 text-center overflow-hidden">
        {/* Subtle Map Background Watermark */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.07] dark:opacity-[0.04] pointer-events-none mix-blend-multiply dark:mix-blend-screen bg-center bg-no-repeat bg-[length:450px]"
          style={{ backgroundImage: 'url("/media/missoula-map-bg.webp")' }}
        />
        
        <div className="relative z-10 max-w-[900px] mx-auto px-4 sm:px-6">
          <span className="font-mono text-emerald-800 dark:text-emerald-400 tracking-[0.25em] text-[10px] sm:text-xs uppercase font-bold mb-4 block w-fit mx-auto bg-emerald-50 dark:bg-emerald-950/40 px-3.5 py-1 rounded">
            EDITORIAL JOURNAL
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white font-serif leading-tight">
            {article.title}
          </h1>
        </div>
      </section>

      {/* Hero Image Section (High quality original photo with overlap) */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 -mt-8 md:-mt-12 relative z-10 animate-fade-in [animation-delay:100ms]">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[2rem] bg-slate-950 shadow-xl border border-slate-250/20 dark:border-slate-800/40">
          <Image
            src={
              decodeUrl(article.heroImage?.sizes?.featureHero?.url) ||
              decodeUrl(article.heroImage?.url) ||
              '/media/missoula-hero-twilight.png'
            }
            alt={article.heroImage?.alt || article.title}
            fill
            priority
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-cover object-center scale-102 hover:scale-105 transition-transform duration-700 ease-out"
          />
        </div>
      </section>

      {/* Elegant Separator between Image and Text */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 my-12 md:my-16">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent"></div>
      </div>

      {/* Main Content Layout with Sidebar */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 pb-20 md:pb-32 animate-fade-in [animation-delay:200ms]">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Article Body */}
          <div className="flex-1 max-w-[800px] w-full">
            <div className="prose prose-slate dark:prose-invert prose-lg md:prose-xl font-light leading-relaxed prose-headings:font-serif prose-headings:font-bold prose-a:text-emerald-700 dark:prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline prose-img:rounded-2xl">
              <RichText data={article.content} />
            </div>

            {/* Date at the bottom of the article */}
            <div className="mt-12 pt-6 border-t border-slate-200/60 dark:border-slate-800/60 text-xs font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Published on {formatDate(article.createdAt)}
            </div>

            {/* Back to Archives link */}
            <div className="mt-8 pt-8 border-t border-slate-200/60 dark:border-slate-800/60">
              <Link 
                href="/archives" 
                className="group inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
              >
                <span className="transform group-hover:-translate-x-1 transition-transform duration-300">&larr;</span> Back to Archives
              </Link>
            </div>
          </div>

          {/* Right Column: Sidebar (w-full lg:w-[320px]) */}
          <aside className="w-full lg:w-[320px] shrink-0 sticky top-28 flex flex-col gap-8">
            {/* Sidebar Box 1: Curator Profile Card */}
            <div className="bg-[#fdfbf7] dark:bg-slate-900/40 border border-slate-250/50 dark:border-slate-800/60 p-6 sm:p-8 rounded-[2rem]">
              <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white mb-4">Curator Spotlight</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-light leading-relaxed mb-6">
                {curatorProfile?.bio || 'Trevor Riggs has spent years helping Montana businesses tell clearer stories, reach the right people, and turn attention into real customers.'}
              </p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full overflow-hidden relative border border-slate-200 dark:border-slate-700">
                  <Image
                    src={
                      decodeUrl(curatorProfile?.photo?.sizes?.thumbnail?.url) ||
                      decodeUrl(curatorProfile?.photo?.url) ||
                      '/media/missoula-curator.jpg'
                    }
                    alt={curatorProfile?.name || 'Trevor Riggs'}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    {curatorProfile?.name || 'Trevor Riggs'}
                  </div>
                  <div className="text-[10px] uppercase tracking-widest font-mono text-emerald-700 dark:text-emerald-500">
                    {curatorProfile?.title ? curatorProfile.title.split('•')[0].trim() : 'Missoula Curator'}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Box 2: Dynamic Custom Sidebar or Registry Notes */}
            <div className="bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800/60 p-6 sm:p-8 rounded-[2rem]">
              <h3 className="font-sans text-xs uppercase tracking-widest font-bold text-slate-900 dark:text-white mb-4">
                {article.sidebar?.title || 'Registry Notes'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-light mb-4">
                {article.sidebar?.text || "This article registry focuses on Missoula's local history and community craftsmanship. Check out the Directory to support independent business owners."}
              </p>
              <Link 
                href={article.sidebar?.linkUrl || '/directory'}
                className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-450 hover:text-emerald-950 dark:hover:text-emerald-350 underline underline-offset-4 transition-colors"
              >
                {article.sidebar?.linkText || 'Local Directory'} &rarr;
              </Link>
            </div>
          </aside>

        </div>
      </section>

      {/* Basic Footer */}
      <footer className="bg-slate-950 py-12 border-t border-slate-900 mt-12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 text-center">
          <p className="text-slate-500 text-sm font-light">
            © {new Date().getFullYear()} Missoula Legends. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
