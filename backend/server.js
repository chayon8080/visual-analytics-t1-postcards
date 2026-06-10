const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Load Real Data
const realPostcardDataPath = path.join(__dirname, 'realPostcardData.json');
let postcardsData = [];

try {
  if (fs.existsSync(realPostcardDataPath)) {
    const rawData = fs.readFileSync(realPostcardDataPath, 'utf8');
    postcardsData = JSON.parse(rawData);
    console.log(`✅ Successfully loaded ${postcardsData.length} real postcards into memory.`);
  } else {
    console.error("❌ Error: realPostcardData.json not found in the backend folder.");
  }
} catch (error) {
  console.error("❌ Error parsing real data:", error);
}

// Routes
app.get('/', (req, res) => {
  res.send('Backend is running! The data is at /api/postcards');
});

app.get('/api/postcards', (req, res) => {
  res.json(postcardsData);
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});