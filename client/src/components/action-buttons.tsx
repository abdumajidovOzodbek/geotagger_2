import { Download, Save, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/use-language';

interface ActionButtonsProps {
  onWriteExif: () => void;
  onDownload: () => void;
  canWrite: boolean;
  canDownload: boolean;
  isWriting: boolean;
  hasModified?: boolean;
}

export function ActionButtons({
  onWriteExif,
  onDownload,
  canWrite,
  canDownload,
  isWriting,
  hasModified = false,
}: ActionButtonsProps) {
  const { t } = useLanguage();
  
  return (
    <Card className="overflow-visible">
      <CardContent className="p-3">
        <div className="flex flex-col gap-2.5">
          <Button
            onClick={onWriteExif}
            disabled={!canWrite || isWriting}
            className="w-full gap-2 text-sm h-10"
            data-testid="button-write-exif"
          >
            {isWriting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t('writeExif')}...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {t('writeExif')}
              </>
            )}
          </Button>
          
          <Button
            variant={hasModified ? "default" : "outline"}
            onClick={onDownload}
            disabled={!canDownload}
            className={`w-full gap-2 text-sm h-10 ${hasModified ? 'ring-2 ring-offset-2 ring-offset-background' : ''}`}
            data-testid="button-download"
          >
            <Download className="w-4 h-4" />
            {t('download')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
