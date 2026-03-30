'use client'

import {Box, Text, TextInput} from '@mantine/core'
import {useDebouncedValue} from '@mantine/hooks'
import {MagnifyingGlass} from '@phosphor-icons/react/dist/ssr'
import {themeAlpine, type ColDef} from 'ag-grid-community'
import {AgGridReact} from 'ag-grid-react'
import Fuse from 'fuse.js'
import {useMemo, useState} from 'react'
import type {Part} from '../data/schemas/part.schema'

export function PartsTab({parts}: {parts: Part[]}) {
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebouncedValue(search, 300)

  const indexedParts = parts.map(p => {
    return {...p, index: {id: p.id.toString(), price: p.price.toString()}}
  })

  const fuse = useMemo(
    () =>
      new Fuse(indexedParts, {
        keys: ['index.id', 'index.price', 'desc'],
        threshold: 0.3
      }),
    [indexedParts]
  )

  const filteredParts = useMemo(() => {
    if (!debouncedSearch.trim()) return parts
    return fuse.search(debouncedSearch).map((result: any) => result.item)
  }, [fuse, debouncedSearch, parts])

  const colDefs: ColDef[] = [
    {field: 'id', headerName: 'ID', sortable: true},
    {field: 'price', headerName: 'Price', sortable: true},
    {field: 'desc', headerName: 'Description', sortable: false}
  ]

  return (
    <Box px="md" h={800}>
      <Text size="sm" mb="md" c="dimmed">
        View all available parts with pricing and descriptions.
      </Text>
      <TextInput
        placeholder="Search parts..."
        leftSection={<MagnifyingGlass />}
        value={search}
        onChange={e => setSearch(e.currentTarget.value)}
        mb="md"
      />
      <AgGridReact theme={themeAlpine} columnDefs={colDefs} rowData={filteredParts} />
    </Box>
  )
}
