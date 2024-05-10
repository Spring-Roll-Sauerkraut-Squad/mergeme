import express from 'express';
import cors from 'cors';
import extractWaypoints from './fetch-mongo-data.js';

const app = express();

app.use(cors());

app.get('/api/data', async (req, res) => {
  try {
    const { collectionName } = req.query;
    if (!collectionName) {
      return res.status(400).json({ error: 'Collection name is required' });
    }

   
    const data = await extractWaypoints(collectionName);
    res.json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
