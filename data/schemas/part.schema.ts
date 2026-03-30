import z from 'zod'

export const partSchema = z.object({
  id: z.bigint(),
  price: z.number(),
  desc: z.string()
})

export type Part = z.infer<typeof partSchema>
