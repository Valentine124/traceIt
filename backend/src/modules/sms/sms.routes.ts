import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../../database/prisma';
import { trackReport } from '../reports/reports.service';
import { sendSms } from '../notifications/notification.service';

const router = Router();

/**
 * Idempotent by providerMsgId: retried webhook deliveries (Africa's
 * Talking/any SMS gateway will retry on timeout) must not double-process.
 */
router.post('/inbound', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { from, text, id: providerMsgId } = req.body as { from: string; text: string; id?: string };

    if (providerMsgId) {
      const existing = await prisma.sMSMessage.findUnique({ where: { providerMsgId } });
      if (existing) {
        res.status(200).send('OK'); // Already processed — ack without reprocessing.
        return;
      }
    }

    await prisma.sMSMessage.create({
      data: { direction: 'inbound', phone: from, body: text, providerMsgId },
    });

    await processCommand(from, text.trim());
    res.status(200).send('OK');
  } catch (err) {
    next(err);
  }
});

async function processCommand(phone: string, text: string): Promise<void> {
  const [command, ...args] = text.split(' ');

  switch (command.toUpperCase()) {
    case 'HELP':
      await sendSms(phone, 'TraceIt commands: PROJECT <ID>, STATUS <trackingId>, REPORT <ID> <message>');
      return;
    case 'STATUS': {
      if (!args[0]) return void (await sendSms(phone, 'Usage: STATUS <trackingId>'));
      try {
        const report = await trackReport(args[0]);
        await sendSms(phone, `Report status: ${report.status}`);
      } catch {
        await sendSms(phone, 'Tracking ID not found.');
      }
      return;
    }
    default:
      await sendSms(phone, 'Unrecognized command. Text HELP for options.');
  }
}

export default router;
