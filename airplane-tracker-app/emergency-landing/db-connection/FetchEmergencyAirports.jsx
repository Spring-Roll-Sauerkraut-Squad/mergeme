import axios from 'axios';

const FetchEmergencyAirports = () => {
    return axios.get('http://localhost:3000/api/airports')
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching emergency airports:', error);
            return [];
        });
}

export default FetchEmergencyAirports;