import styles from './HeatMap.module.css'
import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, HeatmapLayer } from '@react-google-maps/api';
import {getHitoricalHeatmapPositions, getHitoricalTopAirports, getHitoricalTopLines} from './Api'

const containerStyle = {
    width: '1300px',
    height: '600px'
};

// Heidelberg
const center = {
    lat: 49.4057769,
    lng: 8.6423291
};

const libraries = ['visualization'];

function HistoricalHeatMap() {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-heatmap',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries
    })

    const [heatmapLayerHistorical, setHeatmapLayerHistorical] = useState( /**  @type google.maps.visualization.HeatmapLayer */ (null))

    const [topAirports, setTopAirports] = useState([]);
    const [topLines, setTopLines] = useState([])

    const onLoadHistorical = (heatmapLayer) => {
        setHeatmapLayerHistorical(heatmapLayer);
        console.log('Historical HeatmapLayer Onload : ', heatmapLayer);
    }

    const onUnmountHistorical = () => {
        console.log('Historical HeatmapLayer Unmount');
        setHeatmapLayerHistorical(null);
    }

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleStartDateChange = (event) => {
        setStartDate(event.target.value);
    };

    const handleEndDateChange = (event) => {
        setEndDate(event.target.value);
    };

    const fetchHistoricalHeatmapPositions = async (startDate, endDate) => {
        try {
          const responseData = await getHitoricalHeatmapPositions(startDate, endDate);
          return responseData;
        } catch (error) {
          console.error('Error fetching historical heatmap positions: ', error);
          return [];
        }
      };

    const handleTimeRangeSubmit = () => {
        console.log('Time Range Submitted: ', startDate, ' to ', endDate);

        const responseTopAirports = getHitoricalTopAirports(startDate, endDate);
        responseTopAirports.then((data) => {
            console.log('Top Airports: ', data);
            setTopAirports(data);
        });

        const responseTopLines = getHitoricalTopLines(startDate, endDate);
        responseTopLines.then((data) => {
            console.log('Top Lines: ', data);
            setTopLines(data);
        });

        const responseHeatmapPositions = fetchHistoricalHeatmapPositions(startDate, endDate);

        responseHeatmapPositions.then((data) => {
            const heatmapData = data.map((position) => {
                return {
                    location: new google.maps.LatLng(position.latitude, position.longitude),
                    weight: position.count
                }
            });
            heatmapLayerHistorical.setOptions({radius: 20}); //maxIntensity: 500
            heatmapLayerHistorical.setData(heatmapData);
            
            console.log('Hitorical HeatmapLayer Data Size: ', heatmapLayerHistorical.getData().getLength());
        });
    };

    return isLoaded ? (

        <div className= {styles.heatmap}>

            <h1>Historical Heatmap</h1>

            <label>Start Date: </label>
            <input type="date" value={startDate} onChange={handleStartDateChange} /><br />
            <label>End Date: </label>
            <input type="date" value={endDate} onChange={handleEndDateChange} /> <br />
            <button onClick={handleTimeRangeSubmit} style={{color: 'black'}}>Submit</button>

            <div className={styles.top10data}>
                <div>  <h3>Top 10 Airports</h3>
                    <ul>
                        {topAirports.map((airport, index) => {
                            return <li key={index}>{airport.airportName + ' (' + airport.airportCode + '): ' + airport.totalFlights}</li>
                        })}
                    </ul>
                </div>
                <div>  <h3>Top 10 Routes</h3>
                    <ul>
                        {topLines.map((line, index) => {
                            return <li key={index}>{line.originAirportName + ' ⇒ ' + line.destinationAirportName + ': ' + line.totalFlights}</li>
                        })}
                    </ul>
                </div>
            </div>
            
            <GoogleMap
            mapContainerStyle={containerStyle} center={center} zoom={2.5}>
                <HeatmapLayer onLoad={onLoadHistorical} onUnmount={onUnmountHistorical} data={[]}/>
            </GoogleMap>
        </div>
        
    ) : <></>
}

export default React.memo(HistoricalHeatMap)