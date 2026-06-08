import { getPayload } from 'payload'
import config from '@payload-config'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { RichText } from '@/components/RichText'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
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

      {/* Article Header Section */}
      <section className="relative bg-gradient-to-b from-[#fbf9f4] to-[#f6f2e7] dark:from-slate-900/40 dark:to-slate-950/20 border-b-2 border-double border-warm-limestone/80 dark:border-warm-limestone/25 py-24 md:py-32 text-center overflow-hidden">
        {/* Map Background Watermark */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.075] dark:opacity-[0.068] pointer-events-none mix-blend-multiply dark:mix-blend-screen bg-cover bg-center bg-no-repeat transition-opacity duration-300"
          style={{ backgroundImage: 'url("/media/missoula-map-bg.webp")' }}
        />
        {/* Subtle coordinate grid overlay */}
        <div className="absolute inset-0 z-0 opacity-[0.015] dark:opacity-[0.01] pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:32px_32px]" />
        
        <div className="relative z-10 max-w-[950px] mx-auto px-6">
          <div className="flex items-center justify-center gap-3 mb-6 animate-fade-in">
            <span className="h-px w-8 bg-aged-brass/30"></span>
            <span className="font-mono text-aged-brass tracking-[0.3em] text-[10px] sm:text-xs uppercase font-bold bg-[#FAF8F5]/80 dark:bg-blue-black/40 border border-warm-limestone/60 dark:border-warm-limestone/15 px-4 py-1.5 rounded-md backdrop-blur-sm shadow-sm">
              EDITORIAL JOURNAL
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
              className="object-cover object-center scale-100 hover:scale-103 transition-transform duration-1000 ease-out"
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

            {/* Date at the bottom of the article */}
            <div className="mt-12 pt-6 border-t border-warm-limestone/55 dark:border-warm-limestone/15 text-xs font-mono uppercase tracking-wider text-warm-stone flex justify-between items-center">
              <span>Published on {formatDate(article.createdAt)}</span>
              <span className="text-aged-brass/70">❦</span>
            </div>

            {/* Back to Archives link */}
            <div className="mt-8 pt-8 border-t border-warm-limestone/55 dark:border-warm-limestone/15">
              <Link 
                href="/archives" 
                className="group inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest font-bold text-warm-stone hover:text-deep-spruce dark:hover:text-ivory-paper transition-colors"
              >
                <span className="transform group-hover:-translate-x-1 transition-transform duration-300">&larr;</span> Back to Archives
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
              <p className="text-sm text-soft-black dark:text-warm-stone font-serif font-normal leading-relaxed mb-6 italic">
                "{curatorProfile?.bio || 'Trevor Riggs has spent years helping Montana businesses tell clearer stories, reach the right people, and turn attention into real customers.'}"
              </p>
              <div className="flex items-center gap-4 pt-4 border-t border-warm-limestone/60 dark:border-warm-limestone/15">
                <div className="w-12 h-12 rounded-full overflow-hidden relative border-2 border-white dark:border-slate-800 shadow-md">
                  <Image
                    src={
                      decodeUrl(curatorProfile?.photo?.sizes?.thumbnail?.url) ||
                      decodeUrl(curatorProfile?.photo?.url) ||
                      '/media/missoula-curator.jpg'
                    }
                    alt={curatorProfile?.name || 'Trevor Riggs'}
                    fill
                    sizes="48px"
                    className="object-cover object-center"
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
                    
                    return (
                      <div key={bizId || bizName} className="flex gap-4 items-center group/biz p-2 -mx-2 rounded-sm hover:bg-warm-limestone/25 dark:hover:bg-blue-black/30 transition-all duration-300">
                        {bizImgUrl && (
                          <div className="w-14 h-14 rounded-sm overflow-hidden relative shrink-0 border border-warm-limestone/60 dark:border-warm-limestone/20 shadow-sm">
                            <Image
                              src={decodeUrl(bizImgUrl) || '/media/missoula-hero-twilight.png'}
                              alt={bizName}
                              fill
                              sizes="56px"
                              className="object-cover group-hover/biz:scale-105 transition-transform duration-550"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-serif font-semibold text-deep-spruce dark:text-white truncate group-hover/biz:text-oxblood-brown dark:group-hover/biz:text-aged-brass transition-colors">
                            {bizName}
                          </h4>
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
                          {bizWebsite && (
                            <a 
                              href={bizWebsite.startsWith('http') ? bizWebsite : `https://${bizWebsite}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-0.5 text-[10px] font-mono font-bold text-warm-stone hover:text-oxblood-brown dark:hover:text-aged-brass mt-1.5 transition-colors hover:underline"
                            >
                              Website &rarr;
                            </a>
                          )}
                        </div>
                      </div>
                    );
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
              <p className="text-xs text-soft-black dark:text-warm-stone leading-relaxed font-normal mb-6">
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


