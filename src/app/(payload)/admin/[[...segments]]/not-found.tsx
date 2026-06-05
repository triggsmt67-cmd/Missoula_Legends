import { NotFoundPage } from '@payloadcms/next/views'
import { importMap } from '../importMap'
import config from '@payload-config'

type Args = {
  params: Promise<{ segments?: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const NotFound = ({ params, searchParams }: Args) => {
  return NotFoundPage({
    config,
    importMap,
    params: params as Promise<{ segments: string[] }>,
    searchParams: searchParams as Promise<{ [key: string]: string | string[] }>,
  })
}

export default NotFound
