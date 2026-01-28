'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import FileUpload from '@/components/file-upload'

interface ContractFormProps {
  contract?: any
}

export default function ContractForm({ contract }: ContractFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const parseDocuments = (documents: string | null): string[] => {
    if (!documents) return []
    try {
      const parsed = JSON.parse(documents)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }

  const [formData, setFormData] = useState({
    title: contract?.title || '',
    description: contract?.description || '',
    provider: contract?.provider || '',
    contractNumber: contract?.contractNumber || '',
    category: contract?.category || 'internet',
    status: contract?.status || 'active',
    startDate: contract?.startDate ? new Date(contract.startDate).toISOString().split('T')[0] : '',
    endDate: contract?.endDate ? new Date(contract.endDate).toISOString().split('T')[0] : '',
    cancellationDeadline: contract?.cancellationDeadline ? new Date(contract.cancellationDeadline).toISOString().split('T')[0] : '',
    autoRenewal: contract?.autoRenewal || false,
    price: contract?.price || '',
    currency: contract?.currency || 'EUR',
    billingCycle: contract?.billingCycle || 'monthly',
    paymentMethod: contract?.paymentMethod || '',
    notes: contract?.notes || '',
    documents: parseDocuments(contract?.documents),
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = contract ? `/api/contracts/${contract.id}` : '/api/contracts'
      const method = contract ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          documents: JSON.stringify(formData.documents)
        }),
      })

      if (!response.ok) {
        throw new Error('Fehler beim Speichern')
      }

      toast({
        title: contract ? 'Vertrag aktualisiert' : 'Vertrag erstellt',
        description: contract ? 'Der Vertrag wurde erfolgreich aktualisiert.' : 'Der Vertrag wurde erfolgreich erstellt.',
      })

      router.push('/dashboard/contracts')
      router.refresh()
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Der Vertrag konnte nicht gespeichert werden.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Titel *</Label>
          <Input
            id="title"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="provider">Anbieter *</Label>
          <Input
            id="provider"
            required
            value={formData.provider}
            onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contractNumber">Vertragsnummer</Label>
          <Input
            id="contractNumber"
            value={formData.contractNumber}
            onChange={(e) => setFormData({ ...formData, contractNumber: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Kategorie *</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="internet">Internet</SelectItem>
              <SelectItem value="telefon">Telefon</SelectItem>
              <SelectItem value="streaming">Streaming</SelectItem>
              <SelectItem value="versicherung">Versicherung</SelectItem>
              <SelectItem value="energie">Energie</SelectItem>
              <SelectItem value="software">Software</SelectItem>
              <SelectItem value="fitness">Fitness</SelectItem>
              <SelectItem value="miete">Miete</SelectItem>
              <SelectItem value="sonstiges">Sonstiges</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status *</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Aktiv</SelectItem>
              <SelectItem value="cancelled">Gekündigt</SelectItem>
              <SelectItem value="expired">Abgelaufen</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Preis *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            required
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency">Währung *</Label>
          <Select value={formData.currency} onValueChange={(value) => setFormData({ ...formData, currency: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EUR">EUR (€)</SelectItem>
              <SelectItem value="USD">USD ($)</SelectItem>
              <SelectItem value="GBP">GBP (£)</SelectItem>
              <SelectItem value="CHF">CHF (Fr.)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="billingCycle">Abrechnungszyklus *</Label>
          <Select value={formData.billingCycle} onValueChange={(value) => setFormData({ ...formData, billingCycle: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Wöchentlich</SelectItem>
              <SelectItem value="monthly">Monatlich</SelectItem>
              <SelectItem value="quarterly">Quartalsweise</SelectItem>
              <SelectItem value="yearly">Jährlich</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="startDate">Startdatum *</Label>
          <Input
            id="startDate"
            type="date"
            required
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">Enddatum</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cancellationDeadline">Kündigungsfrist</Label>
          <Input
            id="cancellationDeadline"
            type="date"
            value={formData.cancellationDeadline}
            onChange={(e) => setFormData({ ...formData, cancellationDeadline: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="paymentMethod">Zahlungsmethode</Label>
          <Input
            id="paymentMethod"
            value={formData.paymentMethod}
            onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
            placeholder="z.B. SEPA, Kreditkarte, PayPal"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Beschreibung</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notizen</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label>Dokumente</Label>
        <FileUpload
          files={formData.documents}
          onChange={(documents) => setFormData({ ...formData, documents })}
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="autoRenewal"
          checked={formData.autoRenewal}
          onChange={(e) => setFormData({ ...formData, autoRenewal: e.target.checked })}
          className="h-4 w-4 rounded border-gray-300"
        />
        <Label htmlFor="autoRenewal" className="font-normal">
          Automatische Verlängerung
        </Label>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting ? 'Speichern...' : 'Speichern'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="w-full sm:w-auto"
        >
          Abbrechen
        </Button>
      </div>
    </form>
  )
}
