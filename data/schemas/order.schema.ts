import z from 'zod'

export const orderItemSchema = z.object({
  part_id: z.bigint(),
  qty: z.bigint()
})

export const orderSchema = z.object({
  date: z.date(),
  supplierId: z.bigint(),
  items: z.array(orderItemSchema)
})

export type Order = z.infer<typeof orderSchema>
export type OrderItem = z.infer<typeof orderItemSchema>
