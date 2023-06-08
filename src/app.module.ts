import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { EmailModule } from './email/email.module';
import { PaymentController } from './payment/payment.controller';
import { FeesService } from './payment/fees/fees.service';
import { PaymentService } from './payment/payment.service';
import { PaymentModule } from './payment/payment.module';
import { ApplicationModule } from './application/application.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { UserInterceptor } from './user/interceptors/user.interceptor';
import { AuthGuard } from './guards/auth.guard';

@Module({
  imports: [
    UserModule,
    PrismaModule,
    EmailModule,
    PaymentModule,
    ApplicationModule,
  ],
  controllers: [AppController, PaymentController],
  providers: [
    AppService,
    PrismaService,
    FeesService,
    PaymentService,
    {
      provide: APP_INTERCEPTOR,
      useClass: UserInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
