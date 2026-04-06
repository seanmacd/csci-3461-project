'use client'

import { ChartWithTableLayout } from '@/components'
import { currencyValueFormatter } from '@/utils/currency-format'
// Added Alert and Stack to the Mantine imports
import { Group, NumberInput, Text, useMantineTheme, Alert, Stack } from '@mantine/core' 
import type { AgChartOptions } from 'ag-charts-community'
import { type ColDef } from 'ag-grid-community'
import { useMemo, useState } from 'react'

export function BudgetProjection({ baseTotal }: { baseTotal: number }) {
  const [years, setYears] = useState<number | string>(5)
  const [inflationRate, setInflationRate] = useState<number | string>(2)

  const projectionData = useMemo(() => {
    const rate = Number(inflationRate ?? 0) / 100
    const startYear = 2022

    const data = []
    let total = baseTotal

    const nYears = Math.max(1, Number(years) || 0)
    for (let i = 1; i <= nYears; i++) {
      total = total * (1 + rate)
      const year = startYear + i
      data.push({ year: year.toString(), cost: Number(total.toFixed(2)) })
    }

    return data
  }, [baseTotal, years, inflationRate])

  const colDefs: ColDef[] = [
    { field: 'year', headerName: 'Year' },
    { field: 'cost', headerName: 'Projected Cost ($)', valueFormatter: currencyValueFormatter }
  ]

  const theme = useMantineTheme()

  const chartOptions: AgChartOptions = {
    data: projectionData,
    series: [
      { type: 'bar', xKey: 'year', yKey: 'cost', yName: 'Projected Cost', fill: theme.colors.violet[5], strokeWidth: 0 }
    ],
    axes: {
      x: { type: 'category', position: 'bottom', title: { text: 'Year' } },
      y: {
        type: 'number',
        position: 'left',
        title: { text: 'Cost ($)' },
        label: { formatter: currencyValueFormatter }
      }
    }
  }

  const formattedBase = new Intl.NumberFormat('en-CA', { 
    style: 'currency', 
    currency: 'CAD' 
  }).format(baseTotal)

  const controls = (
    <Stack gap="md">
      <Group>
        <NumberInput
          label="Number of Years"
          description="Years to project after 2022"
          value={years}
          onChange={setYears}
          min={1}
          max={50}
          w={200}
        />
        <NumberInput
          label="Inflation Rate %"
          description="Annual inflation rate"
          value={inflationRate}
          onChange={setInflationRate}
          step={0.1}
          decimalScale={2}
          w={200}
        />
      </Group>

      <Alert variant="light" color="blue" title="" p="sm">
        Baseline (2022): {formattedBase}, applying {inflationRate}% annual inflation
      </Alert>
    </Stack>
  )

  return (
    <ChartWithTableLayout
      title="Budget Calculator"
      description={
        <Text size="sm" c="dimmed">
          Project future parts spending using compound inflation, starting from the 2022 baseline.
        </Text>
      }
      controls={controls}
      data={projectionData}
      columns={colDefs}
      chartOptions={chartOptions}
      tableHeight={300}
    />
  )
}