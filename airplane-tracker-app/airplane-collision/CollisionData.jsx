import React from 'react';
import Map from './Map';
import '../airplane-collision/CollisionData.css'; 

const CollisionData = () => {
  return (
    <div className="container">
      <Map />
      <div className="flight-data">
        <h2>Flight Data</h2>
        <table>
          <thead>
            <tr>
              <th>Attribute</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Altitude</td>
              <td>...</td> 
            </tr>
            <tr>
              <td>Latitude</td>
              <td>...</td> 
            </tr>
            <tr>
              <td>Longitude</td>
              <td>...</td> 
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CollisionData;
