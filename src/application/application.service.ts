import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApplicationResponseDto } from './dto/application.dto';

interface CreateApplicationInput {
  name: string;
  candidateImage: string;
  studentId: string;
  email: string;
  guardianName: string;
  guardianNID: string;
  mobileNumber: string;
}
@Injectable()
export class ApplicationService {
  constructor(private readonly prisma: PrismaService) {}
  async createApplication({
    name,
    candidateImage,
    studentId,
    email,
    guardianNID,
    guardianName,
    mobileNumber,
  }: CreateApplicationInput): Promise<ApplicationResponseDto> {
    const application = await this.prisma.application.create({
      data: {
        name,
        candidateImage,
        studentId,
        email,
        guardianName,
        guardianNID,
        mobileNumber,
      },
    });
    return new ApplicationResponseDto(application);
  }
  async getAllApplications() {
    return this.prisma.application.findMany({
      orderBy: {
        created_at: 'desc',
      },
      select: {
        id: true,
        name: true,
        candidateImage: true,
        studentId: true,
        email: true,
        guardianName: true,
        guardianNID: true,
        mobileNumber: true,
        created_at: true,
      },
    });
  }
}
