import {env} from '@/env'
import mysql, {RowDataPacket} from 'mysql2/promise'
import {AnnualExpense, AnnualExpensesData, DashboardData, Order, Part, Supplier} from './types'

export const db = mysql.createPool(env.DATABASE_URL)

export async function query<T>(sql: string, params?: any[]) {
  const [rows] = await db.execute<(T & RowDataPacket)[]>(sql, params || [])
  return rows
}

export async function getDashboardData(limit: number): Promise<DashboardData> {
  const [orderCount] = await query<{orderCount: number}>('SELECT COUNT(*) AS value FROM orders')
  const [supplierCount] = await query<{supplierCount: number}>('SELECT COUNT(*) AS value FROM suppliers')
  const [partCount] = await query<{partCount: number}>('SELECT COUNT(*) AS value FROM parts')
  const recentOrders = await getOrders(limit)

  return {
    orderCount: orderCount.value,
    supplierCount: supplierCount.value,
    partCount: partCount.value,
    recentOrders
  }
}

export async function getAnnualExpenses(startYear?: number, endYear?: number): Promise<AnnualExpensesData> {
  // Query to get year bounds first
  const boundsQuery = `
    SELECT 
      MIN(YEAR(o.order_date)) as minYear,
      MAX(YEAR(o.order_date)) as maxYear
    FROM orders o
  `
  const bounds = await query<{minYear: number | null; maxYear: number | null}>(boundsQuery)
  const minYearBound = bounds[0]?.minYear ?? new Date().getFullYear()
  const maxYearBound = bounds[0]?.maxYear ?? new Date().getFullYear()

  // Use provided years or defaults
  const finalStartYear = startYear ?? minYearBound
  const finalEndYear = endYear ?? maxYearBound

  // Query to get annual totals by year filtered by range
  const sql = `
    SELECT 
      YEAR(o.order_date) as year,
      SUM(op.qty * p.price) as total
    FROM orders o
    JOIN order_parts op ON o.id = op.order_id
    JOIN parts p ON op.part_id = p.id
    WHERE YEAR(o.order_date) BETWEEN ? AND ?
    GROUP BY YEAR(o.order_date)
    ORDER BY year ASC
  `

  const rows = await query<{year: number; total: number}>(sql, [finalStartYear, finalEndYear])

  const annualExpenses: AnnualExpense[] = rows.map(row => ({
    year: row.year.toString(),
    total: Number(row.total.toFixed(2))
  }))

  return {minYear: minYearBound, maxYear: maxYearBound, annualExpenses}
}

export async function getBudgetProjectionBase(): Promise<number> {
  // Calculate total spending from all orders as the base for budget projection
  const sql = `
    SELECT SUM(op.qty * p.price) as value
    FROM orders o
    JOIN order_parts op ON o.id = op.order_id
    JOIN parts p ON op.part_id = p.id
  `
  const [total] = await query<{value: number}>(sql)
  return total.value
}

export async function getOrders(limit?: number): Promise<Order[]> {
  const limitClause = limit ? `LIMIT ${limit}` : ''
  const sql = `
    SELECT 
      o.id,
      o.supplier_id,
      o.order_date,
      JSON_ARRAYAGG(JSON_OBJECT('id', op.part_id, 'qty', op.qty)) as parts
    FROM orders o
    LEFT JOIN order_parts op ON o.id = op.order_id
    GROUP BY o.id, o.supplier_id, o.order_date
    ORDER BY o.order_date DESC
    ${limitClause}
  `
  return query<Order>(sql)
}

export async function getParts(): Promise<Part[]> {
  const sql = `
    SELECT id, price, description
    FROM parts
    ORDER BY id
  `
  return query<Part>(sql)
}

export async function getSuppliers(): Promise<Supplier[]> {
  const sql = `
    SELECT 
      s.id,
      s.name,
      s.email,
      JSON_ARRAYAGG(JSON_OBJECT('phone', pn.phone)) as phoneNumbers
    FROM suppliers s
    LEFT JOIN supplier_phones pn ON s.id = pn.supplier_id
    GROUP BY s.id, s.name, s.email
    ORDER BY s.id
  `
  return query<Supplier>(sql)
}
