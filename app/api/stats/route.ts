import { query } from '@/lib/db'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const contracts: any[] = await query('SELECT * FROM Contract')
    
    // Total contracts
    const totalContracts = contracts.length
    
    // Active contracts
    const activeContracts = contracts.filter(c => c.status === 'active').length
    
    // Monthly costs
    const monthlyCosts = contracts.reduce((sum, contract) => {
      if (contract.status !== 'active') return sum
      
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
    
    // Yearly costs
    const yearlyCosts = monthlyCosts * 12
    
    // Contracts by category
    const contractsByCategory = contracts.reduce((acc, contract) => {
      acc[contract.category] = (acc[contract.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    // Contracts by status
    const contractsByStatus = contracts.reduce((acc, contract) => {
      acc[contract.status] = (acc[contract.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    // Monthly costs trend (last 12 months)
    const now = new Date()
    const monthlyTrend = Array.from({ length: 12 }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1)
      const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0)
      const monthName = date.toLocaleString('de-DE', { month: 'short' })
      
      const costsForMonth = contracts
        .filter(c => {
          if (c.status !== 'active') return false
          
          const start = new Date(c.startDate)
          const end = c.endDate ? new Date(c.endDate) : null
          
          // Contract is active in this month if:
          // 1. It started before or during this month
          // 2. It hasn't ended yet, or it ends after the start of this month, 
          //    or it has auto-renewal
          const hasStarted = start <= lastDayOfMonth
          const hasNotEnded = !end || end >= date || c.autoRenewal
          
          return hasStarted && hasNotEnded
        })
        .reduce((sum, contract) => {
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
      
      return {
        month: monthName,
        costs: Math.round(costsForMonth * 100) / 100
      }
    })
    
    // Upcoming renewals (next 90 days)
    const in90Days = new Date()
    in90Days.setDate(in90Days.getDate() + 90)
    
    const upcomingRenewals = contracts
      .filter(c => {
        if (!c.endDate || c.status !== 'active') return false
        const endDate = new Date(c.endDate)
        return endDate >= now && endDate <= in90Days
      })
      .map(c => ({
        id: c.id,
        title: c.title,
        provider: c.provider,
        endDate: c.endDate,
        autoRenewal: c.autoRenewal
      }))
      .sort((a, b) => new Date(a.endDate!).getTime() - new Date(b.endDate!).getTime())
    
    return NextResponse.json({
      totalContracts,
      activeContracts,
      monthlyCosts: Math.round(monthlyCosts * 100) / 100,
      yearlyCosts: Math.round(yearlyCosts * 100) / 100,
      contractsByCategory,
      contractsByStatus,
      monthlyTrend,
      upcomingRenewals
    })
  } catch (error) {
    console.error('Error fetching statistics:', error)
    return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 })
  }
}
