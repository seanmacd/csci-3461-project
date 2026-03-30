import {mantineHtmlProps, MantineProvider} from '@mantine/core'
import {theme} from '../theme'

import '@mantine/core/styles.css'
import AgGridClientProvider from './AgGridClientProvider'

export const metadata = {
  title: 'MUC Dashboard',
  description: 'Dashboard for Mega Used Cars'
}

export default function RootLayout({children}: {children: any}) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        {/* <ColorSchemeScript /> */}
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no" />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <AgGridClientProvider>{children}</AgGridClientProvider>
        </MantineProvider>
      </body>
    </html>
  )
}
