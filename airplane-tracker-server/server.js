import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import redis from 'redis';
import { createServer } from 'http';

import historicalHeatmapPositionsRoutes from './routes/historicalHeatmapPositionsRoutes.js';
import historicalTopAirportsRoutes from './routes/historicalTopAirportsRoutes.js';
import historicalTopLinesRoutes from './routes/historicalTopLinesRoutes.js';

import { getRealtimeMockingFlights } from './services/realtimeFlightsMockingService.js';

const app = express();
app.use(cors());

const server = createServer(app);

app.use('/historical-heatmap-positions', historicalHeatmapPositionsRoutes);
app.use('/historical-top-airports', historicalTopAirportsRoutes);
app.use('/historical-top-lines', historicalTopLinesRoutes);

const port = 3001;

const io = new Server(server,
  {
    cors: {
      origin: "*",
    }
  });

const redisClient = await redis.createClient()
  .on('error', err => console.log('Redis Client Error', err))
  .connect();


const fetchDataFromHistoricalDB = () => {
  return getRealtimeMockingFlights();
};

// fetch data from the historical database and store it in Redis, and trigger a WebSocket event to send the mock data to the client
const fetchAndStoreData = async () => {
  const realtimeFlights = await fetchDataFromHistoricalDB();
  console.log('Realtime Flights Size: ', realtimeFlights.length);
  
  realtimeFlights.map(async flight => {
  
    if (flight.departureAirportCode) {
      await redisClient.zAdd('airport_lb', {score: 1, value: flight.departureAirportCode}, {INCR: true});
    } 
    if (flight.arrivalAirportCode) {
      await redisClient.zAdd('airport_lb', {score: 1, value: flight.arrivalAirportCode}, {INCR: true});
    }
    if (flight.departureAirportCode && flight.arrivalAirportCode) {
      await redisClient.zAdd('flight_route_lb', {score: 1, value: `${flight.departureAirportCode} -> ${flight.arrivalAirportCode}`}, {INCR: true});
    }

    if (flight.departureLatitude && flight.departureLongitude) {
      await redisClient.hIncrBy('airport_geo', flight.departureLatitude.toString() + '|' + flight.departureLongitude.toString(), 1);
    }
    if (flight.arrivalLatitude && flight.arrivalLongitude) {
      await redisClient.hIncrBy('airport_geo', flight.arrivalLatitude.toString() + '|' + flight.arrivalLongitude.toString(), 1);
    }
  });
  const airport_lbs = await redisClient.zRangeWithScores('airport_lb', 0, 9, {REV: true});
  console.log('Top Airports: ', airport_lbs);
  const flight_route_lbs = await redisClient.zRangeWithScores('flight_route_lb', 0, 9, {REV: true});
  console.log('Top Flight Routes: ', flight_route_lbs);
  const airport_geos = await redisClient.hGetAll('airport_geo');
  const mockdata = {
    airport_lbs,
    flight_route_lbs,
    airport_geos
  };
  await redisClient.set('mockdata', JSON.stringify(mockdata));
  io.emit('mockdata', JSON.stringify(mockdata));
};


// Every 3 seconds
const intervalId = setInterval(fetchAndStoreData, 3 * 1000);

// Start the WebSocket server
io.on('connection', socket => {
  console.log('Client connected');
  redisClient.get('mockdata', (err, mockdata) => {
    if (err) throw err;
    socket.emit('mockdata', mockdata);
  });
});

app.on('close', () => {
  clearInterval(intervalId);
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

