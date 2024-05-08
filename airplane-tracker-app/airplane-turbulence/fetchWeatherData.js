//Fetching weather data from the WeatherAPI
import config from './config';

export const fetchWeatherData = async (latitude, longitude) => {
  try {
    const apiKey = config.apiKey;
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude},${longitude}`;
    const response = await fetch(url);
    return response;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};