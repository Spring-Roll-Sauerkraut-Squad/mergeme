import axios from 'axios';

const FetchAirports = async () => {
    try {
        const response = await axios.get('http://localhost:3000/api/airports');
        return response.data;
    } catch (error) {
        console.error('Error fetching airports:', error);
        return [];
    }
};

export default FetchAirports;