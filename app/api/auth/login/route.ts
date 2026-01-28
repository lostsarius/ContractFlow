import { NextRequest, NextResponse } from 'next/server'
import { createToken, setAuthCookie } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // Get credentials from environment variables
    const adminUsername = process.env.ADMIN_USERNAME || 'admin'
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin'

    // Simple comparison (in production, use hashed passwords)
    if (username === adminUsername && password === adminPassword) {
      const token = await createToken(username)
      
      const response = NextResponse.json({ 
        success: true,
        message: 'Login successful' 
      })

      const isSecure = process.env.COOKIE_SECURE === 'true' || 
                      (process.env.NODE_ENV === 'production' && process.env.COOKIE_SECURE !== 'false')

      // Set cookie
      response.cookies.set('auth-token', token, {
        httpOnly: true,
        secure: isSecure,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      })

      return response
    }

    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
