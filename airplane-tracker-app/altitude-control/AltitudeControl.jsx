import "./AltitudeControl.css";
import React, { useState, useEffect } from "react";
import PlaceholderMap from "../placeholder/PlacerholderMap.jsx";
import FlightsDisplay from "./FlightsDisplay.jsx";
import AltitudeMap from "./AltitudeMap.jsx";
import Filter from "./Filter.jsx";

const AltitudeControl = () => {
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
                    <AltitudeMap />
                </div>
            </div>
        </div >
    );
}

export default AltitudeControl;