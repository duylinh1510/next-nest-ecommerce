import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsDate,
} from 'class-validator';

export class CategoryResponseDto {
  @ApiProperty({
    example: '550e4840-e29b-41d4-a716-446655440000',
    description: 'The unique identifier for the category',
  })
  id!: string;

  @ApiProperty({
    example: 'Electronics',
    description: 'The name of the category',
  })
  name!: string;

  @ApiProperty({
    example: 'Electronics category description',
    description: 'The description of the category',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  description!: string | null;

  @ApiProperty({
    example: 'electronics-category',
    description: 'The slug of the category',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  slug!: string | null;

  @ApiProperty({
    example: 'https://example.com/electronics-category.jpg',
    description: 'The image URL of the category',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  imageUrl!: string | null;

  @ApiProperty({
    example: true,
    description: 'Whether the category is active',
  })
  @IsBoolean()
  @IsNotEmpty()
  isActive!: boolean;

  @ApiProperty({
    example: 10,
    description: 'The number of products in the category',
  })
  @IsNumber()
  @IsNotEmpty()
  productCount!: number;

  @ApiProperty({
    example: '2026-01-01',
    description: 'The date the category was created',
  })
  @IsDate()
  createdAt!: Date;

  @ApiProperty({
    example: '2026-01-01',
    description: 'The date the category was updated',
  })
  @IsDate()
  updatedAt!: Date;
}
