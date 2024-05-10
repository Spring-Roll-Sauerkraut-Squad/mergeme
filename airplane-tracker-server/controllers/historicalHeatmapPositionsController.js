import {getPositionsService} from '../services/historicalHeatmapPositionsService.js';

export const getPotisions = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const positions = await getPositionsService(startDate, endDate);
    res.status(200).json(positions);
  } catch (error) {
    next(error);
  }
};