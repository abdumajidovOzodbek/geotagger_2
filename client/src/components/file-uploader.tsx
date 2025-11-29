import { useCallback, useState } from 'react';
import { Upload, Image, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/use-language';
import { cn } from '@/lib/utils';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  imagePreview: string | null;
  onClear: () => void;
}

export function FileUploader({ onFileSelect, selectedFile, imagePreview, onClear }: FileUploaderProps) {
  const { t } = useLanguage();
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
        onFileSelect(file);
      }
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
        onFileSelect(file);
      }
    }
  }, [onFileSelect]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (selectedFile && imagePreview) {
    return (
      <Card className="overflow-visible">
        <CardContent className="p-3">
          <div className="flex items-start gap-3">
            <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-full h-full object-cover"
                data-testid="img-preview"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-medium text-xs truncate" data-testid="text-filename">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5" data-testid="text-filesize">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClear}
                  className="flex-shrink-0 h-8 w-8"
                  data-testid="button-clear-file"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span className="text-xs text-muted-foreground">{t('enterCoordinates')}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-visible">
      <CardContent className="p-0">
        <label
          htmlFor="file-upload"
          className={cn(
            "flex flex-col items-center justify-center w-full h-40 cursor-pointer rounded-xl border-2 border-dashed transition-colors",
            isDragging 
              ? "border-primary bg-primary/5" 
              : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          data-testid="dropzone-upload"
        >
          <div className="flex flex-col items-center justify-center py-4 px-4 text-center">
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-colors",
              isDragging ? "bg-primary/10" : "bg-muted"
            )}>
              {isDragging ? (
                <Image className="w-6 h-6 text-primary" />
              ) : (
                <Upload className="w-6 h-6 text-muted-foreground" />
              )}
            </div>
            <p className="text-sm font-medium">
              {isDragging ? t('dragDropText') : t('dragDropText')}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {t('orText')} {t('selectFileButton')}
            </p>
            <p className="text-xs text-muted-foreground mt-3">
              {t('supportedFormats')}
            </p>
          </div>
          <input
            id="file-upload"
            type="file"
            accept=".jpg,.jpeg,image/jpeg"
            onChange={handleFileInput}
            className="hidden"
            data-testid="input-file"
          />
        </label>
      </CardContent>
    </Card>
  );
}
