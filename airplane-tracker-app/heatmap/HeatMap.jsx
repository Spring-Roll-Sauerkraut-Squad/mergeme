import styles from './HeatMap.module.css'
import React, {useState} from 'react'
import { GoogleMap, useJsApiLoader, HeatmapLayer } from '@react-google-maps/api';
import {getHitoricalHeatmapPositions} from './Api'

const containerStyle = {
    width: '1600px',
    height: '800px'
};

// Heidelberg
const center = {
    lat: 49.4057769,
    lng: 8.6423291
};

const libraries = ['visualization'];

function HeatMap() {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-heatmap',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries
    })

    const [heatmapLayerHistorical, setHeatmapLayerHistorical] = useState( /**  @type google.maps.visualization.HeatmapLayer */ (null))
    const [heatmapLayerRealtime, setHeatmapLayerRealtime] = useState( /**  @type google.maps.visualization.HeatmapLayer */ (null))

    const onLoadHistorical = (heatmapLayer) => {
        setHeatmapLayerHistorical(heatmapLayer);
        console.log('Historical HeatmapLayer Onload : ', heatmapLayer);
    }

    const onUnmountHistorical = () => {
        console.log('Historical HeatmapLayer Unmount');
        setHeatmapLayerHistorical(null);
    }

    const onLoadRealtime = (heatmapLayer) => {
        setHeatmapLayerRealtime(heatmapLayer);
        console.log('Realtime HeatmapLayer Onload : ', heatmapLayer);
    }

    const onUnmountRealtime = () => {
        console.log('Realtime HeatmapLayer Unmount');
        setHeatmapLayerRealtime(null);
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
        console.log('Start Date: ', startDate);
        console.log('End Date: ', endDate);

        const responseData = fetchHistoricalHeatmapPositions(startDate, endDate);

        responseData.then((data) => {
            const heatmapData = data.map((position) => {
                return {
                    location: new google.maps.LatLng(position.latitude, position.longitude),
                    weight: position.count
                }
            });
            heatmapLayerHistorical.setOptions({radius: 20, maxIntensity: 500})
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
                        <li>Frankfurt</li>
                        <li>Heathrow</li>
                        <li>Amsterdam</li>
                        <li>Charles de Gaulle</li>
                        <li>Madrid</li>
                        <li>Barajas</li>
                        <li>Barcelona</li>
                        <li>Malaga</li>
                        <li>Palma de Mallorca</li>
                        <li>Vienna</li>
                    </ul>
                </div>
                <div>  <h3>Top 10 Routes</h3>
                    <ul>
                        <li>Frankfurt</li>
                        <li>Heathrow</li>
                        <li>Amsterdam</li>
                        <li>Charles de Gaulle</li>
                        <li>Madrid</li>
                        <li>Barajas</li>
                        <li>Barcelona</li>
                        <li>Malaga</li>
                        <li>Palma de Mallorca</li>
                        <li>Vienna</li>
                    </ul>
                </div>
            </div>
            

            <GoogleMap
            mapContainerStyle={containerStyle} center={center} zoom={2.5}>
                
                <HeatmapLayer onLoad={onLoadHistorical} onUnmount={onUnmountHistorical} data={[]}/>
                {<div>Historical Heatmap</div>}
            </GoogleMap>





            <h1>Realtime Heatmap</h1>
            <GoogleMap
            mapContainerStyle={containerStyle} center={center} zoom={10}>
                <HeatmapLayer onLoad={onLoadRealtime} onUnmount={onUnmountRealtime} data={[]}/>
            </GoogleMap>
            
        </div>
        
    ) : <></>
}

export default React.memo(HeatMap)