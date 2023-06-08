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
        intro:
          'We are pleased to inform you that your hall booking application has been successfully processed and confirmed.',
      },
    };
    const email = mailgenerator.generate(response);
    const message = {
      from: 'rixy253@gamil.com',
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
    studentId: string,
    amount: number,
  ): Promise<void> {
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

        We hope this email finds you well. We are writing to confirm the successful receipt of your fee payment for the current academic period at [University/School Name]. We appreciate your timely payment and your commitment to your education.
        
        Here are the details of your fee payment:
        
        Amount Paid: ${amount}
        Payment Method: card
        Payment Date: ${new Date().toLocaleDateString()}
        `,
      },
    };
    const email = mailgenerator.generate(response);
    const message = {
      from: 'rixy253@gamil.com',
      to: to,
      subject: `Fee Payment Confirmation  `,
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
}
