import './Warning.css';
import React from 'react';

const Warning = ({ warnings, onClose }) => {
    console.log(warnings);
    return (
        <div className="warning-overlay">
            <div className="popup">
                <div className="spacer-top">
                    <div className="warning-symbol"></div>
                    <p className='warning-header'> Altitude Warning!</p>
                    <div className="warning-symbol"></div>
                </div>
                <div className='message-box'>
                    <p className='warning-description'>Detected Aircrafts Below Permissible Altitude:</p>
                    <div>
                        {warnings.map((warning, index) => (
                            <div key={index}>
                                <p>Flight Callsign: {warning.callsign} </p>
                                <p>Location: {warning.location} | Altitude: {warning.altitude} ft</p>
                                <p> - - - - - </p>
                            </div>
                        ))}
                    </div>
                </div>
                <button className="close-button" onClick={onClose}>OK</button>
            </div>
        </div>
    );
}

export default Warning;