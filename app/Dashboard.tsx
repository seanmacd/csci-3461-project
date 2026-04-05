'use client'

import {PopoverListCell, StatCard} from '@/components'
import {DashboardData, OrderPart} from '@/data/types'
import {Box, Grid, Group, Select, Stack, Text} from '@mantine/core'
import {themeAlpine, type ColDef} from 'ag-grid-community'
import {AgGridReact} from 'ag-grid-react'
import {useRouter, useSearchParams} from 'next/navigation'
import {useState} from 'react'

type DashboardProps = {
  data: DashboardData
}

export function Dashboard({data}: DashboardProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentLimit = searchParams.get('limit') || '10'
  const [limit, setLimit] = useState(currentLimit)

  const handleLimitChange = (value: string | null) => {
    if (value) {
      setLimit(value)
      router.push(`?limit=${value}`)
    }
  }

  const colDefs: ColDef[] = [
    {field: 'id', headerName: 'Order ID'},
    {field: 'supplier_id', headerName: 'Supplier ID'},
    {field: 'order_date', headerName: 'Date'},
    {
      field: 'parts',
      headerName: 'Parts',
      cellRenderer: (params: any) => (
        <PopoverListCell
          items={params.value || []}
          itemRenderer={(item: OrderPart) => `Part ID: ${item.id}, Qty: ${item.qty}`}
        />
      ),
      sortable: false
    }
  ]

  const {orderCount, supplierCount, partCount, recentOrders} = data

  return (
    <Box p="md">
      <Stack gap="sm">
        <Text size="lg" fw={500}>
          Overview
        </Text>
        <Grid>
          <Grid.Col span={{base: 12, sm: 6, md: 3}}>
            <StatCard label="Total Orders" value={orderCount} />
          </Grid.Col>
          <Grid.Col span={{base: 12, sm: 6, md: 3}}>
            <StatCard label="Total Suppliers" value={supplierCount} />
          </Grid.Col>
          <Grid.Col span={{base: 12, sm: 6, md: 3}}>
            <StatCard label="Total Parts" value={partCount} />
          </Grid.Col>
        </Grid>
      </Stack>

      {/* Recent Orders */}
      <Stack gap="sm">
        <Group justify="space-between" align="flex-end">
          <Stack gap={0}>
            <Text size="lg" fw={500}>
              Most Recent Orders
            </Text>
            <Text size="sm" c="dimmed">
              Showing the latest orders from your system.
            </Text>
          </Stack>
          <Select
            label="Number of orders"
            placeholder="Select count"
            data={['5', '10', '15', '20', '50']}
            value={limit}
            onChange={handleLimitChange}
            w={150}
          />
        </Group>
        <Box h={500}>
          <AgGridReact theme={themeAlpine} columnDefs={colDefs} rowData={recentOrders} />
        </Box>
      </Stack>
    </Box>
  )
}
