//Script to fetch data from API and save it to MongoDB
import axios from 'axios';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

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

        await saveToMongoDB(flightsWithWaypoints);
        console.log('Flights data with waypoints for the last 2 hours saved to MongoDB');
    } catch (error) {
        handleError(error, 'fetching or saving flight data with waypoints');
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
        handleError(error, 'fetching waypoints for flight');
        return null;
    }
}

async function saveToMongoDB(data) {
    const uri = process.env.MONGO_URI;
    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        authSource: 'admin',
    };
    const client = new MongoClient(uri, options);

    try {
        await client.connect();
        const database = client.db('aircraftTracker');
        const collection = database.collection('aircraft-waypoints');

        // Delete old data
        await collection.deleteMany({});

        // Insert new data
        for (const item of data) {
            await collection.insertOne(item);
        }
        console.log('Data saved to MongoDB successfully');
    } catch (error) {
        handleError(error, 'saving data to MongoDB');
    } finally {
        await client.close();
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

function handleError(error, action) {
    console.error(`Error ${action}:`, error);
}

getFlightsAndWaypointsLast2Hours();
