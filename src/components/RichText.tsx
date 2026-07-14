import { RichText as RichTextConverter } from '@payloadcms/richtext-lexical/react'
import React from 'react'
import { MarkdownRenderer } from './MarkdownRenderer'

type Props = {
  data: any
  className?: string
}

function lexicalToMarkdown(data: any): string {
  if (!data) return ''
  
  if (typeof data === 'string') {
    const trimmed = data.trim()
    if (trimmed.startsWith('{"root"') || trimmed.startsWith('{"children"')) {
      try {
        return lexicalToMarkdown(JSON.parse(trimmed))
      } catch (e) {
        return data
      }
    }
    return data
  }

  // Helper to extract text recursively, preserving links as markdown [text](url)
  function getChildrenText(children: any[]): string {
    if (!Array.isArray(children)) return ''
    return children
      .map((child: any) => {
        if (!child) return ''
        if (child.type === 'link') {
          const linkText = getChildrenText(child.children)
          const url = child.fields?.url || child.url || ''
          return `[${linkText}](${url})`
        }
        if (child.type === 'text') {
          return child.text || ''
        }
        if (Array.isArray(child.children)) {
          return getChildrenText(child.children)
        }
        return ''
      })
      .join('')
  }

  try {
    const root = data.root || data
    if (!root || !Array.isArray(root.children)) {
      return ''
    }

    const lines: string[] = []
    
    for (const node of root.children) {
      if (node.type === 'paragraph') {
        lines.push(getChildrenText(node.children))
      } else if (node.type === 'heading') {
        const level = node.tag || `h${node.level || 1}`
        const hashes = '#'.repeat(parseInt(level.replace('h', ''), 10) || 1)
        lines.push(`${hashes} ${getChildrenText(node.children)}`)
      } else if (node.type === 'list') {
        const isOrdered = node.listType === 'number'
        if (Array.isArray(node.children)) {
          node.children.forEach((itemNode: any, idx: number) => {
            const prefix = isOrdered ? `${idx + 1}.` : '-'
            lines.push(`${prefix} ${getChildrenText(itemNode.children)}`)
          })
        }
      } else if (node.type === 'quote') {
        lines.push(`> ${getChildrenText(node.children)}`)
      } else {
        const text = getChildrenText(node.children)
        if (text) {
          lines.push(text)
        }
      }
    }

    return lines.join('\n')
  } catch (err) {
    return ''
  }
}

function hasMarkdownHeuristics(text: string): boolean {
  if (!text) return false
  const lines = text.split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (
      trimmed.match(/^#{1,6}\s+/) || // Heading
      trimmed.match(/^[-*•]\s+/) || // Unordered list
      trimmed.match(/^\d+\.\s+/) || // Ordered list
      trimmed.startsWith('>') || // Blockquote
      trimmed.match(/(\*\*|__)(.*?)\1/) || // Bold
      trimmed.match(/(\*|_)(.*?)\1/) || // Italic
      trimmed.match(/\[([^\]]+)\]\(([^)]+)\)/) // Link
    ) {
      return true
    }
  }
  return false
}

export function RichText({ data, className = '' }: Props) {
  if (!data) return null

  let reconstructedMarkdown = lexicalToMarkdown(data)
  // Demote any H1 headings to H2 to prevent duplicate H1 tags on the page
  reconstructedMarkdown = reconstructedMarkdown.replace(/^#\s+/gm, '## ')
  
  if (hasMarkdownHeuristics(reconstructedMarkdown)) {
    return <MarkdownRenderer text={reconstructedMarkdown} className={className} />
  }

  return (
    <div
      className={`max-w-none text-slate-800 dark:text-slate-200 
      [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-slate-900 [&_h2]:dark:text-white
      [&_h3]:text-xl [&_h3]:font-bold [&_h3]:tracking-tight [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-slate-900 [&_h3]:dark:text-white
      [&_p]:text-base [&_p]:leading-relaxed [&_p]:text-slate-600 [&_p]:dark:text-slate-300 [&_p]:mb-4 
      [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4
      [&_li]:mb-1 [&_a]:text-emerald-800 [&_a]:underline [&_a]:hover:text-emerald-950
      ${className}`}
    >
      <RichTextConverter data={data} />
    </div>
  )
}
