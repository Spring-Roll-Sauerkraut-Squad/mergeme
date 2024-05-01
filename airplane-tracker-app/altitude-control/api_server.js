import express from 'express';
import axios from 'axios';
import cors from 'cors';
import 'dotenv/config'

const app = express();
const api_port = process.env.API_PORT || 3000;

const api_url = 'https://opensky-network.org/api/states/own';
const opensky_username = process.env.OPENSKY_USERNAME;
const opensky_password = process.env.OPENSKY_PASSWORD;

app.use(cors());

app.get('/api/flights', async (req, res) => {
    const username = opensky_username;
    const password = opensky_password;

    const auth = Buffer.from(`${username}:${password}`).toString('base64');
    try {
        const response = await axios.get(api_url, {
            headers: { Authorization: `Basic ${auth}` }
        });
        res.json(response.data);
        console.log('test');
    } catch (error) {
        console.error('Error fetching data from OpenSky:', error);
        res.status(500).send('Failed to fetch data');
    }
});

app.listen(api_port, () => console.log(`Server running on port ${api_port}/api/flights`));