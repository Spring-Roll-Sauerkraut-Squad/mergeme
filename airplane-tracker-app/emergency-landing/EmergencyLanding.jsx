import "./EmergencyLanding.css";
import React, { useState, useEffect } from "react";
import AirportsMap from "./components/MarkerMap.jsx";
import FetchAirportsData from "./data-fetch/FetchAirportsData.jsx";

const EmergencyLanding = () => {
    const [airports, setAirports] = useState([]);

    useEffect(() => {
        FetchAirportsData().then(data => {
            setAirports(data);
        })
    }, []);

    return (
        <div className="emergencylanding-window">
            <div className="info-description" >
                <h2> Emergency Landing System </h2>
            </div >
            <div className="emergencylanding-content">
                <div className="airports-map">
                    <h1> | Airports Location | </h1>
                    <AirportsMap airports={airports} />
                </div>
            </div>
        </div >
    );
}
export default EmergencyLanding;