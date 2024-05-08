import express from 'express';
import cors from 'cors';
import extractAirports from './airports-data.js';

const app = express();
app.use(cors());

app.get('/api/airports', async (req, res) => {
  try {
    const airports = await extractAirports();
    res.json(airports); 
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/api/airports`);
});