import axios from 'axios';

const FetchAirspaces = async () => {
    try {
        const response = await axios.get('http://localhost:5000/api/airspaces');
        return response.data;
    } catch (error) {
        console.error('Error fetching airspaces:', error);
        return [];
    }
};

export default FetchAirspaces;