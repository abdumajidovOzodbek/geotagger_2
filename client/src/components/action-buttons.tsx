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
}

export function ActionButtons({
  onWriteExif,
  onDownload,
  canWrite,
  canDownload,
  isWriting,
}: ActionButtonsProps) {
  const { t } = useLanguage();
  
  return (
    <Card className="overflow-visible">
      <CardContent className="p-2">
        <div className="flex flex-col gap-1.5">
          <Button
            onClick={onWriteExif}
            disabled={!canWrite || isWriting}
            size="sm"
            className="w-full gap-1 text-xs h-8"
            data-testid="button-write-exif"
          >
            {isWriting ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                {t('writeExif')}...
              </>
            ) : (
              <>
                <Save className="w-3 h-3" />
                {t('writeExif')}
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onDownload}
            disabled={!canDownload}
            className="w-full gap-1 text-xs h-8"
            data-testid="button-download"
          >
            <Download className="w-3 h-3" />
            {t('download')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
