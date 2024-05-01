import axios from 'axios';

export async function FetchAirports() {
    try {
        const response = await axios.get('http://localhost:4000/api/airports');
        return response.data;
    } catch (error) {
        console.error('Error fetching airports:', error);
        return [];
    }
}