import React, { useState, useEffect } from 'react';
import { FetchFlights } from './FetchFlights'; 

function FlightsDisplay() {
    const [flights, setFlights] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const data = await FetchFlights();
            setFlights(data);
            setIsLoading(false);
        };
        fetchData();
    }, []);

    if (isLoading) return <div>Loading flights data...</div>;
    if (!flights.length) return <div>No flight data available.</div>;

    return (
        <div>
            <h1>Flight Data</h1>
            <div>
                {flights.map((flight, index) => (
                    <div key={index}>
                        <p>Callsign: {flight.callsign}</p>
                        <p>Origin Country: {flight.originCountry}</p>
                        <p>Coordinates: {flight.latitude}, {flight.longitude}</p>
                        {/* Display other data as needed */}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default FlightsDisplay;
