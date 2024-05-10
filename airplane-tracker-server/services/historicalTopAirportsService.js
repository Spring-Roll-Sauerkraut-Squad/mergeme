import neo4j from 'neo4j-driver';
import dotenv from 'dotenv';
dotenv.config();

const driver = neo4j.driver(process.env.NEO4J_URI, neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD));

const getDataFromNeo4j = async (startDate, endDate) => {
  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH (flight:Flight)-[:DEPARTS_FROM]->(airport:Airport)
      WHERE flight.flight_date >= $startDate AND flight.flight_date <= $endDate
      WITH airport, COUNT(flight) AS departuresCount

      MATCH (flight:Flight)-[:ARRIVES_AT]->(airport)
      WHERE flight.flight_date >= $startDate AND flight.flight_date <= $endDate
      WITH airport, departuresCount, COUNT(flight) AS arrivalsCount

      WITH airport, departuresCount, arrivalsCount, departuresCount + arrivalsCount AS totalFlights

      RETURN airport.airport_code AS airportCode, airport.airport_name as airportName, totalFlights
      ORDER BY totalFlights DESC
      LIMIT 10
      `,
      { startDate, endDate }
    );

    const airports = result.records.map(record => {
      return {
        airportCode: record.get('airportCode'),
        airportName: record.get('airportName'),
        totalFlights: record.get('totalFlights').low
      };
    });
    return airports;
  } catch (error) {
    console.error('Error executing Cypher query:', error);
    throw error;
  } finally {
    await session.close();
  }
};
export const getTopAirportsService = async (startDate, endDate) => {
  console.log('Received time range(getTopAirportsService):', startDate, 'to', endDate);
  const topAirports = await getDataFromNeo4j(startDate, endDate);
  return topAirports;
};