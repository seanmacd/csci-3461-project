'use client'

import {Alert, Box, Button} from '@mantine/core'
import Link from 'next/link'

export default function NotFound() {
  return (
    <Box p="md">
      <Alert title="Page Not Found">
        The page you are looking for does not exist. Please check the URL and try again.
      </Alert>
      <Button mt="md" component={Link} href="/" variant="outline">
        Back to safety
      </Button>
    </Box>
  )
}
