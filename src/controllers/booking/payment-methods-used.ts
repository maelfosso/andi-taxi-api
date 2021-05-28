import { Request, Response } from 'express';

/**
 * Get the different payment method used by the customer
 */
const getPaymentMethodsUsed = async (req: Request, res: Response) => {
  const methods = [
    { type: 'visa', account: '4512875496523256' },
    { type: 'mastercard', account: '5684795102311154' }
  ]

  return res.json(methods);
}

export default getPaymentMethodsUsed;
