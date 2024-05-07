import express from 'express';
import cors from 'cors';
import historicalHeatmapPositionsRoutes from './routes/historicalHeatmapPositionsRoutes.js';
import historicalTopAirportsRoutes from './routes/historicalTopAirportsRoutes.js';
import historicalTopLinesRoutes from './routes/historicalTopLinesRoutes.js';

const app = express();

app.use(cors());

const port = 3001;

app.use('/historical-heatmap-positions', historicalHeatmapPositionsRoutes);
app.use('/historical-top-airports', historicalTopAirportsRoutes);
app.use('/historical-top-lines', historicalTopLinesRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
