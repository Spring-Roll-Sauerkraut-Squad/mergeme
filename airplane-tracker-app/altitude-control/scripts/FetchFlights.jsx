import axios from 'axios';

export async function FetchFlights() {
    try {
        const response = await axios.get('/api/flights');
        const rawData = response.data;
        const filteredData = rawData.states.map(state => ({
            icao24: state[0],
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