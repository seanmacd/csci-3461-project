'use client'

import {PopoverListCell, SearchableTable} from '@/components'
import type {Order, OrderPart} from '@/data/types'
import type {ColDef} from 'ag-grid-community'

type OrdersTabProps = {
  orders?: Order[]
}

export function OrdersTab({orders}: OrdersTabProps) {
  const columns: ColDef[] = [
    {field: 'id', headerName: 'ID', sortable: true},
    {field: 'supplier_id', headerName: 'Supplier ID', sortable: true},
    {field: 'order_date', headerName: 'Date', sortable: true},
    {
      field: 'parts',
      headerName: 'Items',
      cellRenderer: (params: any) => (
        <PopoverListCell
          items={params.value || []}
          itemRenderer={(item: OrderPart) => `Part ID: ${item.id}, Qty: ${item.qty}`}
        />
      ),
      sortable: false
    }
  ]

  return (
    <SearchableTable
      data={orders}
      columns={columns}
      searchKeys={['supplier_id', 'order_date']}
      searchPlaceholder="Search orders..."
      description="View all orders with supplier information and itemized part lists."
      debounceMs={250}
    />
  )
}
