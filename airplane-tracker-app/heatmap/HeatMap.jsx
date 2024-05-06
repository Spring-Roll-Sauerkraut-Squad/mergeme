import styles from './HeatMap.module.css'
import React, {useState} from 'react'
import { GoogleMap, useJsApiLoader, HeatmapLayer } from '@react-google-maps/api';

const containerStyle = {
    width: '1600px',
    height: '500px'
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

    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    const handleStartTimeChange = (event) => {
        setStartTime(event.target.value);
    };

    const handleEndTimeChange = (event) => {
        setEndTime(event.target.value);
    };

    const handleTimeRangeSubmit = () => {
        console.log('Start Time: ', startTime);
        console.log('End Time: ', endTime);
        heatmapLayerHistorical.setData(
            [
                {location: new google.maps.LatLng(37.785, -122.437), weight: 2},
                {location: new google.maps.LatLng(37.785, -122.437), weight: 2},
            ]
        )
        console.log('Hitorical HeatmapLayer Data Size: ', heatmapLayerHistorical.getData().getLength());
    };

    return isLoaded ? (

        <div className= {styles.heatmap}>

            <h1>Historical Leaderboard</h1>
            <h1>Historical Heatmap</h1>

            <label>Start Date: </label>
            <input type="date" value={startTime} onChange={handleStartTimeChange} />
            <br />
            <label>End Date: </label>
            <input type="date" value={endTime} onChange={handleEndTimeChange} />
            <br />
            <button onClick={handleTimeRangeSubmit} style={{color: 'black'}}>Submit</button>

            <GoogleMap
            mapContainerStyle={containerStyle} center={center} zoom={10}>
                <HeatmapLayer onLoad={onLoadHistorical} onUnmount={onUnmountHistorical} data={[]}/>
            </GoogleMap>




            <h1>Realtime Leaderboard</h1>

            <h1>Realtime Heatmap</h1>
            <GoogleMap
            mapContainerStyle={containerStyle} center={center} zoom={10}>
                <HeatmapLayer onLoad={onLoadRealtime} onUnmount={onUnmountRealtime} data={[]}/>
            </GoogleMap>
            
        </div>
        
    ) : <></>
}

export default React.memo(HeatMap)