import "./FlightsDisplay.css"
import React, { useState, useEffect } from 'react';
import { FetchFlights } from "../scripts/FetchFlights";

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
        <div className="flight-data-container">
            <h1 className="flight-data-header">All Fetched Flight Data: </h1>
            {flights.map((flight, index) => (
                <div key={index} className="flight-data-entry">
                    <p>ICAO24: {flight.icao24}</p>
                    <p>Callsign: {flight.callsign}</p>
                    <p>Origin Country: {flight.originCountry}</p>
                    <p>Coordinates: {flight.latitude}, {flight.longitude}</p>
                    <p>Altitude: {flight.altitude}</p>
                    <p>On Ground: {flight.onGround ? 'Yes' : 'No'}</p>
                    <p>Velocity: {flight.velocity}</p>
                    <p>Heading: {flight.heading}</p>
                    <p>Vertical Rate: {flight.verticalRate}</p>
                    <p>Squawk: {flight.squawk}</p>
                    <p>SPI: {flight.spi}</p>
                    <p>Position Source: {flight.positionSource}</p>
                </div>
            ))}
        </div>
    );
}

export default FlightsDisplay;