import React from 'react';
import HistoricalHeatMap from './HistoricalHeatMap';
import RealTimeHeatMap from './RealtimeHeatMap';

function HeatMap() {
    return (
        <div>
            <div>
                <HistoricalHeatMap />
            </div>
            <div>
                <RealTimeHeatMap />
            </div>
        </div>
    );
}

export default HeatMap;