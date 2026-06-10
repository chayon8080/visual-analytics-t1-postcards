import React from 'react';
import DeckGL from '@deck.gl/react';
import { ArcLayer } from '@deck.gl/layers';
import Map from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

export default function MapView({ postcards, zoomLevel, setZoomLevel }) {
  const layers = [
    new ArcLayer({
      id: 'arcs',
      data: postcards,
      getSourcePosition: d => [d.source.lng, d.source.lat],
      getTargetPosition: d => [d.target.lng, d.target.lat],
      getSourceColor: d => d.isAnomaly ? [255, 50, 50, 220] : [0, 255, 128, 140], 
      getTargetColor: d => d.isAnomaly ? [255, 100, 0, 240] : [255, 0, 128, 140],
      getWidth: d => d.isAnomaly ? 2.5 * zoomLevel : 1.2 * zoomLevel
    })
  ];

  const onViewStateChange = ({ viewState }) => {
    setZoomLevel(viewState.zoom);
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <h3 className="map-title">Live Transit Network</h3>
      <DeckGL 
        viewState={{ longitude: 15, latitude: 20, zoom: zoomLevel, pitch: 40 }} 
        onViewStateChange={onViewStateChange} 
        controller={true} 
        layers={layers}
      >
        <Map mapStyle={MAP_STYLE} mapLib={maplibregl} />
      </DeckGL>
    </div>
  );
}