import React from 'react';
import DeckGL from '@deck.gl/react';
import { ArcLayer } from '@deck.gl/layers';
import Map from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

export default function MapView({ postcards }) {
  const layers = [
    new ArcLayer({
      id: 'arcs',
      data: postcards,
      getSourcePosition: d => [d.source.lng, d.source.lat],
      getTargetPosition: d => [d.target.lng, d.target.lat],
      getSourceColor: [0, 255, 128, 140], // Neon Green Start
      getTargetColor: [255, 0, 128, 140], // Pinkish Red End
      getWidth: 1.5
    })
  ];

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <h3 className="map-title">Live Transit Network</h3>
      <DeckGL 
        initialViewState={{ longitude: 15, latitude: 20, zoom: 1.2, pitch: 40 }} 
        controller={true} 
        layers={layers}
      >
        <Map mapStyle={MAP_STYLE} mapLib={maplibregl} />
      </DeckGL>
    </div>
  );
}