import { Request, Response } from 'express';

/**
 * Booking a taxi
 */
const bookingTaxi = async (req: Response, res: Response) => {
  const { from, to, distance, cost } = req.body;

  return res.json({});
}

export default bookingTaxi;
