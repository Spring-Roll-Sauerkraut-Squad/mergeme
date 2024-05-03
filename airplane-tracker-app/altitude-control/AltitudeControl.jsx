import "./AltitudeControl.css";
import React, { useState, useEffect } from "react";
import FlightsDisplay from "./components/FlightsDisplay.jsx";

import Filter from "./components/Filter.jsx";
import Warning from "./components/Warning.jsx";

import LiveMap from "./components/LiveMap.jsx";
import AltitudeMap from "./components/AltitudeMap.jsx";

import FetchAirspaces from "./scripts/FetchAirspaces.jsx";
import { FetchAirports } from "./scripts/FetchAirports.jsx";
import { FetchFlights } from "./scripts/FetchFlights.jsx";


const AltitudeControl = () => {
    const [airports, setAirports] = useState([]);
    const [airspaces, setAirspaces] = useState(null);

    const [warning, setWarning] = useState(null);
    const [selectedFilter, setSelectedFilter] = useState('');

    const [activeTab, setActiveTab] = useState('live-map');

    /*
    const airspaceData = {
        type: "Feature",
        properties: {
            name: "TMA MÜNCHEN A 131.225",
            fillOpacity: 0,
            strokeOpacity: 1,
            stroke: "#ff0000",
            CLASS: "C",
            FLOOR: "3500msl",
            CEILING: "FL 100"
        },
        geometry: {
            type: "Polygon",
            "coordinates": [
                [
                    [
                        11.146111,
                        48.430556
                    ],
                    [
                        12.382778,
                        48.527222
                    ],
                    [
                        12.387222,
                        48.520278
                    ],
                    [
                        12.391389,
                        48.513333
                    ],
                    [
                        12.395556,
                        48.506111
                    ],
                    [
                        12.399444,
                        48.499167
                    ],
                    [
                        12.403056,
                        48.491944
                    ],
                    [
                        12.406389,
                        48.484722
                    ],
                    [
                        12.409722,
                        48.4775
                    ],
                    [
                        12.412778,
                        48.470278
                    ],
                    [
                        12.415833,
                        48.463056
                    ],
                    [
                        12.418611,
                        48.455833
                    ],
                    [
                        12.421111,
                        48.448333
                    ],
                    [
                        12.423333,
                        48.441111
                    ],
                    [
                        12.425556,
                        48.433611
                    ],
                    [
                        12.4275,
                        48.426111
                    ],
                    [
                        12.429167,
                        48.418611
                    ],
                    [
                        12.430556,
                        48.411111
                    ],
                    [
                        12.431944,
                        48.403889
                    ],
                    [
                        12.433056,
                        48.396389
                    ],
                    [
                        12.434167,
                        48.388611
                    ],
                    [
                        12.435,
                        48.381111
                    ],
                    [
                        12.435556,
                        48.373611
                    ],
                    [
                        12.435833,
                        48.366111
                    ],
                    [
                        12.435833,
                        48.358611
                    ],
                    [
                        12.435833,
                        48.351111
                    ],
                    [
                        12.435556,
                        48.343611
                    ],
                    [
                        12.435278,
                        48.336111
                    ],
                    [
                        12.434722,
                        48.328611
                    ],
                    [
                        12.433889,
                        48.321111
                    ],
                    [
                        12.432778,
                        48.313611
                    ],
                    [
                        12.431389,
                        48.306111
                    ],
                    [
                        12.43,
                        48.298611
                    ],
                    [
                        12.428611,
                        48.291111
                    ],
                    [
                        12.424722,
                        48.276389
                    ],
                    [
                        11.191944,
                        48.18
                    ],
                    [
                        11.1875,
                        48.186944
                    ],
                    [
                        11.183056,
                        48.193889
                    ],
                    [
                        11.178889,
                        48.200833
                    ],
                    [
                        11.175,
                        48.208056
                    ],
                    [
                        11.171389,
                        48.215
                    ],
                    [
                        11.167778,
                        48.222222
                    ],
                    [
                        11.164444,
                        48.229444
                    ],
                    [
                        11.161111,
                        48.236667
                    ],
                    [
                        11.158056,
                        48.243889
                    ],
                    [
                        11.155278,
                        48.251111
                    ],
                    [
                        11.152778,
                        48.258611
                    ],
                    [
                        11.150278,
                        48.265833
                    ],
                    [
                        11.148056,
                        48.273333
                    ],
                    [
                        11.145833,
                        48.280833
                    ],
                    [
                        11.144167,
                        48.288056
                    ],
                    [
                        11.1425,
                        48.295556
                    ],
                    [
                        11.140833,
                        48.303056
                    ],
                    [
                        11.139722,
                        48.310556
                    ],
                    [
                        11.138611,
                        48.318056
                    ],
                    [
                        11.137778,
                        48.325556
                    ],
                    [
                        11.136944,
                        48.333056
                    ],
                    [
                        11.136667,
                        48.340556
                    ],
                    [
                        11.136389,
                        48.348333
                    ],
                    [
                        11.136111,
                        48.355833
                    ],
                    [
                        11.136389,
                        48.363333
                    ],
                    [
                        11.136667,
                        48.370833
                    ],
                    [
                        11.137222,
                        48.378333
                    ],
                    [
                        11.137778,
                        48.385833
                    ],
                    [
                        11.138611,
                        48.393333
                    ],
                    [
                        11.139722,
                        48.400833
                    ],
                    [
                        11.141111,
                        48.408333
                    ],
                    [
                        11.1425,
                        48.415833
                    ],
                    [
                        11.146111,
                        48.430556
                    ]
                ]
            ]
        },
        id: "Y3NDE"
    };

    */

    useEffect(() => {
        FetchAirports()
            .then(data => {
                setAirports(data);
            })
            .catch(error => {
                console.error('Failed to fetch airports:', error);
                setAirports([]);
            });

        FetchAirspaces()
            .then(data => {
                setAirspaces(data);
            })
            .catch(error => {
                console.error('Failed to fetch airspace data:', error);
            });
    }, []);

    //Testing Only
    const handleTestWarning = () => {
        setWarning('Location: xx, xx || Altitude: xx');
    };

    const handleCloseWarning = () => {
        setWarning(null);
    };
    //

    return (
        <div className="altitude-window">
            <div className="info-description" >
                <h2> Welcome to the Altitude Supervision! </h2>
                <button className="warning-test-button" onClick={handleTestWarning}>Test Warning Message</button>
            </div >
            <div className="altitude-content">
                <div className="details">
                    <h1> Active Flights: </h1>
                    <Filter setSelectedFilter={setSelectedFilter} />
                    <FlightsDisplay selectedFilter={selectedFilter} />
                </div>
                <div className="details">

                    <div className="tab-content">
                        {activeTab === 'live-map' &&
                            <div>
                                <h1 className="map-title"> Live Data Map </h1>
                                <LiveMap airports={airports} airspaces={airspaces} />
                            </div>
                        }
                        {activeTab === 'altitude-map' &&
                            <div>
                                <h1 className="map-title"> Altitude Visualization Map </h1>
                                <AltitudeMap />
                            </div>
                        }
                        {activeTab === 'test-map' &&
                            <div>
                                <h1 className="map-title"> Test Map Data </h1>
                                <LiveMap airports={''} airspaces={''} />
                            </div>
                        }
                    </div>
                    <div className="tab-selector">
                        <button id="tab-button" style={{ borderRight: 'none' }} onClick={() => setActiveTab('live-map')} className={activeTab === 'live-map' ? 'active' : ''}>Live Map</button>
                        <button id="tab-button" onClick={() => setActiveTab('altitude-map')} className={activeTab === 'altitude-map' ? 'active' : ''}>Altitude Map</button>
                        <button id="tab-button" style={{ borderLeft: 'none' }} onClick={() => setActiveTab('test-map')} className={activeTab === 'test-map' ? 'active' : ''}>Test Map</button>
                    </div>
                </div >
            </div>
            {warning && <Warning message={warning} onClose={handleCloseWarning} />}
        </div >
    );
}

export default AltitudeControl;