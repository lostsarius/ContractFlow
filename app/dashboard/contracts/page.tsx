import { query } from '@/lib/db'
import ContractsClient from '@/components/contracts-client'

export const dynamic = 'force-dynamic'

async function getContracts() {
  return await query('SELECT * FROM Contract ORDER BY createdAt DESC')
}

export default async function ContractsPage() {
  const contracts = await getContracts()

  return <ContractsClient contracts={contracts as any[]} />
}
