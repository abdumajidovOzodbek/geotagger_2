import { useEffect, useRef, useCallback, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Map as MapIcon, Search, Maximize2, Minimize2, Layers, X, Loader2 } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { cn } from '@/lib/utils';

interface MapViewProps {
  latitude: number | null;
  longitude: number | null;
  onPositionChange: (lat: number, lng: number) => void;
  hasImage: boolean;
}

interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
  place_id: number;
}

const DEFAULT_CENTER: [number, number] = [20, 0];
const DEFAULT_ZOOM = 2;
const MARKER_ZOOM = 16;

const createCustomIcon = () => L.divIcon({
  className: 'custom-marker',
  html: `<div style="
    width: 36px;
    height: 36px;
    background: hsl(217, 91%, 60%);
    border: 4px solid white;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    box-shadow: 0 4px 12px rgba(0,0,0,0.4);
  "></div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
});

// Tile layer configurations
const tileLayers = {
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    maxZoom: 19,
  },
  street: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  },
  hybrid: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri',
    maxZoom: 19,
  },
};

export function MapView({ latitude, longitude, onPositionChange, hasImage }: MapViewProps) {
  const { t } = useLanguage();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const fullscreenContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const labelsLayerRef = useRef<L.TileLayer | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeLayer, setActiveLayer] = useState<'satellite' | 'street' | 'hybrid'>('satellite');
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Stable callback refs for event handlers
  const onPositionChangeRef = useRef(onPositionChange);
  onPositionChangeRef.current = onPositionChange;

  const hasImageRef = useRef(hasImage);
  hasImageRef.current = hasImage;

  // Search for locations using Nominatim
  const searchLocation = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      setSearchError(null);
      return;
    }

    setIsSearching(true);
    setSearchError(null);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`,
        {
          headers: {
            'Accept': 'application/json',
          },
        }
      );
      
      if (!response.ok) {
        throw new Error('Search failed');
      }
      
      const data = await response.json();
      setSearchResults(data);
      setShowSearchResults(true);
      
      if (data.length === 0) {
        setSearchError(t('noLocationsFound'));
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
      setSearchError(t('searchFailed'));
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length >= 3) {
        searchLocation(searchQuery);
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, searchLocation]);

  // Handle search result selection
  const handleSelectResult = useCallback((result: SearchResult) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    
    if (hasImageRef.current) {
      onPositionChangeRef.current(lat, lng);
    }
    
    if (mapRef.current) {
      mapRef.current.setView([lat, lng], MARKER_ZOOM, { animate: true });
    }
    
    setSearchQuery('');
    setShowSearchResults(false);
    setSearchResults([]);
  }, []);

  // Switch tile layer
  const switchLayer = useCallback((layerType: 'satellite' | 'street' | 'hybrid') => {
    if (!mapRef.current) return;

    // Remove existing layers
    if (tileLayerRef.current) {
      mapRef.current.removeLayer(tileLayerRef.current);
    }
    if (labelsLayerRef.current) {
      mapRef.current.removeLayer(labelsLayerRef.current);
    }

    const layer = tileLayers[layerType === 'hybrid' ? 'satellite' : layerType];
    tileLayerRef.current = L.tileLayer(layer.url, {
      attribution: layer.attribution,
      maxZoom: layer.maxZoom,
    }).addTo(mapRef.current);

    // Add labels overlay for hybrid view
    if (layerType === 'hybrid') {
      labelsLayerRef.current = L.tileLayer(
        'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-labels/{z}/{x}/{y}{r}.png',
        {
          attribution: 'Labels &copy; Stamen Design',
          maxZoom: 19,
          subdomains: 'abcd',
        }
      ).addTo(mapRef.current);
    }

    setActiveLayer(layerType);
    setShowLayerMenu(false);
  }, []);

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  // Handle escape key for fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Invalidate map size when fullscreen changes
  useEffect(() => {
    if (mapRef.current && isFullscreen) {
      // Multiple invalidateSize calls to ensure Leaflet recalculates
      setTimeout(() => {
        mapRef.current?.invalidateSize();
      }, 50);
      setTimeout(() => {
        mapRef.current?.invalidateSize();
      }, 200);
      setTimeout(() => {
        mapRef.current?.invalidateSize();
      }, 400);
    }
  }, [isFullscreen]);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: false,
    });

    // Add zoom control to bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Initialize with satellite layer
    const layer = tileLayers.satellite;
    tileLayerRef.current = L.tileLayer(layer.url, {
      attribution: layer.attribution,
      maxZoom: layer.maxZoom,
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
        tileLayerRef.current = null;
        labelsLayerRef.current = null;
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

  const mapContent = (
    <>
      {/* Search Bar */}
      <div className={cn("absolute z-[1000]", isFullscreen ? "top-3 left-3 right-3" : "top-3 left-3 right-3")}>
        <div className="relative max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              placeholder={t('searchLocation')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-9 bg-background/95 backdrop-blur-sm shadow-lg border-0"
              disabled={!hasImage}
              data-testid="input-search-location"
            />
            {searchQuery && !isSearching && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSearchResults([]);
                  setShowSearchResults(false);
                  setSearchError(null);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            {isSearching && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground animate-spin" />
            )}
          </div>
          
          {/* Search Results Dropdown */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-background/95 backdrop-blur-sm rounded-lg shadow-lg border overflow-hidden">
              {searchResults.map((result) => (
                <button
                  key={result.place_id}
                  onClick={() => handleSelectResult(result)}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-muted/50 truncate transition-colors"
                  data-testid={`search-result-${result.place_id}`}
                >
                  {result.display_name}
                </button>
              ))}
            </div>
          )}
          
          {/* Search Error Message */}
          {searchError && !isSearching && searchResults.length === 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-background/95 backdrop-blur-sm rounded-lg shadow-lg border overflow-hidden">
              <div className="px-3 py-2 text-sm text-muted-foreground">
                {searchError}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Map Controls */}
      <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-2">
        {/* Fullscreen Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={toggleFullscreen}
          className="bg-background/95 backdrop-blur-sm shadow-lg border-0"
          data-testid="button-fullscreen"
        >
          {isFullscreen ? (
            <Minimize2 className="w-4 h-4" />
          ) : (
            <Maximize2 className="w-4 h-4" />
          )}
        </Button>

        {/* Layer Switcher */}
        <div className="relative">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowLayerMenu(!showLayerMenu)}
            className="bg-background/95 backdrop-blur-sm shadow-lg border-0"
            data-testid="button-layers"
          >
            <Layers className="w-4 h-4" />
          </Button>
          
          {showLayerMenu && (
            <div className="absolute top-0 right-full mr-2 bg-background/95 backdrop-blur-sm rounded-lg shadow-lg border overflow-hidden min-w-[120px]">
              <button
                onClick={() => switchLayer('satellite')}
                className={cn(
                  "w-full px-3 py-2 text-left text-sm transition-colors",
                  activeLayer === 'satellite' ? "bg-primary/10 text-primary" : "hover:bg-muted/50"
                )}
                data-testid="button-layer-satellite"
              >
                Satellite
              </button>
              <button
                onClick={() => switchLayer('hybrid')}
                className={cn(
                  "w-full px-3 py-2 text-left text-sm transition-colors",
                  activeLayer === 'hybrid' ? "bg-primary/10 text-primary" : "hover:bg-muted/50"
                )}
                data-testid="button-layer-hybrid"
              >
                Hybrid
              </button>
              <button
                onClick={() => switchLayer('street')}
                className={cn(
                  "w-full px-3 py-2 text-left text-sm transition-colors",
                  activeLayer === 'street' ? "bg-primary/10 text-primary" : "hover:bg-muted/50"
                )}
                data-testid="button-layer-street"
              >
                Street
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Map Container */}
      <div
        ref={mapContainerRef}
        className="absolute inset-0 w-full h-full"
        data-testid="map-container"
      />

      {/* Overlay when no image */}
      {!hasImage && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-[1000]">
          <p className="text-sm text-muted-foreground text-center px-4">
            {t('uploadImageToSetLocation')}
          </p>
        </div>
      )}
    </>
  );

  const cardContent = (
    <div className={cn("h-full flex flex-col", isFullscreen && "fixed inset-0 z-[9999] bg-background")}>
      {isFullscreen && (
        <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 bg-background border-b">
          <div className="flex items-center gap-2">
            <MapIcon className="w-4 h-4" />
            <span className="text-sm font-semibold">Location Map (Fullscreen)</span>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleFullscreen}
            className="bg-background/95 backdrop-blur-sm shadow-lg border-0"
            data-testid="button-fullscreen-close"
          >
            <Minimize2 className="w-4 h-4" />
          </Button>
        </div>
      )}
      <Card className={cn("h-full flex flex-col overflow-visible", isFullscreen && "rounded-none border-0 shadow-none")}>
        {!isFullscreen && (
          <CardHeader className="pb-3 flex-shrink-0">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <MapIcon className="w-4 h-4" />
              Location Map
            </CardTitle>
          </CardHeader>
        )}
        <CardContent className="flex-1 p-0">
          <div className={cn("relative h-full min-h-[400px] lg:min-h-0 rounded-b-xl overflow-hidden", isFullscreen && "rounded-none")}>
            {mapContent}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return cardContent;
}
