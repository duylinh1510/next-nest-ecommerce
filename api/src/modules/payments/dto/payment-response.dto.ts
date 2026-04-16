import { ApiProperty } from '@nestjs/swagger';

export class PaymentResponseDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  orderId!: string;

  @ApiProperty({
    example: 100,
  })
  amount!: number;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  userId!: string;

  @ApiProperty({
    example: 'USD',
  })
  currency!: string;

  @ApiProperty({
    example: 'PENDING',
    enum: ['PENDING', 'COMPLETED', 'FAILED', 'CANCELLED'],
  })
  status!: string;

  @ApiProperty({
    example: 'CARD',
    enum: ['CARD', 'PAYPAL', 'STRIPE', 'CASH'],
    nullable: true,
  })
  paymentMethod!: string | null;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    nullable: true,
  })
  transactionId!: string | null;

  @ApiProperty({
    example: '2026-01-01',
  })
  createdAt!: Date;

  @ApiProperty({
    example: '2026-01-01',
  })
  updatedAt!: Date;
}

export class CreatePaymentIntentResponse {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Stripe client secret for payment intent',
  })
  clientSecret!: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Payment ID in the database',
  })
  paymentId!: string;
}

export class PaymentApiResponseDto {
  @ApiProperty({
    example: true,
  })
  success!: boolean;

  @ApiProperty({
    type: PaymentResponseDto,
  })
  data!: PaymentResponseDto;

  @ApiProperty({
    example: 'Payment retrieved successfully',
    required: false,
  })
  message?: string;
}

export class CreatePaymentIntentApiResponseDto {
  @ApiProperty({
    example: true,
  })
  success!: boolean;

  @ApiProperty({
    type: CreatePaymentIntentResponse,
  })
  data!: CreatePaymentIntentResponse;

  @ApiProperty({
    example: 'Payment intent created successfully',
    required: false,
    nullable: true,
  })
  message?: string | null;
}
