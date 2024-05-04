import axios from 'axios';

const FetchFlights = async () => {
    try {
        const response = await axios.get('http://localhost:3000/api/flights');
        const rawData = response.data;

        if (!rawData.states) {
            console.error('No states data available');
            return [];
        }

        return rawData.states.map(state => ({
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
    } catch (error) {
        console.error('Error fetching flights:', error);
        return [];
    }
};

export default FetchFlights;