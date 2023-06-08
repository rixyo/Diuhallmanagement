import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
interface CreateFeeInput {
  studentId: string;
  email: string;
  amount: number;
}
@Injectable()
export class FeesService {
  constructor(private readonly prisma: PrismaService) {}
  async createFee({ studentId, amount, email }: CreateFeeInput) {
    return this.prisma.fees.create({
      data: {
        studentId,
        amount,
        email: email,
      },
    });
  }
  async getFeesByStudentId(studentId: string) {
    return this.prisma.fees.findMany({
      where: {
        studentId: studentId,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }
  async getAllFees() {
    return this.prisma.fees.findMany({
      orderBy: {
        created_at: 'desc',
      },
    });
  }
}
