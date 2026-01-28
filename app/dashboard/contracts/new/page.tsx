import ContractForm from '@/components/contract-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function NewContractPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Neuer Vertrag</h2>
        <p className="text-muted-foreground">
          Fügen Sie einen neuen Vertrag hinzu
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vertragsdetails</CardTitle>
          <CardDescription>
            Geben Sie alle relevanten Informationen zum Vertrag ein
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ContractForm />
        </CardContent>
      </Card>
    </div>
  )
}
