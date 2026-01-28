'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '@/lib/utils'

interface Stats {
  totalContracts: number
  activeContracts: number
  monthlyCosts: number
  yearlyCosts: number
  contractsByCategory: Record<string, number>
  contractsByStatus: Record<string, number>
  monthlyTrend: Array<{ month: string; costs: number }>
  upcomingRenewals: any[]
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16']

const CATEGORY_LABELS: Record<string, string> = {
  internet: 'Internet',
  telefon: 'Telefon',
  streaming: 'Streaming',
  versicherung: 'Versicherung',
  energie: 'Energie',
  software: 'Software',
  fitness: 'Fitness',
  miete: 'Miete',
  sonstiges: 'Sonstiges',
}

export default function StatsPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/stats')
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Laden...</p>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Fehler beim Laden der Statistiken</p>
      </div>
    )
  }

  const categoryData = Object.entries(stats.contractsByCategory).map(([key, value]) => ({
    name: CATEGORY_LABELS[key] || key,
    value,
  }))

  const statusData = Object.entries(stats.contractsByStatus).map(([key, value]) => ({
    name: key === 'active' ? 'Aktiv' : key === 'cancelled' ? 'Gekündigt' : 'Abgelaufen',
    value,
  }))

  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Statistiken</h2>
        <p className="text-muted-foreground mt-1">
          Detaillierte Analyse Ihrer Verträge und Kosten
        </p>
      </div>

      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Verträge gesamt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalContracts}</div>
            <p className="text-xs text-muted-foreground mt-1">Alle Verträge</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Aktive Verträge</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.activeContracts}</div>
            <p className="text-xs text-muted-foreground mt-1">Derzeit laufend</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monatliche Kosten</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(stats.monthlyCosts)}</div>
            <p className="text-xs text-muted-foreground mt-1">Pro Monat</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Jährliche Kosten</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(stats.yearlyCosts)}</div>
            <p className="text-xs text-muted-foreground mt-1">Pro Jahr</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Kostenverlauf</CardTitle>
            <CardDescription>Monatliche Kosten der letzten 12 Monate</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={stats.monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: 'currentColor' }}
                  className="text-xs"
                />
                <YAxis 
                  tick={{ fill: 'currentColor' }}
                  className="text-xs"
                />
                <Tooltip 
                  formatter={(value) => formatCurrency(Number(value))}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="costs" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  name="Kosten" 
                  dot={{ fill: '#3b82f6', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Verträge nach Kategorie</CardTitle>
            <CardDescription>Verteilung nach Kategorien</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Verträge nach Status</CardTitle>
            <CardDescription>Verteilung nach Status</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: 'currentColor' }}
                  className="text-xs"
                />
                <YAxis 
                  tick={{ fill: 'currentColor' }}
                  className="text-xs"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Legend />
                <Bar dataKey="value" fill="#3b82f6" name="Anzahl" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Kategorieverteilung</CardTitle>
            <CardDescription>Anzahl pro Kategorie</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  type="number"
                  tick={{ fill: 'currentColor' }}
                  className="text-xs"
                />
                <YAxis 
                  type="category"
                  dataKey="name" 
                  tick={{ fill: 'currentColor' }}
                  className="text-xs"
                  width={100}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Legend />
                <Bar dataKey="value" fill="#10b981" name="Anzahl" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {stats.upcomingRenewals.length > 0 && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Anstehende Verlängerungen & Endtermine</CardTitle>
            <CardDescription>Verträge, die in den nächsten 90 Tagen enden oder verlängert werden</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b">
                    <th className="pb-3 font-semibold">Vertrag</th>
                    <th className="pb-3 font-semibold">Anbieter</th>
                    <th className="pb-3 font-semibold">Datum</th>
                    <th className="pb-3 font-semibold">Auto-Verlängerung</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {stats.upcomingRenewals.map((renewal) => (
                    <tr key={renewal.id} className="group hover:bg-muted/50 transition-colors">
                      <td className="py-3 font-medium">{renewal.title}</td>
                      <td className="py-3 text-muted-foreground">{renewal.provider}</td>
                      <td className="py-3">{new Date(renewal.endDate).toLocaleDateString('de-DE')}</td>
                      <td className="py-3">
                        {renewal.autoRenewal ? (
                          <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                            <span className="h-2 w-2 rounded-full bg-green-500"></span> Ja
                          </span>
                        ) : (
                          <span className="text-muted-foreground flex items-center gap-1">
                            <span className="h-2 w-2 rounded-full bg-slate-400"></span> Nein
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
