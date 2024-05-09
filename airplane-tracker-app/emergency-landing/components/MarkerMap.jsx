import React, { useEffect, useState } from 'react';
import "./MarkerMap.css";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchOpenSkyData } from '../api-connect/FetchOSAPI.js';

const AirportsMap = ({ airports }) => {
  const [flights, setFlights] = useState([]);

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

          // Check if longitude and latitude are available
          if (longitude && latitude) {
            // Create a green marker at the specified latitude and longitude
            L.marker([latitude, longitude], { icon: airplaneMarker })
              .addTo(map)
              .bindPopup(`Flight: ${callsign}<br>Latitude: ${latitude}<br>Longitude: ${longitude}<br>Category: ${category}`);
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