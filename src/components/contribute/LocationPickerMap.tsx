import { useEffect } from 'react';

import { MapContainer, Marker, Rectangle, useMap, useMapEvents } from 'react-leaflet';

import L from 'leaflet';

import { TAMIL_NADU_CENTER } from '../../lib/geo';

import { BaseMapLayers } from '../map/BaseMapLayers';

import { MapAttribution } from '../map/MapAttribution';

import { MAJOR_WATER_GUIDE_SITES } from '../map/majorWaterBodies';

import { PORUNAI_REGION_STYLE, TAMIL_NADU_DEFAULT_ZOOM } from '../map/mapConfig';

import { PORUNAI_REGION_BOUNDS } from '../map/porunaiRegion';



const pickerIcon = L.divIcon({

  className: '',

  html: '<div class="location-picker-pin" aria-hidden="true"></div>',

  iconSize: [36, 36],

  iconAnchor: [18, 36],

});



const guideIcon = L.divIcon({

  className: '',

  html: '<div class="water-map-marker water-map-marker--guide" aria-hidden="true"></div>',

  iconSize: [20, 20],

  iconAnchor: [10, 20],

});



/** Only recenters when `zoom` is set (search / GPS), not while dragging the pin */

function MapRecenter({ lat, lng, zoom }: { lat: number; lng: number; zoom?: number }) {

  const map = useMap();

  useEffect(() => {

    if (zoom == null) return;

    map.setView([lat, lng], zoom, { animate: true });

  }, [lat, lng, zoom, map]);

  return null;

}



function MapClickToMove({ onPick }: { onPick: (lat: number, lng: number) => void }) {

  useMapEvents({

    click(e) {

      onPick(e.latlng.lat, e.latlng.lng);

    },

  });

  return null;

}



function DraggablePin({

  lat,

  lng,

  onDragEnd,

}: {

  lat: number;

  lng: number;

  onDragEnd: (lat: number, lng: number) => void;

}) {

  return (

    <Marker

      position={[lat, lng]}

      icon={pickerIcon}

      draggable

      zIndexOffset={1000}

      eventHandlers={{

        dragend: (e) => {

          const pos = e.target.getLatLng();

          onDragEnd(pos.lat, pos.lng);

        },

      }}

    />

  );

}



/** Read-only reference pins for major rivers and lakes */

function GuideMarkers() {

  return (

    <>

      <Rectangle bounds={PORUNAI_REGION_BOUNDS} pathOptions={PORUNAI_REGION_STYLE} />

      {MAJOR_WATER_GUIDE_SITES.map((site) => (

        <Marker

          key={String(site.id)}

          position={site.coords}

          icon={guideIcon}

          interactive={false}

        />

      ))}

    </>

  );

}



export function LocationPickerMap({

  lat,

  lng,

  onPick,

  recenterZoom,

  mapZoom,

}: {

  lat: number;

  lng: number;

  onPick: (lat: number, lng: number) => void;

  recenterZoom?: number;

  mapZoom: number;

}) {

  return (

    <>

      <MapContainer

        center={[lat, lng]}

        zoom={recenterZoom ?? mapZoom}

        className="location-picker-map water-atlas-map"

        scrollWheelZoom

        attributionControl={false}

        aria-label="Pick location on map"

      >

        <BaseMapLayers />

        <GuideMarkers />

        <MapRecenter lat={lat} lng={lng} zoom={recenterZoom} />

        <MapClickToMove onPick={onPick} />

        <DraggablePin lat={lat} lng={lng} onDragEnd={onPick} />

      </MapContainer>

      <MapAttribution className="map-attribution--picker" />

    </>

  );

}



export function defaultPickerCenter(

  lat: number | null,

  lng: number | null,

): { lat: number; lng: number } {

  if (lat != null && lng != null) return { lat, lng };

  return TAMIL_NADU_CENTER;

}



export function defaultPickerZoom(lat: number | null, lng: number | null): number {

  if (lat != null && lng != null) return 14;

  return TAMIL_NADU_DEFAULT_ZOOM;

}


