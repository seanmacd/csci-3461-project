'use client'

import {Box, Text, TextInput} from '@mantine/core'
import {useDebouncedValue} from '@mantine/hooks'
import {MagnifyingGlassIcon} from '@phosphor-icons/react/dist/ssr'
import {themeAlpine, type ColDef} from 'ag-grid-community'
import {AgGridReact} from 'ag-grid-react'
import Fuse from 'fuse.js'
import {useMemo, useState} from 'react'

type SearchableTableProps<T> = {
  data?: T[]
  columns: ColDef[]
  searchKeys: string[]
  searchPlaceholder?: string
  description?: string
  debounceMs?: number
  threshold?: number
  height?: number | string
}

export function SearchableTable<T extends Record<string, any>>({
  data,
  columns,
  searchKeys,
  searchPlaceholder = 'Search...',
  description,
  debounceMs = 300,
  threshold = 0.3,
  height = 500
}: SearchableTableProps<T>) {
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebouncedValue(search, debounceMs)

  const indexedData = useMemo(() => {
    if (!data) return []
    return data.map(item => {
      const indexed: any = {...item}
      // Create indexed fields for numeric types
      searchKeys.forEach(key => {
        if (typeof item[key] === 'number') {
          indexed[`_${key}`] = item[key].toString()
        }
      })
      return indexed
    })
  }, [data, searchKeys])

  const fuse = useMemo(
    () =>
      new Fuse(indexedData, {
        keys: searchKeys.flatMap(key => (typeof data?.[0]?.[key] === 'number' ? [`_${key}`] : [key])),
        threshold
      }),
    [indexedData, searchKeys, threshold, data]
  )

  const filteredData = useMemo(() => {
    if (!data) return []
    if (!debouncedSearch.trim()) return data
    const results = fuse.search(debouncedSearch)
    return results.map(result => result.item)
  }, [fuse, debouncedSearch, data])

  return (
    <>
      {description && (
        <Text size="sm" mb="md" c="dimmed">
          {description}
        </Text>
      )}
      <TextInput
        placeholder={searchPlaceholder}
        leftSection={<MagnifyingGlassIcon />}
        value={search}
        onChange={e => setSearch(e.currentTarget.value)}
        mb="md"
      />
      <Box h={height} className="ag-theme-alpine">
        <AgGridReact theme={themeAlpine} columnDefs={columns} rowData={filteredData} />
      </Box>
    </>
  )
}
