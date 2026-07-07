import React, {useState, useMemo} from 'react';
import DeckGL from '@deck.gl/react';
import { ArcLayer } from '@deck.gl/layers';
import Map from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { getPostcardColor, hexToRgb } from '.';

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

export default function MapView({ postcards, zoomLevel, setZoomLevel }) {

  const [minCount, setMinCount] = useState(1);
  const [exceptAnomalies, setExceptAnomalies] = useState(true);
  const [viewState, setViewState] = useState({longitude: 15, latitude: 20, zoom: zoomLevel, pitch: 40, bearing: 0});

  const min_zoom = 0

  const onViewStateChange = ({ viewState: nextViewState }) => {
    if (nextViewState.zoom <= min_zoom) {
      const lockedState = {
        ...nextViewState,
        longitude: 15,
        latitude: 20,
        zoom: min_zoom
      };
      setViewState(lockedState);
      setZoomLevel(min_zoom);
    } else {
      setViewState(nextViewState);
      setZoomLevel(nextViewState.zoom);
      }
  };

  const aggregatedRoutes = useMemo(() => {
    if (!postcards || postcards.length === 0) return [];

    const routeMap = {};

    const adjustAntarctica = (lat, lng) => {
    let latitude = parseFloat(lat);
    let longitude = parseFloat(lng);

    if (latitude < -85) {
      latitude = -75; 
    }
    return [longitude, latitude];
  };

    postcards.forEach(pc => {
      const sourceCountry = pc.source?.country;
      const targetCountry = pc.target?.country;
      
      if (!sourceCountry || !targetCountry) return;

      const routeId = `${sourceCountry}->${targetCountry}`;

      if (!routeMap[routeId]) {
        const source = adjustAntarctica(pc.source.lat, pc.source.lng);
        const target = adjustAntarctica(pc.target.lat, pc.target.lng);

        routeMap[routeId] = {
          id: routeId,
          source: source,
          target: target,
          count: 0,
          isAnomaly: false,
          clusterId: pc.clusterId
        };
      }

      routeMap[routeId].count += 1;
      if (pc.isAnomaly) {
        routeMap[routeId].isAnomaly = true;
      }
    });

    return Object.values(routeMap);
  }, [postcards]);

  const filteredData = useMemo(() => {
    return aggregatedRoutes.filter(route => {
      if (exceptAnomalies && route.isAnomaly) {
        return true;
      }
      return route.count >= minCount;
    });
  }, [aggregatedRoutes, minCount, exceptAnomalies]);


  const layers = [
    new ArcLayer({
      id: 'arcs',
      data: filteredData,
      getSourcePosition: d => d.source,
      getTargetPosition: d => d.target,
      getSourceColor: d => hexToRgb(getPostcardColor(d)), 
      getTargetColor: d => hexToRgb(getPostcardColor(d)),
      getWidth: d => d.isAnomaly ? 2.5 * viewState.zoom : 1.2 * viewState.zoom
    })
  ];

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div style={{ 
        position: 'absolute', 
        bottom: 20, 
        left: 20, 
        zIndex: 10, 
        background: '#000', 
        padding: '15px', 
        color: '#fff',
        borderRadius: '5px',
        fontFamily: 'sans-serif'
      }}>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Min. Postcards: {minCount}</label>
          <input 
            type="range" 
            min="1" 
            max="20" 
            value={minCount} 
            onChange={(e) => setMinCount(Number(e.target.value))} 
            style={{ width: '150px' }}
          />
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', cursor: 'pointer' }}>
          <input 
            type="checkbox" 
            checked={exceptAnomalies} 
            onChange={(e) => setExceptAnomalies(e.target.checked)} 
          />
          Except Anomalies
        </label>
      </div>
      <h3 className="map-title">Live Transit Network</h3>
      <DeckGL 
        viewState={viewState} 
        onViewStateChange={onViewStateChange}
        style={{ background: '#2E353C' }}
        controller={{
          dragPan: viewState.zoom > min_zoom,
          scrollZoom: true,
          doubleClickZoom: true,
          minZoom: min_zoom,
          maxZoom: 15,
          maxBounds: [[-180, -85], [180, 85]]
        }}
        layers={layers}
      >
        <Map mapStyle={MAP_STYLE} mapLib={maplibregl} renderWorldCopies={true} />
      </DeckGL>
    </div>
  );
}