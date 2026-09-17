import { Router, Request, Response, NextFunction } from 'express';
import { handleUssdRequest } from './ussd.service';

const router = Router();

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Africa's Talking posts application/x-www-form-urlencoded.
    const { sessionId, phoneNumber, text } = req.body as {
      sessionId: string;
      phoneNumber: string;
      text: string;
    };
    const responseText = await handleUssdRequest({ sessionId, phoneNumber, text: text ?? '' });
    res.set('Content-Type', 'text/plain');
    res.status(200).send(responseText);
  } catch (err) {
    next(err);
  }
});

export default router;
