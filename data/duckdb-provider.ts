import 'server-only'

import {DuckDBConnection} from '@duckdb/node-api'
import z from 'zod'
import {DataProvider} from './data-provider.interface'
import {Order, orderSchema} from './schemas/order.schema'
import {Part, partSchema} from './schemas/part.schema'
import {Supplier, supplierSchema} from './schemas/supplier.schema'

export class DuckDbProvider implements DataProvider {
  private clientPromise = DuckDBConnection.create()

  async getSuppliers(): Promise<Supplier[]> {
    const client = await this.clientPromise
    const sql = `
      SELECT _id AS id, name, email, tel AS phoneNumbers 
      FROM read_json_auto('data/suppliers_100.json')
    `
    const reader = await client.runAndReadAll(sql)
    const data = reader.getRowObjectsJS()
    return z.array(supplierSchema).parse(data)
  }

  async getParts(): Promise<Part[]> {
    const client = await this.clientPromise
    const sql = `
      SELECT _id AS id, price, description AS desc
      FROM read_json_auto('data/parts_100.json')
    `
    const reader = await client.runAndReadAll(sql)
    const data = reader.getRowObjectsJS()
    return z.array(partSchema).parse(data)
  }

  async getOrders(): Promise<Order[]> {
    const client = await this.clientPromise
    const sql = `
      SELECT "when" AS date, supp_id as supplierId, items
      FROM read_json_auto('data/orders_4000.json')
    `
    const reader = await client.runAndReadAll(sql)
    const data = reader.getRowObjectsJS()
    return z.array(orderSchema).parse(data)
  }
}
