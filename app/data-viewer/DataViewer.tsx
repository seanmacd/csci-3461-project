'use client'

import type {Order, Part, Supplier} from '@/data/types'
import {Box, Tabs} from '@mantine/core'
import {useRouter, useSearchParams} from 'next/navigation'
import {OrdersTab} from './Orders.tab'
import {PartsTab} from './Parts.tab'
import {SuppliersTab} from './Suppliers.tab'

export type DataViewerData = {
  orders?: Order[]
  parts?: Part[]
  suppliers?: Supplier[]
}

type DataViewerProps = {
  data: DataViewerData
}

export function DataViewer({data}: DataViewerProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tab = searchParams.get('tab') ?? 'orders'

  return (
    <Box p="md">
      <Tabs value={tab} onChange={value => router.push(`?tab=${value}`)}>
        <Tabs.List>
          <Tabs.Tab value="orders">Orders</Tabs.Tab>
          <Tabs.Tab value="parts">Parts</Tabs.Tab>
          <Tabs.Tab value="suppliers">Suppliers</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="orders" pt="lg">
          <OrdersTab orders={data.orders} />
        </Tabs.Panel>

        <Tabs.Panel value="parts" pt="lg">
          <PartsTab parts={data.parts} />
        </Tabs.Panel>

        <Tabs.Panel value="suppliers" pt="lg">
          <SuppliersTab suppliers={data.suppliers} />
        </Tabs.Panel>
      </Tabs>
    </Box>
  )
}
