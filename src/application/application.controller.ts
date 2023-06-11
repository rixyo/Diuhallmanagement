import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { ApplicationDto } from './dto/application.dto';
import { EmailService } from 'src/email/email.service';
import { Roles } from 'src/decorators/role.decorator';
import { UserRole } from '@prisma/client';
import { User, userType } from 'src/user/decorators/user.decorator';

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
    @User() user: userType,
  ): Promise<ApplicationDto> {
    const application = await this.applicationService.createApplication(
      body,
      user.id,
    );
    await this.mailService.sendEmail(body.email, body.name);
    return application;
  }
  @Roles(UserRole.STUDENT)
  @Get('history')
  async getApplicationHistory(@User() user: userType) {
    return this.applicationService.gethistoryById(user.id);
  }
  @Roles(UserRole.ADMIN)
  @Get('all')
  async getAllApplications() {
    return this.applicationService.getAllApplications();
  }
}
