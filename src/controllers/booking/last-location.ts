import { Request, Response } from 'express';

/**
 * Get the last 6 location where the customer comes from 
 * or were dropped by the taxi
 */
const getLastLocations = async (req: Request, res: Response) => {

  return res.json([]);
}

export default getLastLocations;
