import { queryOne } from '@/lib/db'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

import ContractForm from '@/components/contract-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

async function getContract(id: string) {
  const contract = await queryOne('SELECT * FROM Contract WHERE id = ?', [id])
  
  if (!contract) {
    notFound()
  }
  
  return contract as any
}

export default async function EditContractPage({
  params,
}: {
  params: { id: string }
}) {
  const contract = await getContract(params.id)

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Vertrag bearbeiten</h2>
        <p className="text-muted-foreground">
          Ändern Sie die Vertragsdetails
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vertragsdetails</CardTitle>
          <CardDescription>
            Aktualisieren Sie die Informationen zum Vertrag
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ContractForm contract={contract} />
        </CardContent>
      </Card>
    </div>
  )
}
