import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashService {
  constructor(private prisma: PrismaService) {}

  async getStats(workspaceId?: string) {
    const [certificates, courses, enrollments, recentCourses] = await Promise.all([
      this.prisma.certificate.count(workspaceId ? { where: { workspaceId } } : undefined),
      this.prisma.course.count(workspaceId ? { where: { workspaceId } } : undefined),
      this.prisma.enrollment.count(
        workspaceId ? { where: { course: { workspaceId } } } : undefined,
      ),
      this.prisma.course.findMany({
        where: workspaceId ? { workspaceId } : undefined,
        include: {
          _count: { select: { enrollments: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ]);

    const topCourses = recentCourses
      .sort((a, b) => b._count.enrollments - a._count.enrollments)
      .slice(0, 5)
      .map((c) => ({
        id: c.id,
        title: c.title,
        enrollments: c._count.enrollments,
        thumbnail: c.thumbnail,
      }));

    return {
      certificatesIssued: certificates,
      numberOfCourses: courses,
      totalStudents: enrollments,
      topCourses,
    };
  }

  async getRecentCertifications(workspaceId?: string) {
    const certs = await this.prisma.certificate.findMany({
      where: workspaceId ? { workspaceId } : undefined,
      include: {
        user: { select: { id: true, name: true, email: true } },
        course: { select: { id: true, title: true } },
      },
      orderBy: { issuedAt: 'desc' },
      take: 10,
    });

    return certs.map((c) => ({
      id: c.id,
      certificateNumber: c.certificateNumber,
      issuedAt: c.issuedAt,
      user: c.user,
      course: c.course,
    }));
  }

  async getLoginActivity(workspaceId?: string) {
    // Aggregate login events by day of week from analytics events
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const events = await this.prisma.analyticsPageEvent.findMany({
      where: {
        ...(workspaceId ? { workspaceId } : {}),
        eventType: 'page_view',
        createdAt: { gte: ninetyDaysAgo },
      },
      select: { createdAt: true },
    });

    const counts = [0, 0, 0, 0, 0, 0, 0];
    for (const e of events) {
      const dow = new Date(e.createdAt).getDay();
      counts[dow]++;
    }

    const maxCount = Math.max(...counts, 1);
    return days.map((day, i) => ({
      day,
      count: counts[i],
      percentage: Math.round((counts[i] / maxCount) * 100),
    }));
  }
}
