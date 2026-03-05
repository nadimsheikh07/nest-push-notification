import { IsNotEmpty, IsString, IsIn } from 'class-validator';

export class CreateTokenDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsIn(['customer', 'seller', 'admin'])
  role: string;

  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsIn(['android', 'ios', 'web'])
  device: string;
}
