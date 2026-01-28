'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { FileText, Download, Eye, X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface DocumentsListProps {
  documents: string
}

export default function DocumentsList({ documents }: DocumentsListProps) {
  const { toast } = useToast()
  const [previewOpen, setPreviewOpen] = useState(false)
  const [currentFile, setCurrentFile] = useState<any>(null)

  const parseDocuments = (docs: string): any[] => {
    try {
      const parsed = JSON.parse(docs)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }

  const downloadFile = (fileString: string) => {
    try {
      const file = JSON.parse(fileString)
      const link = document.createElement('a')
      link.href = file.data
      link.download = file.name
      link.click()
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Datei konnte nicht heruntergeladen werden.',
        variant: 'destructive',
      })
    }
  }

  const previewFile = (fileString: string) => {
    try {
      const file = typeof fileString === 'string' ? JSON.parse(fileString) : fileString
      setCurrentFile(file)
      setPreviewOpen(true)
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Datei konnte nicht angezeigt werden.',
        variant: 'destructive',
      })
    }
  }

  const files = parseDocuments(documents)

  if (files.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Keine Dokumente hochgeladen
      </p>
    )
  }

  const isImage = (type: string) => type.startsWith('image/')
  const isPdf = (type: string) => type === 'application/pdf'

  return (
    <>
      <div className="space-y-2">
        {files.map((fileString, index) => {
          try {
            const file = typeof fileString === 'string' ? JSON.parse(fileString) : fileString
            const sizeInKB = (file.size / 1024).toFixed(1)
            
            return (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{sizeInKB} KB</p>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  {(isImage(file.type) || isPdf(file.type)) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => previewFile(typeof fileString === 'string' ? fileString : JSON.stringify(fileString))}
                      title="Vorschau"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => downloadFile(typeof fileString === 'string' ? fileString : JSON.stringify(fileString))}
                    title="Herunterladen"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )
          } catch (error) {
            return null
          }
        })}
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span className="truncate pr-4">{currentFile?.name}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setPreviewOpen(false)}
                className="shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
            <DialogDescription>
              {currentFile && (
                <span className="text-xs">
                  {(currentFile.size / 1024).toFixed(1)} KB
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-auto">
            {currentFile && isImage(currentFile.type) && (
              <img
                src={currentFile.data}
                alt={currentFile.name}
                className="w-full h-auto rounded-lg"
              />
            )}
            {currentFile && isPdf(currentFile.type) && (
              <iframe
                src={currentFile.data}
                className="w-full h-[70vh] rounded-lg border"
                title={currentFile.name}
              />
            )}
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => downloadFile(JSON.stringify(currentFile))}
            >
              <Download className="mr-2 h-4 w-4" />
              Herunterladen
            </Button>
            <Button onClick={() => setPreviewOpen(false)}>
              Schließen
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
