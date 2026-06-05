import { RichText as RichTextConverter } from '@payloadcms/richtext-lexical/react'
import React from 'react'

type Props = {
  data: any
  className?: string
}

export function RichText({ data, className = '' }: Props) {
  if (!data) return null
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
