import { Queue } from 'bullmq';
import { NotificationChannel, NotificationEvent } from '@prisma/client';
import { redis } from '../../database/redis';
import { prisma } from '../../database/prisma';
import { logger } from '../../common/utils/logger';

const notificationQueue = new Queue('notifications', { connection: redis.duplicate() });

export interface NotificationRequest {
  userId?: string;
  reportId?: string;
  event: NotificationEvent;
  channel: NotificationChannel;
  payload?: Record<string, unknown>;
}

/**
 * Enqueues a notification for background delivery. Never awaited by request
 * handlers for the actual send — API responses must not block on SMS/email
 * provider latency (spec §15).
 */
export async function enqueueNotification(req: NotificationRequest): Promise<void> {
  const record = await prisma.notification.create({
    data: {
      userId: req.userId,
      reportId: req.reportId,
      event: req.event,
      channel: req.channel,
      payload: req.payload as any,
      status: 'PENDING',
    },
  });
  await notificationQueue.add('deliver', { notificationId: record.id }, {
    attempts: 5,
    backoff: { type: 'exponential', delay: 5000 },
  });
}

/**
 * Direct SMS send used by time-sensitive flows (OTP) where the message
 * itself IS the response the user is waiting for. Everything else should go
 * through enqueueNotification.
 *
 * Behind an adapter so the Africa's Talking dependency can be swapped/mocked.
 */
export async function sendSms(phone: string, body: string): Promise<void> {
  const { smsAdapter } = await import('../sms/sms.adapter');
  try {
    await smsAdapter.send(phone, body);
  } catch (err) {
    logger.error({ err, phone: phone.slice(0, 4) + '***' }, 'Failed to send SMS');
    throw err;
  }
}
