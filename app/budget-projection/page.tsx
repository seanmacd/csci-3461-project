import {getBudgetProjectionBase} from '@/data/db'
import {BudgetProjection} from './BudgetProjection'

export default async function Page() {
  const baseTotal = await getBudgetProjectionBase()
  return <BudgetProjection baseTotal={baseTotal} />
}
