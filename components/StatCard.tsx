import {Paper, Stack, Text} from '@mantine/core'
import type {ReactNode} from 'react'

type StatCardProps = {
  label: string
  value: ReactNode
}

export function StatCard({label, value}: StatCardProps) {
  return (
    <Paper p="md" radius="md" withBorder>
      <Stack gap={0}>
        <Text size="xs" c="dimmed" fw={700} tt="uppercase">
          {label}
        </Text>
        <Text size="xl" fw={700} mt={4}>
          {value}
        </Text>
      </Stack>
    </Paper>
  )
}
