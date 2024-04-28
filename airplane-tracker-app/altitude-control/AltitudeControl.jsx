import "./AltitudeControl.css";
import React from "react";
import Map from "../airplane-collision/Map.jsx";
import PlaceholderMap from "../placeholder/PlacerholderMap.jsx";

const AltitudeControl = () => {
    return (
        <div className="altitude-content">
            <div className="description" >
                <h2> Click on an airplane to get more information! </h2>
            </div >
            <div className="test">
                <div className="altitude-details">
                    <h1>Altitude Control</h1>
                </div>
                <div className="altitude-map">
                    <PlaceholderMap />
                </div>
            </div>
        </div >
    );
}

export default AltitudeControl;