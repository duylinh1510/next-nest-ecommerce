import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class UserResponseDto {
  @ApiProperty({ description: 'UserID', example: '1' })
  id!: string;

  @ApiProperty({
    description: 'User email address',
    example: 'johndoe@gmail.com',
  })
  email!: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
    nullable: true,
  })
  firstName!: string | null;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
    nullable: true,
  })
  lastName!: string | null;

  @ApiProperty({ description: 'User role', enum: Role })
  role!: Role;

  @ApiProperty({ description: 'Account creation date', example: '2026-01-01' })
  createdAt!: Date;

  @ApiProperty({
    description: 'Last account update date',
    example: '2026-01-02',
  })
  updatedAt!: Date;
}
