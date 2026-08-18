const { PrismaClient } = require('../../../node_modules/@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting GurukulX database seeding...');

  // Clean existing data for clean seed
  await prisma.forumPost.deleteMany({});
  await prisma.forum.deleteMany({});
  await prisma.submission.deleteMany({});
  await prisma.assignment.deleteMany({});
  await prisma.quizAttempt.deleteMany({});
  await prisma.quiz.deleteMany({});
  await prisma.progress.deleteMany({});
  await prisma.lesson.deleteMany({});
  await prisma.module.deleteMany({});
  await prisma.enrollment.deleteMany({});
  await prisma.courseTag.deleteMany({});
  await prisma.programCourse.deleteMany({});
  await prisma.program.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.workspaceMember.deleteMany({});
  await prisma.apiKey.deleteMany({});
  await prisma.media.deleteMany({});
  await prisma.tag.deleteMany({});
  await prisma.workspace.deleteMany({});
  await prisma.user.deleteMany({});

  // 1. Create Users
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@gurukulx.dev',
      name: 'GurukulX Admin',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=GurukulAdmin',
    },
  });

  const instructorUser = await prisma.user.create({
    data: {
      email: 'instructor@gurukulx.dev',
      name: 'Sarah Connor (Lead Instructor)',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SarahInstructor',
    },
  });

  const studentUser = await prisma.user.create({
    data: {
      email: 'student@gurukulx.dev',
      name: 'Kiran Teja',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kiran',
    },
  });

  // 2. Create Workspace
  const workspace = await prisma.workspace.create({
    data: {
      name: 'GurukulX Academy',
      slug: 'gurukulx',
      customDomain: 'academy.gurukulx.dev',
      branding: JSON.stringify({ primaryColor: '#2563eb', theme: 'dark' }),
    },
  });

  // 3. Create Workspace Members
  await prisma.workspaceMember.createMany({
    data: [
      { userId: adminUser.id, workspaceId: workspace.id, role: 'ADMIN' },
      { userId: instructorUser.id, workspaceId: workspace.id, role: 'INSTRUCTOR' },
      { userId: studentUser.id, workspaceId: workspace.id, role: 'STUDENT' },
    ],
  });

  // 4. Create Tags
  const tagTech = await prisma.tag.create({
    data: { workspaceId: workspace.id, name: 'Web Dev', color: '#3b82f6' },
  });
  const tagBackend = await prisma.tag.create({
    data: { workspaceId: workspace.id, name: 'Backend', color: '#10b981' },
  });

  // 5. Create Courses
  const course1 = await prisma.course.create({
    data: {
      title: 'Fullstack Next.js 16 & React 19 Mastery',
      description: 'Build high-performance monorepo web applications using Next.js App Router, Tailwind CSS, and Prisma.',
      workspaceId: workspace.id,
      instructorId: instructorUser.id,
      published: true,
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    },
  });

  const course2 = await prisma.course.create({
    data: {
      title: 'Advanced NestJS 11 & Microservices Architecture',
      description: 'Master backend engineering, dependency injection, custom guards, RxJS, and clean enterprise API design.',
      workspaceId: workspace.id,
      instructorId: instructorUser.id,
      published: true,
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    },
  });

  // Associate tags
  await prisma.courseTag.createMany({
    data: [
      { courseId: course1.id, tagId: tagTech.id },
      { courseId: course2.id, tagId: tagBackend.id },
    ],
  });

  // 6. Create Modules & Lessons for Course 1
  const module1 = await prisma.module.create({
    data: {
      courseId: course1.id,
      title: 'Module 1: Monorepo Setup & Architecture',
      order: 1,
    },
  });

  const lesson1 = await prisma.lesson.create({
    data: {
      moduleId: module1.id,
      title: 'Introduction to Turborepo & App Structure',
      type: 'RICH_TEXT',
      content: '### Welcome to GurukulX Monorepo Architecture\nIn this lesson we cover turborepo pipelines and workspace organization.',
      order: 1,
      isPublished: true,
    },
  });

  const lesson2 = await prisma.lesson.create({
    data: {
      moduleId: module1.id,
      title: 'Next.js 16 Server Components & Hydration Best Practices',
      type: 'VIDEO',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      order: 2,
      isPublished: true,
    },
  });

  const lesson3 = await prisma.lesson.create({
    data: {
      moduleId: module1.id,
      title: 'Knowledge Check: Next.js 16 & Monorepo Basics',
      type: 'QUIZ',
      order: 3,
      isPublished: true,
    },
  });

  // Create Quiz for Lesson 3
  await prisma.quiz.create({
    data: {
      lessonId: lesson3.id,
      passingScore: 70,
      questions: JSON.stringify([
        {
          id: 'q1',
          question: 'What command starts the GurukulX dev servers in Turborepo?',
          options: ['npm run dev', 'npm start', 'turbo build', 'next start'],
          correctAnswer: 'npm run dev',
          points: 50,
        },
        {
          id: 'q2',
          question: 'Which ORM is used for database management in GurukulX?',
          options: ['Prisma', 'TypeORM', 'Sequelize', 'Mongoose'],
          correctAnswer: 'Prisma',
          points: 50,
        },
      ]),
    },
  });

  const lesson4 = await prisma.lesson.create({
    data: {
      moduleId: module1.id,
      title: 'Assignment: Build a Custom Layout Component',
      type: 'ASSIGNMENT',
      order: 4,
      isPublished: true,
    },
  });

  // Create Assignment for Lesson 4
  await prisma.assignment.create({
    data: {
      lessonId: lesson4.id,
      prompt: 'Create a responsive sidebar component using Tailwind CSS and Radix UI primitives. Submit your repository link or code snippet.',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    },
  });

  // 7. Enroll Student in Course 1
  const enrollment = await prisma.enrollment.create({
    data: {
      courseId: course1.id,
      userId: studentUser.id,
    },
  });

  // 8. Progress tracking
  await prisma.progress.create({
    data: {
      userId: studentUser.id,
      lessonId: lesson1.id,
      completed: true,
      completedAt: new Date(),
    },
  });

  // 9. Create Discussion Forum
  const forum = await prisma.forum.create({
    data: {
      workspaceId: workspace.id,
      title: 'General Student Discussions',
      description: 'Ask questions, share project showcases, and collaborate with peers.',
    },
  });

  await prisma.forumPost.create({
    data: {
      forumId: forum.id,
      userId: studentUser.id,
      content: 'Welcome everyone to GurukulX Academy! Excited to learn Next.js 16 and NestJS 11.',
    },
  });

  console.log('✅ GurukulX Database seeding complete!');
  console.log(`- Workspace ID: ${workspace.id}`);
  console.log(`- Admin: admin@gurukulx.dev`);
  console.log(`- Instructor: instructor@gurukulx.dev`);
  console.log(`- Student: student@gurukulx.dev`);
  console.log(`- Course 1 ID: ${course1.id}`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
