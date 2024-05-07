import './AltitudeControl.css';
import React, { useState, useEffect } from 'react';

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
    const [showWarnings, setShowWarnings] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('');
    const [activeTab, setActiveTab] = useState('live-map');
    const [currentCallSign, setCurrentCallSign] = useState('');
    const [mapCenter, setMapCenter] = useState(null);

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        setFilteredFlights(applyFlightFilter(flights, selectedFilter));
    }, [flights, selectedFilter]);

    useEffect(() => {
        setCurrentCallSign('');
    }, []);

    useEffect(() => {
        if (currentCallSign && filteredFlights.length > 0) {
            const selectedFlight = filteredFlights.find(flight => flight.callsign === currentCallSign);
            if (selectedFlight) {
                setMapCenter({ longitude: selectedFlight.longitude, latitude: selectedFlight.latitude });
            }
        }
    }, [currentCallSign, filteredFlights]);

    const fetchInitialData = async () => {
        await fetchAirports();
        await fetchAndFilterFlights();
    };

    const fetchAirports = async () => {
        try {
            const airportsData = await FetchAirports();
            setAirports(airportsData);
        } catch (error) {
            console.error('Failed to fetch airport data');
            setAirports([]);
        }
    };

    const fetchAndFilterFlights = async () => {
        try {
            const [airspacesData, flightsData] = await Promise.all([FetchAirspaces(), FetchFlights()]);
            setAirspaces(airspacesData);
            setFlights(flightsData);

            const filtered = applyFlightFilter(flightsData, selectedFilter);
            setFilteredFlights(filtered);

            const activeWarnings = CheckAltitudes(filtered, airspacesData);
            setWarnings(activeWarnings);
            setShowWarnings(true);
        } catch (error) {
            console.error('Failed to fetch flights or airspaces:', error);
            setAirspaces([]);
            setFlights([]);
            setWarnings([]);
            setShowWarnings(false);
        }
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

    return (
        <div className="altitude-window">
            <div className="info-description">
                <h2 className="altitude-title">Welcome to the Altitude Supervision!</h2>
            </div>
            <div className="altitude-content">
                <div className="details">
                    <h1>Active Flights:</h1>
                    <button className="refresh-button" onClick={fetchAndFilterFlights}>Refresh Flights and Map & Show Warnings</button>
                    <Filter setSelectedFilter={setSelectedFilter} />
                    <FlightsDisplay flights={filteredFlights} />
                    {warnings && warnings.length > 0 && showWarnings && (
                        <Warning warnings={warnings} onClose={() => { setWarnings([]); setShowWarnings(false); }} onCallSignExtracted={setCurrentCallSign} />
                    )}
                </div>
                <div className="details">
                    <div className="tab-content">
                        {activeTab === 'live-map' && <div><h1 className="map-title">Live Data Map</h1><LiveMap airports={airports} airspaces={airspaces} flights={filteredFlights} center={mapCenter} /></div>}
                        {activeTab === 'altitude-map' && <div><h1 className="map-title">Airspace Visualization Map</h1><AltitudeMap /></div>}
                    </div>
                    <div className="tab-selector">
                        <button id="tab-button" style={{ borderRight: 'none' }} onClick={() => setActiveTab('live-map')} className={activeTab === 'live-map' ? 'active' : ''}>Live Map</button>
                        <button id="tab-button" onClick={() => setActiveTab('altitude-map')} className={activeTab === 'altitude-map' ? 'active' : ''}>Airspace Map</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AltitudeControl;