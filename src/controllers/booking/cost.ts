import { Request, Response } from 'express';

/**
 * Calculate the price to pay for a travel from one point to another
 */
const calculateTravelCost = async (req: Request, res: Response) => {
  const { from, to, distance } = req.body;

  return res.json();
}

export default calculateTravelCost;
