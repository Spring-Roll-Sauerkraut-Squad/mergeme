import axios from 'axios';

export async function FetchAPIFlights() {
    console.log('recieved api flight data');
    //const username = process.env.USERNAME_API;
    //const password = process.env.PASSWORD_API;
    const username = "FAH";
    const password = "TL]M2{C632Z+";
    const basicAuth = 'Basic ' + btoa(username + ':' + password);
    const url = "https://opensky-network.org/api/states/own";
    
    try {
        const response = await axios.get(url, {
            headers: { Authorization: basicAuth }
        });
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
        console.error('Error recieving data:', error);
        return [];
    }
}