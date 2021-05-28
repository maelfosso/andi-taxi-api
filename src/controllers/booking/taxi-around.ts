import { Request, Response } from 'express';

/**
 * Get all the taxi around a position
 */
const getTaxiAround = async (req: Request, res: Response) => {
  const { position } = req.body;

  return res.json([]);
}

export default getTaxiAround;
