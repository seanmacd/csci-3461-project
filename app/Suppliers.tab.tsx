'use client'

import {Badge, Box, Popover, Stack, Text, TextInput} from '@mantine/core'
import {useDebouncedValue} from '@mantine/hooks'
import {CaretDownIcon, MagnifyingGlass} from '@phosphor-icons/react/dist/ssr'
import {themeAlpine, type ColDef} from 'ag-grid-community'
import {AgGridReact} from 'ag-grid-react'
import Fuse from 'fuse.js'
import {useMemo, useState} from 'react'
import type {Supplier} from '../data/schemas/supplier.schema'

export function SuppliersTab({suppliers}: {suppliers: Supplier[]}) {
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebouncedValue(search, 300)

  const indexedSuppliers = suppliers.map(s => {
    return {...s, index: {id: s.id.toString()}}
  })

  const fuse = useMemo(
    () =>
      new Fuse(indexedSuppliers, {
        keys: ['index.id', 'name', 'email', 'phoneNumbers.number'],
        threshold: 0.3
      }),
    [indexedSuppliers]
  )

  const filteredSuppliers = useMemo(() => {
    if (!debouncedSearch.trim()) return suppliers
    return fuse.search(debouncedSearch).map((result: any) => result.item)
  }, [fuse, debouncedSearch, suppliers])

  const colDefs: ColDef[] = [
    {field: 'id', headerName: 'ID', sortable: true},
    {field: 'name', headerName: 'Name', sortable: false},
    {field: 'email', headerName: 'Email', sortable: false},
    {field: 'phoneNumbers', headerName: 'Phone Numbers', cellRenderer: PhoneNumbersCell, sortable: false}
  ]

  return (
    <Box px="md" h={800}>
      <Text size="sm" mb="md" c="dimmed">
        Browse and manage supplier information including contact details and phone numbers.
      </Text>
      <TextInput
        placeholder="Search suppliers..."
        leftSection={<MagnifyingGlass />}
        value={search}
        onChange={e => setSearch(e.currentTarget.value)}
        mb="md"
      />
      <AgGridReact theme={themeAlpine} columnDefs={colDefs} rowData={filteredSuppliers} />
    </Box>
  )
}

function PhoneNumbersCell({value}: {value: Supplier['phoneNumbers']}) {
  const numbers = (value as Supplier['phoneNumbers']).map((pn, index) => <div key={index}>{pn.number}</div>)
  return (
    <Popover>
      <Popover.Target>
        <Badge variant="default" rightSection={<CaretDownIcon />} w="100%">
          {value.length} phone number{value.length > 1 ? 's' : ''}
        </Badge>
      </Popover.Target>
      <Popover.Dropdown>
        <Stack>{numbers}</Stack>
      </Popover.Dropdown>
    </Popover>
  )
}
