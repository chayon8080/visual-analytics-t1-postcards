import React, { useState, useEffect } from 'react';
import ClusterView from './ClusterView';
import MapView from './MapView';
import './App.css';

function App() {
  const [postcards, setPostcards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/postcards')
      .then((res) => res.json())
      .then((data) => {
        setPostcards(data);
        setLoading(false);
      })
      .catch((err) => console.error("Data Error:", err));
  }, []);

  if (loading) return <div className="loading-screen">Syncing Postcard Data...</div>;

  return (
    <div className="app-container">
      {/* M1 Section */}
      <div className="sidebar">
        <h2>Postcard Dispatch Logs</h2>
        <p className="sidebar-subtitle">Total Processed: {postcards.length}</p>
        
        {postcards.slice(0, 50).map((pc, i) => (
          <div key={i} className="feed-card">
            <p className="route-title">{pc.source.country} ✈️ {pc.target.country}</p>
            <p className="route-details">ID: {pc.postcardId} • {pc.distance} km</p>
            <span className="topic-badge">{pc.topic}</span>
          </div>
        ))}
      </div>

      <div className="analytics-container">
        {/* M2 Section */}
        <div className="cluster-section">
          <ClusterView postcards={postcards} />
        </div>
        
        {/* M3 Section */}
        <div className="map-section">
          <MapView postcards={postcards} />
        </div>
      </div>
    </div>
  );
}

export default App;