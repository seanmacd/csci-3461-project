'use client'

import {Badge, Box, Grid, Group, Paper, Popover, Select, Stack, Text} from '@mantine/core'
import {CaretDownIcon} from '@phosphor-icons/react/dist/ssr'
import {themeAlpine, type ColDef} from 'ag-grid-community'
import {AgGridReact} from 'ag-grid-react'
import {useMemo, useState} from 'react'
import type {Order, OrderItem} from '../data/schemas/order.schema'
import type {Part} from '../data/schemas/part.schema'
import type {Supplier} from '../data/schemas/supplier.schema'

interface DashboardProps {
  orders: Order[]
  parts: Part[]
  suppliers: Supplier[]
}

export function DashboardTab({orders, parts, suppliers}: DashboardProps) {
  const [orderCount, setOrderCount] = useState('5')

  const stats = useMemo(() => {
    const totalOrders = orders.length
    const totalSuppliers = suppliers.length
    const totalParts = parts.length
    const avgItemsPerOrder =
      orders.length > 0 ? (orders.reduce((sum, o) => sum + o.items.length, 0) / orders.length).toFixed(1) : 0

    return {totalOrders, totalSuppliers, totalParts, avgItemsPerOrder}
  }, [orders, parts, suppliers])

  const recentOrders = useMemo(() => {
    const count = parseInt(orderCount)
    return [...orders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, count)
  }, [orders, orderCount])

  const colDefs: ColDef[] = [
    {field: 'date', headerName: 'Date'},
    {field: 'supplierId', headerName: 'Supplier ID'},
    {field: 'items', headerName: 'Items', cellRenderer: OrderItemsCell, sortable: false}
  ]

  return (
    <Box px="md">
      <Stack gap="xl">
        <Stack gap="sm">
          <Text size="lg" fw={500}>
            Overview
          </Text>
          <Grid>
            <Grid.Col span={{base: 12, sm: 6, md: 3}}>
              <Paper p="md" radius="md" withBorder>
                <Stack gap={0}>
                  <Text size="xs" c="dimmed" fw={700} tt="uppercase">
                    Total Orders
                  </Text>
                  <Text size="xl" fw={700} mt={4}>
                    {stats.totalOrders}
                  </Text>
                </Stack>
              </Paper>
            </Grid.Col>
            <Grid.Col span={{base: 12, sm: 6, md: 3}}>
              <Paper p="md" radius="md" withBorder>
                <Stack gap={0}>
                  <Text size="xs" c="dimmed" fw={700} tt="uppercase">
                    Total Suppliers
                  </Text>
                  <Text size="xl" fw={700} mt={4}>
                    {stats.totalSuppliers}
                  </Text>
                </Stack>
              </Paper>
            </Grid.Col>
            <Grid.Col span={{base: 12, sm: 6, md: 3}}>
              <Paper p="md" radius="md" withBorder>
                <Stack gap={0}>
                  <Text size="xs" c="dimmed" fw={700} tt="uppercase">
                    Total Parts
                  </Text>
                  <Text size="xl" fw={700} mt={4}>
                    {stats.totalParts}
                  </Text>
                </Stack>
              </Paper>
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
              value={orderCount}
              onChange={value => setOrderCount(value || '5')}
              w={150}
            />
          </Group>
          <Box h={500}>
            <AgGridReact theme={themeAlpine} columnDefs={colDefs} rowData={recentOrders} />
          </Box>
        </Stack>
      </Stack>
    </Box>
  )
}

function OrderItemsCell({value}: {value: OrderItem[]}) {
  const items = (value as OrderItem[]).map((item, index) => (
    <div key={index}>
      Part ID: {String(item.part_id)}, Qty: {String(item.qty)}
    </div>
  ))
  return (
    <Popover>
      <Popover.Target>
        <Badge variant="default" rightSection={<CaretDownIcon />} w="100%">
          {value.length} item{value.length > 1 ? 's' : ''}
        </Badge>
      </Popover.Target>
      <Popover.Dropdown>
        <Stack>{items}</Stack>
      </Popover.Dropdown>
    </Popover>
  )
}
