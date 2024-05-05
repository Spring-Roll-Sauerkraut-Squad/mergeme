//To fetch flights and it's waypoints in the last 2 hours
const axios = require('axios');
const fs = require('fs');

async function getFlightsAndWaypointsLast2Hours() {
    try {
        const { currentTime } = getTimestamps();
        
        const response = await axios.get(`https://opensky-network.org/api/flights/all?begin=${currentTime.twoHoursAgo}&end=${currentTime.now}`);

        const flights = response.data;
        const flightsWithWaypoints = [];

        for (const flight of flights) {
            const waypoints = await getWaypointsForFlight(flight);
            if (waypoints) { 
                flightsWithWaypoints.push(waypoints);
            }
        }

        const jsonData = JSON.stringify(flightsWithWaypoints, null, 2);
        fs.writeFileSync('flights_with_waypoints_last_2_hours.json', jsonData);

        console.log('Flights data with waypoints for the last 2 hours saved to flights_with_waypoints_last_2_hours.json');
    } catch (error) {
        handleRequestError(error, 'fetching or saving flight data with waypoints');
    }
}

async function getWaypointsForFlight(flight) {
    try {
        const response = await axios.get(`https://opensky-network.org/api/tracks/all?icao24=${flight.icao24}&begin=${flight.firstSeen}&end=${flight.lastSeen}`);

        const waypoints = response.data.path.map(([timestamp, latitude, longitude, altitude, velocity, onGround]) => ({
            timestamp,
            latitude,
            longitude,
            altitude,
            velocity,
            onGround
        }));

        return {
            flight: {
                ...flight,
                firstSeen: flight.firstSeen,
                lastSeen: flight.lastSeen
            },
            waypoints: {
                icao24: flight.icao24,
                callsign: flight.callsign,
                startTime: flight.firstSeen,
                endTime: flight.lastSeen,
                path: waypoints
            }
        };
    } catch (error) {
        handleRequestError(error, 'fetching waypoints for flight');
        return null;
    }
}

function getTimestamps() {
    const currentTime = Math.floor(Date.now() / 1000); 
    const twoHoursAgo = currentTime - (2 * 60 * 60); 
    return { 
        currentTime: {
            now: currentTime,
            twoHoursAgo: twoHoursAgo
        }
    };
}

function handleRequestError(error, action) {
    console.error(`Error ${action}:`, error);
}

getFlightsAndWaypointsLast2Hours();
