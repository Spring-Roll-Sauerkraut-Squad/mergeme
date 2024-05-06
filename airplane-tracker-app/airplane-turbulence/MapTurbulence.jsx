import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import PlaneSVG from './plane1.svg'; 
import config from './config';

const Map = ({ airplane, selectedFlight, selectedWaypointIndex }) => {
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const [zoomLevel, setZoomLevel] = useState(8); 

  useEffect(() => {
    if (!mapRef.current || !airplane) return;

    const map = L.map(mapRef.current);

    const firstWaypoint = airplane?.waypoints.path[0];
    map.setView([firstWaypoint?.latitude || 49.4, firstWaypoint?.longitude || 8.7], zoomLevel); 

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    const drawFlightPath = (flight, color) => {
      const latlngs = flight.waypoints.path.map(waypoint => [waypoint.latitude, waypoint.longitude]);
      L.polyline(latlngs, { color }).addTo(map);
    };

    const addMarkers = async (flight, color) => {
      const flightMarkers = [];
      let redMarkerOpened = false; 
      let openedPopup = null; 
    
      for (let i = 0; i < flight.waypoints.path.length; i++) {
        const waypoint = flight.waypoints.path[i];
        let markerColor = color;
    
        try {
          const response = await fetchWeatherData(waypoint.latitude, waypoint.longitude);
          const weatherData = await response.json();
    
          if (weatherData.current.gust_kph > 24.4 || weatherData.current.wind_kph > 12) {
            markerColor = 'red';
            if (!redMarkerOpened) {
              redMarkerOpened = true;
              openedPopup = L.popup({ autoClose: false, closeOnClick: false })
                .setLatLng([waypoint.latitude, waypoint.longitude])
                .setContent(`<b>Turbulence Warning</b> <br/> Gust Speed: ${weatherData.current.gust_kph} KPH
                <br/> Wind Speed : ${weatherData.current.wind_kph} KPH
                <br/> Temperature : ${weatherData.current.temp_c}°C
                <br/> Pressure : ${weatherData.current.pressure_mb} MB
                <br/> Humidity : ${weatherData.current.humidity}`)
                .openOn(map);
            }
          } else {
            markerColor = 'blue';
          }
    
          const marker = L.circleMarker([waypoint.latitude, waypoint.longitude], { color: markerColor, radius: 5 }).addTo(map);
    
          marker.on('click', () => {
            const message = markerColor === 'red' ? `<b>Turbulence Warning</b> <br/> Gust Speed: ${weatherData.current.gust_kph} KPH 
                <br/> Wind Speed :${weatherData.current.wind_kph} KPH
                <br/> Temperature : ${weatherData.current.temp_c}°C
                <br/> Pressure : ${weatherData.current.pressure_mb} MB
                <br/> Humidity : ${weatherData.current.humidity}` 
              : `Flight: ${flight.flight.callsign}`;
            marker.bindPopup(message, { autoClose: false, closeOnClick: false }).openPopup();
          });
    
          flightMarkers.push(marker);
        } catch (error) {
          console.error('Error fetching weather data:', error);
        }
      }
    
      markersRef.current.push(...flightMarkers);
    };
    
    
    const fetchWeatherData = async (latitude, longitude) => {
      try {
        const apiKey = config.apiKey;
        const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude},${longitude}`;
        const response = await fetch(url);
        return response;
      } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error; 
      }
    };
    
    const addPlaneIcon = (flight, svgImage, waypointIndex) => {
      const waypoint = flight.waypoints.path[waypointIndex];
      const planeIcon = L.icon({
        iconUrl: svgImage, 
        iconSize: [52, 52], 
        iconAnchor: [26, 26],
      });
      const marker = L.marker([waypoint.latitude, waypoint.longitude], { icon: planeIcon }).addTo(map);
      markersRef.current.push(marker);
      map.setView([waypoint.latitude, waypoint.longitude], zoomLevel);
    };

    drawFlightPath(airplane, 'blue');
    addMarkers(airplane, 'blue');
    addPlaneIcon(airplane, PlaneSVG, selectedWaypointIndex);

    map.on('zoomend', () => {
      setZoomLevel(map.getZoom());
    });

    return () => {
      map.remove();
    };
  }, [airplane, selectedFlight, selectedWaypointIndex]);

  return <div id="map" style={{ width: '1700px', height: '800px', margin: 'auto' }} ref={mapRef}></div>;
};

export default Map;
