import { ConflictException, Injectable } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
interface SignupInput {
  email: string;
  password: string;
  name: string;
}
interface SigninInput {
  email: string;
  password: string;
}
@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}
  async signup({ email, name, password }: SignupInput, role: UserRole) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: email },
    });
    if (existingUser) {
      throw new ConflictException('invalid credentails');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role,
      },
    });
    return this.generateToken(user.id, user.name, user.role);
  }
  async signin({ email, password }: SigninInput) {
    const user = await this.prisma.user.findUnique({
      where: { email: email },
    });
    if (!user) {
      throw new ConflictException('invalid credentails');
    }
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      throw new ConflictException('invalid credentails');
    }
    return this.generateToken(user.id, user.name, user.role);
  }
  async generateToken(id: string, name: string, role: UserRole) {
    return jwt.sign({ id, name, role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION_TIME,
    });
  }
  async getCurrentUser(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true },
    });
  }
}
