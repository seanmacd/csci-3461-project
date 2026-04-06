import {z} from 'zod'

export const SupplierFormSchema = z.object({
  id: z.coerce.number().int('ID is required').min(1, 'ID must be a positive integer'),
  name: z.string().min(1, 'Supplier name is required').trim(),
  email: z.email('Enter a valid email address').toLowerCase().trim(),
  phoneNumbers: z
    .array(z.string().min(1, 'Phone number is required').trim())
    .min(1, 'At least one phone number is required')
})

export type SupplierForm = z.infer<typeof SupplierFormSchema>
