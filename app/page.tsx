import {Tabs, TabsList, TabsPanel, TabsTab} from '@mantine/core'
import {CarIcon} from '@phosphor-icons/react/dist/ssr'
import {DuckDbProvider} from '../data/duckdb-provider'
import {DashboardTab} from './Dashboard.tab'
import {OrdersTab} from './Orders.tab'
import {PartsTab} from './Parts.tab'
import {SuppliersTab} from './Suppliers.tab'

export default async function Dashboard() {
  const provider = new DuckDbProvider()
  const suppliers = await provider.getSuppliers()
  const parts = await provider.getParts()
  const orders = await provider.getOrders()

  return (
    <Tabs defaultValue="dashboard" orientation="vertical" py="md" h="100vh">
      <TabsList w={150} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem'}}>
          <CarIcon size={32} />
        </div>
        <TabsTab value="dashboard">Dashboard</TabsTab>
        <TabsTab value="suppliers">Suppliers</TabsTab>
        <TabsTab value="parts">Parts</TabsTab>
        <TabsTab value="orders">Orders</TabsTab>
        <TabsTab value="annualExpenses">Annual Expenses</TabsTab>
        <TabsTab value="budgetProjection">Budget Projection</TabsTab>
        {/* Future tabs for other data */}
      </TabsList>

      <TabsPanel value="dashboard">
        <DashboardTab orders={orders} parts={parts} suppliers={suppliers} />
      </TabsPanel>
      <TabsPanel value="suppliers">
        <SuppliersTab suppliers={suppliers} />
      </TabsPanel>
      <TabsPanel value="parts">
        <PartsTab parts={parts} />
      </TabsPanel>
      <TabsPanel value="orders">
        <OrdersTab orders={orders} />
      </TabsPanel>
    </Tabs>
  )
}
