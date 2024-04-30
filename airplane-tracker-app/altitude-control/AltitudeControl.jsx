import "./AltitudeControl.css";
import React, { useState, useEffect } from "react";
import PlaceholderMap from "../placeholder/PlacerholderMap.jsx";
import FlightsDisplay from "./FlightsDisplay.jsx";
import AltitudeMap from "./AltitudeMap.jsx";
import Filter from "./Filter.jsx";

const AltitudeControl = () => {
   
    const airport1 = {
        name: 'Flughafen München',
        location: [
            { latitude: 48.35389, longitude: 11.78611 }
        ],
    };

    const airport2 = {
        name: 'Flughafen Frankfurt Main',
        location: [
            { latitude: 50.03333, longitude: 8.57056 }
        ],
    };

    return (
        <div className="altitude-window">
            <div className="info-description" >
                <h2> Welcome to the Altitude Supervision! </h2>
            </div >
            <div className="altitude-content">
                <div className="flight-details">
                    <h1> Active Flights: </h1>
                    <Filter />
                    <FlightsDisplay />
                </div>
                <div className="flight-map">
                    <h1> | Live Map Data | </h1>
                    <AltitudeMap airports={[airport1, airport2]} />
                </div>
            </div>
        </div >
    );
}

export default AltitudeControl;