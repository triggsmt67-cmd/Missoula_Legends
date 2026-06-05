import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import { importMap } from '../importMap'
import config from '@payload-config'

type PageProps = {
  params: Promise<{ segments?: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export const generateMetadata = ({ params, searchParams }: PageProps) =>
  generatePageMetadata({
    config,
    params: params as Promise<{ segments: string[] }>,
    searchParams: searchParams as Promise<{ [key: string]: string | string[] }>,
  })

export default async function Page({ params, searchParams }: PageProps) {
  return (
    <RootPage
      config={config}
      importMap={importMap}
      params={params as Promise<{ segments: string[] }>}
      searchParams={searchParams as Promise<{ [key: string]: string | string[] }>}
    />
  )
}
