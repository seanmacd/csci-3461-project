import {AgGridClientProvider} from '@/components'
import {Badge, Box, Group, mantineHtmlProps, MantineProvider, Stack} from '@mantine/core'
import {CarIcon} from '@phosphor-icons/react/dist/ssr'
import {PropsWithChildren} from 'react'
import {NavLink} from '../components'
import {theme} from '../theme'

import '@mantine/core/styles.css'

export const metadata = {
  title: 'MUC Dashboard',
  description: 'Dashboard for Mega Used Cars'
}

export default function RootLayout({children}: {children: any}) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no" />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <AgGridClientProvider>
            <Navigation>{children}</Navigation>
          </AgGridClientProvider>
        </MantineProvider>
      </body>
    </html>
  )
}

type LinkDef = {href: string; label: string}

const linkDefs: LinkDef[] = [
  {href: '/', label: 'Dashboard'},
  {href: '/data-viewer', label: 'Data Viewer'},
  {href: '/annual-expenses', label: 'Annual Expenses'},
  {href: '/budget-projection', label: 'Budget Projection'}
]

function Navigation({children}: PropsWithChildren) {
  const links = linkDefs.map(({href, label}) => <NavLink key={href} href={href} label={label} />)

  return (
    <Group gap={0} align="stretch">
      <Stack
        align="center"
        justify="flex-start"
        mih="100vh"
        p="md"
        style={{borderRight: '1px solid var(--mantine-color-default-border)'}}
      >
        <Group gap="xs">
          <CarIcon size={32} weight="fill" color="var(--mantine-primary-color-filled)" />
          <Badge size="lg">MUC</Badge>
        </Group>
        <Stack flex={1} gap="xs">
          {links}
        </Stack>
      </Stack>
      <Box flex={1}>{children}</Box>
    </Group>
  )
}
