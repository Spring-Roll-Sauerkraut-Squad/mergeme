//To fetch flights and its airports from MongoDB
const fetchWaypoints = async () => {
  try {
    if (typeof fetch !== 'undefined') {
      const response = await fetch('http://localhost:3000/api/data?collectionName=airports'); 
      const data = await response.json();
      return data;
    } else {
      throw new Error('Fetch API is not available');
    }
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};

export default fetchWaypoints;