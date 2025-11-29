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
        title: 'Geolocation not supported',
        description: 'Your browser does not support geolocation.',
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
          title: 'Location found',
          description: 'Your current location has been set.',
        });
      },
      () => {
        setIsLocating(false);
        toast({
          title: 'Location error',
          description: 'Failed to get your current location. Please check permissions.',
          variant: 'destructive',
        });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [toast]);

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
        title: 'GPS data removed',
        description: 'GPS metadata has been removed. Download to save changes.',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to remove GPS data.',
        variant: 'destructive',
      });
    }
  }, [imageBase64, toast]);

  // Write EXIF tags
  const handleWriteExif = useCallback(() => {
    if (!imageBase64) return;

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      toast({
        title: 'Invalid coordinates',
        description: 'Please enter valid latitude and longitude values.',
        variant: 'destructive',
      });
      return;
    }

    if (lat < -90 || lat > 90) {
      toast({
        title: 'Invalid latitude',
        description: 'Latitude must be between -90 and 90.',
        variant: 'destructive',
      });
      return;
    }

    if (lng < -180 || lng > 180) {
      toast({
        title: 'Invalid longitude',
        description: 'Longitude must be between -180 and 180.',
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
        title: 'EXIF tags written',
        description: 'GPS metadata has been written to the image. Download to save.',
      });
    } catch {
      toast({
        title: 'Error writing EXIF',
        description: 'Failed to write EXIF data to the image.',
        variant: 'destructive',
      });
    } finally {
      setIsWriting(false);
    }
  }, [imageBase64, latitude, longitude, altitude, toast]);

  // Download image
  const handleDownload = useCallback(() => {
    const base64ToUse = modifiedBase64 || imageBase64;
    if (!base64ToUse || !selectedFile) return;

    try {
      const blob = base64ToBlob(base64ToUse);
      const fileName = selectedFile.name.replace(/\.[^/.]+$/, '') + '_geotagged.jpg';
      saveAs(blob, fileName);
      
      toast({
        title: 'Download started',
        description: `Saving ${fileName}`,
      });
    } catch {
      toast({
        title: 'Download failed',
        description: 'Failed to download the image.',
        variant: 'destructive',
      });
    }
  }, [modifiedBase64, imageBase64, selectedFile, toast]);

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
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto max-w-screen-2xl px-4 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 h-full">
          {/* Left Panel - Upload, EXIF, Coordinates, Actions */}
          <div className="space-y-6 flex flex-col">
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
            />
          </div>
          
          {/* Right Panel - Map */}
          <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)]">
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
      <footer className="border-t py-4 mt-auto">
        <div className="container mx-auto max-w-screen-2xl px-4 lg:px-8">
          <p className="text-xs text-muted-foreground text-center">
            All processing happens locally in your browser. Your images are never uploaded to any server.
          </p>
        </div>
      </footer>
    </div>
  );
}
