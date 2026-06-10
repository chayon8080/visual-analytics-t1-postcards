const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

const realPostcardDataPath = path.join(__dirname, 'realPostcardData.json');
let postcardsData = [];

try {
  if (fs.existsSync(realPostcardDataPath)) {
    const rawData = fs.readFileSync(realPostcardDataPath, 'utf8');
    const parsedData = JSON.parse(rawData);
    
    // --- E2: Server-side Outlier Evaluation Logic ---
    postcardsData = parsedData.map(pc => ({
      ...pc,
      // Flag cards travelling more than 8000km as severe delivery outliers
      isAnomaly: pc.distance > 8000 
    }));
    
    console.log(`✅ Successfully loaded ${postcardsData.length} postcards with anomaly matrices.`);
  } else {
    console.error("❌ Error: realPostcardData.json not found in backend folder.");
  }
} catch (error) {
  console.error("❌ Error parsing real data:", error);
}

app.get('/', (req, res) => {
  res.send('Backend is running! The data is at /api/postcards');
});

app.get('/api/postcards', (req, res) => {
  res.json(postcardsData);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
});