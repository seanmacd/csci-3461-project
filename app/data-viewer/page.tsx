import {getOrders, getParts, getSuppliers} from '@/data/db'
import z from 'zod'
import {DataViewer, type DataViewerData} from './DataViewer'

const tabs = ['orders', 'parts', 'suppliers'] as const

type Tab = (typeof tabs)[number]
type Fetcher = () => Promise<any>

const fetchers: Record<Tab, Fetcher> = {
  orders: getOrders,
  parts: getParts,
  suppliers: getSuppliers
}

const ParamsSchema = z.object({
  tab: z.enum(tabs).default('orders')
})

export default async function Page({searchParams}: {searchParams: Promise<unknown>}) {
  const {tab} = ParamsSchema.parse(await searchParams)
  const data: DataViewerData = {}
  data[tab] = await fetchers[tab]()

  return <DataViewer data={data} />
}
