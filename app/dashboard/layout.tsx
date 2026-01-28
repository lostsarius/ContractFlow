import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import MobileNav from '@/components/mobile-nav'
import LogoutButton from '@/components/logout-button'
import { FileText, LayoutDashboard, BarChart3 } from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || 'ContractFlow'

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center px-4 md:px-8">
          <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
            <FileText className="h-6 w-6" />
            <span className="font-bold text-lg">{appName}</span>
          </Link>

          <nav className="hidden md:flex items-center gap-2 flex-1">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link href="/dashboard/contracts">
              <Button variant="ghost" size="sm">
                <FileText className="mr-2 h-4 w-4" />
                Verträge
              </Button>
            </Link>
            <Link href="/dashboard/stats">
              <Button variant="ghost" size="sm">
                <BarChart3 className="mr-2 h-4 w-4" />
                Statistiken
              </Button>
            </Link>
          </nav>

          <div className="flex flex-1 items-center justify-end space-x-2">
            <ThemeToggle />
            <LogoutButton />
          </div>

          <MobileNav appName={appName} />
        </div>
      </header>
      <main className="container mx-auto px-4 py-4 md:py-8">
        {children}
      </main>
    </div>
  )
}
