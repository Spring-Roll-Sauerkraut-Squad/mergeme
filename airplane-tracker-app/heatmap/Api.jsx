
const BASE_URL = 'http://localhost:3001';

const getHitoricalHeatmapPositions = async (startDate, endDate) => {
  try {
    const response = await fetch(`${BASE_URL}/historical-heatmap-positions?startDate=${startDate}&endDate=${endDate}`);
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error('API call failed: historical-heatmap-positions');
    }
  } catch (error) {
    throw new Error(`API call failed: historical-heatmap-positions: ${error.message}`);
  }
};

const getHitoricalTopAirports = async (startDate, endDate) => {
    try {
      const response = await fetch(`${BASE_URL}/historical-top-airports?startDate=${startDate}&endDate=${endDate}`);
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        throw new Error('API call failed: historical-top-airports');
      }
    } catch (error) {
      throw new Error(`API call failed: historical-top-airports: ${error.message}`);
    }
  };

  const getHitoricalTopLines = async (startDate, endDate) => {
    try {
      const response = await fetch(`${BASE_URL}/historical-top-lines?startDate=${startDate}&endDate=${endDate}`);
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        throw new Error(`API call failed: historical-top-lines: ${response.statusText}`);
      }
    } catch (error) {
      throw new Error(`API call failed: historical-top-lines: ${error.message}`);
    }
  };

export { getHitoricalHeatmapPositions, getHitoricalTopAirports, getHitoricalTopLines };
