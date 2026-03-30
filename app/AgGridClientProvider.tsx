'use client'

import { AllCommunityModule, IntegratedChartsModule } from 'ag-grid-enterprise'
import { AgChartsEnterpriseModule } from 'ag-charts-enterprise'
import { AgGridProvider } from 'ag-grid-react'
import { PropsWithChildren } from 'react'

const modules = [
  AllCommunityModule,
  IntegratedChartsModule.with(AgChartsEnterpriseModule)
]

export default function AgGridClientProvider({children}: PropsWithChildren) {
  return <AgGridProvider modules={modules}>{children}</AgGridProvider>
}