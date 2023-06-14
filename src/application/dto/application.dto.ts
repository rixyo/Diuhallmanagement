import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class ApplicationDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  candidateImage: string;
  @IsString()
  @IsNotEmpty()
  studentId: string;
  @IsString()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty()
  guardianName: string;
  @IsString()
  @IsNotEmpty()
  guardianNID: string;
  @IsString()
  @IsNotEmpty()
  mobileNumber: string;
  sId: string;
}
export class ApplicationResponseDto {
  id: string;
  candidateImage: string;
  name: string;
  studentId: string;
  email: string;
  guardianName: string;
  guardianNID: string;
  mobileNumber: string;
  sId: string;
  guardianMobileNumber: string;

  @Exclude()
  created_at: Date;
  @Exclude()
  updated_at: Date;
  constructor(partial: Partial<ApplicationResponseDto>) {
    Object.assign(this, partial);
  }
}
