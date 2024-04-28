import React from 'react';
import Map from './Map';
import '../airplane-collision/CollisionData.css';

const CollisionData = () => {
  
  const airplane1 = {
    name: 'Plane 1',
    altitude: 30000,
    path: [
      { latitude: 40.7128, longitude: -74.0060 }, 
      { latitude: 51.5074, longitude: -0.1278 }, 
      { latitude: 35.6895, longitude: 139.6917 }, 
    ],
  };

  const airplane2 = {
    name: 'Plane 2',
    altitude: 35000,
    path: [
      { latitude: 48.8566, longitude: 2.3522 }, 
      { latitude: 40.7128, longitude: -74.0060 }, 
      { latitude: 34.0522, longitude: -118.2437 }, 
    ],
  };

  return (
    <div className="container">
      <Map airplanes={[airplane1, airplane2]} />
      <div className="flight-data">
        <h2>Flight Data</h2>
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
            {airplane1.path.map((coordinate, index) => (
              <tr key={`plane1-coordinate-${index}`}>
                <td>{index === 0 ? airplane1.name : ''}</td>
                <td>{index === 0 ? `${airplane1.altitude} feet` : ''}</td>
                <td>{coordinate.latitude}</td>
                <td>{coordinate.longitude}</td>
              </tr>
            ))}
            {airplane2.path.map((coordinate, index) => (
              <tr key={`plane2-coordinate-${index}`}>
                <td>{index === 0 ? airplane2.name : ''}</td>
                <td>{index === 0 ? `${airplane2.altitude} feet` : ''}</td>
                <td>{coordinate.latitude}</td>
                <td>{coordinate.longitude}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CollisionData;
