import "./AltitudeControl.css";
import React, { useState, useEffect } from "react";
import FlightsDisplay from "./components/FlightsDisplay.jsx";
import Filter from "./components/Filter.jsx";
import Warning from "./components/Warning.jsx";
import LiveMap from "./components/LiveMap.jsx";
import AltitudeMap from "./components/AltitudeMap.jsx";
import FetchAirspaces from "./scripts/FetchAirspaces.jsx";
import FetchAirports from "./scripts/FetchAirports.jsx";
import FetchFlights from "./scripts/FetchFlights.jsx";
import CheckAltitudes from "./scripts/CheckAltitudes.jsx";

const AltitudeControl = () => {
    const [airports, setAirports] = useState([]);
    const [airspaces, setAirspaces] = useState([]);
    const [flights, setFlights] = useState([]);
    const [filteredFlights, setFilteredFlights] = useState([]);
    const [warnings, setWarnings] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState('');
    const [activeTab, setActiveTab] = useState('live-map');

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        setFilteredFlights(applyFlightFilter(flights, selectedFilter));
    }, [flights, selectedFilter]);

    const fetchInitialData = () => {
        fetchAirports();
        fetchAirspaces();
        fetchAndFilterFlights();
    };

    const fetchAirports = () => {
        FetchAirports()
            .then(setAirports)
            .catch(() => {
                console.error('Failed to fetch airport data');
                setAirports([]);
            });
    };

    const fetchAirspaces = () => {
        FetchAirspaces()
            .then(setAirspaces)
            .catch(() => {
                console.error('Failed to fetch airspace data');
            });
    };

    const fetchAndFilterFlights = () => {
        FetchFlights()
            .then(data => {
                setFlights(data);
                const filtered = applyFlightFilter(data, selectedFilter);
                setFilteredFlights(filtered);
                console.log(airspaces);
                const newWarnings = CheckAltitudes(filtered, airspaces);
                setWarnings(newWarnings);
            })
            .catch(() => {
                console.error('Failed to fetch flight data');
            });
    };

    const applyFlightFilter = (flights, filter) => {
        switch (filter) {
            case '> 300 ft':
                return flights.filter(flight => parseFloat(flight.altitude) > 300);
            case '300 ft - 150 ft':
                return flights.filter(flight => parseFloat(flight.altitude) <= 300 && parseFloat(flight.altitude) >= 150);
            case '< 150 ft':
                return flights.filter(flight => parseFloat(flight.altitude) < 150);
            default:
                return flights;
        }
    };

    //const handleTestWarning = () => setWarning('Location: xx, xx || Altitude: xx');
    //const handleCloseWarning = () => setWarning(null);

    return (
        <div className="altitude-window">
            <div className="info-description">
                <h2>Welcome to the Altitude Supervision!</h2>
                <button className="warning-test-button" onClick={() => console.log(warnings)}>Test Warning Message</button>
            </div>
            <div className="altitude-content">
                <div className="details">
                    <h1>Active Flights:</h1>
                    <button className="refresh-button" onClick={fetchAndFilterFlights}>Refresh Flights and Map</button>
                    <Filter setSelectedFilter={setSelectedFilter} />
                    <FlightsDisplay flights={filteredFlights} />
                    {warnings?.map((message, index) => (
                        <Warning warnings={message} key={index} onClose={() => setWarnings([])} />
                    ))}
                </div>
                <div className="details">
                    <div className="tab-content">
                        {activeTab === 'live-map' && <div><h1 className="map-title">Live Data Map</h1><LiveMap airports={airports} airspaces={airspaces} flights={filteredFlights} /></div>}
                        {activeTab === 'altitude-map' && <div><h1 className="map-title">Airspace Visualization Map</h1><AltitudeMap /></div>}
                        {activeTab === 'test-map' && <div> <h1 className="map-title">Test Map Data</h1><LiveMap airports={''} airspaces={''} /></div>}
                    </div>
                    <div className="tab-selector">
                        <button id="tab-button" style={{ borderRight: 'none' }} onClick={() => setActiveTab('live-map')} className={activeTab === 'live-map' ? 'active' : ''}>Live Map</button>
                        <button id="tab-button" onClick={() => setActiveTab('altitude-map')} className={activeTab === 'altitude-map' ? 'active' : ''}>Airspace Map</button>
                        <button id="tab-button" style={{ borderLeft: 'none' }} onClick={() => setActiveTab('test-map')} className={activeTab === 'test-map' ? 'active' : ''}>Test Map</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AltitudeControl;