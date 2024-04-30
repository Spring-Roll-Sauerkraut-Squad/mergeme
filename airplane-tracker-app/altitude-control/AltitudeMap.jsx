import "./AltitudeMap.css";
import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const AltitudeMap = ({ airports }) => {
  useEffect(() => {
    const map = L.map('altitude-map').setView([49.4, 8.7], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    //Red Marker for Airports
    const airportMarker = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    //Add Markers
    airports.forEach(airport => {
      L.marker([airport.location[0].latitude, airport.location[0].longitude], { icon: airportMarker })
        .addTo(map)
        .bindPopup(`${airport.name}`);
    });

    return () => {
      map.remove();
    };
  }, [airports]);

  return <div id="altitude-map"></div>;
};

export default AltitudeMap;