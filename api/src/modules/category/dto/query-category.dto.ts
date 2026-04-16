import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsOptional,
  IsBoolean,
  IsString,
  IsNumber,
  Min,
} from 'class-validator';

export class QueryCategoryDto {
  @ApiProperty({
    example: true,
    description: 'Filter by active status',
    required: false,
  })
  @Transform(({ obj }) => {
    if (obj.isActive === 'true') return true;
    if (obj.isActive === 'false') return false;
    return undefined;
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Search term to filter categories by name or description',
    example: 'electronics',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    default: 1,
    minimum: 1,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  page = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page for pagination',
    example: 10,
    default: 10,
    minimum: 1,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  limit = 10;
}
