import express from 'express';
import cors from 'cors';
import historicalHeatmapPositionsRoutes from './routes/historicalHeatmapPositionsRoutes.js';

const app = express();

app.use(cors());

const port = 3001;

app.use('/historical-heatmap-positions', historicalHeatmapPositionsRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
