import { Download, Save, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
  return (
    <Card className="overflow-visible">
      <CardContent className="p-4">
        <div className="flex flex-col gap-3">
          <Button
            onClick={onWriteExif}
            disabled={!canWrite || isWriting}
            className="w-full gap-2"
            data-testid="button-write-exif"
          >
            {isWriting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Writing EXIF...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Write EXIF Tags
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            onClick={onDownload}
            disabled={!canDownload}
            className="w-full gap-2"
            data-testid="button-download"
          >
            <Download className="w-4 h-4" />
            Download Image
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
