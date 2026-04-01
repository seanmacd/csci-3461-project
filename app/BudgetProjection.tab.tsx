'use client'

import {Box, Group, NumberInput, Stack, Text, Title, useMantineTheme} from '@mantine/core'
import {AgCharts} from 'ag-charts-react'
import {themeAlpine, type ColDef} from 'ag-grid-community'
import {AgGridReact} from 'ag-grid-react'

import {AgChartOptions} from 'ag-charts-community'
import {useMemo, useState} from 'react'
import type {Order} from '../data/schemas/order.schema'
import {currencyValueFormatter} from './currency-format'

export function BudgetProjectionTab({orders}: {orders: Order[]}) {
  const [years, setYears] = useState<number | string>(5)
  const [inflationRate, setInflationRate] = useState<number | string>(2)

  const baseTotal = useMemo(() => {
    if (!orders || orders.length === 0) return 100000

    return orders.reduce((acc, order) => {
      const orderTotal = (order.items || []).reduce((sum, item) => {
        return sum + Number(item.qty || 0) * 100
      }, 0)
      return acc + orderTotal
    }, 0)
  }, [orders])

  const projectionData = useMemo(() => {
    const data = []
    let currentTotal = baseTotal

    const nYears = Math.max(1, Number(years) || 0)
    const rate = (Number(inflationRate) || 0) / 100

    for (let i = 1; i <= nYears; i++) {
      const year = 2022 + i
      currentTotal = currentTotal * (1 + rate)
      data.push({
        year: year.toString(),
        cost: Number(currentTotal.toFixed(2))
      })
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

  return (
    <Box px="md">
      <Stack gap="xs" mb="lg">
        <Title order={3}>Budget Calculator</Title>
        <Text size="sm" c="dimmed">
          Project future spending by applying an annual inflation rate over a specified number of years, starting after
          2022.
        </Text>
      </Stack>

      <Group mb="lg" align="flex-end">
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
          decimalScale={2}
          w={200}
        />
      </Group>

      <Box h={300} mb="lg">
        <AgGridReact theme={themeAlpine} columnDefs={colDefs} rowData={projectionData} />
      </Box>

      <Box>
        <AgCharts options={chartOptions} />
      </Box>
    </Box>
  )
}
