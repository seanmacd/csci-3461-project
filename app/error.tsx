'use client'

import {Alert, Box, Button, Code} from '@mantine/core'

type ErrorProps = {
  error: Error & {digest?: string}
  unstable_retry: () => void
}

export default function RuntimeError({error, unstable_retry}: ErrorProps) {
  return (
    <Box p="md">
      <Alert title="An unexpected error occurred" color="orange">
        {error.message.length ? error.message : 'Unknown error'}
        <br />
        {error.digest && <Code>{error.digest}</Code>}
      </Alert>
      <Button mt="md" onClick={unstable_retry} variant="outline">
        Try again
      </Button>
    </Box>
  )
}
