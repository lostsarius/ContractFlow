'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, FileText, Upload } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface FileUploadProps {
  files: string[]
  onChange: (files: string[]) => void
}

export default function FileUpload({ files, onChange }: FileUploadProps) {
  const { toast } = useToast()
  const [isDragging, setIsDragging] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    
    selectedFiles.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        const fileData = JSON.stringify({
          name: file.name,
          size: file.size,
          type: file.type,
          data: base64String
        })
        onChange([...files, fileData])
      }
      reader.readAsDataURL(file)
    })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const droppedFiles = Array.from(e.dataTransfer.files)
    
    droppedFiles.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        const fileData = JSON.stringify({
          name: file.name,
          size: file.size,
          type: file.type,
          data: base64String
        })
        onChange([...files, fileData])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeFile = (index: number) => {
    onChange(files.filter((_, i) => i !== index))
  }

  const parseFile = (fileString: string) => {
    try {
      return JSON.parse(fileString)
    } catch {
      return null
    }
  }

  return (
    <div className="space-y-3">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-primary/50'
        }`}
      >
        <Input
          id="file-upload"
          type="file"
          multiple
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Drag & Drop oder klicken zum Hochladen
          </p>
          <p className="text-xs text-muted-foreground">PDF, Word, oder Bilder</p>
        </label>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">{files.length} Datei(en) ausgewählt</p>
          {files.map((fileString, index) => {
            const file = parseFile(fileString)
            if (!file) return null
            
            const sizeInKB = (file.size / 1024).toFixed(1)
            
            return (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-muted rounded-lg"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{sizeInKB} KB</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile(index)}
                  className="shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
