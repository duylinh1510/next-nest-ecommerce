import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class AuthResponseDto {
  @ApiProperty({
    description: 'Access token for authentication',
    example: 'wdqwdqwdqwdwdasda',
  })
  accessToken!: string;

  @ApiProperty({
    description: 'Refresh token for authentication',
    example: 'wdqwdqwdqwdwdasda',
  })
  refreshToken!: string;

  @ApiProperty({
    description: 'Authenticated user information',
    example: {
      id: 'user-123',
      email: '<EMAIL>',
      firstName: 'John',
      lastName: 'Doe',
      role: 'USER',
    },
  })
  user!: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    role: Role;
  };
}
