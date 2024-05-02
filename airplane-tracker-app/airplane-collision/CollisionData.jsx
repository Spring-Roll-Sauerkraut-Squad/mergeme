import React, { useEffect, useState } from 'react';
import '../airplane-collision/CollisionData.css';
import fetchWaypoints from '../../airplane-tracker-server/scripts/collision-data/fetch-collision-data.js';
import Map from './Map'; 

const CollisionData = () => {
  const [airplanes, setAirplanes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchWaypoints();
        setAirplanes(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="container">
      <Map airplanes={airplanes} />
      <div className="flight-data">
        <h2>Flight Data</h2>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Flight</th>
                <th>Altitude</th>
                <th>Latitude</th>
                <th>Longitude</th>
              </tr>
            </thead>
            <tbody>
              {airplanes.map((airplane, index) => (
                <tr key={index}>
                  <td>{airplane.flight.callsign}</td>
                  <td className="scrollable-list">
                    <ul>
                      {airplane.waypoints.path.map((waypoint, idx) => (
                        <li key={idx}>{waypoint.altitude}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="scrollable-list">
                    <ul>
                      {airplane.waypoints.path.map((waypoint, idx) => (
                        <li key={idx}>{waypoint.latitude}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="scrollable-list">
                    <ul>
                      {airplane.waypoints.path.map((waypoint, idx) => (
                        <li key={idx}>{waypoint.longitude}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CollisionData;
