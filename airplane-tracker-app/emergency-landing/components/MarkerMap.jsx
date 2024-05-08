import React, { useEffect, useState } from 'react';
import "./MarkerMap.css";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FetchAPIFlights } from '../api-connect/FetchAPIFlights';

const AirportsMap = ({ airports }) => {
  const [flights, setFlights] = useState([]);
  console.log(airports);

  useEffect(() => {
    const map = L.map('marker-map').setView([49.4, 8.7], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    // Green Marker - Airplanes
    const airplaneMarker = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    // Red Marker - Airports
    const airportMarker = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    
    //Place marker for each Airport location
    airports.forEach(airport => {
        L.marker([airport.latitude_deg, airport.longitude_deg], { icon: airportMarker })
          .addTo(map)
          .bindPopup(`${airport.name}<br>Type: ${airport.type}`);
    });
    

    //Fetch data from OpenSky API
    const fetchData = async () => {
      try {
        const airplaneData = await FetchAPIFlights();

      //setFlights(airplaneData);
        //console.log(airplaneData); //console log opensky api data

        //Place marker for each airplane
        flights.forEach(flight => {
          if ([2, 3, 4, 5, 6].includes(flight.category)) {
            const flightPosition = L.latLng(flight.latitude, flight.longitude);
            const closestAirport = findClosestAirport(flightPosition, airports, flight.category);

            if (closestAirport) {
              L.marker([flight.latitude, flight.longitude], { icon: airplaneMarker })
                .addTo(map)
                .bindPopup(`Flight: ${flight.callsign}<br>Category: ${flight.category}<br>Closest Airport: ${closestAirport.name}`);
            }
          }
        });
      } catch (error) {
        console.error('Error fetching flights:', error);
      }
    };

    //fetchData();

    return () => {
      map.remove();
    };

  }, [airports]);

  // Function to find the closest airport of the same type (size) as the airplane
  const findClosestAirport = (flightPosition, airports, category) => {
    let closestAirport = null;
    let minDistance = Infinity;

    const validTypes = ["small_airport", "medium_airport", "large_airport"];

    airports.forEach(airport => {
      if (validTypes.includes(airport.type)) {
        const airportPosition = L.latLng(airport.location[0].latitude, airport.location[0].longitude);
        const distance = flightPosition.distanceTo(airportPosition);

        if (distance < minDistance) {
          minDistance = distance;
          closestAirport = airport;
        }
      }
    });

    return closestAirport;
  };

  console.log("refreshed"); //just for consol log clarity

  return <div id="marker-map"></div>;
};

export default AirportsMap;