import { Camera, Calendar, MapPin, Mountain, ChevronDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import type { ExifData } from '@/lib/exif-utils';
import { useState } from 'react';
import { useLanguage } from '@/hooks/use-language';

interface ExifDisplayProps {
  exifData: ExifData | null;
}

export function ExifDisplay({ exifData }: ExifDisplayProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAllTagsOpen, setIsAllTagsOpen] = useState(false);
  const { t } = useLanguage();

  if (!exifData) {
    return null;
  }

  const hasGps = exifData.latitude !== null && exifData.longitude !== null;

  return (
    <Card className="overflow-visible">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between p-3 hover-elevate cursor-pointer">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4" />
              <span className="text-sm font-semibold">{t('exifData')}</span>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="px-3 pb-3 pt-0 space-y-2">
          {/* GPS Status */}
          <div className="flex items-center gap-2 pb-2 border-b">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-medium">{t('gpsInfo')}:</span>
            {hasGps ? (
              <Badge variant="default" className="bg-green-500/10 text-green-600 border-green-500/20 text-xs no-default-hover-elevate no-default-active-elevate">
                Found
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-orange-500/10 text-orange-600 border-orange-500/20 text-xs no-default-hover-elevate no-default-active-elevate">
                Not Found
              </Badge>
            )}
          </div>

          {/* Key Metadata Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {/* Coordinates */}
            {hasGps && (
              <>
                <div>
                  <p className="text-muted-foreground">{t('latitude')}</p>
                  <p className="font-medium" data-testid="text-exif-latitude">
                    {exifData.latitude?.toFixed(6)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">{t('longitude')}</p>
                  <p className="font-medium" data-testid="text-exif-longitude">
                    {exifData.longitude?.toFixed(6)}
                  </p>
                </div>
              </>
            )}

            {/* Altitude */}
            {exifData.altitude !== null && (
              <div>
                <p className="text-muted-foreground flex items-center gap-1">
                  <Mountain className="w-3 h-3" /> Alt
                </p>
                <p className="font-medium" data-testid="text-exif-altitude">
                  {exifData.altitude.toFixed(0)}m
                </p>
              </div>
            )}

            {/* Date Taken */}
            {exifData.dateTaken && (
              <div className="col-span-2">
                <p className="text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Date
                </p>
                <p className="font-medium" data-testid="text-exif-date">
                  {exifData.dateTaken}
                </p>
              </div>
            )}
          </div>

          {/* All Tags Collapsible */}
          {Object.keys(exifData.allTags).length > 0 && (
            <Collapsible open={isAllTagsOpen} onOpenChange={setIsAllTagsOpen}>
              <CollapsibleTrigger className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground w-full pt-2 border-t" data-testid="button-toggle-all-tags">
                <ChevronDown className={`w-3 h-3 transition-transform ${isAllTagsOpen ? 'rotate-180' : ''}`} />
                All tags ({Object.keys(exifData.allTags).length})
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
                <div className="bg-muted/50 rounded-lg p-2 space-y-1 max-h-32 overflow-y-auto text-xs">
                  {Object.entries(exifData.allTags).map(([key, value]) => (
                    <div key={key} className="flex justify-between gap-2">
                      <span className="text-muted-foreground truncate">{key}</span>
                      <span className="font-medium text-right truncate max-w-[50%]">{value}</span>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
