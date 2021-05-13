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
  '/api/auth/signup', 
  [
    body('name')
      .notEmpty()
      .withMessage('Name must be provided'),
    body('phoneNumber')
      .notEmpty()
      .withMessage('Phone number must be provided')
  ],
  validateRequest,
  auth.signUp
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
