import {
  Controller,
  Post,
  Param,
  Body,
  ParseEnumPipe,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, SignupDto } from './dto/auth.dto';
import { UserRole } from '@prisma/client';
import { EmailService } from 'src/email/email.service';
import { Roles } from 'src/decorators/role.decorator';
import { User, userType } from '../decorators/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailService: EmailService,
  ) {}
  @Post('signup/:userType')
  async signup(
    @Param('userType', new ParseEnumPipe(UserRole)) userType: UserRole,
    @Body() body: SignupDto,
  ) {
    const signuprespone = await this.authService.signup(body, userType);
    this.mailService.sendEmail(body.email, body.name);
    return signuprespone;
  }
  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.signin(body);
  }
  @Roles(UserRole.ADMIN, UserRole.STUDENT)
  @Get('me')
  me(@User() user: userType) {
    return this.authService.getCurrentUser(user.id);
  }
}
