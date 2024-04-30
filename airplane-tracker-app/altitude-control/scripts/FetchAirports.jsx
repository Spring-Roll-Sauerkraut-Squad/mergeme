import * as axios from 'axios';

const FetchAirports = () => {
    axios.get('http://localhost:3000/api/airports')
        .then(response => {
            console.log('Airports:', response.data);
        })
        .catch(error => {
            console.error('Error fetching airports:', error);
        });
}

export default FetchAirports;