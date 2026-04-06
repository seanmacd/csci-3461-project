'use client'

import {ChartWithTableLayout} from '@/components'
import {currencyValueFormatter} from '@/utils/currency-format'
import {Group, NumberInput, Text, useMantineTheme} from '@mantine/core'
import type {AgChartOptions} from 'ag-charts-community'
import {type ColDef} from 'ag-grid-community'
import {useMemo, useState} from 'react'

export function BudgetProjection({baseTotal}: {baseTotal: number}) {
  const [years, setYears] = useState<number | string>(5)
  const [inflationRate, setInflationRate] = useState<number | string>(2)

  const projectionData = useMemo(() => {
    const rate = Number(inflationRate ?? 0) / 100
    const startYear = 2022

    const data = []
    data.push({year: startYear.toString(), cost: Number(baseTotal.toFixed(2))})

    // Project future years
    let total = baseTotal
    for (let i = 1; i < Math.max(1, Number(years) || 0); i++) {
      total = total * (1 + rate)
      const year = startYear + i
      data.push({year: year.toString(), cost: Number(total.toFixed(2))})
    }

    return data
  }, [baseTotal, years, inflationRate])

  const colDefs: ColDef[] = [
    {field: 'year', headerName: 'Year'},
    {field: 'cost', headerName: 'Projected Cost ($)', valueFormatter: currencyValueFormatter}
  ]

  const theme = useMantineTheme()

  const chartOptions: AgChartOptions = {
    data: projectionData,
    series: [
      {type: 'bar', xKey: 'year', yKey: 'cost', yName: 'Projected Cost', fill: theme.colors.violet[5], strokeWidth: 0}
    ],
    axes: {
      x: {type: 'category', position: 'bottom', title: {text: 'Year'}},
      y: {
        type: 'number',
        position: 'left',
        title: {text: 'Cost ($)'},
        label: {formatter: currencyValueFormatter}
      }
    }
  }

  const controls = (
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
  )

  return (
    <ChartWithTableLayout
      title="Budget Calculator"
      description={
        <Text size="sm" c="dimmed">
          Project future spending by applying an annual inflation rate over a specified number of years, starting after
          2022.
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
