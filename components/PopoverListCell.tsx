'use client'

import {Badge, Popover, Stack} from '@mantine/core'
import {CaretDownIcon} from '@phosphor-icons/react/dist/ssr'
import type {ReactNode} from 'react'

type PopoverListCellProps<T> = {
  items: T[]
  itemRenderer: (item: T, index: number) => ReactNode
  label?: (count: number) => string
}

export function PopoverListCell<T>({items, itemRenderer, label}: PopoverListCellProps<T>) {
  const defaultLabel = (count: number) => `${count} item${count !== 1 ? 's' : ''}`
  const displayLabel = label ? label(items.length) : defaultLabel(items.length)

  if (!items || items.length === 0) {
    return <span>No items</span>
  }

  const renderedItems = items.map((item, index) => <div key={index}>{itemRenderer(item, index)}</div>)

  return (
    <Popover>
      <Popover.Target>
        <Badge variant="default" rightSection={<CaretDownIcon />} w="100%">
          {displayLabel}
        </Badge>
      </Popover.Target>
      <Popover.Dropdown>
        <Stack>{renderedItems}</Stack>
      </Popover.Dropdown>
    </Popover>
  )
}
