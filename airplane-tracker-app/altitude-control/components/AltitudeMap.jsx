import './AltitudeMap.css';
import React from 'react';

const AltitudeMap = () => {
    return (
        <iframe
            className='altitude-map'
            allowFullScreen
            allow="geolocation"
            src="https://umap.openstreetmap.fr/en/map/airspace_map_1063712?scaleControl=false&miniMap=false&scrollWheelZoom=false&zoomControl=true&editMode=disabled&moreControl=true&searchControl=null&tilelayersControl=null&embedControl=null&datalayersControl=true&onLoadPanel=none&captionBar=false&captionMenus=true">
        </iframe>
    );
};

export default AltitudeMap;