'use client'

import {PopoverListCell, SearchableTable} from '@/components'
import type {Supplier} from '@/data/types'
import type {ColDef} from 'ag-grid-community'

type SuppliersTabProps = {
  suppliers?: Supplier[]
}

export function SuppliersTab({suppliers}: SuppliersTabProps) {
  const columns: ColDef[] = [
    {field: 'id', headerName: 'ID', sortable: true},
    {field: 'name', headerName: 'Name', sortable: false},
    {field: 'email', headerName: 'Email', sortable: false},
    {
      field: 'phoneNumbers',
      headerName: 'Phone Numbers',
      cellRenderer: (params: any) => (
        <PopoverListCell
          items={params.value || []}
          itemRenderer={(pn: any) => pn.phone}
          label={(count: number) => `${count} phone number${count !== 1 ? 's' : ''}`}
        />
      ),
      sortable: false
    }
  ]

  return (
    <SearchableTable
      data={suppliers}
      columns={columns}
      searchKeys={['id', 'name', 'email']}
      searchPlaceholder="Search suppliers..."
      description="Browse and manage supplier information including contact details and phone numbers."
      debounceMs={300}
      threshold={0.3}
    />
  )
}
