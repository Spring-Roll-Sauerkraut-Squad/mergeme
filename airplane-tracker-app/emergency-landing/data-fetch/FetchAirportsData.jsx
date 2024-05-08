import axios from 'axios';

const FetchAirports = () => {
    return axios.get('http://localhost:4000/api/airports')
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching airports:', error);
            return [];
        });
}

export default FetchAirports;