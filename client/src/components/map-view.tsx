import { useEffect, useRef, useCallback, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Map as MapIcon } from 'lucide-react';

interface MapViewProps {
  latitude: number | null;
  longitude: number | null;
  onPositionChange: (lat: number, lng: number) => void;
  hasImage: boolean;
}

const DEFAULT_CENTER: [number, number] = [0, 0];
const DEFAULT_ZOOM = 2;
const MARKER_ZOOM = 15;

const createCustomIcon = () => L.divIcon({
  className: 'custom-marker',
  html: `<div style="
    width: 32px;
    height: 32px;
    background: hsl(217, 91%, 60%);
    border: 3px solid white;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
  "></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

export function MapView({ latitude, longitude, onPositionChange, hasImage }: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  // Stable callback refs for event handlers
  const onPositionChangeRef = useRef(onPositionChange);
  onPositionChangeRef.current = onPositionChange;

  const hasImageRef = useRef(hasImage);
  hasImageRef.current = hasImage;

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Click handler for setting marker
    map.on('click', (e: L.LeafletMouseEvent) => {
      if (hasImageRef.current) {
        onPositionChangeRef.current(e.latlng.lat, e.latlng.lng);
      }
    });

    mapRef.current = map;
    setIsMapReady(true);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
        setIsMapReady(false);
      }
    };
  }, []);

  // Update marker when coordinates or hasImage changes
  useEffect(() => {
    if (!mapRef.current || !isMapReady) return;

    const map = mapRef.current;
    const hasValidCoords = latitude !== null && longitude !== null && 
                           !isNaN(latitude) && !isNaN(longitude);

    // Remove existing marker if coordinates are invalid
    if (!hasValidCoords) {
      if (markerRef.current) {
        map.removeLayer(markerRef.current);
        markerRef.current = null;
      }
      map.setView(DEFAULT_CENTER, DEFAULT_ZOOM, { animate: false });
      return;
    }

    const position: [number, number] = [latitude, longitude];

    // Create or update marker
    if (markerRef.current) {
      markerRef.current.setLatLng(position);
    } else {
      markerRef.current = L.marker(position, {
        icon: createCustomIcon(),
        draggable: hasImage,
      }).addTo(map);

      markerRef.current.on('dragend', () => {
        const pos = markerRef.current?.getLatLng();
        if (pos) {
          onPositionChangeRef.current(pos.lat, pos.lng);
        }
      });
    }

    // Update dragging state
    if (hasImage) {
      markerRef.current.dragging?.enable();
    } else {
      markerRef.current.dragging?.disable();
    }

    // Pan to marker
    map.setView(position, Math.max(map.getZoom(), MARKER_ZOOM), { animate: true });
  }, [latitude, longitude, hasImage, isMapReady]);

  return (
    <Card className="h-full flex flex-col overflow-visible">
      <CardHeader className="pb-3 flex-shrink-0">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <MapIcon className="w-4 h-4" />
          Location Map
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <div className="relative h-full min-h-[400px] lg:min-h-0">
          <div
            ref={mapContainerRef}
            className="absolute inset-0 rounded-b-xl overflow-hidden"
            data-testid="map-container"
          />
          {!hasImage && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-b-xl z-[1000]">
              <p className="text-sm text-muted-foreground text-center px-4">
                Upload an image to set or view GPS location
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
