import { VStack, Text, Center, Link } from '@chakra-ui/react'

export default function Footer() {
  return (
    <VStack bg="gray.100" py="4" mt="12">
      <Center>
        <Link href="https://github.com/yuta-hayashi/oembed-preview">
          GitHub
        </Link>
      </Center>
      <Center>
        <Text>
          Made by <Link href="https://yuta.run">yuta.run</Link>
        </Text>
      </Center>
    </VStack>
  )
}
