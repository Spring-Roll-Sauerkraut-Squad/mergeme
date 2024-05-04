import express from 'express';
import axios from 'axios';
import cors from 'cors';
import 'dotenv/config'

const app = express();
const flights_server_port = process.env.FLIGHTS_API_PORT || 3000;

const flights_api_url = 'https://opensky-network.org/api/states/all?lamin=47.2701&lomin=5.8663&lamax=55.0583&lomax=15.0419';
const opensky_username = process.env.OPENSKY_USERNAME;
const opensky_password = process.env.OPENSKY_PASSWORD;

app.use(cors());

app.get('/api/flights', async (req, res) => {
    const username = opensky_username;
    const password = opensky_password;

    const auth = Buffer.from(`${username}:${password}`).toString('base64');
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

app.listen(flights_server_port, () => console.log(`Server running on port ${flights_server_port}/api/flights`));