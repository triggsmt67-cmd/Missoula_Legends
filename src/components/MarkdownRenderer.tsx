import React from 'react'

interface Block {
  type: 'heading' | 'blockquote' | 'list' | 'hr' | 'paragraph'
  level?: number
  items?: string[]
  content?: string
}

function renderInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = []
  let remaining = text
  let key = 0

  while (remaining.length > 0) {
    // 1. Link pattern: [label](url)
    const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/)
    if (linkMatch) {
      const label = linkMatch[1]
      const url = linkMatch[2]
      const isExternal = url.startsWith('http') || url.startsWith('//')
      parts.push(
        <a
          key={key++}
          href={url}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          className="text-deep-spruce dark:text-aged-brass hover:text-oxblood-brown dark:hover:text-aged-brass/80 transition-colors font-semibold underline"
        >
          {renderInline(label)}
        </a>
      )
      remaining = remaining.substring(linkMatch[0].length)
      continue
    }

    // 2. Bold pattern: **text** or __text__
    const boldMatch = remaining.match(/^(\*\*|__)(.*?)\1/)
    if (boldMatch) {
      parts.push(
        <strong key={key++} className="font-bold text-soft-black dark:text-ivory-paper">
          {renderInline(boldMatch[2])}
        </strong>
      )
      remaining = remaining.substring(boldMatch[0].length)
      continue
    }

    // 3. Italic pattern: *text* or _text_
    const italicMatch = remaining.match(/^(\*|_)(.*?)\1/)
    if (italicMatch) {
      parts.push(
        <em key={key++} className="italic">
          {renderInline(italicMatch[2])}
        </em>
      )
      remaining = remaining.substring(italicMatch[0].length)
      continue
    }

    // 4. Code pattern: `text`
    const codeMatch = remaining.match(/^`(.*?)`/)
    if (codeMatch) {
      parts.push(
        <code
          key={key++}
          className="px-1.5 py-0.5 rounded bg-warm-limestone/50 dark:bg-slate-800 font-mono text-sm"
        >
          {codeMatch[1]}
        </code>
      )
      remaining = remaining.substring(codeMatch[0].length)
      continue
    }

    // 5. Normal text character - consume until next special character
    const nextSpecial = remaining.search(/[\*_\[`]/)
    if (nextSpecial === -1) {
      parts.push(remaining)
      break
    } else if (nextSpecial === 0) {
      // Standalone special character
      parts.push(remaining[0])
      remaining = remaining.substring(1)
    } else {
      parts.push(remaining.substring(0, nextSpecial))
      remaining = remaining.substring(nextSpecial)
    }
  }

  return parts
}

interface MarkdownRendererProps {
  text: string
  className?: string
}

export function MarkdownRenderer({ text, className = '' }: MarkdownRendererProps) {
  if (!text) return null

  // Split by newline to parse line by line
  const lines = text.split('\n')
  const blocks: Block[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()

    // Skip empty lines but do not merge paragraphs across them
    if (trimmed === '') {
      continue
    }

    // Horizontal rule
    if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
      blocks.push({ type: 'hr' })
      continue
    }

    // Headings
    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/)
    if (headingMatch) {
      blocks.push({
        type: 'heading',
        level: headingMatch[1].length,
        content: headingMatch[2],
      })
      continue
    }

    // Blockquote
    if (line.startsWith('>') || line.startsWith('> ')) {
      const content = line.replace(/^>\s?/, '')
      // Group consecutive blockquotes
      const lastBlock = blocks[blocks.length - 1]
      if (lastBlock && lastBlock.type === 'blockquote') {
        lastBlock.content += '\n' + content
      } else {
        blocks.push({ type: 'blockquote', content })
      }
      continue
    }

    // List item (e.g. starting with - or * or bullet character)
    const listMatch = line.match(/^([-*•]|\d+\.)\s+(.*)$/)
    if (listMatch) {
      const itemContent = listMatch[2]
      // Group consecutive list items
      const lastBlock = blocks[blocks.length - 1]
      if (lastBlock && lastBlock.type === 'list') {
        lastBlock.items?.push(itemContent)
      } else {
        blocks.push({ type: 'list', items: [itemContent] })
      }
      continue
    }

    // Treat lines starting with a bold header followed by a colon as a stylized paragraph/list-like item
    // e.g. "**Structural Fabrication:** text"
    const boldPrefixMatch = line.match(/^\s*(\*\*|__)(.*?)\1:(.*)$/)
    if (boldPrefixMatch) {
      blocks.push({ type: 'paragraph', content: line })
      continue
    }

    // Default: Each line is its own paragraph block (prevents wall-of-text merging)
    blocks.push({ type: 'paragraph', content: line })
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {blocks.map((block, index) => {
        // Skip duplicate "About the Business" heading if it starts the description
        const isDuplicateHeading =
          index === 0 &&
          block.type === 'heading' &&
          block.content?.toLowerCase().replace(/[^a-z0-9]/g, '') === 'aboutthebusiness'

        if (isDuplicateHeading) {
          return null
        }

        switch (block.type) {
          case 'heading': {
            const level = block.level || 1
            const HeadingTag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
            let sizeClass = 'text-lg font-serif font-bold text-deep-spruce dark:text-ivory-paper mt-6 mb-3'
            if (level === 1) {
              sizeClass = 'text-3xl font-serif font-bold text-deep-spruce dark:text-ivory-paper mt-8 mb-4'
            } else if (level === 2) {
              sizeClass = 'text-2xl md:text-3xl font-serif font-bold text-deep-spruce dark:text-ivory-paper mt-8 mb-4'
            } else if (level === 3) {
              sizeClass = 'text-xl md:text-2xl font-serif font-bold text-deep-spruce dark:text-ivory-paper mt-6 mb-3'
            }
            return (
              <HeadingTag key={index} className={sizeClass}>
                {renderInline(block.content || '')}
              </HeadingTag>
            )
          }

          case 'blockquote':
            return (
              <blockquote
                key={index}
                className="border-l-4 border-aged-brass/70 pl-6 my-6 italic text-smoked-olive dark:text-warm-stone/90 bg-warm-limestone/5 dark:bg-slate-900/10 py-3 pr-4 rounded-r"
              >
                <p className="whitespace-pre-line leading-relaxed text-lg font-serif">
                  {renderInline(block.content || '')}
                </p>
              </blockquote>
            )

          case 'list':
            return (
              <ul
                key={index}
                className="list-disc pl-6 mb-6 flex flex-col gap-2 font-serif text-lg md:text-xl"
              >
                {block.items?.map((item, itemIdx) => (
                  <li
                    key={itemIdx}
                    className="text-soft-black dark:text-warm-stone/95 leading-relaxed"
                  >
                    {renderInline(item)}
                  </li>
                ))}
              </ul>
            )

          case 'hr':
            return (
              <hr
                key={index}
                className="border-t border-warm-limestone/40 dark:border-warm-limestone/15 my-8"
              />
            )

          case 'paragraph':
          default:
            return (
              <p
                key={index}
                className="text-soft-black dark:text-warm-stone/95 leading-relaxed font-serif text-lg md:text-xl mb-6"
              >
                {renderInline(block.content || '')}
              </p>
            )
        }
      })}
    </div>
  )
}
