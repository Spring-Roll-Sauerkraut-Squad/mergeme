import {getTopAirportsService} from '../services/historicalTopAirportsService.js';

export const getTopAirports = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const positions = await getTopAirportsService(startDate, endDate);
    res.status(200).json(positions);
  } catch (error) {
    next(error);
  }
};