import { useState, useCallback, useEffect } from 'react';
import { saveAs } from 'file-saver';
import { Header } from '@/components/header';
import { FileUploader } from '@/components/file-uploader';
import { ExifDisplay } from '@/components/exif-display';
import { CoordinateForm } from '@/components/coordinate-form';
import { MapView } from '@/components/map-view';
import { ActionButtons } from '@/components/action-buttons';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/use-language';
import {
  type ExifData,
  fileToBase64,
  readExifFromBase64,
  writeGpsToImage,
  removeGpsFromImage,
  base64ToBlob,
} from '@/lib/exif-utils';

export default function Home() {
  const { toast } = useToast();
  const { t } = useLanguage();
  
  // File state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [exifData, setExifData] = useState<ExifData | null>(null);
  
  // Coordinate state
  const [latitude, setLatitude] = useState<string>('');
  const [longitude, setLongitude] = useState<string>('');
  const [altitude, setAltitude] = useState<string>('');
  
  // UI state
  const [isLocating, setIsLocating] = useState(false);
  const [isWriting, setIsWriting] = useState(false);
  const [modifiedBase64, setModifiedBase64] = useState<string | null>(null);

  // Handle file selection
  const handleFileSelect = useCallback(async (file: File) => {
    setSelectedFile(file);
    setModifiedBase64(null);
    
    try {
      const base64 = await fileToBase64(file);
      setImageBase64(base64);
      setImagePreview(base64);
      
      // Read EXIF data
      const exif = readExifFromBase64(base64);
      setExifData(exif);
      
      // Set coordinates if available
      if (exif.latitude !== null && exif.longitude !== null) {
        setLatitude(exif.latitude.toString());
        setLongitude(exif.longitude.toString());
        if (exif.altitude !== null) {
          setAltitude(exif.altitude.toString());
        }
        toast({
          title: t('gpsDataFound'),
          description: t('locationLoadedFromExif'),
        });
      } else {
        setLatitude('');
        setLongitude('');
        setAltitude('');
        toast({
          title: t('noGpsData'),
          description: t('addCoordinatesUsingMapOrForm'),
        });
      }
    } catch {
      toast({
        title: t('errorReadingImage'),
        description: t('failedToReadImage'),
        variant: 'destructive',
      });
    }
  }, [toast, t]);

  // Clear file
  const handleClear = useCallback(() => {
    setSelectedFile(null);
    setImageBase64(null);
    setImagePreview(null);
    setExifData(null);
    setLatitude('');
    setLongitude('');
    setAltitude('');
    setModifiedBase64(null);
  }, []);

  // Update coordinates from map
  const handlePositionChange = useCallback((lat: number, lng: number) => {
    setLatitude(lat.toFixed(6));
    setLongitude(lng.toFixed(6));
    setModifiedBase64(null);
  }, []);

  // Use current location
  const handleUseCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      toast({
        title: t('geolocationNotSupported'),
        description: t('browserDoesNotSupportGeolocation'),
        variant: 'destructive',
      });
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toFixed(6));
        setLongitude(position.coords.longitude.toFixed(6));
        if (position.coords.altitude !== null) {
          setAltitude(position.coords.altitude.toFixed(1));
        }
        setIsLocating(false);
        setModifiedBase64(null);
        toast({
          title: t('locationFound'),
          description: t('yourCurrentLocationHasBeenSet'),
        });
      },
      () => {
        setIsLocating(false);
        toast({
          title: t('errorGettingLocation'),
          description: t('failedToGetYourLocation'),
          variant: 'destructive',
        });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [toast, t]);

  // Remove GPS data
  const handleRemoveGps = useCallback(() => {
    if (!imageBase64) return;

    try {
      const newBase64 = removeGpsFromImage(imageBase64);
      setModifiedBase64(newBase64);
      setLatitude('');
      setLongitude('');
      setAltitude('');
      
      // Update EXIF display
      const newExif = readExifFromBase64(newBase64);
      setExifData(newExif);
      
      toast({
        title: t('exifRemoved'),
        description: t('gpsDataSuccessfullyRemoved'),
      });
    } catch {
      toast({
        title: t('errorRemovingExif'),
        description: t('failedToRemoveGpsData'),
        variant: 'destructive',
      });
    }
  }, [imageBase64, toast, t]);

  // Write EXIF tags
  const handleWriteExif = useCallback(() => {
    if (!imageBase64) return;

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      toast({
        title: t('invalidCoordinates'),
        description: t('pleaseEnterValidCoordinates'),
        variant: 'destructive',
      });
      return;
    }

    if (lat < -90 || lat > 90) {
      toast({
        title: t('invalidLatitude'),
        description: t('latitudeMustBeBetween'),
        variant: 'destructive',
      });
      return;
    }

    if (lng < -180 || lng > 180) {
      toast({
        title: t('invalidLongitude'),
        description: t('longitudeMustBeBetween'),
        variant: 'destructive',
      });
      return;
    }

    setIsWriting(true);

    try {
      const alt = altitude ? parseFloat(altitude) : undefined;
      const newBase64 = writeGpsToImage(imageBase64, {
        latitude: lat,
        longitude: lng,
        altitude: alt,
      });
      
      setModifiedBase64(newBase64);
      
      // Update EXIF display
      const newExif = readExifFromBase64(newBase64);
      setExifData(newExif);
      
      toast({
        title: t('exifWritten'),
        description: t('gpsDataSuccessfullyWritten'),
      });
    } catch {
      toast({
        title: t('errorWritingExif'),
        description: t('failedToWriteGpsData'),
        variant: 'destructive',
      });
    } finally {
      setIsWriting(false);
    }
  }, [imageBase64, latitude, longitude, altitude, toast, t]);

  // Download image
  const handleDownload = useCallback(() => {
    const base64ToUse = modifiedBase64 || imageBase64;
    if (!base64ToUse || !selectedFile) return;

    try {
      const blob = base64ToBlob(base64ToUse);
      const fileName = selectedFile.name.replace(/\.[^/.]+$/, '') + '_geotagged.jpg';
      saveAs(blob, fileName);
      
      toast({
        title: t('downloadStarted'),
        description: `${t('imageDownloaded')}: ${fileName}`,
      });
    } catch {
      toast({
        title: t('downloadFailed'),
        description: t('failedToDownloadImage'),
        variant: 'destructive',
      });
    }
  }, [modifiedBase64, imageBase64, selectedFile, toast, t]);

  // Get current map coordinates
  const mapLatitude = latitude ? parseFloat(latitude) : null;
  const mapLongitude = longitude ? parseFloat(longitude) : null;
  const validMapCoords = mapLatitude !== null && !isNaN(mapLatitude) && 
                         mapLongitude !== null && !isNaN(mapLongitude) &&
                         mapLatitude >= -90 && mapLatitude <= 90 &&
                         mapLongitude >= -180 && mapLongitude <= 180;

  // Check if can write/download
  const canWrite = !!selectedFile && latitude !== '' && longitude !== '';
  const canDownload = !!selectedFile && (!!modifiedBase64 || !!imageBase64);
  const hasExistingGps = exifData?.latitude !== null && exifData?.longitude !== null;

  // Update coordinate fields when inputs change
  const handleLatitudeChange = useCallback((value: string) => {
    setLatitude(value);
    setModifiedBase64(null);
  }, []);

  const handleLongitudeChange = useCallback((value: string) => {
    setLongitude(value);
    setModifiedBase64(null);
  }, []);

  const handleAltitudeChange = useCallback((value: string) => {
    setAltitude(value);
    setModifiedBase64(null);
  }, []);

  return (
    <div className="h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto max-w-screen-2xl px-3 lg:px-6 py-1.5 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
          {/* Left Panel - Scrollable */}
          <div className="space-y-2.5 flex flex-col flex-1 overflow-y-auto pr-2">
            <FileUploader
              onFileSelect={handleFileSelect}
              selectedFile={selectedFile}
              imagePreview={imagePreview}
              onClear={handleClear}
            />
            
            <ExifDisplay exifData={exifData} />
            
            <CoordinateForm
              latitude={latitude}
              longitude={longitude}
              altitude={altitude}
              onLatitudeChange={handleLatitudeChange}
              onLongitudeChange={handleLongitudeChange}
              onAltitudeChange={handleAltitudeChange}
              onUseCurrentLocation={handleUseCurrentLocation}
              onRemoveGps={handleRemoveGps}
              isLocating={isLocating}
              hasImage={!!selectedFile}
              hasExistingGps={hasExistingGps}
            />
            
            <ActionButtons
              onWriteExif={handleWriteExif}
              onDownload={handleDownload}
              canWrite={canWrite}
              canDownload={canDownload}
              isWriting={isWriting}
              hasModified={!!modifiedBase64}
            />
          </div>
          
          {/* Right Panel - Map */}
          <div className="h-full overflow-hidden">
            <MapView
              latitude={validMapCoords ? mapLatitude : null}
              longitude={validMapCoords ? mapLongitude : null}
              onPositionChange={handlePositionChange}
              hasImage={!!selectedFile}
            />
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t py-0.5 flex-shrink-0">
        <div className="container mx-auto max-w-screen-2xl px-3 lg:px-6">
          <p className="text-xs text-muted-foreground text-center">
            All processing happens locally in your browser. Your images are never uploaded to any server.
          </p>
        </div>
      </footer>
    </div>
  );
}
