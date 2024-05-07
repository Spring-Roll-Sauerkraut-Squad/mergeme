import neo4j from 'neo4j-driver';
import dotenv from 'dotenv';
dotenv.config();

const driver = neo4j.driver(process.env.NEO4J_URI, neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD));

const getDataFromNeo4j = async (startDate, endDate) => {
  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH (originAirport:Airport)<-[:DEPARTS_FROM]-(flight:Flight)-[:ARRIVES_AT]->(destinationAirport:Airport)
      WHERE flight.flight_date >= $startDate AND flight.flight_date <=  $endDate
      WITH originAirport, destinationAirport, COUNT(flight) AS flightCount
      RETURN originAirport.airport_name AS originAirportName, 
             destinationAirport.airport_name AS destinationAirportName, 
             flightCount
      ORDER BY flightCount DESC
      LIMIT 10
      `,
      { startDate, endDate }
    );

    const lines = result.records.map(record => {
      return {
        originAirportName: record.get('originAirportName'),
        destinationAirportName: record.get('destinationAirportName'),
        totalFlights: record.get('flightCount').low
      };
    });
    return lines;
  } catch (error) {
    console.error('Error executing Cypher query:', error);
    throw error;
  } finally {
    await session.close();
  }
};
export const getTopLinesService = async (startDate, endDate) => {
  console.log('Received time range(getTopLinesService):', startDate, 'to', endDate);
  const topLines = await getDataFromNeo4j(startDate, endDate);
  return topLines;
};