import React, { useEffect, useState } from 'react';
import '../airplane-turbulence/TurbulenceData.css';
import fetchWaypoints from '../../airplane-tracker-server/scripts/fetch-waypoint-data.js';
import Map from './MapTurbulence.jsx'; 
import { fetchWeatherData } from './fetchWeatherData.js';

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

  useEffect(() => {
    if (selectedFlight && airplanes.length > 0) {
      const selectedAirplane = airplanes.find(({ flight }) => flight.callsign === selectedFlight);
      if (selectedAirplane && selectedAirplane.waypoints && selectedAirplane.waypoints.path[selectedWaypointIndex]) {
        const { latitude, longitude } = selectedAirplane.waypoints.path[selectedWaypointIndex];
        fetchWeatherData(latitude, longitude) 
          .then(response => response.json())
          .then(data => setWeatherData(data))
          .catch(error => console.error('Error fetching weather data:', error));
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

  const renderWeatherTable = () => {
    const weatherFields = [
      { fieldName: 'Temperature (°C)', value: weatherData?.current?.temp_c },
      { fieldName: 'Condition', value: weatherData?.current?.condition?.text },
      { fieldName: 'Wind Speed (KPH)', value: weatherData?.current?.wind_kph },
      { fieldName: 'Wind Degree', value: weatherData?.current?.wind_degree },
      { fieldName: 'Wind Direction', value: weatherData?.current?.wind_dir },
      { fieldName: 'Pressure (MB)', value: weatherData?.current?.pressure_mb },
      { fieldName: 'Humidity', value: weatherData?.current?.humidity },
      { fieldName: 'Cloud', value: weatherData?.current?.cloud },
      { fieldName: 'Visibility (KM)', value: weatherData?.current?.vis_km },
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
        
        <h3 className='flightHeader'>Select Flight:
          <select className='selectFlight' value={selectedFlight} onChange={handleFlightChange}>
            {airplanes.map(({ flight: { callsign } }, index) => (
              <option key={index} value={callsign}>{callsign}</option>
            ))}
          </select>
        </h3>  
        <div className="turbulence-button-group">
          <button onClick={() => handleWaypointChange(-1)} disabled={selectedWaypointIndex === 0}>Previous Waypoint</button>
          <button onClick={() => handleWaypointChange(1)} disabled={selectedWaypointIndex === airplanes.find(airplane => airplane.flight.callsign === selectedFlight)?.waypoints.path.length - 1}>Next Waypoint</button>
        </div>
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
      {renderWeatherTable()} 
    </div>
  );
};

export default TurbulenceData;
TurbulenceData.jsx