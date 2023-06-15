import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as mailgen from 'mailgen';
@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  constructor() {
    this.createTransporter();
  }
  private async createTransporter() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
  }
  async sendEmail(to: string, name: string): Promise<void> {
    const mailgenerator = new mailgen({
      theme: 'default',
      product: {
        name: 'Daffodil International University',
        link: 'https://mailgen.js/',
      },
    });
    // Define the email options
    const response = {
      body: {
        name: name,
        intro:
          'We are pleased to inform you that your hall booking application has been successfully processed and confirmed.',
      },
    };
    const email = mailgenerator.generate(response);
    const message = {
      from: process.env.EMAIL,
      to: to,
      subject: 'Hall Booking Application Confirmation',
      html: email,
    };

    // Send the email using the transporter
    await this.transporter
      .sendMail(message)
      .then(() => {
        console.log('Email sent successfully');
      })
      .catch((err) => {
        console.log(err);
      });
  }
  async sendPaymentEmail(
    to: string,
    name: string,
    sessionId: string,
    amount: number,
  ): Promise<void> {
    const currentDate = new Date();
    // Define the email options
    const mailgenerator = new mailgen({
      theme: 'default',
      product: {
        name: 'Daffodil International University',
        link: 'https://mailgen.js/',
      },
    });
    const response = {
      body: {
        name: name,
        intro: `Dear ${name},

     
        Here are the details of your fee payment:
        payment Id: ${sessionId}
        Amount Paid: ${amount}
        Fee Type: Hall Fee
        Payment Method: card
        Payment Date: ${currentDate}
        `,
      },
    };
    const email = mailgenerator.generate(response);
    const message = {
      from: process.env.EMAIL,
      to: to,
      subject: `Fee Payment Confirmation  `,
      html: email,
    };

    // Send the email using the transporter
    await this.transporter.sendMail(message).catch((err) => {
      console.log(err);
    });
  }
}
