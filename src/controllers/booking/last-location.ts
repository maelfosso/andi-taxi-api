import { Request, Response } from 'express';
import { DatabaseError } from '../../errors/database-error';
import { Travel, TravelDocument, Location } from '../../models/travel.model';

/**
 * Get the last 6 location where the customer comes from 
 * or were dropped by the taxi
 */
const getLastLocations = async (req: Request, res: Response) => {
  const { id } = req.currentUser!;

  let travels: TravelDocument[];

  try {
    travels = await Travel.find({ orderedBy: id }).limit(3);
  } catch(e) {
    throw new DatabaseError(`error when finding all travels ordered by ${id}`);
  }

  const location: Location[] = [];
  for (let i=0; i < travels.length; i++) {
    let travel: TravelDocument = travels[i];

    location.push(travel.from);
    location.push(travel.to);
  }

  return res.json(location);
}

export default getLastLocations;
