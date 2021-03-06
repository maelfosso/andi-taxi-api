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
    body('rcIdentificationNumber').notEmpty().withMessage('RC Identification number must be provided'),
    body('residenceAddress').notEmpty().withMessage('Residence address must be provided'),
    body('realResidenceAddress').notEmpty().withMessage('Real Residence address must be provided'),
    body('car').notEmpty().withMessage('Car number must be provided'),
    body('car.registrationNumber').notEmpty().withMessage('Car registration number must be provided'),
    body('car.model').notEmpty().withMessage('Car model must be provided'),
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
