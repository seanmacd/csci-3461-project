import {getDashboardData} from '@/data/db'
import {Dashboard} from './Dashboard'

type DashboardPageProps = {
  searchParams: Promise<{limit?: string}>
}

export default async function Page({searchParams}: DashboardPageProps) {
  const params = await searchParams
  const limit = Number(params.limit ?? '10')
  const data = await getDashboardData(limit)

  return <Dashboard data={data} />
}
