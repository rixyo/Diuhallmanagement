import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { line_items } from './payment.controller';
@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2022-11-15',
    });
  }

  async createPaymentIntent(line_items: line_items[]) {
    try {
      const session = await this.stripe.checkout.sessions.create({
        line_items: line_items,
        mode: 'payment',
        success_url: 'http://localhost:3000/success',
        cancel_url: 'http://localhost:3000/?canceled=true',
        payment_method_types: ['card'],
      });

      return session;
    } catch (error) {
      console.log(error);
    }
  }
}
