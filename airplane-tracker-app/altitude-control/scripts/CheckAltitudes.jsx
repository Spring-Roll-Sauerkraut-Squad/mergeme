import * as turf from '@turf/turf';

const CheckAltitudes = (flights, airspaces) => {
    const warnings = [];
    flights.forEach(flight => {
        let isCompliant = false;
        const point = turf.point([flight.longitude, flight.latitude]);

        airspaces.forEach(airspace => {
            const polygon = turf.polygon([airspace.geometry.coordinates]);
            if (turf.booleanPointInPolygon(point, polygon) &&
                flight.altitude >= airspace.floor && flight.altitude <= airspace.ceiling) {
                isCompliant = true;
            }
        });

        if (!isCompliant) {
            warnings.push(`Flight ${flight.callsign || "[no callsign provided]"} at altitude ${flight.altitude} is out of bounds at location ${flight.longitude}, ${flight.latitude}`);
        }
    });
    
    if (warnings.length) {
        return [];
    }
    return warnings;
};

export default CheckAltitudes;