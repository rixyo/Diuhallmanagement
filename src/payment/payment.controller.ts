import { Body, Controller, Post } from '@nestjs/common';
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
  ) {}
  @Roles(UserRole.STUDENT)
  @Post('create-payment-intent')
  async createPaymentIntent(
    @Body() body: CreatePaymentInput,
    @User() user: userType,
  ) {
    const payment = this.paymentService.createPaymentIntent(body.line_items);
    if (payment) {
      this.feesService.createFee({
        studentId: user.id,
        amount: body[0].price_data.unit_amount,
        email: user.email,
      });
      this.mailService.sendPaymentEmail(
        user.email,
        user.name,
        user.id,

        body[0].price_data.unit_amount,
      );
      return payment;
    }
  }
}
