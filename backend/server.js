const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// TODO: Connect to your MongoDB instance
// mongoose.connect('mongodb://localhost:27017/postcards');

// M1: Provide a scrollable list of all postcards with basic filter functions [cite: 262, 263]
app.get('/api/postcards', async (req, res) => {
  // Extract filters from the request (country, distance, date) [cite: 263]
  const { country, distance, date, clusterId } = req.query;
  
  // TODO: Build Mongoose query based on filters
  
  res.json({ message: "Postcard list will be returned here." });
});

// M2: Endpoint to fetch cluster data (vision model topics) [cite: 263, 264]
app.get('/api/clusters', async (req, res) => {
  res.json({ message: "Spatial layout data will be returned here." });
});

// M3: Endpoint for postcard travel paths (Source to Target) [cite: 266, 267]
app.get('/api/paths', async (req, res) => {
   // The path view must be linked to the cluster view [cite: 268]
   res.json({ message: "Travel paths returning here." });
});

app.listen(5000, () => {
  console.log('Backend running on http://localhost:5000');
});