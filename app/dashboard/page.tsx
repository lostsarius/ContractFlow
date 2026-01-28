import { query } from '@/lib/db'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Euro, TrendingUp, AlertCircle, Plus } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

async function getDashboardData() {
  const contracts: any[] = await query('SELECT * FROM Contract ORDER BY createdAt DESC')

  const activeContracts = contracts.filter(c => c.status === 'active')
  
  const monthlyCosts = activeContracts.reduce((sum, contract) => {
    let monthlyAmount = 0
    switch (contract.billingCycle) {
      case 'monthly':
        monthlyAmount = contract.price
        break
      case 'quarterly':
        monthlyAmount = contract.price / 3
        break
      case 'yearly':
        monthlyAmount = contract.price / 12
        break
      case 'weekly':
        monthlyAmount = contract.price * 4
        break
      default:
        monthlyAmount = contract.price
    }
    return sum + monthlyAmount
  }, 0)

  const now = new Date()
  const in90Days = new Date()
  in90Days.setDate(in90Days.getDate() + 90)
  
  const upcomingRenewals = contracts
    .filter(c => {
      if (!c.endDate || c.status !== 'active') return false
      const endDate = new Date(c.endDate)
      return endDate >= now && endDate <= in90Days
    })
    .sort((a, b) => new Date(a.endDate!).getTime() - new Date(b.endDate!).getTime())
    .slice(0, 5)

  return {
    totalContracts: contracts.length,
    activeContracts: activeContracts.length,
    monthlyCosts: Math.round(monthlyCosts * 100) / 100,
    yearlyCosts: Math.round(monthlyCosts * 12 * 100) / 100,
    upcomingRenewals,
    recentContracts: contracts.slice(0, 5)
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData()

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground mt-1">
            Übersicht über Ihre Verträge und Kosten
          </p>
        </div>
        <Link href="/dashboard/contracts/new">
          <Button size="lg" className="w-full sm:w-auto shadow-md">
            <Plus className="mr-2 h-5 w-5" />
            Neuer Vertrag
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Verträge gesamt
            </CardTitle>
            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.totalContracts}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {data.activeContracts} aktiv
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Monatliche Kosten
            </CardTitle>
            <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <Euro className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatCurrency(data.monthlyCosts)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Aktive Verträge
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Jährliche Kosten
            </CardTitle>
            <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatCurrency(data.yearlyCosts)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Hochgerechnet
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ablaufende Verträge
            </CardTitle>
            <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {data.upcomingRenewals.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Nächste 90 Tage
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Ablaufende Verträge</CardTitle>
                <CardDescription className="mt-1">
                  Verträge, die in den nächsten 90 Tagen auslaufen
                </CardDescription>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            {data.upcomingRenewals.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
                  <AlertCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-sm font-medium">Keine ablaufenden Verträge</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Alle Verträge sind aktuell
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {data.upcomingRenewals.map((contract) => (
                  <Link
                    key={contract.id}
                    href={`/dashboard/contracts/${contract.id}`}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="space-y-1 flex-1">
                      <p className="text-sm font-semibold leading-none">
                        {contract.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {contract.provider}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
                        {formatDate(contract.endDate!)}
                      </p>
                      {contract.autoRenewal && (
                        <p className="text-xs text-muted-foreground">
                          Auto-Verlängerung
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Neueste Verträge</CardTitle>
                <CardDescription className="mt-1">
                  Zuletzt hinzugefügte Verträge
                </CardDescription>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            {data.recentContracts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium">Keine Verträge vorhanden</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Fügen Sie Ihren ersten Vertrag hinzu
                </p>
                <Link href="/dashboard/contracts/new" className="mt-4">
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Vertrag erstellen
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {data.recentContracts.map((contract) => (
                  <Link
                    key={contract.id}
                    href={`/dashboard/contracts/${contract.id}`}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="space-y-1 flex-1">
                      <p className="text-sm font-semibold leading-none">
                        {contract.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {contract.provider}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">
                        {formatCurrency(contract.price)}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {contract.billingCycle === 'monthly' ? 'monatlich' :
                         contract.billingCycle === 'yearly' ? 'jährlich' :
                         contract.billingCycle === 'quarterly' ? 'quartalsweise' : 'wöchentlich'}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
