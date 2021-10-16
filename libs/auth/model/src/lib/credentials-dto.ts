import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CredentialsDto {
  @ApiProperty({
    example: 'dashy',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(128)
  username = '';

  @ApiProperty({
    example: 'secret',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(128)
  password = '';
}
