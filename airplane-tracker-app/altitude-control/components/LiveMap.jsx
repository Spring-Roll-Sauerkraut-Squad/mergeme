import "./LiveMap.css";
import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const LiveMap = ({ airports, airspaces }) => {
  useEffect(() => {
    const map = L.map('live-map').setView([49.4, 8.7], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    //Red Marker - Airports
    const airportMarker = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    airports.forEach(airport => {
      L.marker([airport.latitude_deg, airport.longitude_deg], { icon: airportMarker })
        .addTo(map)
        .bindPopup(`${airport.name}`);
    });

    //Blue Layers - Airspaces
    if (airspaces) {
      const airspaceLayer = L.geoJSON(airspaces, {
        style: () => ({
          color: '#0000ff',
          fillOpacity: 0.1,
          weight: 2
        }),
        onEachFeature: (feature, layer) => {
          const props = feature.properties;
          layer.bindPopup(`Name: ${props.name}<br/>Floor: ${props.FLOOR}<br/>Ceiling: ${props.CEILING}`);
        }
      }).addTo(map);
    }

    return () => {
      map.remove();
    };
  }, [airports, airspaces]);

  return <div id="live-map"></div>;
};

export default LiveMap;