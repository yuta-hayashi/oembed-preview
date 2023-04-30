import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import {
  Button,
  Container,
  Flex,
  Heading,
  Input,
  Text,
  Link,
} from '@chakra-ui/react'
import Prism from 'prismjs'
import 'prismjs/components/prism-json'
import 'prismjs/themes/prism-tomorrow.css'

export default function Preview() {
  const router = useRouter()
  const [targetUrl, setTargetUrl] = useState<string | null>(null)
  const [oembedResponse, setOembedResponse] = useState<string | null>(null)
  const [oembedHtml, setOembedHtml] = useState<string | null>(null)

  const fetchOembed = async () => {
    const res = await fetch(`/api/oembed-from-url?url=${targetUrl}`)
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
  const handleSubmit = async (e: any) => {
    e.preventDefault()
    const url = e.target[0].value
    router.replace({
      query: { url: url },
    })
    setTargetUrl(url)
  }
  useEffect(() => {
    if (targetUrl) {
      fetchOembed()
    }
  }, [targetUrl])

  useEffect(() => {
    Prism.highlightAll()
  }, [oembedResponse])

  const { url } = router.query
  useEffect(() => {
    console.log(url)
    if (url) {
      console.log(url)
      setTargetUrl(url as string)
    }
  }, [url])

  return (
    <>
      <Container maxW="1200px">
        <Heading my="8">Oembed Preview</Heading>
        <Text fontSize="lg">
          Enter the URL of a website and if the site is Oembed compliant, it
          will show it!
        </Text>
        <Text>This site supports oEmbed only for rich and video Type.</Text>
        <Text>
          Here is the {''}
          <Link href="https://oembed.com/" isExternal color="blue.500">
            oEmbed documents
          </Link>
        </Text>
        <form onSubmit={handleSubmit}>
          <Flex my="4">
            <Input
              type="url"
              defaultValue={targetUrl || ''}
              name="target url"
              placeholder="Target URL"
              required
              mr={2}
            />
            <Button type="submit">Get!</Button>
          </Flex>
        </form>

        <Flex flexWrap="wrap">
          <Container maxW={{ base: '100%', xl: '550px' }}>
            <pre>
              <code className="language-json">
                {JSON.stringify(oembedResponse, null, 2)}
              </code>
            </pre>
          </Container>
          <Container maxW={{ base: '600' }} p="0">
            {oembedHtml && (
              <iframe srcDoc={oembedHtml} width="510px" height="510px"></iframe>
            )}
          </Container>
        </Flex>
      </Container>
    </>
  )
}
