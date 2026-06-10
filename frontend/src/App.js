// 

import React, { useState, useEffect } from 'react';
import ClusterView from './ClusterView';
import MapView from './MapView';
import logo from './logo.svg';
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
        {/* 2. Add the logo container right at the top */}

<div className="brand-header" style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
  <img
    src={logo}
    alt="Postcrossing Analytics Logo"
    style={{ width: '50px', height: 'auto', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}
  />
  <h2 style={{ margin: 0 }}>Postcard Dispatch Logs</h2>
</div>
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