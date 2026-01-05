'use client';
import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { MapPin } from 'lucide-react';

interface MapLocation {
  lat: number;
  lng: number;
}

interface MapMarker {
  id: string;
  position: MapLocation;
  title: string;
  crimeType?: string;
  status?: string;
  urgency?: string;
}

interface MapComponentProps {
  center?: MapLocation;
  zoom?: number;
  markers?: MapMarker[];
  onLocationSelect?: (location: MapLocation) => void;
  height?: string;
  interactive?: boolean;
}

const containerStyle = {
  width: '100%',
  height: '100%',
  minHeight: '400px'
};

const defaultCenter: MapLocation = {
  lat: 48.8566, // Paris par défaut
  lng: 2.3522
};

// Configuration des couleurs par urgence
const getMarkerColor = (urgency?: string) => {
  switch (urgency) {
    case 'high': return '#ef4444'; // Rouge
    case 'medium': return '#f59e0b'; // Orange
    case 'low': return '#10b981'; // Vert
    default: return '#3b82f6'; // Bleu par défaut
  }
};

// Configuration des icônes par statut
const getMarkerIcon = (status?: string, urgency?: string) => {
  const color = getMarkerColor(urgency);
  
  return {
    path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
    fillColor: color,
    fillOpacity: status === 'resolved' ? 0.5 : 1,
    strokeColor: '#ffffff',
    strokeWeight: 2,
    scale: 2,
    anchor: { x: 12, y: 24 } as google.maps.Point
  };
};

export default function MapComponent({
  center = defaultCenter,
  zoom = 12,
  markers = [],
  onLocationSelect,
  height = '500px',
  interactive = true
}: MapComponentProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [clickedLocation, setClickedLocation] = useState<MapLocation | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (!interactive || !onLocationSelect || !e.latLng) return;
    
    const location = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    };
    
    setClickedLocation(location);
    onLocationSelect(location);
  }, [interactive, onLocationSelect]);

  const handleMarkerClick = (marker: MapMarker) => {
    setSelectedMarker(marker);
  };

  if (loadError) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height,
        backgroundColor: '#f3f4f6',
        borderRadius: '8px',
        color: '#ef4444'
      }}>
        <div style={{ textAlign: 'center' }}>
          <MapPin size={48} />
          <p>Erreur de chargement de la carte</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height,
        backgroundColor: '#f3f4f6',
        borderRadius: '8px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p style={{ marginTop: '12px', color: '#6b7280' }}>Chargement de la carte...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height, borderRadius: '8px', overflow: 'hidden' }}>
      <GoogleMap
        mapContainerStyle={{ ...containerStyle, height }}
        center={center}
        zoom={zoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={handleMapClick}
        options={{
          streetViewControl: false,
          mapTypeControl: true,
          fullscreenControl: true,
          zoomControl: true,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ]
        }}
      >
        {/* Marqueurs des signalements */}
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={marker.position}
            onClick={() => handleMarkerClick(marker)}
            icon={getMarkerIcon(marker.status, marker.urgency)}
            title={marker.title}
          />
        ))}

        {/* Marqueur de localisation sélectionnée (pour le formulaire) */}
        {clickedLocation && interactive && (
          <Marker
            position={clickedLocation}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: '#667eea',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2
            }}
          />
        )}

        {/* InfoWindow pour afficher les détails */}
        {selectedMarker && (
          <InfoWindow
            position={selectedMarker.position}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div style={{ padding: '8px', maxWidth: '200px' }}>
              <h3 style={{ 
                fontSize: '16px', 
                fontWeight: 'bold', 
                marginBottom: '8px',
                color: '#1f2937'
              }}>
                {selectedMarker.title}
              </h3>
              
              {selectedMarker.crimeType && (
                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
                  Type: <strong>{selectedMarker.crimeType}</strong>
                </p>
              )}
              
              {selectedMarker.urgency && (
                <p style={{ 
                  fontSize: '12px', 
                  marginTop: '8px',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  display: 'inline-block',
                  backgroundColor: getMarkerColor(selectedMarker.urgency),
                  color: 'white',
                  fontWeight: '600'
                }}>
                  {selectedMarker.urgency === 'high' ? 'Urgent' : 
                   selectedMarker.urgency === 'medium' ? 'Moyen' : 'Faible'}
                </p>
              )}
              
              {selectedMarker.status && (
                <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                  Statut: {selectedMarker.status === 'submitted' ? 'Soumis' :
                           selectedMarker.status === 'in_review' ? 'En cours' : 'Résolu'}
                </p>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}