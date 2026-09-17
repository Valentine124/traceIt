import { env, externalServiceAvailability } from '../../config/env';
import { logger } from '../../common/utils/logger';
import { ExternalServiceError } from '../../common/errors/AppError';

export interface SmsAdapter {
  send(phone: string, body: string): Promise<void>;
}

class AfricasTalkingAdapter implements SmsAdapter {
  async send(phone: string, body: string): Promise<void> {
    const res = await fetch('https://api.africastalking.com/version1/messaging', {
      method: 'POST',
      headers: {
        apiKey: env.AFRICAS_TALKING_API_KEY!,
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: new URLSearchParams({
        username: env.AFRICAS_TALKING_USERNAME!,
        to: phone,
        message: body,
        ...(env.AFRICAS_TALKING_SHORTCODE ? { from: env.AFRICAS_TALKING_SHORTCODE } : {}),
      }),
    });
    if (!res.ok) {
      throw new ExternalServiceError('AfricasTalking', `HTTP ${res.status}`);
    }
  }
}

/** Local/dev fallback — logs instead of sending so development isn't blocked
 * on having live SMS credentials (spec §27: mock when service unavailable). */
class MockSmsAdapter implements SmsAdapter {
  async send(phone: string, body: string): Promise<void> {
    logger.info({ phone: phone.slice(0, 4) + '***' }, `[MOCK SMS] would send: "${body}"`);
  }
}

export const smsAdapter: SmsAdapter = externalServiceAvailability.africasTalking
  ? new AfricasTalkingAdapter()
  : new MockSmsAdapter();
