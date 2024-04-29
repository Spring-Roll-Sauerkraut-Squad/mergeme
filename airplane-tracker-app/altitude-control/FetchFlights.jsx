import axios from 'axios';
import { URL } from './constants';

//const fs = require('fs');

export async function FetchFlights() {
    const url = 'https://opensky-network.org/api/states/all';
    try {
        const response = await axios.get(url);
        const rawData = response.data;
        const filteredData = rawData.states.map(state => ({
            ica024: state[0],
            callsign: state[1].trim(),
            originCountry: state[2],
            longitude: state[5],
            latitude: state[6],
            altitude: state[7],
            onGround: state[8],
            velocity: state[9],
            heading: state[10],
            verticalRate: state[11],
            squawk: state[13],
            spi: state[14],
            positionSource: state[15]
        }));
        return filteredData;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

/*
async function saveDataToFile() {
    const data = await fetchData();
    if (data) {
        fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
        console.log('Data saved to data. json');
    }
}

saveDataToFile();
*/