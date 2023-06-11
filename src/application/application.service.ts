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
  sId: string;
}
@Injectable()
export class ApplicationService {
  constructor(private readonly prisma: PrismaService) {}
  async createApplication(
    {
      name,
      candidateImage,
      studentId,
      email,
      guardianNID,
      guardianName,
      mobileNumber,
    }: CreateApplicationInput,
    sId: string,
  ): Promise<ApplicationResponseDto> {
    const application = await this.prisma.application.create({
      data: {
        name,
        sId: sId,
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
  async gethistoryById(studenId: string) {
    return this.prisma.application.findMany({
      where: {
        sId: studenId,
      },
      orderBy: {
        created_at: 'desc',
      },
      select: {
        candidateImage: true,
        name: true,
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
