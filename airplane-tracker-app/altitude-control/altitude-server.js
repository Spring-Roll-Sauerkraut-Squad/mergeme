import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import axios from 'axios';
import AirportRoutes from './routes/AirportRoutes.js';
import AirspaceRoutes from './routes/AirspaceRoutes.js';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI;
const flights_api_url = 'https://opensky-network.org/api/states/all?lamin=47.2701&lomin=5.8663&lamax=55.0583&lomax=15.0419';
const opensky_username = process.env.OPENSKY_USERNAME;
const opensky_password = process.env.OPENSKY_PASSWORD;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    authSource: 'admin',
};

mongoose.connect(mongoURI, options)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());

app.use('/api/airports', AirportRoutes);
app.use('/api/airspaces', AirspaceRoutes);
app.get('/api/flights', async (req, res) => {
    const auth = Buffer.from(`${opensky_username}:${opensky_password}`).toString('base64');
    try {
        const response = await axios.get(flights_api_url, {
            headers: { Authorization: `Basic ${auth}` }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching data from OpenSky:', error);
        res.status(500).send('Failed to fetch data');
    }
});

app.listen(PORT, () => console.log(`Server running on:\nhttp://localhost:${PORT}/api/airports \nhttp://localhost:${PORT}/api/airspaces \nhttp://localhost:${PORT}/api/flights`));