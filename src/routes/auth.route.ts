import express from 'express';
import { body } from 'express-validator';

import * as auth from '../controllers/auth.controller';
import { validateRequest } from '../middlewares/validate-request';

const router = express.Router();

router.post(
  '/api/auth/signin', 
  [
    body('name')
      .isString()
      .withMessage('Name must be provided'),
    body('phoneNumber')
      .isString()
      .withMessage('Phone number must be provided')
  ],
  validateRequest,
  auth.signIn
);

router.post(
  '/api/auth/signup', 
  [
    body('name')
      .isString()
      .withMessage('Name must be provided'),
    body('phoneNumber')
      .isString()
      .withMessage('Phone number must be provided')
  ],
  validateRequest,
  auth.signUp
);

router.post(
  '/api/auth/signcode', 
  [
    body('name')
      .isString()
      .withMessage('Name must be provided'),
    body('phoneNumber')
      .isString()
      .withMessage('Phone number must be provided')
  ],
  validateRequest,
  auth.signCode
);