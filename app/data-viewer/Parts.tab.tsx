'use client'

import {SearchableTable} from '@/components'
import type {Part} from '@/data/types'
import type {ColDef} from 'ag-grid-community'

type PartsTabProps = {
  parts?: Part[]
}

export function PartsTab({parts}: PartsTabProps) {
  const columns: ColDef[] = [
    {field: 'id', headerName: 'ID', sortable: true},
    {field: 'price', headerName: 'Price', sortable: true},
    {field: 'description', headerName: 'Description', sortable: false}
  ]

  return (
    <SearchableTable
      data={parts}
      columns={columns}
      searchKeys={['id', 'price', 'description']}
      searchPlaceholder="Search parts..."
      description="View all available parts with pricing and descriptions."
      debounceMs={300}
      threshold={0.3}
    />
  )
}
