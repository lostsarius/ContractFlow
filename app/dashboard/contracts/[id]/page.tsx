import { queryOne } from '@/lib/db'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Edit, Trash2, Calendar, Euro, FileText, Building, Tag, CircleDot, CreditCard, RefreshCw, AlertCircle } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import DeleteContractButton from '@/components/delete-contract-button'
import DocumentsList from '@/components/documents-list'
import DocumentUploadSection from '@/components/document-upload-section'

async function getContract(id: string) {
  const contract = await queryOne('SELECT * FROM Contract WHERE id = ?', [id])
  
  if (!contract) {
    notFound()
  }
  
  return contract as any
}

export default async function ContractDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const contract = await getContract(params.id)

  const statusColor = 
    contract.status === 'active' ? 'bg-green-500' :
    contract.status === 'cancelled' ? 'bg-red-500' :
    'bg-yellow-500'

  const statusText =
    contract.status === 'active' ? 'Aktiv' :
    contract.status === 'cancelled' ? 'Gekündigt' : 'Abgelaufen'

  const billingCycleText =
    contract.billingCycle === 'monthly' ? 'Monatlich' :
    contract.billingCycle === 'yearly' ? 'Jährlich' :
    contract.billingCycle === 'quarterly' ? 'Quartalsweise' : 'Wöchentlich'

  // Calculate monthly cost
  let monthlyCost = contract.price
  switch (contract.billingCycle) {
    case 'yearly':
      monthlyCost = contract.price / 12
      break
    case 'quarterly':
      monthlyCost = contract.price / 3
      break
    case 'weekly':
      monthlyCost = contract.price * 4
      break
  }

  const yearlyCost = monthlyCost * 12

  // Check if contract is expiring soon
  const now = new Date()
  const in90Days = new Date()
  in90Days.setDate(in90Days.getDate() + 90)
  const isExpiringSoon = contract.endDate && new Date(contract.endDate) >= now && new Date(contract.endDate) <= in90Days

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/contracts">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="min-w-0">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight truncate">{contract.title}</h2>
            <p className="text-sm md:text-base text-muted-foreground truncate">{contract.provider}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/contracts/${contract.id}/edit`}>
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <Edit className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Bearbeiten</span>
            </Button>
          </Link>
          <DeleteContractButton 
            contractId={contract.id} 
            contractTitle={contract.title} 
          />
        </div>
      </div>

      {isExpiringSoon && (
        <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Dieser Vertrag läuft bald aus am {formatDate(contract.endDate!)}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Allgemeine Informationen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CircleDot className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Status</span>
              </div>
              <Badge className={statusColor}>{statusText}</Badge>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Kategorie</span>
              </div>
              <span className="text-sm font-medium capitalize">{contract.category}</span>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Anbieter</span>
              </div>
              <span className="text-sm font-medium">{contract.provider}</span>
            </div>

            {contract.contractNumber && (
              <>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Vertragsnummer</span>
                  </div>
                  <span className="text-sm font-medium">{contract.contractNumber}</span>
                </div>
              </>
            )}

            {contract.description && (
              <>
                <Separator />
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">Beschreibung</span>
                  <p className="text-sm">{contract.description}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kosten & Abrechnung</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Euro className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Preis</span>
              </div>
              <span className="text-lg font-bold">{formatCurrency(contract.price, contract.currency)}</span>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Abrechnungszyklus</span>
              </div>
              <span className="text-sm font-medium">{billingCycleText}</span>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Monatliche Kosten</span>
              <span className="text-sm font-medium">{formatCurrency(monthlyCost, contract.currency)}</span>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Jährliche Kosten</span>
              <span className="text-sm font-medium">{formatCurrency(yearlyCost, contract.currency)}</span>
            </div>

            {contract.paymentMethod && (
              <>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Zahlungsmethode</span>
                  </div>
                  <span className="text-sm font-medium">{contract.paymentMethod}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Laufzeit & Termine</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Startdatum</span>
              </div>
              <span className="text-sm font-medium">{formatDate(contract.startDate)}</span>
            </div>

            {contract.endDate && (
              <>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Enddatum</span>
                  </div>
                  <span className="text-sm font-medium">{formatDate(contract.endDate)}</span>
                </div>
              </>
            )}

            {contract.cancellationDeadline && (
              <>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Kündigungsfrist</span>
                  </div>
                  <span className="text-sm font-medium">{formatDate(contract.cancellationDeadline)}</span>
                </div>
              </>
            )}

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Automatische Verlängerung</span>
              </div>
              <Badge variant={contract.autoRenewal ? "default" : "secondary"}>
                {contract.autoRenewal ? 'Ja' : 'Nein'}
              </Badge>
            </div>

            {contract.endDate && !contract.autoRenewal && (
              <>
                <Separator />
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">Verbleibende Tage</span>
                  <p className="text-2xl font-bold">
                    {Math.max(0, Math.ceil((new Date(contract.endDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))} Tage
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {contract.notes && (
          <Card>
            <CardHeader>
              <CardTitle>Notizen</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{contract.notes}</p>
            </CardContent>
          </Card>
        )}

        {contract.documents && (
          <Card>
            <CardHeader>
              <CardTitle>Dokumente</CardTitle>
              <CardDescription>Hochgeladene Vertragsdokumente</CardDescription>
            </CardHeader>
            <CardContent>
              <DocumentsList documents={contract.documents} />
            </CardContent>
          </Card>
        )}

        <DocumentUploadSection 
          contractId={contract.id} 
          currentDocuments={contract.documents}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Metadaten</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Erstellt am</span>
            <span>{formatDate(contract.createdAt)}</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Zuletzt aktualisiert</span>
            <span>{formatDate(contract.updatedAt)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
