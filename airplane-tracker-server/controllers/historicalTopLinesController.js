import {getTopLinesService} from '../services/historicalTopLinesService.js';

export const getTopLines = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const positions = await getTopLinesService(startDate, endDate);
    res.status(200).json(positions);
  } catch (error) {
    next(error);
  }
};