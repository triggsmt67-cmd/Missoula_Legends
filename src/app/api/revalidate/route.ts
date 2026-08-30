import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const path = url.searchParams.get('path')
  
  if (!path) {
    return NextResponse.json({ success: false, message: 'Missing path param' })
  }
  
  revalidatePath(path)
  revalidatePath('/directory/category/[slug]', 'page')
  return NextResponse.json({ success: true, revalidated: path })
}
