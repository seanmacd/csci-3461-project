export type Order = {
  id: number
  supplier_id: number
  order_date: Date
  parts: OrderPart[]
}

export type OrderPart = {
  id: number
  qty: number
}

export type Part = {
  id: number
  price: number
  description: string
}

export type Supplier = {
  id: number
  name: string
  email: string
  phoneNumbers: SupplierPhone[]
}

export type SupplierPhone = {
  phone: string
}

export type AnnualExpense = {
  year: string
  total: number
}

export type AnnualExpensesData = {
  minYear: number
  maxYear: number
  annualExpenses: AnnualExpense[]
}

export type DashboardData = {
  orderCount: number
  supplierCount: number
  partCount: number
  recentOrders: Order[]
}
