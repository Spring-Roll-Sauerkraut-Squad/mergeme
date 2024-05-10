import axios from 'axios';

//const opensky_username = process.env.OPENSKY_USERNAME;
//const opensky_password = process.env.OPENSKY_PASSWORD;
const opensky_username = "FAH";
const opensky_password = "TL]M2{C632Z+";

export const fetchOpenSkyData = async () => {
    const flights_api_url = 'https://opensky-network.org/api/states/all?lamin=47.2701&lomin=5.8663&lamax=55.0583&lomax=15.0419';
    const auth = btoa(`${opensky_username}:${opensky_password}`);
    try {
        const response = await axios.get(flights_api_url, {
            headers: { Authorization: `Basic ${auth}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching data from OpenSky:', error);
        throw error;
    }
};