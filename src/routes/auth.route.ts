import express from 'express';
import { body } from 'express-validator';

import * as auth from '../controllers/auth.controller';
import { validateRequest } from '../middlewares/validate-request';

const router = express.Router();

router.post(
  '/api/auth/signin', 
  [
    body('phoneNumber')
      .notEmpty()
      .withMessage('Phone number must be provided')
  ],
  validateRequest,
  auth.signIn
);

router.post(
  '/api/auth/signup/client', 
  [
    body('name')
      .notEmpty()
      .withMessage('Name must be provided'),
    body('phoneNumber')
      .notEmpty()
      .withMessage('Phone number must be provided')
  ],
  validateRequest,
  auth.signUpClient
);

router.post(
  '/api/auth/signup/driver', 
  [
    body('name').notEmpty().withMessage('Name must be provided'),
    body('phoneNumber').notEmpty().withMessage('Phone number must be provided'),
    body('address').notEmpty().withMessage('Address number must be provided'),
    body('car').notEmpty().withMessage('Car number must be provided'),
    body('car.identificationNumber').notEmpty().withMessage('Car identification number must be provided'),
    body('car.class').notEmpty().withMessage('Car class must be provided'),
  ],
  validateRequest,
  auth.signUpDriver
);

router.post(
  '/api/auth/signcode', 
  [
    body('code')
      .notEmpty()
      .withMessage('Code must be provided'),
    body('phoneNumber')
      .notEmpty()
      .withMessage('Phone number must be provided')
  ],
  validateRequest,
  auth.signCode
);

export { router as authRouter };
