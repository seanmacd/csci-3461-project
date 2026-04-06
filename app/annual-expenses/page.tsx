import {getAnnualExpenses} from '@/data/db'
import {z} from 'zod'
import {AnnualExpenses} from './AnnualExpenses'

const ParamsSchema = z.object({
  startYear: z.coerce.number().optional(),
  endYear: z.coerce.number().optional()
})

export default async function Page({searchParams}: {searchParams: Promise<unknown>}) {
  const {startYear, endYear} = ParamsSchema.parse(await searchParams)
  const data = await getAnnualExpenses(startYear, endYear)
  return <AnnualExpenses data={data} />
}
