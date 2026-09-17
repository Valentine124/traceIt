import { redis } from '../../database/redis';

export interface UssdSessionState {
  stage: 'MENU' | 'FIND_PROJECT' | 'REPORT_ISSUE' | 'TRACK_REPORT' | 'DONE';
  context: Record<string, unknown>;
}

const SESSION_TTL_SECONDS = 180; // USSD sessions are short-lived by nature

function key(sessionId: string): string {
  return `ussd:session:${sessionId}`;
}

export async function getSession(sessionId: string): Promise<UssdSessionState | null> {
  const raw = await redis.get(key(sessionId));
  return raw ? JSON.parse(raw) : null;
}

export async function saveSession(sessionId: string, state: UssdSessionState): Promise<void> {
  await redis.set(key(sessionId), JSON.stringify(state), 'EX', SESSION_TTL_SECONDS);
}

export async function clearSession(sessionId: string): Promise<void> {
  await redis.del(key(sessionId));
}
