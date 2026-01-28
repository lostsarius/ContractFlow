'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Plus, FileText, Search, Filter, X, Calendar, Euro, Building2, Edit } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import DeleteContractButton from '@/components/delete-contract-button'

interface Contract {
  id: string
  title: string
  description: string | null
  provider: string
  contractNumber: string | null
  category: string
  status: string
  startDate: Date
  endDate: Date | null
  cancellationDeadline: Date | null
  autoRenewal: boolean
  price: number
  currency: string
  billingCycle: string
  paymentMethod: string | null
  notes: string | null
  documents: string | null
  createdAt: Date
  updatedAt: Date
}

interface ContractsClientProps {
  contracts: Contract[]
}

export default function ContractsClient({ contracts }: ContractsClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [billingCycleFilter, setBillingCycleFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  const categories = useMemo(() => {
    const cats = new Set(contracts.map(c => c.category))
    return Array.from(cats).sort()
  }, [contracts])

  const filteredContracts = useMemo(() => {
    return contracts.filter(contract => {
      const matchesSearch = 
        contract.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contract.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contract.contractNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contract.description?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = categoryFilter === 'all' || contract.category === categoryFilter
      const matchesStatus = statusFilter === 'all' || contract.status === statusFilter
      const matchesBillingCycle = billingCycleFilter === 'all' || contract.billingCycle === billingCycleFilter

      return matchesSearch && matchesCategory && matchesStatus && matchesBillingCycle
    })
  }, [contracts, searchQuery, categoryFilter, statusFilter, billingCycleFilter])

  const clearFilters = () => {
    setSearchQuery('')
    setCategoryFilter('all')
    setStatusFilter('all')
    setBillingCycleFilter('all')
  }

  const hasActiveFilters = searchQuery || categoryFilter !== 'all' || statusFilter !== 'all' || billingCycleFilter !== 'all'

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Verträge</h2>
          <p className="text-muted-foreground mt-1">
            {filteredContracts.length} von {contracts.length} Verträgen
          </p>
        </div>
        <Link href="/dashboard/contracts/new">
          <Button size="lg" className="w-full sm:w-auto shadow-md">
            <Plus className="mr-2 h-5 w-5" />
            Neuer Vertrag
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Verträge durchsuchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-11"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={showFilters ? "default" : "outline"}
              size="lg"
              onClick={() => setShowFilters(!showFilters)}
              className="shrink-0"
            >
              <Filter className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Filter</span>
            </Button>
            {hasActiveFilters && (
              <Button variant="ghost" size="lg" onClick={clearFilters} className="shrink-0">
                <X className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Zurücksetzen</span>
              </Button>
            )}
          </div>
        </div>

        {showFilters && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 p-6 bg-muted/50 rounded-lg border shadow-sm">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Kategorie</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Kategorien</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat} className="capitalize">
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Status</SelectItem>
                  <SelectItem value="active">Aktiv</SelectItem>
                  <SelectItem value="cancelled">Gekündigt</SelectItem>
                  <SelectItem value="expired">Abgelaufen</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Abrechnungszyklus</label>
              <Select value={billingCycleFilter} onValueChange={setBillingCycleFilter}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Zyklen</SelectItem>
                  <SelectItem value="weekly">Wöchentlich</SelectItem>
                  <SelectItem value="monthly">Monatlich</SelectItem>
                  <SelectItem value="quarterly">Quartalsweise</SelectItem>
                  <SelectItem value="yearly">Jährlich</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      {contracts.length === 0 ? (
        <Card className="shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
              <FileText className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Keine Verträge</h3>
            <p className="text-muted-foreground mb-6 text-center max-w-sm">
              Beginnen Sie, indem Sie Ihren ersten Vertrag hinzufügen
            </p>
            <Link href="/dashboard/contracts/new">
              <Button size="lg" className="shadow-md">
                <Plus className="mr-2 h-5 w-5" />
                Vertrag hinzufügen
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : filteredContracts.length === 0 ? (
        <Card className="shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
              <Search className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Keine Ergebnisse</h3>
            <p className="text-muted-foreground mb-6 text-center max-w-sm">
              Keine Verträge entsprechen Ihren Suchkriterien
            </p>
            <Button variant="outline" size="lg" onClick={clearFilters}>
              <X className="mr-2 h-4 w-4" />
              Filter zurücksetzen
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredContracts.map((contract) => {
            const statusColor = 
              contract.status === 'active' ? 'bg-green-500' :
              contract.status === 'cancelled' ? 'bg-red-500' :
              'bg-yellow-500'

            const statusText =
              contract.status === 'active' ? 'Aktiv' :
              contract.status === 'cancelled' ? 'Gekündigt' : 'Abgelaufen'

            return (
              <Link 
                key={contract.id} 
                href={`/dashboard/contracts/${contract.id}`}
                className="block"
              >
                <Card className="hover:shadow-lg transition-all hover:border-primary/50 cursor-pointer shadow-sm">
                  <CardContent className="p-4 md:p-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="flex-1 font-semibold text-lg md:text-xl hover:text-primary transition-colors truncate">
                            {contract.title}
                          </h3>
                          <Badge className={`${statusColor} shrink-0 text-xs font-medium`}>
                            {statusText}
                          </Badge>
                        </div>

                      <div className="grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="truncate font-medium">{contract.provider}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Euro className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="font-semibold">
                            {formatCurrency(contract.price)} / {
                              contract.billingCycle === 'monthly' ? 'Monat' :
                              contract.billingCycle === 'yearly' ? 'Jahr' :
                              contract.billingCycle === 'quarterly' ? 'Quartal' : 'Woche'
                            }
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span>{formatDate(contract.startDate)}</span>
                        </div>

                        <div className="flex items-center gap-2 capitalize">
                          <span className="text-muted-foreground">•</span>
                          <span className="font-medium">{contract.category}</span>
                        </div>
                      </div>

                      {contract.endDate && (
                        <div className="mt-3 text-sm text-muted-foreground flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5" />
                          Läuft aus: {formatDate(contract.endDate)}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0 border-l pl-4 ml-2" onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}>
                      <Link href={`/dashboard/contracts/${contract.id}/edit`} tabIndex={-1}>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-9 w-9 border-slate-200 hover:bg-slate-100 hover:text-primary transition-colors"
                          title="Bearbeiten"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <DeleteContractButton 
                        contractId={contract.id} 
                        contractTitle={contract.title} 
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
