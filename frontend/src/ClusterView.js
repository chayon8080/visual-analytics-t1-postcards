import React, { useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function ClusterView({ postcards }) {
  const data = useMemo(() => {
    return postcards.slice(0, 1000).map(pc => ({
      topic: pc.topic,
      x: pc.spatialLayout.x,
      y: pc.spatialLayout.y,
      clusterId: pc.clusterId
    }));
  }, [postcards]);

  const COLORS = ['#FF8042', '#00C49F', '#FFBB28', '#0088FE', '#FF66B2'];

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <h3 className="cluster-title">Image Categorization Scatter</h3>
      <ResponsiveContainer width="100%" height="85%">
        <ScatterChart>
          <XAxis type="number" dataKey="x" hide />
          <YAxis type="number" dataKey="y" hide />
          <Tooltip 
            content={({ payload }) => {
              if (payload && payload.length) {
                const { topic, clusterId } = payload[0].payload;
                return (
                  <div className="custom-tooltip">
                    <p style={{ margin: 0 }}><b>Topic:</b> {topic}</p>
                    <p style={{ margin: 0 }}><b>Cluster:</b> {clusterId}</p>
                  </div>
                );
              }
              return null;
            }} 
          />
          <Scatter data={data}>
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[entry.clusterId % COLORS.length]} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}