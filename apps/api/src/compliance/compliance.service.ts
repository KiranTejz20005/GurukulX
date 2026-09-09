import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export type ComplianceStatus =
  | 'compliant'
  | 'expiring_soon'
  | 'in_grace_period'
  | 'non_compliant'
  | 'in_progress'
  | 'not_started'
  | 'waived'
  | 'no_record';

@Injectable()
export class ComplianceService {
  constructor(private prisma: PrismaService) {}

  private async resolveWorkspaceId(workspaceId?: string): Promise<string> {
    if (workspaceId) {
      const ws = await this.prisma.workspace.findUnique({ where: { id: workspaceId } });
      if (ws) return ws.id;
    }
    const firstWs = await this.prisma.workspace.findFirst();
    if (firstWs) return firstWs.id;

    const newWs = await this.prisma.workspace.create({
      data: {
        name: 'GurukulX Academy',
        slug: 'gurukulx-default',
      },
    });
    return newWs.id;
  }

  async seedBaselineData(workspaceId: string) {
    const complianceCourses = await this.prisma.course.findMany({
      where: { workspaceId, type: 'COMPLIANCE' },
    });

    if (complianceCourses.length > 0) return;

    // Get an instructor or admin
    let instructor = await this.prisma.user.findFirst();
    if (!instructor) {
      instructor = await this.prisma.user.create({
        data: {
          email: 'admin@gurukulx.dev',
          name: 'Compliance Officer',
        },
      });
    }

    // 1. Create a flagship Compliance Course: "Annual Security Awareness & Data Privacy 2026"
    const course1 = await this.prisma.course.create({
      data: {
        workspaceId,
        instructorId: instructor.id,
        title: 'Annual Security Awareness & Data Privacy (HIPAA / GDPR / SOC2)',
        description: 'Mandatory annual training covering phishing prevention, data protection, credential hygiene, and incident reporting.',
        type: 'COMPLIANCE',
        validityMonths: 12,
        gracePeriodDays: 14,
        published: true,
        thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80',
      },
    });

    // 2. Create second Compliance Course: "Workplace Health, Safety & Anti-Harassment"
    const course2 = await this.prisma.course.create({
      data: {
        workspaceId,
        instructorId: instructor.id,
        title: 'Workplace Safety, Ethics & Anti-Harassment Training',
        description: 'Standards for a safe, respectful, and inclusive working environment across all regional offices.',
        type: 'COMPLIANCE',
        validityMonths: 12,
        gracePeriodDays: 30,
        published: true,
        thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80',
      },
    });

    // Create a few realistic learners if they don't already exist
    const learnerSeed = [
      { email: 'alex.chen@gurukulx.dev', name: 'Alex Chen (Senior Dev)' },
      { email: 'priya.sharma@gurukulx.dev', name: 'Priya Sharma (Product Lead)' },
      { email: 'marcus.vance@gurukulx.dev', name: 'Marcus Vance (Security Analyst)' },
      { email: 'elena.rostova@gurukulx.dev', name: 'Elena Rostova (HR Specialist)' },
      { email: 'kiran.student@gurukulx.dev', name: 'Kiran Teja (Staff Engineer)' },
      { email: 'david.kim@gurukulx.dev', name: 'David Kim (DevOps Engineer)' },
      { email: 'sarah.connor@gurukulx.dev', name: 'Sarah Connor (Engineering Manager)' },
    ];

    const users: any[] = [];
    for (const l of learnerSeed) {
      let u = await this.prisma.user.findUnique({ where: { email: l.email } });
      if (!u) {
        u = await this.prisma.user.create({
          data: {
            email: l.email,
            name: l.name,
            image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(l.name)}`,
          },
        });
      }
      users.push(u);

      // Ensure workspace membership
      await this.prisma.workspaceMember.upsert({
        where: { userId_workspaceId: { userId: u.id, workspaceId } },
        create: { userId: u.id, workspaceId, role: 'STUDENT' },
        update: {},
      });
    }

    const now = new Date();

    // Setup statuses across learners for Course 1
    // Alex Chen: Compliant (completed 2 months ago, valid for 10 more months)
    const validUntilCompliant = new Date(now);
    validUntilCompliant.setMonth(now.getMonth() + 10);
    await this.prisma.enrollment.upsert({
      where: { userId_courseId: { userId: users[0].id, courseId: course1.id } },
      create: { userId: users[0].id, courseId: course1.id },
      update: {},
    });
    await this.prisma.courseCompletionRecord.upsert({
      where: { courseId_userId_cycleNumber: { courseId: course1.id, userId: users[0].id, cycleNumber: 1 } },
      create: {
        courseId: course1.id,
        userId: users[0].id,
        status: 'compliant',
        completedAt: new Date(Date.now() - 60 * 86400000),
        validUntil: validUntilCompliant,
        cycleNumber: 1,
      },
      update: {},
    });

    // Priya Sharma: Expiring soon (expires in 12 days)
    const validUntilExpiring = new Date(Date.now() + 12 * 86400000);
    await this.prisma.enrollment.upsert({
      where: { userId_courseId: { userId: users[1].id, courseId: course1.id } },
      create: { userId: users[1].id, courseId: course1.id },
      update: {},
    });
    await this.prisma.courseCompletionRecord.upsert({
      where: { courseId_userId_cycleNumber: { courseId: course1.id, userId: users[1].id, cycleNumber: 1 } },
      create: {
        courseId: course1.id,
        userId: users[1].id,
        status: 'expiring_soon',
        completedAt: new Date(Date.now() - 350 * 86400000),
        validUntil: validUntilExpiring,
        cycleNumber: 1,
      },
      update: {},
    });

    // Marcus Vance: In grace period (expired 5 days ago, grace period is 14 days)
    const validUntilGrace = new Date(Date.now() - 5 * 86400000);
    await this.prisma.enrollment.upsert({
      where: { userId_courseId: { userId: users[2].id, courseId: course1.id } },
      create: { userId: users[2].id, courseId: course1.id },
      update: {},
    });
    await this.prisma.courseCompletionRecord.upsert({
      where: { courseId_userId_cycleNumber: { courseId: course1.id, userId: users[2].id, cycleNumber: 1 } },
      create: {
        courseId: course1.id,
        userId: users[2].id,
        status: 'in_grace_period',
        completedAt: new Date(Date.now() - 370 * 86400000),
        validUntil: validUntilGrace,
        cycleNumber: 1,
      },
      update: {},
    });

    // Elena Rostova: Non-compliant (expired 45 days ago, past grace period)
    const validUntilNonCompliant = new Date(Date.now() - 45 * 86400000);
    await this.prisma.enrollment.upsert({
      where: { userId_courseId: { userId: users[3].id, courseId: course1.id } },
      create: { userId: users[3].id, courseId: course1.id },
      update: {},
    });
    await this.prisma.courseCompletionRecord.upsert({
      where: { courseId_userId_cycleNumber: { courseId: course1.id, userId: users[3].id, cycleNumber: 1 } },
      create: {
        courseId: course1.id,
        userId: users[3].id,
        status: 'non_compliant',
        completedAt: new Date(Date.now() - 410 * 86400000),
        validUntil: validUntilNonCompliant,
        cycleNumber: 1,
      },
      update: {},
    });

    // Kiran Teja: In progress (started, not finished)
    await this.prisma.enrollment.upsert({
      where: { userId_courseId: { userId: users[4].id, courseId: course1.id } },
      create: { userId: users[4].id, courseId: course1.id },
      update: {},
    });
    await this.prisma.courseCompletionRecord.upsert({
      where: { courseId_userId_cycleNumber: { courseId: course1.id, userId: users[4].id, cycleNumber: 1 } },
      create: {
        courseId: course1.id,
        userId: users[4].id,
        status: 'in_progress',
        cycleNumber: 1,
      },
      update: {},
    });

    // David Kim: Not started
    await this.prisma.enrollment.upsert({
      where: { userId_courseId: { userId: users[5].id, courseId: course1.id } },
      create: { userId: users[5].id, courseId: course1.id },
      update: {},
    });
    await this.prisma.courseCompletionRecord.upsert({
      where: { courseId_userId_cycleNumber: { courseId: course1.id, userId: users[5].id, cycleNumber: 1 } },
      create: {
        courseId: course1.id,
        userId: users[5].id,
        status: 'not_started',
        cycleNumber: 1,
      },
      update: {},
    });

    // Sarah Connor: Waived
    await this.prisma.enrollment.upsert({
      where: { userId_courseId: { userId: users[6].id, courseId: course1.id } },
      create: { userId: users[6].id, courseId: course1.id },
      update: {},
    });
    await this.prisma.courseCompletionRecord.upsert({
      where: { courseId_userId_cycleNumber: { courseId: course1.id, userId: users[6].id, cycleNumber: 1 } },
      create: {
        courseId: course1.id,
        userId: users[6].id,
        status: 'waived',
        cycleNumber: 1,
      },
      update: {},
    });
  }

  async getOverview(workspaceId?: string) {
    const wsId = await this.resolveWorkspaceId(workspaceId);
    await this.seedBaselineData(wsId);

    const complianceCourses = await this.prisma.course.findMany({
      where: { workspaceId: wsId, type: 'COMPLIANCE' },
      select: { id: true },
    });

    const courseIds = complianceCourses.map((c) => c.id);

    const records = await this.prisma.courseCompletionRecord.findMany({
      where: { courseId: { in: courseIds } },
    });

    const counts: Record<ComplianceStatus, number> = {
      compliant: 0,
      non_compliant: 0,
      expiring_soon: 0,
      in_grace_period: 0,
      in_progress: 0,
      not_started: 0,
      waived: 0,
      no_record: 0,
    };

    for (const r of records) {
      const s = (r.status || 'not_started') as ComplianceStatus;
      if (counts[s] !== undefined) {
        counts[s]++;
      }
    }

    // Total members without an enrollment
    const totalMembers = await this.prisma.workspaceMember.count({
      where: { workspaceId: wsId },
    });
    const uniqueLearnersWithRecords = new Set(records.map((r) => r.userId)).size;
    counts.no_record = Math.max(0, totalMembers - uniqueLearnersWithRecords);

    return counts;
  }

  async getCourses(workspaceId?: string) {
    const wsId = await this.resolveWorkspaceId(workspaceId);
    await this.seedBaselineData(wsId);

    const courses = await this.prisma.course.findMany({
      where: { workspaceId: wsId, type: 'COMPLIANCE' },
      include: {
        completionRecords: true,
        enrollments: true,
      },
    });

    return courses.map((c) => {
      const records = c.completionRecords;
      const totalLearners = c.enrollments.length;

      const compliantCount = records.filter((r) => r.status === 'compliant').length;
      const expiringSoonCount = records.filter((r) => r.status === 'expiring_soon').length;
      const gracePeriodCount = records.filter((r) => r.status === 'in_grace_period').length;
      const nonCompliantCount = records.filter((r) => r.status === 'non_compliant').length;
      const inProgressCount = records.filter((r) => r.status === 'in_progress').length;
      const notStartedCount = records.filter((r) => r.status === 'not_started').length;
      const waivedCount = records.filter((r) => r.status === 'waived').length;

      const compliantTotal = compliantCount + waivedCount;
      const complianceRate = totalLearners > 0 ? Number(((compliantTotal / totalLearners) * 100).toFixed(1)) : 0;

      return {
        id: c.id,
        title: c.title,
        description: c.description,
        type: c.type,
        validityMonths: c.validityMonths || 12,
        gracePeriodDays: c.gracePeriodDays || 14,
        published: c.published,
        thumbnail: c.thumbnail,
        totalLearners,
        compliantCount,
        expiringSoonCount,
        gracePeriodCount,
        nonCompliantCount,
        inProgressCount,
        notStartedCount,
        waivedCount,
        complianceRate,
      };
    });
  }

  async getLearners(workspaceId?: string, courseId?: string) {
    const wsId = await this.resolveWorkspaceId(workspaceId);
    await this.seedBaselineData(wsId);

    const whereClause: any = {
      course: {
        workspaceId: wsId,
        type: 'COMPLIANCE',
      },
    };
    if (courseId) {
      whereClause.courseId = courseId;
    }

    const records = await this.prisma.courseCompletionRecord.findMany({
      where: whereClause,
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
        course: { select: { id: true, title: true, validityMonths: true, gracePeriodDays: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return records.map((r) => ({
      recordId: r.id,
      userId: r.userId,
      learnerName: r.user.name || 'Unnamed Learner',
      learnerEmail: r.user.email,
      learnerAvatar: r.user.image,
      courseId: r.courseId,
      courseTitle: r.course.title,
      status: r.status as ComplianceStatus,
      completedAt: r.completedAt ? r.completedAt.toISOString() : null,
      validUntil: r.validUntil ? r.validUntil.toISOString() : null,
      cycleNumber: r.cycleNumber,
    }));
  }

  async waiveCompliance(courseId: string, userId: string) {
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new NotFoundException('Course not found');

    const record = await this.prisma.courseCompletionRecord.upsert({
      where: {
        courseId_userId_cycleNumber: { courseId, userId, cycleNumber: 1 },
      },
      create: {
        courseId,
        userId,
        status: 'waived',
        cycleNumber: 1,
      },
      update: {
        status: 'waived',
      },
    });

    return { success: true, record };
  }

  async resetCompliance(courseId: string, userId: string) {
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new NotFoundException('Course not found');

    const latest = await this.prisma.courseCompletionRecord.findFirst({
      where: { courseId, userId },
      orderBy: { cycleNumber: 'desc' },
    });

    const nextCycle = (latest?.cycleNumber || 0) + 1;

    // Reset progress in lessons
    const lessons = await this.prisma.lesson.findMany({
      where: { module: { courseId } },
      select: { id: true },
    });
    const lessonIds = lessons.map((l) => l.id);

    if (lessonIds.length > 0) {
      await this.prisma.progress.deleteMany({
        where: {
          userId,
          lessonId: { in: lessonIds },
        },
      });
    }

    const newRecord = await this.prisma.courseCompletionRecord.create({
      data: {
        courseId,
        userId,
        status: 'not_started',
        cycleNumber: nextCycle,
      },
    });

    return { success: true, record: newRecord };
  }

  async createComplianceCourse(workspaceId: string | undefined, data: { title: string; description?: string; validityMonths?: number; gracePeriodDays?: number }) {
    const wsId = await this.resolveWorkspaceId(workspaceId);
    let instructor = await this.prisma.user.findFirst();
    if (!instructor) {
      instructor = await this.prisma.user.create({
        data: { email: 'admin@gurukulx.dev', name: 'Compliance Officer' },
      });
    }

    const course = await this.prisma.course.create({
      data: {
        workspaceId: wsId,
        instructorId: instructor.id,
        title: data.title,
        description: data.description,
        type: 'COMPLIANCE',
        validityMonths: data.validityMonths || 12,
        gracePeriodDays: data.gracePeriodDays || 14,
        published: true,
      },
    });

    return course;
  }
}
