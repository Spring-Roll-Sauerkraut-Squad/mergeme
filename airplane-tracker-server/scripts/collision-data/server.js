import express from 'express';
import cors from 'cors';
import extractWaypoints from './collision-data.js';

const app = express();


app.use(cors());

app.get('/api/waypoints', async (req, res) => {
  try {
    const waypoints = await extractWaypoints();
    res.json(waypoints); 
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
