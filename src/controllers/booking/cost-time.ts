import { Request, Response } from 'express';

function randomNumber(min: number, max: number) { 
  return Math.random() * (max - min) + min;
} 

/**
 * Calculate the price to pay for a travel from one point to another
 */
const calculateTravelCost = async (req: Request, res: Response) => {
  const { from, to, distance } = req.body;

  const time = randomNumber(1, 60);
  const cost = randomNumber(10, 30);
  const d = randomNumber(1, 5);

  return res.json([cost - d, cost + d, time]);
}

export default calculateTravelCost;
