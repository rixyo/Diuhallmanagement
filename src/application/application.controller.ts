import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { ApplicationDto } from './dto/application.dto';
import { EmailService } from 'src/email/email.service';
import { Roles } from 'src/decorators/role.decorator';
import { UserRole } from '@prisma/client';

@Controller('application')
export class ApplicationController {
  constructor(
    private readonly applicationService: ApplicationService,
    private readonly mailService: EmailService,
  ) {}
  @Roles(UserRole.STUDENT)
  @Post('')
  async createApplication(
    @Body() body: ApplicationDto,
  ): Promise<ApplicationDto> {
    const application = this.applicationService.createApplication(body);
    if (application) {
      this.mailService.sendEmail(body.email, body.name);
    }
    return application;
  }
  @Roles(UserRole.ADMIN)
  @Get('all')
  async getAllApplications() {
    return this.applicationService.getAllApplications();
  }
}
