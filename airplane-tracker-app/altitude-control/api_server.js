import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;
const OPENSKY_API = 'https://opensky-network.org/api/states/own';

app.use(cors());

app.get('/api/flights', async (req, res) => {
    const username = OPENSKY_USERNAME
    const password = OPENSKY_PASSWORD

    const auth = Buffer.from(`${username}:${password}`).toString('base64');
    try {
        const response = await axios.get(OPENSKY_API, {
            headers: { Authorization: `Basic ${auth}` }
        });
        res.json(response.data);
       console.log('test');
    } catch (error) {
        console.error('Error fetching data from OpenSky:', error);
        res.status(500).send('Failed to fetch data');
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}/api/flights`));