import dynamic from 'next/dynamic'
import Head from 'next/head'

const Footer = dynamic(() => import('../components/footer'), { ssr: false })
const Preview = dynamic(() => import('../components/preview'), { ssr: false })

export default function Home() {
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
      <Preview />
      <Footer />
    </>
  )
}
