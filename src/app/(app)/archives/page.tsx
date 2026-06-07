import { getPayload } from 'payload'
import config from '@payload-config'
import Image from 'next/image'
import Link from 'next/link'
import { seedArticles } from '../../../data/seedData.js'

export const dynamic = 'force-dynamic'

export default async function ArchivesPage() {
  let articles = []

  try {
    const payload = await getPayload({ config })
    const resArticles = await payload.find({
      collection: 'articles',
      depth: 1,
      sort: '-createdAt',
      limit: 100,
    })
    articles = resArticles.docs
  } catch (error: any) {
    console.warn('Database connection failed, falling back to seed data:', error.message)
    articles = seedArticles.map((article, idx) => ({
      id: `article_${idx}`,
      title: article.title,
      slug: article.slug,
      content: article.content,
      heroImage: {
        url: `/media/${article.mediaKey}`,
        alt: article.title,
      },
      createdAt: new Date().toISOString()
    }))
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Recent'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  // Helper to extract a text snippet from RichText payload
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
        
        if (data.root) traverse(data.root)
        else if (Array.isArray(data.children)) data.children.forEach(traverse)
      } catch (e) {
        return ''
      }
    }

    const words = text.trim().split(/\s+/)
    if (words.length > 100) {
      return words.slice(0, 100).join(' ') + '...'
    }
    return text.trim()
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
            <Link href="/directory" className="text-slate-600 dark:text-slate-400 hover:text-emerald-800 dark:hover:text-emerald-400 transition-colors hover-draw-underline">
              Directory
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative w-full h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden bg-slate-950">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <Image
            src="/media/black-coffee.jpg" // Using an existing premium image
            alt="Missoula Archives Background"
            fill
            priority
            className="object-cover object-center scale-105 opacity-60 dark:opacity-40"
          />
          <div className="absolute inset-0 bg-slate-950/60 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-[1400px] w-full mx-auto px-4 sm:px-6 text-center">
          <span className="font-mono text-emerald-400 tracking-[0.2em] text-sm uppercase font-bold mb-4 block animate-fade-in opacity-90">
            The Vault
          </span>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tighter leading-none text-white font-serif mb-6 animate-fade-in drop-shadow-xl">
            Archives
          </h1>
          <p className="text-lg md:text-xl text-slate-300 font-light max-w-2xl mx-auto animate-fade-in [animation-delay:200ms]">
            Explore our collection of stories, historical deep dives, and highlights from the heart of Missoula.
          </p>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-16 md:py-24">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* Left Column: Articles List (approx 2/3 width) */}
          <div className="flex-1">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-10">
              <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white">All Articles</h2>
              <span className="font-mono text-sm text-slate-500">{articles.length} Stories</span>
            </div>

            <div className="flex flex-col gap-10 sm:gap-14">
              {articles.map((article: any) => (
                <article key={article.id} className="group flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
                  {/* Article Image */}
                  <Link href={`/articles/${article.slug}`} className="block relative w-full sm:w-[240px] md:w-[300px] aspect-[4/3] rounded-2xl overflow-hidden shadow-sm shrink-0 bg-slate-100 dark:bg-slate-900">
                    {article.heroImage?.url ? (
                      <Image
                        src={article.heroImage.url}
                        alt={article.heroImage.alt || article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        No Image
                      </div>
                    )}
                    <div className="absolute inset-0 ring-1 ring-inset ring-black/10 dark:ring-white/10 rounded-2xl pointer-events-none" />
                  </Link>
                  
                  {/* Article Content */}
                  <div className="flex flex-col flex-1 py-1">
                    <span className="font-mono text-[10px] sm:text-xs text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-widest mb-2 sm:mb-3">
                      {formatDate(article.createdAt)}
                    </span>
                    <Link href={`/articles/${article.slug}`}>
                      <h3 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-white mb-3 sm:mb-4 group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition-colors leading-tight">
                        {article.title}
                      </h3>
                    </Link>
                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-light line-clamp-3 mb-6">
                      {get100WordSnippet(article.content)}
                    </p>
                    <Link
                      href={`/articles/${article.slug}`}
                      className="mt-auto self-start inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors"
                    >
                      Read Article <span className="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
                    </Link>
                  </div>
                </article>
              ))}

              {articles.length === 0 && (
                <div className="text-center py-20 text-slate-500 font-light">
                  No articles found in the archive.
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Sticky Sidebar (approx 1/3 width) */}
          <aside className="w-full lg:w-[380px] shrink-0">
            <div className="sticky top-28 flex flex-col gap-8">
              
              {/* Mock Box: Curator's Note */}
              <div className="bg-[#fdfbf7] dark:bg-slate-900/40 border border-slate-250/50 dark:border-slate-800/60 p-8 rounded-[2rem]">
                <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-white mb-4">Curator's Note</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-light leading-relaxed mb-6">
                  Welcome to the archives. This space is dedicated to preserving the stories of Missoula's most iconic places, people, and historic moments. As time goes on, this library will grow to reflect the evolving soul of our city.
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden relative border border-slate-200 dark:border-slate-700">
                    <Image
                      src="/media/missoula-curator.jpg"
                      alt="Trevor Riggs"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">Trevor Riggs</div>
                    <div className="text-[10px] uppercase tracking-widest font-mono text-emerald-700 dark:text-emerald-500">Editor</div>
                  </div>
                </div>
              </div>

              {/* Mock Box: Popular Tags */}
              <div className="bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800/60 p-8 rounded-[2rem]">
                <h3 className="font-sans text-sm uppercase tracking-widest font-bold text-slate-900 dark:text-white mb-6">Popular Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {['Local History', 'Dining', 'Brewery', 'Arts & Culture', 'Outdoors', 'Downtown'].map((tag) => (
                    <span key={tag} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-full cursor-pointer hover:bg-emerald-100 dark:hover:bg-emerald-900/30 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Mock Box: Join Newsletter */}
              <div className="bg-slate-900 dark:bg-slate-950 border border-slate-800 p-8 rounded-[2rem] text-center">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-400">
                  <svg xmlns="http://www.w3.org/.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </div>
                <h3 className="font-serif text-xl font-bold text-white mb-3">Never Miss a Story</h3>
                <p className="text-sm text-slate-400 font-light mb-6">
                  Get the best of Missoula Legends delivered straight to your inbox every month.
                </p>
                <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-full text-sm transition-colors shadow-lg shadow-emerald-900/20">
                  Subscribe Now
                </button>
              </div>

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
