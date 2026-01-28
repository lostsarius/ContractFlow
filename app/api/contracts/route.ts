import { query } from '@/lib/db'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const contracts = await query('SELECT * FROM Contract ORDER BY createdAt DESC')
    return NextResponse.json(contracts)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch contracts' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const id = crypto.randomUUID()
    const now = new Date()
    
    await query(
      `INSERT INTO Contract (
        id, title, description, provider, contractNumber, category, status, 
        startDate, endDate, cancellationDeadline, autoRenewal, price, 
        currency, billingCycle, paymentMethod, notes, documents, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        body.title,
        body.description || null,
        body.provider,
        body.contractNumber || null,
        body.category,
        body.status || 'active',
        new Date(body.startDate),
        body.endDate ? new Date(body.endDate) : null,
        body.cancellationDeadline ? new Date(body.cancellationDeadline) : null,
        body.autoRenewal ? 1 : 0,
        parseFloat(body.price),
        body.currency || 'EUR',
        body.billingCycle || 'monthly',
        body.paymentMethod || null,
        body.notes || null,
        body.documents || null,
        now,
        now
      ]
    )

    // Return the created object by fetching it or just constructing it
    const contract = {
      id,
      ...body,
      status: body.status || 'active',
      createdAt: now,
      updatedAt: now
    }

    return NextResponse.json(contract, { status: 201 })
  } catch (error) {
    console.error('Error creating contract:', error)
    return NextResponse.json({ error: 'Failed to create contract' }, { status: 500 })
  }
}
