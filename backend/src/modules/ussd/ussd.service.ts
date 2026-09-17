import { getSession, saveSession, clearSession, UssdSessionState } from './ussd.session';
import { listProjects } from '../projects/projects.service';
import { createReport, trackReport } from '../reports/reports.service';
import { ReportVisibility, Language } from '@prisma/client';

const MAIN_MENU = `CON Welcome to TraceIt
1. Find project
2. Report an issue
3. Track a report
4. Help`;

interface UssdRequest {
  sessionId: string;
  phoneNumber: string;
  text: string; // Africa's Talking sends the FULL accumulated input, '*'-joined
}

/**
 * USSD is a thin transport: every branch below calls the same
 * projects/reports services the Web/Mobile API uses — no parallel business
 * logic lives here, per spec §13.
 */
export async function handleUssdRequest(req: UssdRequest): Promise<string> {
  const parts = req.text.split('*').filter(Boolean);
  const lastInput = parts[parts.length - 1];

  let session = await getSession(req.sessionId);

  if (!session) {
    if (parts.length === 0) {
      session = { stage: 'MENU', context: {} };
      await saveSession(req.sessionId, session);
      return MAIN_MENU;
    }
    session = { stage: 'MENU', context: {} };
  }

  return route(req, session, lastInput);
}

async function route(
  req: UssdRequest,
  session: UssdSessionState,
  input: string,
): Promise<string> {
  if (session.stage === 'MENU') {
    switch (input) {
      case '1':
        session.stage = 'FIND_PROJECT';
        await saveSession(req.sessionId, session);
        return 'CON Enter your community or town name:';
      case '2':
        session.stage = 'REPORT_ISSUE';
        session.context = {};
        await saveSession(req.sessionId, session);
        return 'CON Briefly describe the issue (max 160 chars):';
      case '3':
        session.stage = 'TRACK_REPORT';
        await saveSession(req.sessionId, session);
        return 'CON Enter your tracking ID:';
      case '4':
        await clearSession(req.sessionId);
        return 'END TraceIt lets you find civic projects, report issues, and track responses. Visit traceit.africa for more.';
      default:
        return MAIN_MENU;
    }
  }

  if (session.stage === 'FIND_PROJECT') {
    const result = await listProjects(
      { community: input, page: 1, pageSize: 3, sortBy: 'createdAt', sortDir: 'desc' },
      { page: 1, pageSize: 3 },
    );
    await clearSession(req.sessionId);
    if (result.items.length === 0) {
      return `END No projects found for "${input}". Try a different community name.`;
    }
    const lines = result.items.map((p) => `- ${p.name} (${p.status})`).join('\n');
    return `END Projects in ${input}:\n${lines}`;
  }

  if (session.stage === 'REPORT_ISSUE') {
    if (!session.context.description) {
      session.context.description = input;
      await saveSession(req.sessionId, session);
      return 'CON Report anonymously? 1=Yes 2=No';
    }
    const anonymous = input === '1';
    const report = await createReport(
      {
        title: 'USSD-submitted report',
        description: String(session.context.description),
        visibility: anonymous ? ReportVisibility.ANONYMOUS : ReportVisibility.PROTECTED,
        language: Language.EN,
        contactPhone: anonymous ? undefined : req.phoneNumber,
      },
      undefined,
    );
    await clearSession(req.sessionId);
    return `END Thank you. Your tracking ID is ${report.trackingId}. Save it to check status later.`;
  }

  if (session.stage === 'TRACK_REPORT') {
    await clearSession(req.sessionId);
    try {
      const report = await trackReport(input);
      return `END Report status: ${report.status}`;
    } catch {
      return 'END Tracking ID not found. Please check and try again.';
    }
  }

  await clearSession(req.sessionId);
  return MAIN_MENU;
}
