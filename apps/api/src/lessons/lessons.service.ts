import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LessonsService {
  constructor(private prisma: PrismaService) {}

  async create(createLessonDto: CreateLessonDto & { moduleId: string, type: 'VIDEO' | 'TEXT' | 'QUIZ' | 'ASSIGNMENT' }) {
    const highestOrderLesson = await this.prisma.lesson.findFirst({
      where: { moduleId: createLessonDto.moduleId },
      orderBy: { order: 'desc' },
    });
    
    const newOrder = highestOrderLesson ? highestOrderLesson.order + 1 : 0;

    return this.prisma.lesson.create({
      data: {
        title: createLessonDto.title,
        moduleId: createLessonDto.moduleId,
        type: createLessonDto.type || 'TEXT',
        order: newOrder,
        content: createLessonDto.content,
        videoUrl: createLessonDto.videoUrl,
      },
    });
  }

  async findAll(moduleId: string) {
    return this.prisma.lesson.findMany({
      where: { moduleId },
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: string, moduleId: string) {
    const lesson = await this.prisma.lesson.findFirst({
      where: { id, moduleId },
      include: {
        quiz: true,
        assignment: true,
      },
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${id} not found`);
    }

    return lesson;
  }

  async update(id: string, moduleId: string, updateLessonDto: UpdateLessonDto) {
    return this.prisma.lesson.update({
      where: { id, moduleId },
      data: updateLessonDto,
    });
  }

  async remove(id: string, moduleId: string) {
    return this.prisma.lesson.delete({
      where: { id, moduleId },
    });
  }

  // Quiz submission & auto-grading
  async submitQuiz(lessonId: string, userId: string, answers: Record<string, string>) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { lessonId },
    });

    if (!quiz) {
      throw new NotFoundException(`Quiz not found for lesson ID ${lessonId}`);
    }

    const questions = JSON.parse(quiz.questions || '[]');
    let totalPoints = 0;
    let score = 0;

    for (const q of questions) {
      const qPoints = q.points || 10;
      totalPoints += qPoints;
      const studentAnswer = answers[q.id];
      if (studentAnswer && studentAnswer.trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase()) {
        score += qPoints;
      }
    }

    const percentage = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;
    const passed = percentage >= quiz.passingScore;

    const attempt = await this.prisma.quizAttempt.create({
      data: {
        userId,
        quizId: quiz.id,
        score,
        passed,
      },
    });

    return {
      attemptId: attempt.id,
      score,
      totalPoints,
      percentage,
      passed,
      passingScore: quiz.passingScore,
      submittedAt: attempt.id,
    };
  }

  // Progress completion
  async markProgress(lessonId: string, userId: string, completed: boolean) {
    const existing = await this.prisma.progress.findUnique({
      where: {
        userId_lessonId: { userId, lessonId },
      },
    });

    if (existing) {
      return this.prisma.progress.update({
        where: { id: existing.id },
        data: {
          completed,
          completedAt: completed ? new Date() : null,
        },
      });
    }

    return this.prisma.progress.create({
      data: {
        userId,
        lessonId,
        completed,
        completedAt: completed ? new Date() : null,
      },
    });
  }
}
