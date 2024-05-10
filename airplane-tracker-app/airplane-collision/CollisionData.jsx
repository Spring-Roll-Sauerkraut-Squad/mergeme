import React, { useEffect, useState } from 'react';
import '../airplane-collision/CollisionData.css';
import fetchWaypoints from '../../airplane-tracker-server/scripts/fetch-waypoint-data.js';
import Map from './MapCollision.jsx'; 

const CollisionData = () => {
  const [airplanes, setAirplanes] = useState([]);
  const [selectedFlight1, setSelectedFlight1] = useState('');
  const [selectedFlight2, setSelectedFlight2] = useState('');
  const [selectedWaypointIndex1, setSelectedWaypointIndex1] = useState(0);
  const [selectedWaypointIndex2, setSelectedWaypointIndex2] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchWaypoints();
        setAirplanes(data);
        if (data.length > 0) {
          setSelectedFlight1(data[0]?.flight.callsign || '');
          setSelectedFlight2(data[1]?.flight.callsign || '');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const onWaypointClick = (flight, waypointIndex) => {
    if (flight === selectedFlight1) {
      setSelectedWaypointIndex1(waypointIndex);
    } else if (flight === selectedFlight2) {
      setSelectedWaypointIndex2(waypointIndex);
    }
  };


  const handleWaypointChange = (flightNumber, increment) => {
    const setWaypointIndex = flightNumber === 1 ? setSelectedWaypointIndex1 : setSelectedWaypointIndex2;
    setWaypointIndex(prevIndex => Math.max(0, Math.min(prevIndex + increment, 
      airplanes.find(airplane => airplane.flight.callsign === 
        (flightNumber === 1 ? selectedFlight1 : selectedFlight2))?.waypoints.path.length - 1)));
  };

  const handleFlightChange = (event, flightNumber) => {
    const selectedFlight = event.target.value;
    if (flightNumber === 1) {
      setSelectedFlight1(selectedFlight);
      setSelectedWaypointIndex1(0); 
    } else if (flightNumber === 2) {
      setSelectedFlight2(selectedFlight);
      setSelectedWaypointIndex2(0); 
    }
  };

  const renderFlightTable = (selectedFlight, selectedAirplane, selectedWaypointIndex, flightNumber) => (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Flight</th>
            <th>Path : Waypoint {selectedWaypointIndex + 1}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <select value={selectedFlight} onChange={(event) => handleFlightChange(event, flightNumber)}>
                {airplanes.map(({ flight: { callsign } }, index) => (
                  <option key={index} value={callsign}>{callsign}</option>
                ))}
              </select>
            </td>
            <td>
              <div className="waypoint-list">
                {selectedAirplane && selectedAirplane.waypoints && selectedAirplane.waypoints.path[selectedWaypointIndex] && (
                  <div className="waypoint">
                    <p><strong>Timestamp:</strong> {selectedAirplane.waypoints.path[selectedWaypointIndex].timestamp}</p>
                    <p><strong>Altitude:</strong> {selectedAirplane.waypoints.path[selectedWaypointIndex].altitude}</p>
                    <p><strong>Longitude:</strong> {selectedAirplane.waypoints.path[selectedWaypointIndex].longitude}</p>
                    <p><strong>Latitude:</strong> {selectedAirplane.waypoints.path[selectedWaypointIndex].latitude}</p>
                    <p><strong>Velocity:</strong> {selectedAirplane.waypoints.path[selectedWaypointIndex].velocity}</p>
                    <div className="button-group">
                      <button onClick={() => handleWaypointChange(flightNumber, 1)} disabled={selectedWaypointIndex === selectedAirplane.waypoints.path.length - 1}>Next</button>
                      <button onClick={() => handleWaypointChange(flightNumber, -1)} disabled={selectedWaypointIndex === 0}>Previous</button>
                    </div>
                  </div>
                )}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="container">
      <Map
        airplanes={airplanes}
        selectedFlight1={selectedFlight1}
        selectedFlight2={selectedFlight2}
        selectedWaypointIndex1={selectedWaypointIndex1}
        selectedWaypointIndex2={selectedWaypointIndex2}
        onWaypointClick={onWaypointClick}
      />
      <div className="flight-data">
        <h2>Flight Data</h2>
        {renderFlightTable(selectedFlight1, airplanes.find(({ flight }) => flight.callsign === selectedFlight1), selectedWaypointIndex1, 1)}
        {renderFlightTable(selectedFlight2, airplanes.find(({ flight }) => flight.callsign === selectedFlight2), selectedWaypointIndex2, 2)}
      </div>
    </div>
  );
};

export default CollisionData;
