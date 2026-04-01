'use client'

import {Box, Group, Select, Stack, Text, Title, useMantineTheme} from '@mantine/core'
import {AgCharts} from 'ag-charts-react'
import {AgChartOptions} from 'ag-charts-community'
import {themeAlpine, type ColDef} from 'ag-grid-community'
import {AgGridReact} from 'ag-grid-react'
import {useEffect, useMemo, useState} from 'react'
import type {Order} from '../data/schemas/order.schema'
import type {Part} from '../data/schemas/part.schema'
import {currencyValueFormatter} from './currency-format'

type AnnualExpenseRow = {
  year: string
  total: number
}

export function AnnualExpensesTab({orders, parts}: {orders: Order[]; parts: Part[]}) {
  const yearBounds = useMemo(() => {
    if (!orders || orders.length === 0) {
      const currentYear = new Date().getUTCFullYear()
      return {minYear: currentYear, maxYear: currentYear}
    }

    let minYear = Number.POSITIVE_INFINITY
    let maxYear = Number.NEGATIVE_INFINITY

    for (const order of orders) {
      const year = order.date.getUTCFullYear()
      if (year < minYear) minYear = year
      if (year > maxYear) maxYear = year
    }

    return {minYear, maxYear}
  }, [orders])

  const [startYear, setStartYear] = useState(yearBounds.minYear)
  const [endYear, setEndYear] = useState(yearBounds.maxYear)

  useEffect(() => {
    setStartYear(yearBounds.minYear)
    setEndYear(yearBounds.maxYear)
  }, [yearBounds.minYear, yearBounds.maxYear])

  const startYearOptions = useMemo(() => {
    const options: string[] = []
    for (let year = yearBounds.minYear; year <= yearBounds.maxYear; year++) {
      options.push(year.toString())
    }
    return options
  }, [yearBounds.minYear, yearBounds.maxYear])

  const endYearOptions = useMemo(() => {
    const options: string[] = []
    for (let year = startYear; year <= yearBounds.maxYear; year++) {
      options.push(year.toString())
    }
    return options
  }, [startYear, yearBounds.maxYear])

  const handleStartYearChange = (value: string | null) => {
    if (!value) return

    const nextStartYear = Number(value)
    if (!Number.isFinite(nextStartYear)) return

    setStartYear(nextStartYear)

    if (nextStartYear > endYear) {
      setEndYear(nextStartYear)
    }
  }

  const handleEndYearChange = (value: string | null) => {
    if (!value) return

    const nextEndYear = Number(value)
    if (!Number.isFinite(nextEndYear)) return
    if (nextEndYear < startYear) return

    setEndYear(nextEndYear)
  }

  const partPriceById = useMemo(() => {
    const priceMap = new Map<bigint, number>()
    for (const part of parts) {
      priceMap.set(part.id, part.price)
    }
    return priceMap
  }, [parts])

  const annualTotalsByYear = useMemo(() => {
    const totals = new Map<number, number>()

    for (const order of orders) {
      const year = order.date.getUTCFullYear()
      let orderTotal = 0

      for (const item of order.items || []) {
        const partPrice = partPriceById.get(item.part_id)
        if (partPrice === undefined) continue
        orderTotal += Number(item.qty) * partPrice
      }

      totals.set(year, (totals.get(year) || 0) + orderTotal)
    }

    return totals
  }, [orders, partPriceById])

  const annualExpensesData = useMemo<AnnualExpenseRow[]>(() => {
    const rows: AnnualExpenseRow[] = []

    for (let year = startYear; year <= endYear; year++) {
      rows.push({
        year: year.toString(),
        total: Number((annualTotalsByYear.get(year) || 0).toFixed(2))
      })
    }

    return rows
  }, [startYear, endYear, annualTotalsByYear])

  const colDefs: ColDef[] = [
    {field: 'year', headerName: 'Year'},
    {field: 'total', headerName: 'Total Parts Spend ($)', valueFormatter: currencyValueFormatter}
  ]

  const theme = useMantineTheme()

  const chartOptions: AgChartOptions = {
    data: annualExpensesData,
    series: [
      {
        type: 'bar',
        xKey: 'year',
        yKey: 'total',
        yName: 'Total Parts Spend',
        fill: theme.colors.violet[5],
        strokeWidth: 0
      }
    ],
    axes: {
      x: {type: 'category', position: 'bottom', title: {text: 'Year'}},
      y: {
        type: 'number',
        position: 'left',
        title: {text: 'Spend ($)'},
        label: {formatter: currencyValueFormatter}
      }
    }
  }

  return (
    <Box px="md">
      <Stack gap="xs" mb="lg">
        <Title order={3}>Annual Expenses for Parts</Title>
        <Text size="sm" c="dimmed">
          Select a start and end year to see total yearly spend for parts.
        </Text>
      </Stack>

      <Group mb="lg" align="flex-end">
        <Select
          label="Start Year"
          description={`From ${yearBounds.minYear} to ${yearBounds.maxYear}`}
          data={startYearOptions}
          value={startYear.toString()}
          onChange={handleStartYearChange}
          w={200}
        />
        <Select
          label="End Year"
          description={`From ${yearBounds.minYear} to ${yearBounds.maxYear}`}
          data={endYearOptions}
          value={endYear.toString()}
          onChange={handleEndYearChange}
          w={200}
        />
      </Group>

      <Box h={300} mb="lg">
        <AgGridReact theme={themeAlpine} columnDefs={colDefs} rowData={annualExpensesData} />
      </Box>

      <Box>
        <AgCharts options={chartOptions} />
      </Box>
    </Box>
  )
}
