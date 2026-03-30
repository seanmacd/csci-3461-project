'use client'

import {Badge, Box, Popover, Stack, Text, TextInput} from '@mantine/core'
import {useDebouncedValue} from '@mantine/hooks'
import {CaretDownIcon, MagnifyingGlassIcon} from '@phosphor-icons/react/dist/ssr'
import {themeAlpine, type ColDef} from 'ag-grid-community'
import {AgGridReact} from 'ag-grid-react'
import Fuse from 'fuse.js'
import {useMemo, useState} from 'react'
import type {Order, OrderItem} from '../data/schemas/order.schema'

export function OrdersTab({orders}: {orders: Order[]}) {
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebouncedValue(search, 250)

  const indexedOrders = orders.map(o => {
    return {...o, index: {supplierId: o.supplierId.toString(), date: o.date.toISOString()}}
  })

  const fuse = useMemo(
    () =>
      new Fuse(indexedOrders, {
        keys: ['index.supplierId', 'index.date']
      }),
    [indexedOrders]
  )

  const filteredOrders = useMemo(() => {
    if (!debouncedSearch.trim()) return orders
    const results = fuse.search(debouncedSearch)
    return results.map(result => result.item)
  }, [fuse, debouncedSearch, orders])

  const colDefs: ColDef[] = [
    {field: 'date', headerName: 'Date'},
    {field: 'supplierId', headerName: 'Supplier ID'},
    {field: 'items', headerName: 'Items', cellRenderer: OrderItemsCell, sortable: false}
  ]

  return (
    <Box px="md" h={800}>
      <Text size="sm" mb="md" c="dimmed">
        View all orders with supplier information and itemized part lists.
      </Text>
      <TextInput
        placeholder="Search orders..."
        leftSection={<MagnifyingGlassIcon />}
        value={search}
        onChange={e => setSearch(e.currentTarget.value)}
        mb="md"
      />
      <AgGridReact theme={themeAlpine} columnDefs={colDefs} rowData={filteredOrders} />
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
