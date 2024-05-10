import neo4j from 'neo4j-driver';
import dotenv from 'dotenv';
dotenv.config();

const driver = neo4j.driver(process.env.NEO4J_URI, neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD));

const getPositionsFromNeo4j = async (startDate, endDate) => {
  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH (flight:Flight)-[:DEPARTS_FROM|ARRIVES_AT]->(airport:Airport)
      WHERE flight.flight_date >= $startDate AND flight.flight_date <= $endDate
      RETURN airport.latitude AS latitude, airport.longitude AS longitude, COUNT(*) AS count
      ORDER BY count(*) DESC
      `,
      { startDate, endDate }
    );

    const positions = result.records.map(record => ({
      latitude: record.get('latitude'),
      longitude: record.get('longitude'),
      count: record.get('count').toNumber(),
    }));
    return positions;
  } catch (error) {
    console.error('Error executing Cypher query:', error);
    throw error;
  } finally {
    await session.close();
  }
};

export const getPositionsService = async (startDate, endDate) => {
  console.log('Received time range:', startDate, 'to', endDate);
  const positions = await getPositionsFromNeo4j(startDate, endDate);
  return positions;
};