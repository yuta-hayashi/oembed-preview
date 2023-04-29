import { useState, useEffect } from 'react'
import { Button, Container, Flex, Heading, Input, Text } from '@chakra-ui/react'
import Prism from 'prismjs'
import 'prismjs/components/prism-json'
import 'prismjs/themes/prism-tomorrow.css'

export default function Preview() {
  const [oembedResponse, setOembedResponse] = useState<string | null>(null)
  const [oembedHtml, setOembedHtml] = useState<string | null>(null)
  const handleSubmit = async (e: any) => {
    e.preventDefault()
    const url = e.target[0].value
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
  useEffect(() => {
    Prism.highlightAll()
  }, [oembedResponse])

  return (
    <>
      <Container maxW="1200px">
        <Heading>Oembed Preview</Heading>
        <Text fontSize="lg">
          Enter the URL of a website and if the site is Oembed compliant, it
          will show it!
        </Text>
        <form onSubmit={handleSubmit}>
          <Flex>
            <Input
              type="url"
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