'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Menu, LayoutDashboard, FileText, BarChart3, LogOut } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface MobileNavProps {
  appName: string
}

export default function MobileNav({ appName }: MobileNavProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      
      toast({
        title: 'Abgemeldet',
        description: 'Sie wurden erfolgreich abgemeldet.',
      })
      
      setOpen(false)
      router.push('/login')
      router.refresh()
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Abmeldung fehlgeschlagen.',
        variant: 'destructive',
      })
    }
  }

  const routes = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      active: pathname === '/dashboard'
    },
    {
      href: '/dashboard/contracts',
      label: 'Verträge',
      icon: FileText,
      active: pathname?.startsWith('/dashboard/contracts')
    },
    {
      href: '/dashboard/stats',
      label: 'Statistiken',
      icon: BarChart3,
      active: pathname === '/dashboard/stats'
    }
  ]

  return (
    <div className="flex md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {appName}
            </SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-2 mt-6">
            {routes.map((route) => {
              const Icon = route.icon
              return (
                <Link
                  key={route.href}
                  href={route.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                    route.active
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {route.label}
                </Link>
              )
            })}
          </nav>
          
          <div className="absolute bottom-4 left-4 right-4">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-5 w-5" />
              Abmelden
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

