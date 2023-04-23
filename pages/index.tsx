import Head from 'next/head'
import { useState } from 'react'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [oembedResponse, setOembedResponse] = useState<string | null>(null)
  const [oembedHtml, setOembedHtml] = useState<string | null>(null)
  const handleSubmit = async (e: any) => {
    e.preventDefault()
    const url = e.target[0].value
    console.log(url)
    const res = await fetch(`/api/oembed-from-url?url=${url}`)
      .then((res) => {
        return res.json()
      })
      .catch((err) => console.log(err))
    if (res.oembedResponse && res.oembedResponse.html) {
      setOembedResponse(res.oembedResponse)
      setOembedHtml(res.oembedResponse.html)
    } else {
      setOembedResponse(null)
      setOembedHtml(null)
    }
  }

  return (
    <>
      <Head>
        <title>Oembed Preview</title>
        <meta
          name="description"
          content="Preview the content of Oembed from the website URL."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>Oembed Preview</h1>
        <p>
          Enter the URL of a website and if the site is Oembed compliant, it
          will show it!
        </p>
        <form onSubmit={handleSubmit}>
          <input type="url" name="target url" placeholder="Target URL" />
          <button type="submit">Get!</button>
        </form>
        <div>
          <code>{JSON.stringify(oembedResponse)}</code>
          {oembedHtml && (
            <iframe srcDoc={oembedHtml} width="100%" height="500px"></iframe>
          )}
        </div>
      </main>
    </>
  )
}
