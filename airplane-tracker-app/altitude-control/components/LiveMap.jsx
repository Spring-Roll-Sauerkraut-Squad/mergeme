import "./LiveMap.css";
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import planeIcon from "../plane1.svg";

const LiveMap = ({ airports, airspaces, flights, center }) => {
  const mapRef = useRef(null);
  const pingRef = useRef(null);
  const horizontalLineRef = useRef(null);
  const verticalLineRef = useRef(null);

  //Responsible for Maintaining the Map
  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map('live-map').setView([49.4, 8.7], 5);
    }

    const map = mapRef.current;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 15,
    }).addTo(map);

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

    const flightIcon = L.icon({
      iconUrl: planeIcon,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });

    let flightMarkers = [];
    flights.forEach(flight => {
      const marker = L.marker([flight.latitude, flight.longitude], { icon: flightIcon })
        .addTo(map)
        .bindPopup(`Callsign: ${flight.callsign}<br>Altitude: ${flight.altitude} ft`);
      flightMarkers.push(marker);
    });

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

    // Cleanup function
    return () => {
      flightMarkers.forEach(marker => map.removeLayer(marker));
      if (pingRef.current) {
        map.removeLayer(pingRef.current);
        pingRef.current = null;
      }
      if (horizontalLineRef.current) {
        map.removeLayer(horizontalLineRef.current);
        horizontalLineRef.current = null;
      }
      if (verticalLineRef.current) {
        map.removeLayer(verticalLineRef.current);
        verticalLineRef.current = null;
      }
      map.remove();
      mapRef.current = null;
    };
  }, [airports, airspaces, flights]);


  //Responsible for Updating the Centering Point
  useEffect(() => {
    if (center && mapRef.current) {
      mapRef.current.setView([center.latitude, center.longitude], 22);
      if (pingRef.current) {
        mapRef.current.removeLayer(pingRef.current);
      }
      if (horizontalLineRef.current) {
        mapRef.current.removeLayer(horizontalLineRef.current);
      }
      if (verticalLineRef.current) {
        mapRef.current.removeLayer(verticalLineRef.current);
      }
      pingRef.current = L.circle([center.latitude, center.longitude], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 500
      }).addTo(mapRef.current);

      const radiusInDegrees = 500 / 111320;  

      horizontalLineRef.current = L.polyline([
        [center.latitude, center.longitude - 1.5*radiusInDegrees],
        [center.latitude, center.longitude + 1.5*radiusInDegrees]
      ], {color: 'black'}).addTo(mapRef.current);

      verticalLineRef.current = L.polyline([
        [center.latitude - radiusInDegrees, center.longitude],
        [center.latitude + radiusInDegrees, center.longitude]
      ], {color: 'black'}).addTo(mapRef.current);

      setTimeout(() => {
        if (pingRef.current) {
          mapRef.current.removeLayer(pingRef.current);
          pingRef.current = null;
        }
        if (horizontalLineRef.current) {
          mapRef.current.removeLayer(horizontalLineRef.current);
          horizontalLineRef.current = null;
        }
        if (verticalLineRef.current) {
          mapRef.current.removeLayer(verticalLineRef.current);
          verticalLineRef.current = null;
        }
      }, 10000);
    }
  }, [center]);

  return <div id="live-map"></div>;
};

export default LiveMap;
