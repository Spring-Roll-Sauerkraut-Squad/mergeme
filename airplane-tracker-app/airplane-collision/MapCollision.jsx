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
}) => {
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const [zoomLevel, setZoomLevel] = useState(8); 

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
            message = selectedFlight1 === flight.flight.callsign
              ? `Possible collision with <b>${selectedFlight2}</b> 
              predicted.<br/> Air Traffic Control Notified.<br/><b>Closest distance:</b> ${shortestDistance.toFixed(2)} meters`
              : `Possible collision with <b>${selectedFlight1}</b> 
              predicted.<br/> Air Traffic Control Notified.<br/><b>Closest distance:</b> ${shortestDistance.toFixed(2)} meters`;
          }
        } else {
          message = 'No collision predicted.';
        }
    
        marker.bindPopup(`<b>Flight: ${flight.flight.callsign}</b><br/>${message}`, { autoClose: false, closeOnClick: false });
        if (selectedFlight1 === flight.flight.callsign && index === selectedWaypointIndex1) {
          marker.openPopup();
        }
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

    map.on('zoomend', () => {
      setZoomLevel(map.getZoom());
    });

    return () => {
      map.remove();
    };
  }, [airplanes, selectedFlight1, selectedFlight2, selectedWaypointIndex1, selectedWaypointIndex2]);

  return <div id="map" style={{ width: '1700px', height: '1500px', margin: 'auto' }} ref={mapRef}></div>;
};

export default Map;
