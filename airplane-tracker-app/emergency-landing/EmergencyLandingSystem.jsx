//import "./EmergencyLandingSystem.css";
import React, { useState, useEffect } from "react";
import FlightsDisplay from "./components/FlightsDisplay.jsx";
import AltitudeMap from "./components/AltitudeMap.jsx";
import FetchEmergencyAirports from "./db-connection/FetchEmergencyAirports.jsx"

const EmergencyLandingSystem = () => {
    const [airports, setAirports] = useState([]);

    useEffect(() => {
        FetchEmergencyAirports().then(data => {
            setAirports(data);
        })
    }, []);

    return (
        <div className="altitude-window">
            <div className="info-description" >
                <h2> Emergency Landing System </h2>
            </div >
            <div className="altitude-content">
                <div className="flight-details">
                    <h1> Active Flights: </h1>
                    <FlightsDisplay />
                </div>
                <div className="flight-map">
                    <h1> | Live Map Data | </h1>
                    <AltitudeMap airports={airports} />
                </div>
            </div>
        </div >
    );
}

export default EmergencyLandingSystem;