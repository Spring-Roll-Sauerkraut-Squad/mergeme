import styles from './HeatMap.module.css'
import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, HeatmapLayer } from '@react-google-maps/api';
import io from 'socket.io-client';

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

const socket = io('ws://localhost:3001');

function transformData(geoData) {
    const transformedData = [];

    if(geoData === undefined) {
        return transformedData;
    }
    for (const [key, value] of Object.entries(geoData)) {
        const [latitude, longitude] = key.split('|').map(parseFloat);
        const weight = parseInt(value);
        transformedData.push({
            location: new google.maps.LatLng(latitude, longitude),
            weight: weight
        });
    }
    return transformedData;
}

function RealtimeHeatMap() {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-heatmap',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries
    })

    let [heatmapLayerRealtime, setHeatmapLayerRealtime] = useState( /**  @type google.maps.visualization.HeatmapLayer */ (null))

    const [realtimeMockData, setRealtimeMockData] = useState({});

    useEffect(() => {
        socket.on('mockdata', mockdata => {
            console.log('Mockdata Received: ', mockdata);
            mockdata = JSON.parse(mockdata);
            setRealtimeMockData(mockdata);
        });
    
        return () => {
          console.log('Socket Disconnected');
          socket.disconnect(); 
        };
      }, []);

    useEffect(() => {
        if (heatmapLayerRealtime) {
            const heatmapData = transformData(realtimeMockData.airport_geos);
            heatmapLayerRealtime.setData(heatmapData);
        }
    }, [heatmapLayerRealtime, realtimeMockData]);

    const onLoadRealtime = (heatmapLayer) => {
        heatmapLayer.setOptions({ radius: 30});
        heatmapLayerRealtime = heatmapLayer;
        setHeatmapLayerRealtime(heatmapLayer);
        console.log('Realtime HeatmapLayer Onload : ', heatmapLayerRealtime);
    }

    const onUnmountRealtime = () => {
        console.log('Realtime HeatmapLayer Unmount');
        setHeatmapLayerRealtime(null);
    }

    return isLoaded ? (

        <div className= {styles.heatmap}>

            <h1>Realtime Heatmap</h1>

            <div className={styles.top10data}>
                <div>  <h3>Top 10 Airports</h3>
                    <ul>
                        {realtimeMockData.airport_lbs && realtimeMockData.airport_lbs.map((airport, index) => {
                            return <li key={index}>{airport.value + ': ' + airport.score}</li>
                        })} 
                    </ul>
                </div>
                <div>  <h3>Top 10 Routes</h3>
                    <ul>
                        {realtimeMockData.flight_route_lbs && realtimeMockData.flight_route_lbs.map((line, index) => {
                            return <li key={index}>{line.value + ': ' + line.score}</li>
                        })}                        
                    </ul>
                </div>
            </div>

            <GoogleMap
            mapContainerStyle={containerStyle} center={center} zoom={2.5}>
                <HeatmapLayer onLoad={onLoadRealtime} onUnmount={onUnmountRealtime} data={[]}/>
            </GoogleMap>
            
        </div>
        
    ) : <></>
}

export default React.memo(RealtimeHeatMap)