import React, { useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function ClusterView({ postcards, selectedTopic, setSelectedTopic, searchQuery, zoomLevel }) {
  const data = useMemo(() => {
    return postcards.slice(0, 1000).map(pc => ({
      id: pc.postcardId,
      topic: pc.topic,
      x: pc.spatialLayout?.x || 0,
      y: pc.spatialLayout?.y || 0,
      clusterId: pc.clusterId,
      isAnomaly: pc.isAnomaly,
      sourceCountry: pc.source?.country || '',
      targetCountry: pc.target?.country || ''
    }));
  }, [postcards]);

  const COLORS = ['#FF8042', '#00C49F', '#FFBB28', '#0088FE', '#FF66B2'];

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <h3 className="cluster-title">Image Categorization Scatter (Scale: {zoomLevel.toFixed(1)}x)</h3>
      <ResponsiveContainer width="100%" height="85%">
        <ScatterChart>
          <XAxis type="number" dataKey="x" hide />
          <YAxis type="number" dataKey="y" hide />
          <Tooltip 
            content={({ payload }) => {
              if (payload && payload.length) {
                const { topic, clusterId, isAnomaly, sourceCountry, targetCountry } = payload[0].payload;
                return (
                  <div className="custom-tooltip" style={{ background: '#222', padding: '8px', borderRadius: '4px', border: '1px solid #444' }}>
                    <p style={{ margin: 0 }}><b>Route:</b> {sourceCountry} ➔ {targetCountry}</p>
                    <p style={{ margin: 0 }}><b>Topic:</b> {topic}</p>
                    <p style={{ margin: 0 }}><b>Cluster:</b> {clusterId}</p>
                    {isAnomaly && <p style={{ margin: '4px 0 0 0', color: '#e74c3c', fontWeight: 'bold' }}>⚠️ Long-Haul Outlier</p>}
                  </div>
                );
              }
              return null;
            }} 
          />
          <Scatter data={data}>
            {data.map((entry, index) => {
              const query = searchQuery.toLowerCase();
              const matchesSearch = 
                entry.sourceCountry.toLowerCase().includes(query) ||
                entry.targetCountry.toLowerCase().includes(query) ||
                entry.topic.toLowerCase().includes(query) ||
                entry.id.toString().includes(query);

              const matchesCluster = selectedTopic ? entry.topic === selectedTopic : true;
              const isDimmed = !matchesSearch || !matchesCluster;
              
              const cellColor = entry.isAnomaly ? '#e74c3c' : COLORS[entry.clusterId % COLORS.length];

              return (
                <Cell 
                  key={index} 
                  fill={cellColor} 
                  fillOpacity={isDimmed ? 0.10 : 0.9}
                  radius={entry.isAnomaly ? 5 * zoomLevel : 3 * zoomLevel}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedTopic(entry.topic)}
                />
              );
            })}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}