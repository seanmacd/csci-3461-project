'use client'

import { Box, Group, NumberInput, Stack, Text, Title, Divider, Select } from '@mantine/core'
import { themeAlpine, type ColDef } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { AgCharts } from 'ag-charts-react'
import { 
  ModuleRegistry as ChartModuleRegistry, 
  AgChartsEnterpriseModule 
} from 'ag-charts-enterprise'

ChartModuleRegistry.registerModules([AgChartsEnterpriseModule])

import { useMemo, useState } from 'react'
import type { Order } from '../data/schemas/order.schema'

export function BudgetProjectionTab({ orders }: { orders: Order[] }) {
  const [years, setYears] = useState<number | string>(5)
  const [inflationRate, setInflationRate] = useState<number | string>(2)
  const [chartView, setChartView] = useState<string | null>('both')

  const baseTotal = useMemo(() => {
    if (!orders || orders.length === 0) return 100000 

    return orders.reduce((acc, order) => {
      const orderTotal = (order.items || []).reduce((sum, item) => {
        return sum + (Number(item.qty || 0) * 100) 
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
        rawAmount: Number(baseTotal.toFixed(2)),
        cost: Number(currentTotal.toFixed(2))
      })
    }
    return data
  }, [baseTotal, years, inflationRate])

  const colDefs: ColDef[] = [
    { field: 'year', headerName: 'Year', flex: 1 },
    { 
      field: 'rawAmount', 
      headerName: 'Baseline Cost ($)', 
      flex: 1,
      valueFormatter: (params) => {
        if (params.value == null) return ''
        return `$${Number(params.value).toLocaleString('en-CA', { 
          useGrouping: false, 
          minimumFractionDigits: 2, 
          maximumFractionDigits: 2 
        })}`
      }
    },
    { 
      field: 'cost', 
      headerName: 'Projected Cost ($)', 
      flex: 1,
      valueFormatter: (params) => {
        if (params.value == null) return ''
        return `$${Number(params.value).toLocaleString('en-CA', { 
          useGrouping: false, 
          minimumFractionDigits: 2, 
          maximumFractionDigits: 2 
        })}`
      }
    }
  ]

  const seriesToDisplay: any[] = []
  
  if (chartView === 'both' || chartView === 'baseline') {
    seriesToDisplay.push({
      type: 'bar',
      xKey: 'year',
      yKey: 'rawAmount',
      yName: 'Baseline Cost',
      fill: '#868e96',
      strokeWidth: 0
    })
  }
  
  if (chartView === 'both' || chartView === 'projected') {
    seriesToDisplay.push({
      type: 'bar',
      xKey: 'year',
      yKey: 'cost',
      yName: 'Projected Cost',
      fill: '#228be6',
      strokeWidth: 0
    })
  }

  const chartOptions = {
    data: projectionData,
    title: { text: 'Budget Projection Overview' },
    series: seriesToDisplay,
    axes: [
      { type: 'category', position: 'bottom', title: { text: 'Year' } },
      { 
        type: 'number', 
        position: 'left', 
        title: { text: 'Total Cost ($)' },
        label: { 
          formatter: (params: any) => `$${Number(params.value).toLocaleString('en-CA', { useGrouping: false })}` 
        }
      }
    ]
  }

  return (
    // 1. Removed maw and mx="auto" from this top Box so it takes the full width again
    <Box px="md">
      <Stack gap="xs" mb="xl">
        <Title order={3}>Budget Calculator</Title>
        <Text size="sm" c="dimmed">
          Project future spending by applying an annual inflation rate over a specified number of years, starting after 2022.
        </Text>
      </Stack>

      <Group mb="xl" align="flex-end">
        <NumberInput
          label="Number of Years (N)"
          description="Years to project after 2022"
          value={years}
          onChange={setYears}
          min={1}
          max={50}
          w={200}
        />
        <NumberInput
          label="Inflation Rate (%)"
          description="Annual inflation rate"
          value={inflationRate}
          onChange={setInflationRate}
          decimalScale={2}
          w={200}
        />
        <Select
          label="Chart View"
          description="Select metrics to display"
          data={[
            { value: 'both', label: 'Compare Both' },
            { value: 'projected', label: 'Projected Cost Only' },
            { value: 'baseline', label: 'Baseline Only' }
          ]}
          value={chartView}
          onChange={setChartView}
          w={200}
        />
      </Group>

      <Stack gap="xl">
        {/* The Grid stays full width */}
        <Box h={350} w="100%">
          <Text fw={500} mb="xs">Data Table</Text>
          <AgGridReact 
            theme={themeAlpine} 
            columnDefs={colDefs} 
            rowData={projectionData} 
            enableCharts={true} 
          />
        </Box>

        <Divider my="xl" variant="dashed" color="gray.4" />

        {/* 2. Added maw and mx="auto" ONLY to the chart wrapper */}
        <Box maw={1000} mx="auto" w="100%">
          <Text fw={500} mb="xs">Visualization</Text>
          <Box h={400} w="100%">
            <AgCharts options={chartOptions} />
          </Box>
        </Box>
      </Stack>
    </Box>
  )
}