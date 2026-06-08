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

  let article = null

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
      <section className="bg-[#fdfbf7] dark:bg-slate-900/10 border-b border-slate-200/40 dark:border-slate-900/60 py-16 md:py-24 text-center">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6">
          {/* Category/Date Metadata */}
          <span className="font-mono text-emerald-800 dark:text-emerald-400 tracking-[0.2em] text-xs uppercase font-bold mb-6 block w-fit mx-auto">
            {formatDate(article.createdAt)}
          </span>
          {/* Article Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white font-serif leading-tight">
            {article.title}
          </h1>
        </div>
      </section>

      {/* Hero Image Section (High quality original photo with overlap) */}
      <section className="max-w-[1100px] mx-auto px-4 sm:px-6 -mt-8 md:-mt-12 relative z-10 animate-fade-in [animation-delay:100ms]">
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
            sizes="(max-width: 1024px) 100vw, 1100px"
            className="object-cover object-center scale-102 hover:scale-105 transition-transform duration-700 ease-out"
          />
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="max-w-[800px] mx-auto px-4 sm:px-6 py-12 md:py-20 animate-fade-in [animation-delay:200ms]">
        <div className="prose prose-slate dark:prose-invert prose-lg md:prose-xl mx-auto font-light leading-relaxed prose-headings:font-serif prose-headings:font-bold prose-a:text-emerald-700 dark:prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline prose-img:rounded-2xl">
          <RichText data={article.content} />
        </div>

        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <Link href="/archives" className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">
            <span className="transform group-hover:-translate-x-1 transition-transform">&larr;</span> Back to Archives
          </Link>
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
