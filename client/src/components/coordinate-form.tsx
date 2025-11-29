import { MapPin, Mountain, Navigation, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/use-language';

interface CoordinateFormProps {
  latitude: string;
  longitude: string;
  altitude: string;
  onLatitudeChange: (value: string) => void;
  onLongitudeChange: (value: string) => void;
  onAltitudeChange: (value: string) => void;
  onUseCurrentLocation: () => void;
  onRemoveGps: () => void;
  isLocating: boolean;
  hasImage: boolean;
  hasExistingGps: boolean;
}

export function CoordinateForm({
  latitude,
  longitude,
  altitude,
  onLatitudeChange,
  onLongitudeChange,
  onAltitudeChange,
  onUseCurrentLocation,
  onRemoveGps,
  isLocating,
  hasImage,
  hasExistingGps,
}: CoordinateFormProps) {
  const { t } = useLanguage();
  
  const validateLatitude = (value: string): boolean => {
    if (!value) return true;
    const num = parseFloat(value);
    return !isNaN(num) && num >= -90 && num <= 90;
  };

  const validateLongitude = (value: string): boolean => {
    if (!value) return true;
    const num = parseFloat(value);
    return !isNaN(num) && num >= -180 && num <= 180;
  };

  const isLatValid = validateLatitude(latitude);
  const isLngValid = validateLongitude(longitude);

  return (
    <Card className="overflow-visible">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          {t('enterCoordinates')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Latitude */}
          <div className="space-y-2">
            <Label htmlFor="latitude" className="text-sm font-medium">
              {t('latitude')}
            </Label>
            <Input
              id="latitude"
              type="number"
              step="0.000001"
              min="-90"
              max="90"
              placeholder="-90 to 90"
              value={latitude}
              onChange={(e) => onLatitudeChange(e.target.value)}
              className={!isLatValid ? 'border-destructive focus-visible:ring-destructive' : ''}
              disabled={!hasImage}
              data-testid="input-latitude"
            />
            {!isLatValid && (
              <p className="text-xs text-destructive">Must be between -90 and 90</p>
            )}
          </div>

          {/* Longitude */}
          <div className="space-y-2">
            <Label htmlFor="longitude" className="text-sm font-medium">
              {t('longitude')}
            </Label>
            <Input
              id="longitude"
              type="number"
              step="0.000001"
              min="-180"
              max="180"
              placeholder="-180 to 180"
              value={longitude}
              onChange={(e) => onLongitudeChange(e.target.value)}
              className={!isLngValid ? 'border-destructive focus-visible:ring-destructive' : ''}
              disabled={!hasImage}
              data-testid="input-longitude"
            />
            {!isLngValid && (
              <p className="text-xs text-destructive">Must be between -180 and 180</p>
            )}
          </div>
        </div>

        {/* Altitude */}
        <div className="space-y-2">
          <Label htmlFor="altitude" className="text-sm font-medium flex items-center gap-1">
            <Mountain className="w-3 h-3" />
            {t('altitude')}
          </Label>
          <Input
            id="altitude"
            type="number"
            step="0.1"
            placeholder="e.g., 100"
            value={altitude}
            onChange={(e) => onAltitudeChange(e.target.value)}
            disabled={!hasImage}
            data-testid="input-altitude"
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onUseCurrentLocation}
            disabled={isLocating || !hasImage}
            className="w-full gap-2"
            data-testid="button-use-location"
          >
            <Navigation className="w-4 h-4" />
            {isLocating ? 'Getting location...' : t('useCurrentLocation')}
          </Button>
          
          {hasExistingGps && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRemoveGps}
              disabled={!hasImage}
              className="w-full gap-2 text-destructive hover:text-destructive"
              data-testid="button-remove-gps"
            >
              <Trash2 className="w-4 h-4" />
              {t('removeGps')}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
