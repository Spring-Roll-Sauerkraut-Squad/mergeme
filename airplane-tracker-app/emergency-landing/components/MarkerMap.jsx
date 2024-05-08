import React, { useEffect } from 'react';
import "./MarkerMap.css";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FetchAPIFlights } from '../api-connect/FetchAPIFlights';

const AirportsMap = ({ airports }) => {
  const [flights, setFlights] = useState([]);

  useEffect(() => {
    const map = L.map('airports-map').setView([49.4, 8.7], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    // Red Marker - Airports
    const airportMarker = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    // Green Marker - Flights
    const flightMarker = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    airports.forEach(airport => {
      const popupContent = `${airport.name}<br>Type: ${airport.type}`;
      L.marker([airport.location[0].latitude, airport.location[0].longitude], { icon: airportMarker })
        .addTo(map)
        .bindPopup(popupContent);
    });

    const fetchData = async () => {
      try {
        const data = await FetchAPIFlights();
        setFlights(data);
      } catch (error) {
        console.error('Error fetching flights:', error);
      }
    };

    fetchData();

    return () => {
      map.remove();
    };
  }, [airports]);

  useEffect(() => {
    flights.forEach(flight => {
      L.marker([flight.latitude, flight.longitude], { icon: flightMarker })
        .addTo(map)
        .bindPopup(`Flight: ${flight.callsign}<br>Country: ${flight.originCountry}<br>Altitude: ${flight.altitude} meters`);
    });
  }, [flights]);

  return <div id="marker-map"></div>;
};

export default AirportsMap;