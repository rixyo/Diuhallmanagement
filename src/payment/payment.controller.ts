import { Body, Controller, Get, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Roles } from 'src/decorators/role.decorator';
import { UserRole } from '@prisma/client';
import { EmailService } from 'src/email/email.service';
import { FeesService } from './fees/fees.service';
import { AuthService } from 'src/user/auth/auth.service';
import { User, userType } from 'src/user/decorators/user.decorator';

export interface line_items {
  price_data: {
    currency: string;
    unit_amount: number;
    product_data: {
      name: string;
      description: string;
    };
  };
  quantity: 1;
}

interface CreatePaymentInput {
  line_items: line_items[];
}

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly mailService: EmailService,
    private readonly feesService: FeesService,
    private readonly authService: AuthService,
  ) {}
  @Roles(UserRole.STUDENT)
  @Post('create-payment-intent')
  async createPaymentIntent(
    @Body() body: CreatePaymentInput,
    @User() user: userType,
  ) {
    const { line_items } = body;
    const session = await this.paymentService.createPaymentIntent(line_items);

    const { email, name } = await this.authService.getCurrentUser(user.id);
    if (session.id) {
      await this.mailService.sendPaymentEmail(
        email,
        name,
        session.id,
        session.amount_total / 100,
      );
    }
    return session;
  }
  @Roles(UserRole.STUDENT)
  @Get('/history')
  async getPaymentByStudentId(@User() user: userType) {
    return this.feesService.getFeesByStudentId(user.id);
  }
}
