import "./PlaceholderMap.css";
import placeholderMap from './placeholder_map.jpg'

const PlaceholderMap = () => {
    return (
        <div className="map">
            <img src={placeholderMap} alt="Map" />
        </div>
    );
}

export default PlaceholderMap;