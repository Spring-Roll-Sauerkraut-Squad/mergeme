import "./AltitudeControl.css";
import React from "react";
import Map from "../airplane-collision/Map.jsx";

const AltitudeControl = () => {
    return (
        <div className="text-area">
            <div>
                <h1>Altitude Control</h1>
            </div>
            <div>
                <Map />
            </div>
        </div>
    );
}

export default AltitudeControl;