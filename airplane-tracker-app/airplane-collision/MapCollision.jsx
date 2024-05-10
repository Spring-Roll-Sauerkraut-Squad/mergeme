import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Plane1SVG from './plane1.svg';
import Plane2SVG from './plane2.svg';

const Map = ({
  airplanes,
  selectedFlight1,
  selectedFlight2,
  selectedWaypointIndex1,
  selectedWaypointIndex2,
  onWaypointClick,
}) => {
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const zoomLevel = 9;
  const [mousePosition, setMousePosition] = useState({ latitude: 0, longitude: 0 });

  useEffect(() => {
    if (!mapRef.current) return;

    const map = L.map(mapRef.current);

    const firstFlight = airplanes.find(({ flight }) => flight.callsign === selectedFlight1);
    const firstWaypoint = firstFlight?.waypoints.path[0];
    map.setView([firstWaypoint?.latitude || 49.4, firstWaypoint?.longitude || 8.7], zoomLevel);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    const mouseMoveHandler = (e) => {
      setMousePosition({ latitude: e.latlng.lat, longitude: e.latlng.lng });
    };

    map.on('mousemove', mouseMoveHandler);

    const drawFlightPath = (flight, color) => {
      const latlngs = flight.waypoints.path.map(waypoint => [waypoint.latitude, waypoint.longitude]);
      L.polyline(latlngs, { color }).addTo(map);
    };

    const calculateDistance = (lat1, lon1, alt1, lat2, lon2, alt2) => {
      const R = 6371e3; // Earth radius in meters
      const φ1 = lat1 * Math.PI / 180; // φ, λ in radians
      const φ2 = lat2 * Math.PI / 180;
      const Δφ = (lat2 - lat1) * Math.PI / 180;
      const Δλ = (lon2 - lon1) * Math.PI / 180;
      const Δh = (alt2 - alt1);
      const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); //Haversine Formula
      const d = Math.sqrt(c * c + Δh * Δh);
      return R * d; 
    };
    const addMarkers = (flight, color) => {
      const flightMarkers = flight.waypoints.path.map((waypoint, index) => {
        const marker = L.circleMarker([waypoint.latitude, waypoint.longitude], { color, radius: 5 }).addTo(map);
        const otherFlight = selectedFlight1 === flight.flight.callsign ? selectedFlight2 : selectedFlight1;
        const otherFlightData = airplanes.find(({ flight }) => flight.callsign === otherFlight);
        if (!otherFlightData) return marker;
    
        let shortestDistance = Infinity;
        flight.waypoints.path.forEach((waypoint1) => {
          otherFlightData.waypoints.path.forEach((waypoint2) => {
            const distance = calculateDistance(waypoint1.latitude, waypoint1.longitude, 
              waypoint1.altitude, waypoint2.latitude, waypoint2.longitude, waypoint2.altitude);
            
            if (distance < shortestDistance) {
              shortestDistance = distance;
            }
          });
        });
    
        let message;
        if (shortestDistance <= 2000) {
          if (selectedFlight1 === selectedFlight2) {
            message = 'No collision predicted.';
          } else {
            message = `<b><a href="#" class="waypoint-link" data-flight="${flight.flight.callsign}" data-waypoint="${index}">Waypoint: ${index + 1}</a></b> of Flight: <b>${flight.flight.callsign}</b><br/>`;
            message += `Possible collision with <b>${selectedFlight2}</b> predicted.<br/>`;
            message += `Air Traffic Control Notified.<br/>`;
            message += `<b>Closest distance:</b> ${shortestDistance.toFixed(2)} meters`;
          }
        } else {
          message = 'No collision predicted.';
        }
    
        marker.bindPopup(`${message}`, { autoClose: false, closeOnClick: false });
        if (selectedFlight1 === flight.flight.callsign && index === selectedWaypointIndex1) {
          marker.openPopup();
        }
    
        marker.on('popupopen', (e) => {
          const popup = e.popup;
          popup.getElement().querySelector('.waypoint-link').addEventListener('click', (clickEvent) => {
            clickEvent.preventDefault();
            const flight = clickEvent.target.dataset.flight;
            const waypointIndex = parseInt(clickEvent.target.dataset.waypoint, 10);
            onWaypointClick(flight, waypointIndex);
          });
        });
    
        return marker;
      });
      markersRef.current.push(...flightMarkers);
    };
    
    const addPlaneIcons = (flight, svgImage, waypointIndex) => {
      const waypoint = flight.waypoints.path[waypointIndex];
      const planeIcon = L.icon({
        iconUrl: svgImage, 
        iconSize: [52, 52], 
        iconAnchor: [26, 26],
      });
      const marker = L.marker([waypoint.latitude, waypoint.longitude], { icon: planeIcon }).addTo(map);
      markersRef.current.push(marker);
      return marker; 
    };

    const selectedFlightData1 = airplanes.find(({ flight }) => flight.callsign === selectedFlight1);
    if (selectedFlightData1) {
      drawFlightPath(selectedFlightData1, 'blue');
      addMarkers(selectedFlightData1, 'blue');
      const planeMarker1 = addPlaneIcons(selectedFlightData1, Plane1SVG, selectedWaypointIndex1);
      if (planeMarker1) {
        map.setView(planeMarker1.getLatLng(), zoomLevel);
      }
    }

    const selectedFlightData2 = airplanes.find(({ flight }) => flight.callsign === selectedFlight2);
    if (selectedFlightData2) {
      drawFlightPath(selectedFlightData2, 'red');
      addMarkers(selectedFlightData2, 'red');
      addPlaneIcons(selectedFlightData2, Plane2SVG, selectedWaypointIndex2);
    }

    return () => {
      map.off('mousemove', mouseMoveHandler);
      map.remove();
    };
  }, [airplanes, selectedFlight1, selectedFlight2, selectedWaypointIndex1, selectedWaypointIndex2, zoomLevel]);

  return (
    <div>
      <div id="map" style={{ width: '1700px', height: '1500px', margin: 'auto' }} ref={mapRef}></div>
      <div style={{ position: 'absolute', bottom: 10, left: 10, backgroundColor: 'white', padding: 5, border: '1px solid black',color: 'black' }}>
      Longitude: {mousePosition.longitude.toFixed(6)}, Latitude: {mousePosition.latitude.toFixed(6)}
      </div>
    </div>
  );
};

export default Map;
