const { PrismaClient } = require('../../../node_modules/@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting GurukulX database seeding...');

  // Clean existing data in dependency order
  await prisma.notification.deleteMany({});
  await prisma.widgetVersion.deleteMany({});
  await prisma.widgetCourse.deleteMany({});
  await prisma.widget.deleteMany({});
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
  await prisma.courseCompletionRecord.deleteMany({});
  await prisma.certificate.deleteMany({});
  await prisma.analyticsPageEvent.deleteMany({});
  await prisma.analyticsOrgDaily.deleteMany({});
  await prisma.analyticsCountryDaily.deleteMany({});
  await prisma.analyticsCourseDaily.deleteMany({});
  await prisma.apiKey.deleteMany({});
  await prisma.media.deleteMany({});
  await prisma.tag.deleteMany({});
  await prisma.tagGroup.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.workspaceInvite.deleteMany({});
  await prisma.workspaceMember.deleteMany({});
  await prisma.workspace.deleteMany({});
  await prisma.user.deleteMany({});

  // 1. Create Users with deterministic IDs matching dev headers
  const adminUser = await prisma.user.create({
    data: {
      id: 'dev-user-123',
      email: 'admin@gurukulx.dev',
      name: 'GurukulX Admin',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=GurukulAdmin',
    },
  });

  const instructorUser = await prisma.user.create({
    data: {
      id: 'instructor-user-123',
      email: 'instructor@gurukulx.dev',
      name: 'Sarah Connor (Lead Instructor)',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SarahInstructor',
    },
  });

  const studentUser = await prisma.user.create({
    data: {
      id: 'student-user-123',
      email: 'student@gurukulx.dev',
      name: 'Kiran Teja',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kiran',
    },
  });

  // 2. Create Workspace with deterministic ID matching dev headers
  const workspace = await prisma.workspace.create({
    data: {
      id: 'dev-workspace-123',
      name: 'GurukulX Academy',
      slug: 'gurukulx',
      customDomain: 'academy.gurukulx.dev',
      branding: JSON.stringify({
        primaryColor: '#2563eb',
        theme: 'dark',
        heroTitle: 'Welcome to GurukulX Academy',
        heroSubtitle: 'Master high-performance fullstack engineering, architectures, and automated agent verification.',
      }),
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

  // 4. Create Tag Groups and Tags
  const difficultyGroup = await prisma.tagGroup.create({
    data: {
      workspaceId: workspace.id,
      name: 'Difficulty Level',
      description: 'Course complexity classification',
      selectionMode: 'SINGLE',
    },
  });

  const domainGroup = await prisma.tagGroup.create({
    data: {
      workspaceId: workspace.id,
      name: 'Engineering Domain',
      description: 'Core subject area',
      selectionMode: 'MULTI',
    },
  });

  const tagBeginner = await prisma.tag.create({
    data: { workspaceId: workspace.id, groupId: difficultyGroup.id, name: 'Beginner', color: '#10b981' },
  });
  const tagIntermediate = await prisma.tag.create({
    data: { workspaceId: workspace.id, groupId: difficultyGroup.id, name: 'Intermediate', color: '#3b82f6' },
  });
  const tagAdvanced = await prisma.tag.create({
    data: { workspaceId: workspace.id, groupId: difficultyGroup.id, name: 'Advanced', color: '#8b5cf6' },
  });

  const tagFullstack = await prisma.tag.create({
    data: { workspaceId: workspace.id, groupId: domainGroup.id, name: 'Fullstack', color: '#06b6d4' },
  });
  const tagBackend = await prisma.tag.create({
    data: { workspaceId: workspace.id, groupId: domainGroup.id, name: 'Backend', color: '#10b981' },
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

  const courseCompliance = await prisma.course.create({
    data: {
      title: 'Enterprise Security & Compliance 2026',
      description: 'Mandatory annual safety, data privacy, and SOC2 compliance certification for engineering staff.',
      workspaceId: workspace.id,
      instructorId: adminUser.id,
      type: 'COMPLIANCE',
      validityMonths: 12,
      gracePeriodDays: 14,
      published: true,
      thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80',
    },
  });

  // Associate tags
  await prisma.courseTag.createMany({
    data: [
      { courseId: course1.id, tagId: tagIntermediate.id },
      { courseId: course1.id, tagId: tagFullstack.id },
      { courseId: course2.id, tagId: tagAdvanced.id },
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
      type: 'TEXT',
      content: '### Welcome to GurukulX Monorepo Architecture\nIn this lesson we cover turborepo pipelines, workspace package sharing, and build caching.',
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
      title: 'Knowledge Check: Monorepo Basics',
      type: 'QUIZ',
      order: 3,
      isPublished: true,
    },
  });

  await prisma.quiz.create({
    data: {
      lessonId: lesson3.id,
      passingScore: 70,
      questions: JSON.stringify([
        {
          id: 'q1',
          question: 'What command runs dev servers across all monorepo apps in GurukulX?',
          options: ['npm run dev', 'npm start', 'turbo build', 'next start'],
          correctAnswer: 'npm run dev',
          points: 50,
        },
        {
          id: 'q2',
          question: 'Which ORM is used for the centralized data layer in GurukulX?',
          options: ['Prisma', 'TypeORM', 'Mongoose', 'Drizzle'],
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

  await prisma.assignment.create({
    data: {
      lessonId: lesson4.id,
      prompt: 'Create a responsive sidebar component using Tailwind CSS and Radix UI primitives. Submit your repository link or code snippet.',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  // 7. Enroll Student in Course 1 and Course Compliance
  await prisma.enrollment.createMany({
    data: [
      { courseId: course1.id, userId: studentUser.id, progress: 100, completedAt: new Date() },
      { courseId: courseCompliance.id, userId: studentUser.id, progress: 100, completedAt: new Date() },
    ],
  });

  // 8. Progress tracking
  await prisma.progress.createMany({
    data: [
      { userId: studentUser.id, lessonId: lesson1.id, completed: true, completedAt: new Date() },
      { userId: studentUser.id, lessonId: lesson2.id, completed: true, completedAt: new Date() },
      { userId: studentUser.id, lessonId: lesson3.id, completed: true, completedAt: new Date() },
      { userId: studentUser.id, lessonId: lesson4.id, completed: true, completedAt: new Date() },
    ],
  });

  // 9. Create Certificate for Student
  await prisma.certificate.create({
    data: {
      workspaceId: workspace.id,
      userId: studentUser.id,
      courseId: course1.id,
      certificateNumber: 'CERT-GKX-2026-001',
      issuedAt: new Date(),
    },
  });

  // 10. Compliance Record
  await prisma.courseCompletionRecord.create({
    data: {
      userId: studentUser.id,
      courseId: courseCompliance.id,
      completedAt: new Date(),
      validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      cycleNumber: 1,
      status: 'compliant',
    },
  });

  // 11. Create Multi-Course Program
  const program = await prisma.program.create({
    data: {
      workspaceId: workspace.id,
      title: 'Fullstack Software Engineering Master Track',
      description: 'Comprehensive pathway covering frontend Next.js 16 architecture and enterprise NestJS backend microservices.',
      published: true,
    },
  });

  await prisma.programCourse.createMany({
    data: [
      { programId: program.id, courseId: course1.id, order: 1 },
      { programId: program.id, courseId: course2.id, order: 2 },
    ],
  });

  // 12. Create Discussion Forum & Post
  const forum = await prisma.forum.create({
    data: {
      workspaceId: workspace.id,
      title: 'General Student Discussions',
      description: 'Ask questions, share project showcases, and collaborate with fellow learners.',
    },
  });

  await prisma.forumPost.create({
    data: {
      forumId: forum.id,
      userId: studentUser.id,
      content: 'Welcome everyone to GurukulX Academy! Looking forward to learning Next.js 16 and NestJS 11.',
    },
  });

  // 13. Create Sample Media Assets
  await prisma.media.createMany({
    data: [
      {
        workspaceId: workspace.id,
        filename: 'nextjs-architecture-diagram.png',
        url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200',
        mimeType: 'image/png',
        size: 2450000,
      },
      {
        workspaceId: workspace.id,
        filename: 'turborepo-deep-dive.mp4',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        mimeType: 'video/mp4',
        size: 145000000,
      },
      {
        workspaceId: workspace.id,
        filename: 'course-syllabus-2026.pdf',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        mimeType: 'application/pdf',
        size: 180000,
      },
    ],
  });

  // 14. Create Sample API Key
  await prisma.apiKey.create({
    data: {
      workspaceId: workspace.id,
      name: 'Default Production Secret Key',
      key: 'gk_live_9f82d10a4b7e5c3a2f81e6490dcb1234',
      lastUsedAt: new Date(),
    },
  });

  // 15. Create Widgets
  const widget = await prisma.widget.create({
    data: {
      workspaceId: workspace.id,
      name: 'Featured Courses Carousel',
      theme: 'dark',
      layout: 'grid',
      primaryColor: '#2563eb',
    },
  });

  await prisma.widgetCourse.createMany({
    data: [
      { widgetId: widget.id, courseId: course1.id, order: 1 },
      { widgetId: widget.id, courseId: course2.id, order: 2 },
    ],
  });

  // 16. Create Initial Analytics Rollups
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    const landingViews = Math.floor(45 + Math.random() * 50);
    const courseViews = Math.floor(25 + Math.random() * 30);
    const uniqueVisitors = Math.floor(35 + Math.random() * 25);
    const enrollments = Math.floor(2 + Math.random() * 6);
    const completions = Math.floor(1 + Math.random() * 3);

    await prisma.analyticsOrgDaily.create({
      data: {
        workspaceId: workspace.id,
        date: dateStr,
        landingViews,
        coursePageViews: courseViews,
        uniqueVisitors,
        enrollments,
        completions,
      },
    });

    await prisma.analyticsPageEvent.create({
      data: {
        workspaceId: workspace.id,
        eventType: 'page_view',
        country: ['United States', 'India', 'Germany', 'United Kingdom'][i % 4],
        createdAt: d,
      },
    });
  }

  // 17. Notifications
  await prisma.notification.createMany({
    data: [
      {
        workspaceId: workspace.id,
        type: 'COURSE_PUBLISHED',
        title: 'Course Published',
        message: `"${course1.title}" is live and open for enrollment.`,
        link: `/courses/${course1.id}`,
        actorName: 'Sarah Connor',
        read: false,
      },
      {
        workspaceId: workspace.id,
        type: 'ENROLLMENT',
        title: 'New Student Enrollment',
        message: 'Kiran Teja enrolled in Next.js 16 & React 19 Mastery.',
        link: '/audience',
        actorName: 'Kiran Teja',
        actorEmail: 'student@gurukulx.dev',
        read: false,
      },
      {
        workspaceId: workspace.id,
        type: 'SYSTEM',
        title: 'GurukulX System Ready',
        message: 'All workspace services, database tables, and API endpoints are initialized.',
        link: '/dashboard',
        read: true,
      },
    ],
  });

  console.log('✅ GurukulX Database seeding complete!');
  console.log(`- Workspace ID: ${workspace.id}`);
  console.log(`- Admin ID: ${adminUser.id} (${adminUser.email})`);
  console.log(`- Instructor ID: ${instructorUser.id} (${instructorUser.email})`);
  console.log(`- Student ID: ${studentUser.id} (${studentUser.email})`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
