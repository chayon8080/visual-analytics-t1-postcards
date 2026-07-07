import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();

export const CLUSTER_COLORS = ['#FF8042', '#00C49F', '#FFBB28', '#0088FE', '#FF66B2'];

export const getPostcardColor = (postcard) => {
  if (postcard.isAnomaly) {
    return '#e74c3c';
  }
  const clusterId = Number(postcard.clusterId) || 0;
  return CLUSTER_COLORS[clusterId % CLUSTER_COLORS.length];
};

export const hexToRgb = (hex) => {
  const bigint = parseInt(hex.replace('#', ''), 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
};
