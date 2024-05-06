import './Warning.css';
import React, { useState } from 'react';

const Warning = ({ warnings, onClose, onCallSignExtracted }) => {
    const [activeWarningIndex, setActiveWarningIndex] = useState(null);

    const handleWarningClick = (warning, index) => {
        const callSign = getCallSign(warning);
        console.log(callSign);
        alert(`Warning for Flight: \n[ ${callSign} ] \n\nDetails: \n  ${warning}`);
        onCallSignExtracted(callSign);
        setActiveWarningIndex(index);
    };

    const getCallSign = (warning) => {
        const match = warning.match(/Flight: (\[.*?\]|[^ ]+)/);  // Match either a bracketed placeholder or the first word after "Flight:"
        return match ? match[1] : null;
    };

    return (
        <div className="warning-overlay">
            <div className="popup">
                <div className="spacer-top">
                    <div className="warning-symbol"></div>
                    <p className='warning-header'>Altitude Warning!</p>
                    <div className="warning-symbol"></div>
                </div>
                <div className='message-box'>
                    <p className='warning-description'>Detected aircrafts violating airspace requirements:</p>
                    <div>
                        {warnings.map((warning, index) => (
                            <div key={index} className={`clickable-warning ${index === activeWarningIndex ? 'active' : ''}`} onClick={() => handleWarningClick(warning, index)}>
                                <p>{warning}</p>
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
