import {
  IsString,
  MinLength,
  IsEmail,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { Exclude } from 'class-transformer';
import { UserRole } from '@prisma/client';

export class SignupDto {
  id: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  name: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsOptional()
  @IsString()
  SecretKey: string;
}
export class LoginDto {
  @IsString()
  @IsNotEmpty()
  password: string;
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
export class UserResponseDto {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  @Exclude()
  password: string;
  @Exclude()
  created_at: Date;
  @Exclude()
  updated_at: Date;
  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
