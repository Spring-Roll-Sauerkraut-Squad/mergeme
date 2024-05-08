import "./EmergencyLanding.css";
import React, { useState, useEffect } from "react";
import MarkerMap from "./components/MarkerMap.jsx";
import FetchAirportsData from "../../airplane-tracker-server/scripts/fetch-airport-data.js"

const EmergencyLanding = () => {
    const [airports, setAirports] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await FetchAirportsData();
                setAirports(data);
                //console.log(data); //Log MongoDB Fetch Data
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="emergencylanding-window">
            <div className="info-description" >
                <h2> Emergency Landing System </h2>
            </div >
            <div className="emergencylanding-content">
                <div className="airports-map">
                    <h1> | Airports Location | </h1>
                    <MarkerMap airports={airports} />
                </div>
            </div>
        </div >
    );
}
export default EmergencyLanding;