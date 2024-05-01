import "./AltitudeControl.css";
import React, { useState, useEffect } from "react";
import FlightsDisplay from "./components/FlightsDisplay.jsx";
import AltitudeMap from "./components/AltitudeMap.jsx";
import Filter from "./components/Filter.jsx";
import Warning from "./components/Warning.jsx";

import { FetchAirports } from "./scripts/FetchAirports.jsx";
import { FetchFlights } from "./scripts/FetchFlights.jsx";

const AltitudeControl = () => {
    const [airports, setAirports] = useState([]);
    const [warning, setWarning] = useState(null);
    const [selectedFilter, setSelectedFilter] = useState('');

    useEffect(() => {
        FetchAirports().then(data => {
            setAirports(data);
            setWarning(null);
        }).catch(error => {
            console.error('Failed to fetch airports:', error);
            setWarning('test error');
            setAirports([]);
        })
    }, []);

    const handleTestWarning = () => {
        setWarning('Location: xx, xx || Altitude: xx');
    };

    const handleCloseWarning = () => {
        setWarning(null);
    };

    return (
        <div className="altitude-window">
            <div className="info-description" >
                <h2> Welcome to the Altitude Supervision! </h2>
                <button onClick={handleTestWarning} style={{ margin: "10px", padding: "10px" }}>Test Warning</button>
            </div >
            <div className="altitude-content">
                <div className="flight-details">
                    <h1> Active Flights: </h1>
                    <Filter setSelectedFilter={setSelectedFilter} />
                    <FlightsDisplay selectedFilter={selectedFilter} />
                </div>
                <div className="flight-map">
                    <h1> | Live Map Data | </h1>
                    <AltitudeMap airports={airports} />
                </div>
            </div>
            {warning && <Warning message={warning} onClose={handleCloseWarning} />}
        </div >
    );
}

export default AltitudeControl;