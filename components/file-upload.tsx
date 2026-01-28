'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { X, FileText, Upload } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface FileUploadProps {
  files: string[]
  onChange: (files: string[]) => void
}

export default function FileUpload({ files, onChange }: FileUploadProps) {
  const { toast } = useToast()
  const [uploading, setUploading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (!selectedFiles || selectedFiles.length === 0) return

    setUploading(true)

    try {
      const filePromises = Array.from(selectedFiles).map(async (file) => {
        // No file size limit - removed 5MB restriction
        // Convert to base64
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => {
            const base64 = reader.result as string
            resolve(JSON.stringify({
              name: file.name,
              size: file.size,
              type: file.type,
              data: base64
            }))
          }
          reader.onerror = reject
          reader.readAsDataURL(file)
        })
      })

      const newFiles = await Promise.all(filePromises)
      onChange([...files, ...newFiles])

      toast({
        title: 'Dateien hochgeladen',
        description: `${selectedFiles.length} Datei(en) erfolgreich hinzugefügt.`,
      })
    } catch (error: any) {
      toast({
        title: 'Fehler',
        description: error.message || 'Dateien konnten nicht hochgeladen werden.',
        variant: 'destructive',
      })
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index)
    onChange(newFiles)
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

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="file-upload" className="cursor-pointer">
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 hover:border-muted-foreground/50 transition-colors">
            <div className="flex flex-col items-center gap-2 text-center">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <div className="text-sm">
                <span className="font-medium text-primary">Klicken Sie hier</span>
                <span className="text-muted-foreground"> oder ziehen Sie Dateien hierher</span>
              </div>
              <p className="text-xs text-muted-foreground">
                PDF, Word, Bilder (max 5MB pro Datei)
              </p>
            </div>
          </div>
        </Label>
        <Input
          id="file-upload"
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
        />
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <Label>Hochgeladene Dateien</Label>
          <div className="space-y-2">
            {files.map((fileString, index) => {
              try {
                const file = JSON.parse(fileString)
                const sizeInKB = (file.size / 1024).toFixed(1)
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{sizeInKB} KB</p>
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => downloadFile(fileString)}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              } catch {
                return null
              }
            })}
          </div>
        </div>
      )}
    </div>
  )
}
