import { query, queryOne } from '@/lib/db'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const contract = await queryOne('SELECT * FROM Contract WHERE id = ?', [params.id])
    if (!contract) {
      return NextResponse.json({ error: 'Contract not found' }, { status: 404 })
    }
    return NextResponse.json(contract)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch contract' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const now = new Date()
    
    // If only documents field is provided, update only documents
    if (Object.keys(body).length === 1 && 'documents' in body) {
      await query(
        'UPDATE Contract SET documents = ?, updatedAt = ? WHERE id = ?',
        [body.documents, now, params.id]
      )
      const contract = await queryOne('SELECT * FROM Contract WHERE id = ?', [params.id])
      return NextResponse.json(contract)
    }
    
    // Otherwise, update all fields
    await query(
      `UPDATE Contract SET 
        title = ?, description = ?, provider = ?, contractNumber = ?, 
        category = ?, status = ?, startDate = ?, endDate = ?, 
        cancellationDeadline = ?, autoRenewal = ?, price = ?, 
        currency = ?, billingCycle = ?, paymentMethod = ?, 
        notes = ?, documents = ?, updatedAt = ? 
      WHERE id = ?`,
      [
        body.title,
        body.description || null,
        body.provider,
        body.contractNumber || null,
        body.category,
        body.status,
        new Date(body.startDate),
        body.endDate ? new Date(body.endDate) : null,
        body.cancellationDeadline ? new Date(body.cancellationDeadline) : null,
        body.autoRenewal ? 1 : 0,
        parseFloat(body.price),
        body.currency,
        body.billingCycle,
        body.paymentMethod || null,
        body.notes || null,
        body.documents || null,
        now,
        params.id
      ]
    )
    
    const contract = await queryOne('SELECT * FROM Contract WHERE id = ?', [params.id])
    return NextResponse.json(contract)
  } catch (error) {
    console.error('Error updating contract:', error)
    return NextResponse.json({ error: 'Failed to update contract' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await query('DELETE FROM Contract WHERE id = ?', [params.id])
    return NextResponse.json({ message: 'Contract deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete contract' }, { status: 500 })
  }
}
