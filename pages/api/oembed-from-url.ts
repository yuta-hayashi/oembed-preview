// Next.js Edge API Routes: https://nextjs.org/docs/api-routes/edge-api-routes
import type { NextRequest } from 'next/server'
import { parse } from 'node-html-parser'

export default async function handler(req: NextRequest) {
  const html = await fetch(`${req.nextUrl.searchParams.get('url')}`)
    .then((res) => res.text())
    .catch((error) => console.error(error.message))

  if (!html) {
    return new Response('Not Found', { status: 404 })
  }

  const oembedUrl = parse(html)
    .querySelector('head link[type="application/json+oembed"]')
    ?.getAttribute('href')
  if (!oembedUrl) {
    return new Response('Not Found', { status: 404 })
  }

  const oembedResponse = await fetch(oembedUrl)
    .then((res) => res.json())
    .catch((error) => console.error(error.message))

  return new Response(JSON.stringify({ oembedUrl, oembedResponse }))
}
