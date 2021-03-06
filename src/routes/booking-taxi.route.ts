import express from 'express';
import { body } from 'express-validator';

import * as bookingTaxi from '../controllers/booking';
import { requireAuth } from '../middlewares/required-auth';
import { validateRequest } from '../middlewares/validate-request';

const router = express.Router();

router.get(
  '/api/booking/last-locations', 
  requireAuth,
  bookingTaxi.getLastLocations
);

router.post(
  '/api/booking/cost-time',
  requireAuth,
  [
    body('from')
      .notEmpty()
      .withMessage('From position must be provided'),
    body('to')
      .notEmpty()
      .withMessage('To position must be provided'),
    body('distance')
      .notEmpty()
      .withMessage('Distance between the two point must be provided')
  ],
  validateRequest,
  bookingTaxi.calculateTravelCostTime
);

router.get(
  '/api/booking/payment-methods-used',
  requireAuth,
  bookingTaxi.getPaymentMethodsUsed
);

router.post(
  '/api/booking/taxi-around', 
  requireAuth,
  [
    body('position')
      .notEmpty()
      .withMessage('Position must be provided')
  ],
  validateRequest,
  bookingTaxi.getTaxiAround
);

export { router as bookingTaxiRouter };
