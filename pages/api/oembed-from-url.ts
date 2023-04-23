// Next.js Edge API Routes: https://nextjs.org/docs/api-routes/edge-api-routes
import type { NextRequest } from 'next/server'
import { parse } from 'node-html-parser'
import providers from 'oembed-providers'

export default async function handler(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')
  if (!url) {
    return new Response('Not Found', { status: 404 })
  }

  const provider = findProvider(new URL(url).hostname)
  let oembedUrl: string | undefined = undefined
  if (provider) {
    oembedUrl = `${provider.endpoints[0].url}?url=${url}`
  } else {
    oembedUrl = await findHtml(url)
  }
  if (!oembedUrl) {
    return new Response('Not Found', { status: 404 })
  }

  const oembedUrlWithParams = new URL(oembedUrl)
  oembedUrlWithParams.searchParams.set('format', 'json')
  oembedUrlWithParams.searchParams.set('maxwidth', '500')
  oembedUrlWithParams.searchParams.set('maxheight', '500')

  const oembedResponse = await fetch(oembedUrlWithParams)
    .then((res) => res.json())
    .catch((error) => console.error(error.message))
  if (!oembedResponse) {
    return new Response('Not Found', { status: 404 })
  }

  return new Response(JSON.stringify({ oembedUrlWithParams, oembedResponse }))
}

const findProvider = (url: string) => {
  const provider = providers.find((provider) =>
    provider.provider_url.includes(url)
  )
  return provider
}

const findHtml = async (url: string) => {
  const html = await fetch(url)
    .then((res) => res.text())
    .catch((error) => console.error(error.message))

  if (!html) return undefined

  const oembedUrl = parse(html)
    .querySelector('head link[type="application/json+oembed"]')
    ?.getAttribute('href')
  return oembedUrl
}
