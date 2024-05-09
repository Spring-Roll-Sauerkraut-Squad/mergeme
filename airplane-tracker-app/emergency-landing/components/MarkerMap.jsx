import React, { useEffect, useState } from 'react';
import "./MarkerMap.css";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchOpenSkyData } from '../api-connect/FetchOSAPI.js';

const AirportsMap = ({ airports }) => {
  const [flights, setFlights] = useState([]);

  // Function to create a line between two points
  const createLine = (startCoords, endCoords, map) => {
    const line = L.polyline([startCoords, endCoords], { color: 'blue' }).addTo(map);
    return line;
  };

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
        const airplaneData = await fetchOpenSkyData();
        console.log('Airplane data:', airplaneData); // Log the fetched data
        setFlights(airplaneData);

        //Place marker for each airplane
        airplaneData.states.forEach(state => {
          const callsign = state[1];
          const longitude = state[5];
          const latitude = state[6];
          const category = state[17];
          let nearestAirport = null;
          let nearestDistance = Infinity;

          // Iterate through airports to find nearest
          airports.forEach(airport => {
            const airportLatitude = airport.latitude_deg;
            const airportLongitude = airport.longitude_deg;
            const distance = Math.sqrt(
              Math.pow(latitude - airportLatitude, 2) +
              Math.pow(longitude - airportLongitude, 2)
            );

            if (distance < nearestDistance) {
              nearestAirport = airport;
              nearestDistance = distance;
            }
          });

          // Check if longitude and latitude are available
          if (longitude && latitude && nearestAirport) {
            // Create a green marker at the specified latitude and longitude
            const airplane = L.marker([latitude, longitude], { icon: airplaneMarker })
              .addTo(map)
              .bindPopup(
                `Flight: ${callsign}
                <br>Latitude: ${latitude}
                <br>Longitude: ${longitude}
                <br>Category: ${category}
                <br>Nearest Airport: ${nearestAirport.name}`
              );

            // Event listener to create a line when airplane marker is clicked
            airplane.on('click', () => {
              // Calculate coordinates of the nearest airport
              const nearestAirportCoords = [nearestAirport.latitude_deg, nearestAirport.longitude_deg];

              // Create a line between airplane and nearest airport
              createLine([latitude, longitude], nearestAirportCoords, map);
            });

          }
        });

      } catch (error) {
        console.error('Error fetching flights:', error);
      }
    };

    fetchData();

    return () => {
      map.remove();
    };

  }, [airports]);


  console.log("refreshed"); //just for consol log clarity

  return <div id="marker-map"></div>;
};

export default AirportsMap;