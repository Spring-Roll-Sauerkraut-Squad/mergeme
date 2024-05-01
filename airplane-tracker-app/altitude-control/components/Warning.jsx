import './Warning.css';
import React from 'react';

const Warning = ({ message, onClose }) => {
    return (
        <div className="warning-overlay">
            <div className="popup">
                <div className="spacer-top">
                    <div className="warning-symbol"></div>
                    <p className='warning-header'> Altitude Warning!</p>
                    <div className="warning-symbol"></div>
                </div>
                <div className='message-box'>
                    <p className='warning-description'> Detected Aircrafts Below Permissable Altitude: </p>
                    <div>
                        <div>
                            <p> Fight Nr: ###### </p>
                            <p>{message}</p>
                            <p>------------------</p>
                        </div>
                        <div>
                            <p> Fight Nr: ###### </p>
                            <p>{message}</p>
                            <p>------------------</p>
                        </div>
                        <div>
                            <p> Fight Nr: ###### </p>
                            <p>{message}</p>
                            <p>------------------</p>
                        </div>
                        <div>
                            <p> Fight Nr: ###### </p>
                            <p>{message}</p>
                            <p>------------------</p>
                        </div>
                        <div>
                            <p> Fight Nr: ###### </p>
                            <p>{message}</p>
                            <p>------------------</p>
                        </div>
                    </div>
                </div>
                <button className="close-button" onClick={onClose}>OK</button>
            </div>
        </div>
    );
}

export default Warning;