'use client'

import {Box, Stack, Title} from '@mantine/core'
import type {AgChartOptions} from 'ag-charts-community'
import {AgCharts} from 'ag-charts-react'
import {themeAlpine, type ColDef} from 'ag-grid-community'
import {AgGridReact} from 'ag-grid-react'
import type {ReactNode} from 'react'

type ChartWithTableLayoutProps = {
  title: string
  description: ReactNode
  controls: ReactNode
  data: any[]
  columns: ColDef[]
  chartOptions: AgChartOptions
  tableHeight?: number | string
  gap?: string
}

export function ChartWithTableLayout({
  title,
  description,
  controls,
  data,
  columns,
  chartOptions,
  tableHeight = 300,
  gap = 'xs'
}: ChartWithTableLayoutProps) {
  return (
    <Box p="md">
      <Stack gap={gap} mb="lg">
        <Title order={3}>{title}</Title>
        {description}
      </Stack>

      <Box mb="lg">{controls}</Box>

      <Box h={tableHeight} mb="lg">
        <AgGridReact theme={themeAlpine} columnDefs={columns} rowData={data} />
      </Box>

      <Box>
        <AgCharts options={chartOptions} />
      </Box>
    </Box>
  )
}
