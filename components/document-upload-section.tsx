'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import FileUpload from './file-upload-simple'

interface DocumentUploadSectionProps {
  contractId: string
  currentDocuments: string | null
}

export default function DocumentUploadSection({ contractId, currentDocuments }: DocumentUploadSectionProps) {
  const [files, setFiles] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleUpload = async () => {
    if (files.length === 0) {
      toast({
        title: 'Keine Dateien',
        description: 'Bitte wählen Sie mindestens eine Datei aus.',
        variant: 'destructive',
      })
      return
    }

    setUploading(true)

    try {
      // Parse existing documents
      const existingDocs = currentDocuments ? JSON.parse(currentDocuments) : []
      const allDocuments = [...existingDocs, ...files]

      const response = await fetch(`/api/contracts/${contractId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documents: JSON.stringify(allDocuments)
        }),
      })

      if (!response.ok) {
        throw new Error('Upload fehlgeschlagen')
      }

      toast({
        title: 'Erfolgreich hochgeladen',
        description: `${files.length} Datei(en) wurden hinzugefügt.`,
      })

      setFiles([])
      router.refresh()
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Dateien konnten nicht hochgeladen werden.',
        variant: 'destructive',
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dokumente hochladen</CardTitle>
        <CardDescription>Fügen Sie weitere Dokumente zu diesem Vertrag hinzu</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FileUpload files={files} onChange={setFiles} />
        
        {files.length > 0 && (
          <Button 
            onClick={handleUpload} 
            disabled={uploading}
            className="w-full sm:w-auto"
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Hochladen...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                {files.length} Datei(en) hochladen
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
