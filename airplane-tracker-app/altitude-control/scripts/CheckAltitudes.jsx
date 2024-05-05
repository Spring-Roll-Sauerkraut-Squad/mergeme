import * as turf from '@turf/turf'

const CheckAltitudes = (flights, airspaces) => {
    const warnings = [];
    flights.forEach(flight => {
        let isCompliant = false;
        const point = turf.point([flight.longitude, flight.latitude]);

        airspaces.forEach(airspace => {
            // Get the first and last coordinate in the LinearRing
            const coordinates = airspace.geometry.coordinates[0];
            const firstCoord = coordinates[0];
            const lastCoord = coordinates[coordinates.length - 1];

            // Check if the first and last coordinates are the same
            if (coordinates.length >= 4 && firstCoord[0] === lastCoord[0] && firstCoord[1] === lastCoord[1]) {
                const polygon = turf.polygon([coordinates]);
                if (turf.booleanPointInPolygon(point, polygon) &&
                    flight.altitude >= airspace.floor && flight.altitude <= airspace.ceiling) {
                    isCompliant = true;
                }
            }
        });

        if (!isCompliant) {
            warnings.push(`Flight ${flight.callsign} at altitude ${flight.altitude} is out of bounds at location ${flight.longitude}, ${flight.latitude}`);
        }
    });
    return warnings;
};

export default CheckAltitudes;
