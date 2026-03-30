'use client'

import {AllCommunityModule} from 'ag-grid-enterprise'
import {AgGridProvider} from 'ag-grid-react'
import {PropsWithChildren} from 'react'

const modules = [AllCommunityModule]

export default function AgGridClientProvider({children}: PropsWithChildren) {
  return <AgGridProvider modules={modules}>{children}</AgGridProvider>
}
