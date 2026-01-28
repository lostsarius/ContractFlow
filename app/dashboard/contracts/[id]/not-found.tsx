import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileX, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <FileX className="h-16 w-16 text-muted-foreground" />
          </div>
          <CardTitle className="text-center">Vertrag nicht gefunden</CardTitle>
          <CardDescription className="text-center">
            Der gesuchte Vertrag existiert nicht oder wurde gelöscht.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Link href="/dashboard/contracts">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Zurück zur Übersicht
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
