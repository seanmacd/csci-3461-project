import {Badge, Box, Group, Stack, Tabs, TabsList, TabsPanel, TabsTab} from '@mantine/core'
import {CarIcon} from '@phosphor-icons/react/dist/ssr'
import {DuckDbProvider} from '../data/duckdb-provider'
import {DashboardTab} from './Dashboard.tab'
import {OrdersTab} from './Orders.tab'
import {PartsTab} from './Parts.tab'
import {SuppliersTab} from './Suppliers.tab'

type TabDef = {
  value: string
  label: string
}

const tabDefs: TabDef[] = [
  {value: 'dashboard', label: 'Dashboard'},
  {value: 'suppliers', label: 'Suppliers'},
  {value: 'parts', label: 'Parts'},
  {value: 'orders', label: 'Orders'},
  {value: 'annualExpenses', label: 'Annual Expenses'},
  {value: 'budgetProjection', label: 'Budget Projection'}
]

export default async function Dashboard() {
  // This should be lazy loaded per tab vs loading everything upfront
  const provider = new DuckDbProvider()
  const suppliers = await provider.getSuppliers()
  const parts = await provider.getParts()
  const orders = await provider.getOrders()

  const tabs = tabDefs.map(def => (
    <TabsTab key={def.value} value={def.value} py="lg" w="100%">
      {def.label}
    </TabsTab>
  ))

  return (
    <Tabs defaultValue="dashboard" orientation="vertical" py="md" h="100vh">
      <TabsList w={200}>
        <Stack align="center">
          <Group gap="xs">
            <CarIcon size={32} weight="fill" color="var(--mantine-primary-color-filled)" />
            <Badge size="lg">MUC</Badge>
          </Group>
          <Box flex={1} w="100%">
            {tabs}
          </Box>
        </Stack>
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
