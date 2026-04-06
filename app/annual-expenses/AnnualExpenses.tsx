'use client'

import {ChartWithTableLayout} from '@/components'
import type {AnnualExpensesData} from '@/data/types'
import {currencyValueFormatter} from '@/utils/currency-format'
import {Group, Select, Text, useMantineTheme} from '@mantine/core'
import type {AgChartOptions} from 'ag-charts-community'
import {type ColDef} from 'ag-grid-community'
import {useRouter, useSearchParams} from 'next/navigation'
import {useMemo, useState} from 'react'

export function AnnualExpenses({data}: {data: AnnualExpensesData}) {
  const {minYear, maxYear, annualExpenses} = data
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentStartYear = Number(searchParams.get('startYear') ?? minYear)
  const currentEndYear = Number(searchParams.get('endYear') ?? maxYear)

  const [startYear, setStartYear] = useState(currentStartYear)
  const [endYear, setEndYear] = useState(currentEndYear)

  const startYearOptions = useMemo(
    () => Array.from({length: maxYear - minYear + 1}, (_, i) => (minYear + i).toString()),
    [minYear, maxYear]
  )

  const endYearOptions = useMemo(
    () => Array.from({length: maxYear - startYear + 1}, (_, i) => (startYear + i).toString()),
    [startYear, maxYear]
  )

  const handleStartYearChange = (value: string | null) => {
    if (!value) return

    const nextStartYear = Number(value)
    if (!Number.isFinite(nextStartYear)) return

    setStartYear(nextStartYear)

    const newEndYear = nextStartYear > endYear ? nextStartYear : endYear
    router.push(`?startYear=${nextStartYear}&endYear=${newEndYear}`)
  }

  const handleEndYearChange = (value: string | null) => {
    if (!value) return

    const nextEndYear = Number(value)
    if (!Number.isFinite(nextEndYear)) return
    if (nextEndYear < startYear) return

    setEndYear(nextEndYear)
    router.push(`?startYear=${startYear}&endYear=${nextEndYear}`)
  }

  const colDefs: ColDef[] = [
    {field: 'year', headerName: 'Year'},
    {field: 'total', headerName: 'Total Parts Spend ($)', valueFormatter: currencyValueFormatter}
  ]

  const theme = useMantineTheme()

  const chartOptions: AgChartOptions = {
    data: annualExpenses,
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

  const controls = (
    <Group align="flex-end">
      <Select
        label="Start Year"
        description={`From ${minYear} to ${maxYear}`}
        data={startYearOptions}
        value={startYear.toString()}
        onChange={handleStartYearChange}
        w={200}
      />
      <Select
        label="End Year"
        description={`From ${minYear} to ${maxYear}`}
        data={endYearOptions}
        value={endYear.toString()}
        onChange={handleEndYearChange}
        w={200}
      />
    </Group>
  )

  return (
    <ChartWithTableLayout
      title="Annual Expenses for Parts"
      description={
        <Text size="sm" c="dimmed">
          Select a start and end year to see total yearly spend for parts.
        </Text>
      }
      controls={controls}
      data={annualExpenses}
      columns={colDefs}
      chartOptions={chartOptions}
      tableHeight={300}
    />
  )
}
