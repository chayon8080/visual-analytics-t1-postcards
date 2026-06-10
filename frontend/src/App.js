import React, { useState, useEffect, useMemo } from 'react';
import ClusterView from './ClusterView';
import MapView from './MapView';
import logo from './logo.svg';
import './App.css';

function App() {
  const [postcards, setPostcards] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- E1: Cross-Filtering Search & Selection States ---
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(null);

  // --- E3: Shared Zoom State ---
  const [zoomLevel, setZoomLevel] = useState(1.2);

  useEffect(() => {
    fetch('https://postcards-api.onrender.com/api/postcards')
      .then((res) => res.json())
      .then((data) => {
        setPostcards(data);
        setLoading(false);
      })
      .catch((err) => console.error("Data Error:", err));
  }, []);

  // --- E2: Dynamic Outlier Threshold Processing ---
  const enrichedPostcards = useMemo(() => {
    if (postcards.length === 0) return [];

    // Extract all distances, sort them to figure out what the top 5% longest routes look like
    const distances = postcards.map(pc => Number(pc.distance || 0)).sort((a, b) => a - b);
    const thresholdIndex = Math.floor(distances.length * 0.95); 
    
    // Fallback: if top 95% is 0, use a default threshold of 5000km
    const dynamicThreshold = distances[thresholdIndex] > 0 ? distances[thresholdIndex] : 5000;

    return postcards.map(pc => ({
      ...pc,
      // Flag as anomaly if it falls into the longest top 5% of your real dataset
      isAnomaly: Number(pc.distance || 0) >= dynamicThreshold
    }));
  }, [postcards]);

  // --- E1 Data Filter Engine ---
  const filteredPostcards = useMemo(() => {
    return enrichedPostcards.filter(pc => {
      const matchesCluster = selectedTopic ? pc.topic === selectedTopic : true;
      
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        (pc.source?.country || '').toLowerCase().includes(query) ||
        (pc.target?.country || '').toLowerCase().includes(query) ||
        (pc.topic || '').toLowerCase().includes(query) ||
        (pc.postcardId || '').toString().includes(query);

      return matchesCluster && matchesSearch;
    });
  }, [enrichedPostcards, selectedTopic, searchQuery]);

  if (loading) return <div className="loading-screen">Syncing Postcard Data...</div>;

  return (
    <div className="app-container">
      {/* M1 Section */}
      <div className="sidebar">
        <div className="brand-header" style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
          <img
            src={logo}
            alt="Postcrossing Analytics Logo"
            style={{ width: '50px', height: 'auto', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}
          />
          <h2 style={{ margin: 0 }}>Postcard Logs</h2>
        </div>

        {/* 🔍 E1 Controller: Cross-View Search Input Box */}
        <div className="search-box-container" style={{ marginBottom: '15px' }}>
          <input 
            type="text" 
            placeholder="Search country, topic, or ID..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #444',
              backgroundColor: '#222',
              color: '#fff',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', alignItems: 'center' }}>
          <p className="sidebar-subtitle" style={{ margin: 0 }}>Active: {filteredPostcards.length}</p>
          {(selectedTopic || searchQuery) && (
            <button 
              className="clear-btn" 
              onClick={() => { setSelectedTopic(null); setSearchQuery(''); }}
            >
              Reset Filters
            </button>
          )}
        </div>

        <div className="feed-scroll" style={{ overflowY: 'auto', maxHeight: '65vh' }}>
          {filteredPostcards.slice(0, 50).map((pc, i) => (
            <div 
              key={i} 
              className={`feed-card ${pc.isAnomaly ? 'outlier-alert-card' : ''}`}
              style={{ cursor: 'pointer', transition: 'transform 0.1s' }}
              onClick={() => setSearchQuery(pc.topic)}
              title="Click card to isolate this cluster topic across all views"
            >
              <p className="route-title">
                {pc.source?.country || 'Unknown'} ✈️ {pc.target?.country || 'Unknown'}
                {pc.isAnomaly && <span className="outlier-tag">⚠️ OUTLIER</span>}
              </p>
              <p className="route-details">ID: {pc.postcardId} • {pc.distance} km</p>
              <span className="topic-badge">{pc.topic}</span>
            </div>
          ))}
          {filteredPostcards.length === 0 && (
            <p style={{ textAlign: 'center', color: '#888', marginTop: '20px' }}>No matches found.</p>
          )}
        </div>
      </div>

      <div className="analytics-container">
        <div className="cluster-section">
          <ClusterView 
            postcards={enrichedPostcards} 
            selectedTopic={selectedTopic}
            setSelectedTopic={setSelectedTopic}
            searchQuery={searchQuery}
            zoomLevel={zoomLevel}
          />
        </div>

        <div className="map-section">
          <MapView 
            postcards={filteredPostcards} 
            zoomLevel={zoomLevel}
            setZoomLevel={setZoomLevel}
          />
        </div>
      </div>
    </div>
  );
}

export default App;