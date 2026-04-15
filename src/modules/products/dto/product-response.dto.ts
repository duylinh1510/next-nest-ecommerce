import { ApiProperty } from '@nestjs/swagger';
export class ProductResponseDto {
  @ApiProperty({
    description: 'Product ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

  @ApiProperty({
    description: 'Product name',
    example: 'Product 1',
  })
  name!: string;

  @ApiProperty({
    description: 'Product description',
    example: 'Product 1 description',
    nullable: true,
  })
  description!: string | null;

  @ApiProperty({
    description: 'Product price',
    example: 100,
  })
  price!: number;

  @ApiProperty({
    description: 'Product stock',
    example: 100,
  })
  stock!: number;

  @ApiProperty({
    description: 'Product SKU',
    example: 'WH-001',
  })
  sku!: string;

  @ApiProperty({
    description: 'Product image URL',
    example: 'https://example.com/image.jpg',
    nullable: true,
  })
  imageUrl!: string | null;

  @ApiProperty({
    description: 'Product category',
    example: 'Electronics',
  })
  category!: string;

  @ApiProperty({
    description: 'Product is active',
    example: true,
  })
  isActive!: boolean;

  @ApiProperty({
    description: 'Product creation date',
    example: '2026-01-01',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'Product last update date',
    example: '2026-01-02',
  })
  updatedAt!: Date;
}
