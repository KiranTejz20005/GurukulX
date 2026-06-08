import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  
  const user = await prisma.user.create({
    data: {
      email: 'dev@acme.com',
      name: 'Dev User',
    }
  });

  // 1. Create a workspace
  const workspace = await prisma.workspace.create({
    data: {
      name: 'Acme Corp',
      slug: 'acme-corp',
      customDomain: 'acme.lms.com',
    },
  });

  // 2. Create a course
  const course = await prisma.course.create({
    data: {
      title: 'Advanced NestJS & Next.js',
      description: 'Master the fullstack monorepo',
      workspaceId: workspace.id,
      instructorId: user.id,
      published: true,
    },
  });

  console.log(`Created workspace: ${workspace.id}`);
  console.log(`Created course: ${course.id}`);
  console.log(`\n=> Visit http://localhost:3000/courses/${course.id}/builder to see the UI`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
