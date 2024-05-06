import React, { useEffect, useState } from 'react';
import '../airplane-turbulence/TurbulenceData.css';
import fetchWaypoints from '../../airplane-tracker-server/scripts/collision-data/fetch-waypoint-data.js';
import Map from './MapTurbulence.jsx'; 
import config from './config';

const TurbulenceData = () => {
  const [airplanes, setAirplanes] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState('');
  const [selectedWaypointIndex, setSelectedWaypointIndex] = useState(0);
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchWaypoints();
        setAirplanes(data);
        if (data.length > 0) {
          setSelectedFlight(data[0]?.flight.callsign || '');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const fetchWeatherData = async (latitude, longitude) => {
    try {
      const apiKey = config.apiKey; 
      const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude},${longitude}`;
      const response = await fetch(url);
      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  useEffect(() => {
    if (selectedFlight && airplanes.length > 0) {
      const selectedAirplane = airplanes.find(({ flight }) => flight.callsign === selectedFlight);
      if (selectedAirplane && selectedAirplane.waypoints && selectedAirplane.waypoints.path[selectedWaypointIndex]) {
        const { latitude, longitude } = selectedAirplane.waypoints.path[selectedWaypointIndex];
        fetchWeatherData(latitude, longitude);
      }
    }
  }, [selectedFlight, selectedWaypointIndex, airplanes]);

  const handleWaypointChange = (increment) => {
    setSelectedWaypointIndex(prevIndex => Math.max(0, Math.min(prevIndex + increment, 
      airplanes.find(airplane => airplane.flight.callsign === selectedFlight)?.waypoints.path.length - 1)));
  };

  const handleFlightChange = (event) => {
    const selectedFlight = event.target.value;
    setSelectedFlight(selectedFlight);
    setSelectedWaypointIndex(0); 
  };

  const renderFlightTable = (selectedFlight, selectedAirplane, selectedWaypointIndex) => {
    if (!selectedAirplane || !selectedAirplane.waypoints) {
      return null; 
    }
  
    return (
      <div className="turbulence-table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Flight</th>
              <th>Path : Waypoint {selectedWaypointIndex + 1}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <select value={selectedFlight} onChange={handleFlightChange}>
                  {airplanes.map(({ flight: { callsign } }, index) => (
                    <option key={index} value={callsign}>{callsign}</option>
                  ))}
                </select>
              </td>
              <td>
                <div className="waypoint-list">
                  {selectedAirplane.waypoints.path[selectedWaypointIndex] && (
                    <div className="waypoint">
                      <p><strong>Timestamp:</strong> {selectedAirplane.waypoints.path[selectedWaypointIndex].timestamp}</p>
                      <p><strong>Altitude:</strong> {selectedAirplane.waypoints.path[selectedWaypointIndex].altitude}</p>
                      <p><strong>Longitude:</strong> {selectedAirplane.waypoints.path[selectedWaypointIndex].longitude}</p>
                      <p><strong>Latitude:</strong> {selectedAirplane.waypoints.path[selectedWaypointIndex].latitude}</p>
                      <p><strong>Velocity:</strong> {selectedAirplane.waypoints.path[selectedWaypointIndex].velocity}</p>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div className="turbulence-button-group">
          <button onClick={() => handleWaypointChange(-1)} disabled={selectedWaypointIndex === 0}>Previous</button>
          <button onClick={() => handleWaypointChange(1)} disabled={selectedWaypointIndex === selectedAirplane.waypoints.path.length - 1}>Next</button>
        </div>
      </div>
    );
  };

  const renderWeatherTable = () => {
    const weatherFields = [
      { fieldName: 'Temperature (°C)', value: weatherData?.current?.temp_c },
      { fieldName: 'Temperature (°F)', value: weatherData?.current?.temp_f },
      { fieldName: 'Condition', value: weatherData?.current?.condition?.text },
      { fieldName: 'Wind Speed (MPH)', value: weatherData?.current?.wind_mph },
      { fieldName: 'Wind Speed (KPH)', value: weatherData?.current?.wind_kph },
      { fieldName: 'Wind Degree', value: weatherData?.current?.wind_degree },
      { fieldName: 'Wind Direction', value: weatherData?.current?.wind_dir },
      { fieldName: 'Pressure (MB)', value: weatherData?.current?.pressure_mb },
      { fieldName: 'Pressure (IN)', value: weatherData?.current?.pressure_in },
      { fieldName: 'Precipitation (MM)', value: weatherData?.current?.precip_mm },
      { fieldName: 'Humidity', value: weatherData?.current?.humidity },
      { fieldName: 'Cloud', value: weatherData?.current?.cloud },
      { fieldName: 'Visibility (KM)', value: weatherData?.current?.vis_km },
      { fieldName: 'Visibility (Miles)', value: weatherData?.current?.vis_miles },
      { fieldName: 'Gust Speed (MPH)', value: weatherData?.current?.gust_mph },
      { fieldName: 'Gust Speed (KPH)', value: weatherData?.current?.gust_kph },
    ];

    return (
      <div className="table-wrapper turbulence-weather-table-wrapper">
        <table className="turbulence-flight-data-table turbulence-weather-data-table">
          <thead>
            <tr>
              <th colSpan="2" style={{ textAlign: 'center' }}>Weather Information : Waypoint {selectedWaypointIndex + 1}</th>
            </tr>
          </thead>
          <tbody>
            {weatherData ? (
              weatherFields.map(({ fieldName, value }) => (
                <tr key={fieldName}>
                  <td>{fieldName}</td>
                  <td>{typeof value === 'object' ? JSON.stringify(value) : value}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2">Loading weather data...</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="turbulence-container">
      <Map
        airplane={airplanes.find(({ flight }) => flight.callsign === selectedFlight)}
        selectedFlight={selectedFlight}
        selectedWaypointIndex={selectedWaypointIndex}
        weatherData={weatherData} 
        setWeatherData={setWeatherData} 
      />
      <div className="turbulence-flight-data">
        <h2>Flight Data</h2>
        {renderFlightTable(selectedFlight, airplanes.find(({ flight }) => flight.callsign === selectedFlight), selectedWaypointIndex)}
      </div>
      {renderWeatherTable()} 
    </div>
  );
};

export default TurbulenceData;
