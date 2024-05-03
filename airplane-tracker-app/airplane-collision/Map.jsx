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

    const addMarkers = (flight, color) => {
      const flightMarkers = flight.waypoints.path.map((waypoint) => {
        const marker = L.circleMarker([waypoint.latitude, waypoint.longitude], { color, radius: 5 }).addTo(map);
        const isFirstFlight = selectedFlight1 === airplanes[0]?.flight.callsign;
        const isSecondFlight = selectedFlight2 === airplanes[1]?.flight.callsign || selectedFlight2 === airplanes[2]?.flight.callsign;
        const message = isFirstFlight && isSecondFlight
          ? `Possible collision predicted!<br/> Air Traffic Control Notified!`
          : `No collision predicted!`;
        marker.bindPopup(`Flight: ${flight.flight.callsign}<br/>${message}`);
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
    };

    const selectedFlightData1 = airplanes.find(({ flight }) => flight.callsign === selectedFlight1);
    if (selectedFlightData1) {
      drawFlightPath(selectedFlightData1, 'blue');
      addMarkers(selectedFlightData1, 'blue');
      addPlaneIcons(selectedFlightData1, Plane1SVG, selectedWaypointIndex1);
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
