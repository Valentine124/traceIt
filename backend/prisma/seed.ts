import { PrismaClient, RoleName, ProjectCategory, ProjectStatus, SourceType, RecordOrigin } from '@prisma/client';
import { hashPassword } from '../src/modules/auth/password.util';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding TraceIt development data...');

  // --- Roles & permissions ---
  const roleNames = [RoleName.CITIZEN, RoleName.VERIFIER, RoleName.ORGANIZATION_ADMIN, RoleName.SYSTEM_ADMIN];
  const roles: Record<string, { id: string }> = {};
  for (const name of roleNames) {
    roles[name] = await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name, description: `${name} role` },
    });
  }

  const permissionKeys = [
    'projects:read',
    'projects:write',
    'reports:read',
    'reports:verify',
    'reports:respond',
    'admin:manage_users',
  ];
  for (const key of permissionKeys) {
    await prisma.permission.upsert({ where: { key }, update: {}, create: { key } });
  }

  // --- Users ---
  const adminPasswordHash = await hashPassword('DevAdminPassword123!');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@traceit.dev' },
    update: {},
    create: {
      email: 'admin@traceit.dev',
      passwordHash: adminPasswordHash,
      displayName: 'System Admin (seed)',
      authProvider: 'EMAIL_PASSWORD',
    },
  });
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: admin.id, roleId: roles[RoleName.SYSTEM_ADMIN].id } },
    update: {},
    create: { userId: admin.id, roleId: roles[RoleName.SYSTEM_ADMIN].id },
  });

  const verifierPasswordHash = await hashPassword('DevVerifierPassword123!');
  const verifier = await prisma.user.upsert({
    where: { email: 'verifier@traceit.dev' },
    update: {},
    create: {
      email: 'verifier@traceit.dev',
      passwordHash: verifierPasswordHash,
      displayName: 'Sample Verifier',
      authProvider: 'EMAIL_PASSWORD',
    },
  });
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: verifier.id, roleId: roles[RoleName.VERIFIER].id } },
    update: {},
    create: { userId: verifier.id, roleId: roles[RoleName.VERIFIER].id },
  });

  const citizen = await prisma.user.upsert({
    where: { phone: '+2348012345000' },
    update: {},
    create: { phone: '+2348012345000', displayName: 'Sample Citizen', authProvider: 'PHONE_OTP' },
  });
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: citizen.id, roleId: roles[RoleName.CITIZEN].id } },
    update: {},
    create: { userId: citizen.id, roleId: roles[RoleName.CITIZEN].id },
  });

  // --- Organization ---
  const org = await prisma.organization.create({
    data: {
      name: 'Ministry of Works (Sample State)',
      description: 'Sample government institution for development/testing.',
      country: 'Nigeria',
      isVerified: true,
      members: { create: { userId: admin.id, isAdmin: true } },
    },
  });

  // --- Projects ---
  const projectsData = [
    {
      name: 'Ogbomoso Rural Health Center Renovation',
      description: 'Renovation and equipping of the primary health center serving Ogbomoso North.',
      category: ProjectCategory.HEALTHCARE,
      country: 'Nigeria',
      region: 'Oyo State',
      community: 'Ogbomoso',
      budgetAmount: 45000000,
      budgetCurrency: 'NGN',
      contractor: 'Sample Builders Ltd',
      status: ProjectStatus.ONGOING,
    },
    {
      name: 'Kisumu-Bondo Feeder Road Upgrade',
      description: 'Grading and tarring of the 12km feeder road connecting Kisumu to Bondo market.',
      category: ProjectCategory.ROADS,
      country: 'Kenya',
      region: 'Kisumu County',
      community: 'Bondo',
      budgetAmount: 8500000,
      budgetCurrency: 'KES',
      contractor: 'Lakeview Construction',
      status: ProjectStatus.DELAYED,
    },
    {
      name: 'Tamale Primary School Borehole Project',
      description: 'Installation of a solar-powered borehole to serve Tamale Primary School and surrounding community.',
      category: ProjectCategory.WATER,
      country: 'Ghana',
      region: 'Northern Region',
      community: 'Tamale',
      budgetAmount: 120000,
      budgetCurrency: 'GHS',
      status: ProjectStatus.COMPLETED,
    },
  ];

  const createdProjects = [];
  for (const p of projectsData) {
    const project = await prisma.project.create({
      data: {
        ...p,
        responsibleOrgId: org.id,
        statusHistory: { create: { status: p.status, note: 'Seed data' } },
      },
    });
    createdProjects.push(project);
  }

  // --- Sources ---
  const source = await prisma.source.create({
    data: {
      title: 'Oyo State 2025 Capital Budget (Health Sector)',
      publisher: 'Oyo State Ministry of Finance',
      sourceType: SourceType.BUDGET_DOCUMENT,
      origin: RecordOrigin.OFFICIAL_SOURCE,
      publicationDate: new Date('2025-01-15'),
      url: 'https://example.gov/budget-2025-health.pdf',
    },
  });
  await prisma.projectSource.create({
    data: { projectId: createdProjects[0].id, sourceId: source.id },
  });

  // --- Sample report (protected, not anonymous) ---
  const report = await prisma.report.create({
    data: {
      projectId: createdProjects[1].id,
      title: 'Road work appears stalled since March',
      description: 'No visible construction activity at the Bondo road site for over two months.',
      status: 'UNDER_REVIEW',
      visibility: 'PROTECTED',
      statusHistory: { create: { status: 'RECEIVED' } },
      identity: { create: { userId: citizen.id } },
    },
  });
  await prisma.reportStatusHistory.create({
    data: { reportId: report.id, status: 'UNDER_REVIEW', note: 'Assigned for verification', changedBy: verifier.id },
  });

  console.log('Seed complete.');
  console.log('Sample logins:');
  console.log('  admin@traceit.dev / DevAdminPassword123!');
  console.log('  verifier@traceit.dev / DevVerifierPassword123!');
  console.log('  citizen phone: +2348012345000 (use OTP flow — check server logs for the mock OTP)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
