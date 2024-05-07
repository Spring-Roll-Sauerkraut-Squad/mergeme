import neo4j from 'neo4j-driver';
import dotenv from 'dotenv';
dotenv.config();
import { v4  } from 'uuid';

const driver = neo4j.driver(process.env.NEO4J_URI, neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD));

const getDataFromNeo4j = async (flightID) => {
  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH (flight:Flight)
      WHERE flight.flight_id >= $flightID
      WITH flight
      LIMIT 100
      OPTIONAL MATCH (flight)-[:DEPARTS_FROM]->(departureAirport:Airport)
      OPTIONAL MATCH (flight)-[:ARRIVES_AT]->(arrivalAirport:Airport)
      RETURN flight.flight_id AS flightID,
             departureAirport.airport_code AS departureAirportCode,
             departureAirport.airport_name AS departureAirportName,
             departureAirport.latitude AS departureLatitude,
             departureAirport.longitude AS departureLongitude,
             arrivalAirport.airport_code AS arrivalAirportCode,
             arrivalAirport.airport_name AS arrivalAirportName,
             arrivalAirport.latitude AS arrivalLatitude,
             arrivalAirport.longitude AS arrivalLongitude
      `,
      { flightID }
    );

    const realtimeFlights = result.records.map(record => {
      return {
        flightID: record.get('flightID'),
        departureAirportCode: record.get('departureAirportCode'),
        departureAirportName: record.get('departureAirportName'),
        departureLatitude: record.get('departureLatitude'),
        departureLongitude: record.get('departureLongitude'),
        arrivalAirportCode: record.get('arrivalAirportCode'),
        arrivalAirportName: record.get('arrivalAirportName'),
        arrivalLatitude: record.get('arrivalLatitude'),
        arrivalLongitude: record.get('arrivalLongitude')
      };
    });
    return realtimeFlights;
  } catch (error) {
    console.error('Error executing Cypher query:', error);
    throw error;
  } finally {
    await session.close();
  }
};
export const getRealtimeMockingFlights = async () => {
  const flightID = v4();
  console.log('Flight ID: ', flightID);
  const flights = await getDataFromNeo4j(flightID);
  return flights;
};