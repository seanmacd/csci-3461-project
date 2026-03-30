import {Order} from './schemas/order.schema'
import {Part} from './schemas/part.schema'
import {Supplier} from './schemas/supplier.schema'

export interface DataProvider {
  getSuppliers(): Promise<Supplier[]>
  getParts(): Promise<Part[]>
  getOrders(): Promise<Order[]>
}
