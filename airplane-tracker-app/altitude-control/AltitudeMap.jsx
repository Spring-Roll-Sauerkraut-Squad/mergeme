import "./AltitudeMap.css";
import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const AltitudeMap = () => {
  useEffect(() => {
    const map = L.map('map').setView([49.4, 8.7], 5);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    return () => {
      map.remove();
    };
  }, []); 

  return <div id="map"></div>; 
};

export default AltitudeMap;