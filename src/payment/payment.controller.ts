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
    product_data: {
      name: string;
    };
    unit_amount: number;
  };
  quantity: number;
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
    const payment = await this.paymentService.createPaymentIntent(
      body.line_items,
    );
    const currentUser = await this.authService.getCurrentUser(user.id);
    if (payment) {
      const fees = await this.feesService.createFee({
        studentId: user.id,
        amount: body.line_items[0].price_data.unit_amount,
        email: currentUser.email,
      });
      if (fees) {
        await this.mailService.sendPaymentEmail(
          currentUser.email,
          user.name,
          user.id,
          body.line_items[0].price_data.unit_amount,
        );
      }

      return payment;
    }
  }
  @Roles(UserRole.STUDENT)
  @Get('/history')
  async getPaymentByStudentId(@User() user: userType) {
    return this.feesService.getFeesByStudentId(user.id);
  }
}
