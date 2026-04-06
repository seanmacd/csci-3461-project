'use client'

import {AllCommunityModule as AllCharts, ModuleRegistry as ChartsModuleRegistry} from 'ag-charts-community'
import {AllCommunityModule as AllGrid} from 'ag-grid-community'
import {AgGridProvider} from 'ag-grid-react'
import type {PropsWithChildren} from 'react'

ChartsModuleRegistry.registerModules([AllCharts])

export function AgGridClientProvider({children}: PropsWithChildren) {
  return <AgGridProvider modules={[AllGrid]}>{children}</AgGridProvider>
}
