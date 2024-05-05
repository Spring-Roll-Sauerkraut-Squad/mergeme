import "./LiveMap.css";
import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import planeIcon from "../plane1.svg";

const LiveMap = ({ airports, airspaces, flights }) => {
  useEffect(() => {
    const map = L.map('live-map').setView([49.4, 8.7], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 12,
    }).addTo(map);

    //Red Marker - Static Airports
    const airportMarker = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    //Add Airport Marker to map
    airports.forEach(airport => {
      L.marker([airport.latitude_deg, airport.longitude_deg], { icon: airportMarker })
        .addTo(map)
        .bindPopup(`${airport.name}`);
    });

    //Flight Marker - Active Flights
    const flightIcon = L.icon({
      iconUrl: planeIcon,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });

    //Add Flight Marker to map
    let flightMarkers = [];
    flights.forEach(flight => {
      const marker = L.marker([flight.latitude, flight.longitude], { icon: flightIcon })
        .addTo(map)
        .bindPopup(`Callsign: ${flight.callsign}<br>Altitude: ${flight.altitude} ft`);
      flightMarkers.push(marker);
    });

    //Add Blue Airspace Layers
    if (airspaces) {
      L.geoJSON(airspaces, {
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
      flightMarkers.forEach(marker => map.removeLayer(marker));
      map.remove();
    };
  }, [airports, airspaces, flights]);
  return <div id="live-map"></div>;
};

export default LiveMap;