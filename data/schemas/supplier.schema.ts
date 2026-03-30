import z from 'zod'

export const supplierSchema = z.object({
  id: z.bigint(),
  name: z.string(),
  email: z.email(),
  phoneNumbers: z.array(
    z.object({
      number: z.string()
    })
  )
})

export type Supplier = z.infer<typeof supplierSchema>
