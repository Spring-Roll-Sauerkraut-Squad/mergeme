import React from 'react';
import './App.css';
import placeholderSky from './assets/placeholder_sky.jpg';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import CollisionData from '../airplane-collision/CollisionData';
import AltitudeControl from './airplane-tracker/AltitudeControl/AltitudeControl';
import PlaceholderMap from './airplane-tracker/PlaceholderMap/PlacerholderMap';

function App() {
  return (
    <Router>
      <div className="background" style={{ backgroundImage: `url(${placeholderSky})` }}>
        <div className="window">
          <div className="content">
            <div className="menu-area">
              <Link to="/" className='title'>
                <h1>
                  Airplane<br />Tracker
                </h1>
              </Link>
              <div className="buttons">
                <Link to="/collision-surveillance"><button>Collision Surveillance</button></Link>
                <Link to="/altitude-control"><button>Altitude Control</button></Link>
                <Link to="/emergency-service"><button>Emergency Service</button></Link>
                <Link to="/traffic-heatmap"><button>Traffic Heatmap</button></Link>
                <Link to="/turbulence-detection"><button>Turbulence Detection</button></Link>
              </div>
            </div>
            <div className="details-area">
              <div className='details-background'>
                <Routes>
                  <Route path="/" element={<PlaceholderMap />} />
                  <Route path="/collision-surveillance" element={<CollisionData />} />
                  <Route path="/altitude-control" element={<AltitudeControl />} />
                  <Route path="/emergency-service" element={<AltitudeControl />} />
                  <Route path="/traffic-heatmap" element={<AltitudeControl />} />
                  <Route path="/turbulence-detection" element={<AltitudeControl />} />
                  <Route path="*" element={<h4 className='error'> Page not existent </h4>} />
                </Routes>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;