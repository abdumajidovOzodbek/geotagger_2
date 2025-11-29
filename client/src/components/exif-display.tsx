import { Camera, Calendar, MapPin, Mountain, Info, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import type { ExifData } from '@/lib/exif-utils';
import { useState } from 'react';

interface ExifDisplayProps {
  exifData: ExifData | null;
}

export function ExifDisplay({ exifData }: ExifDisplayProps) {
  const [isAllTagsOpen, setIsAllTagsOpen] = useState(false);

  if (!exifData) {
    return (
      <Card className="overflow-visible">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Info className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              Upload an image to view EXIF metadata
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasGps = exifData.latitude !== null && exifData.longitude !== null;

  return (
    <Card className="overflow-visible">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Camera className="w-4 h-4" />
          EXIF Metadata
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* GPS Status */}
        <div className="flex items-center gap-2 pb-3 border-b">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">GPS Data:</span>
          {hasGps ? (
            <Badge variant="default" className="bg-green-500/10 text-green-600 border-green-500/20 no-default-hover-elevate no-default-active-elevate">
              Found
            </Badge>
          ) : (
            <Badge variant="secondary" className="bg-orange-500/10 text-orange-600 border-orange-500/20 no-default-hover-elevate no-default-active-elevate">
              Not Found
            </Badge>
          )}
        </div>

        {/* Key Metadata Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Coordinates */}
          {hasGps && (
            <>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Latitude</p>
                <p className="text-sm font-medium" data-testid="text-exif-latitude">
                  {exifData.latitude?.toFixed(6)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Longitude</p>
                <p className="text-sm font-medium" data-testid="text-exif-longitude">
                  {exifData.longitude?.toFixed(6)}
                </p>
              </div>
            </>
          )}

          {/* Altitude */}
          {exifData.altitude !== null && (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Mountain className="w-3 h-3" /> Altitude
              </p>
              <p className="text-sm font-medium" data-testid="text-exif-altitude">
                {exifData.altitude.toFixed(1)}m
              </p>
            </div>
          )}

          {/* Date Taken */}
          {exifData.dateTaken && (
            <div className="space-y-1 col-span-2">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Date Taken
              </p>
              <p className="text-sm font-medium" data-testid="text-exif-date">
                {exifData.dateTaken}
              </p>
            </div>
          )}

          {/* Camera Info */}
          {(exifData.make || exifData.model) && (
            <div className="space-y-1 col-span-2">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Camera className="w-3 h-3" /> Camera
              </p>
              <p className="text-sm font-medium" data-testid="text-exif-camera">
                {[exifData.make, exifData.model].filter(Boolean).join(' ')}
              </p>
            </div>
          )}

          {/* Exposure Info */}
          {exifData.exposureTime && (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Exposure</p>
              <p className="text-sm font-medium" data-testid="text-exif-exposure">
                {exifData.exposureTime}
              </p>
            </div>
          )}

          {exifData.fNumber && (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Aperture</p>
              <p className="text-sm font-medium" data-testid="text-exif-aperture">
                f/{exifData.fNumber}
              </p>
            </div>
          )}

          {exifData.iso && (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">ISO</p>
              <p className="text-sm font-medium" data-testid="text-exif-iso">
                {exifData.iso}
              </p>
            </div>
          )}

          {exifData.focalLength && (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Focal Length</p>
              <p className="text-sm font-medium" data-testid="text-exif-focal">
                {exifData.focalLength}mm
              </p>
            </div>
          )}
        </div>

        {/* All Tags Collapsible */}
        {Object.keys(exifData.allTags).length > 0 && (
          <Collapsible open={isAllTagsOpen} onOpenChange={setIsAllTagsOpen}>
            <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground w-full pt-2 border-t" data-testid="button-toggle-all-tags">
              <ChevronDown className={`w-4 h-4 transition-transform ${isAllTagsOpen ? 'rotate-180' : ''}`} />
              View all EXIF tags ({Object.keys(exifData.allTags).length})
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3">
              <div className="bg-muted/50 rounded-lg p-3 space-y-2 max-h-48 overflow-y-auto">
                {Object.entries(exifData.allTags).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-xs gap-2">
                    <span className="text-muted-foreground truncate">{key}</span>
                    <span className="font-medium text-right truncate max-w-[60%]">{value}</span>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}
      </CardContent>
    </Card>
  );
}
