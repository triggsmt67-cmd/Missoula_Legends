import { RichText as RichTextConverter } from '@payloadcms/richtext-lexical/react'
import React from 'react'
import type { SerializedEditorState } from 'lexical'
import { MarkdownRenderer } from './MarkdownRenderer'

type Props = {
  data: unknown
  className?: string
}

type UnknownRecord = Record<string, unknown>

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null
}

function isSerializedEditorState(value: unknown): value is SerializedEditorState {
  return isRecord(value) && isRecord(value.root)
}

function lexicalToMarkdown(data: unknown): string {
  if (!data) return ''
  
  if (typeof data === 'string') {
    const trimmed = data.trim()
    if (trimmed.startsWith('{"root"') || trimmed.startsWith('{"children"')) {
      try {
        return lexicalToMarkdown(JSON.parse(trimmed))
      } catch {
        return data
      }
    }
    return data
  }

  // Helper to extract text recursively, preserving links as markdown [text](url)
  function getChildrenText(children: unknown): string {
    if (!Array.isArray(children)) return ''
    return children
      .map((child) => {
        if (!isRecord(child)) return ''
        if (child.type === 'link') {
          const linkText = getChildrenText(child.children)
          const fields = isRecord(child.fields) ? child.fields : undefined
          const url = typeof fields?.url === 'string'
            ? fields.url
            : typeof child.url === 'string'
              ? child.url
              : ''
          return `[${linkText}](${url})`
        }
        if (child.type === 'text') {
          return typeof child.text === 'string' ? child.text : ''
        }
        if (Array.isArray(child.children)) {
          return getChildrenText(child.children)
        }
        return ''
      })
      .join('')
  }

  try {
    if (!isRecord(data)) return ''

    const root = isRecord(data.root) ? data.root : data
    if (!root || !Array.isArray(root.children)) {
      return ''
    }

    const lines: string[] = []
    
    for (const node of root.children) {
      if (!isRecord(node)) continue

      if (node.type === 'paragraph') {
        lines.push(getChildrenText(node.children))
      } else if (node.type === 'heading') {
        const level = typeof node.tag === 'string'
          ? node.tag
          : `h${typeof node.level === 'number' ? node.level : 1}`
        const hashes = '#'.repeat(Number.parseInt(level.replace('h', ''), 10) || 1)
        lines.push(`${hashes} ${getChildrenText(node.children)}`)
      } else if (node.type === 'list') {
        const isOrdered = node.listType === 'number'
        if (Array.isArray(node.children)) {
          node.children.forEach((itemNode, idx) => {
            if (!isRecord(itemNode)) return
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
  } catch {
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

  if (!isSerializedEditorState(data)) {
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
