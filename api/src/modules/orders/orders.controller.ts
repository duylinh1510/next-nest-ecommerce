import {
  Controller,
  Body,
  Post,
  UseGuards,
  Get,
  Query,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiNotFoundResponse,
  ApiQuery,
  ApiResponse,
  getSchemaPath,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiParam,
  ApiProperty,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { OrdersService } from './orders.service';
import {
  ModerateThrottle,
  RelaxedThrottle,
} from '../../common/decorators/custom-throttler.decorator';
import { CreateOrderDto } from './dto/create-order.dto';
import { GetUser } from '../../common/decorators/get-user.decorator';
import {
  OrderApiResponseDto,
  OrderResponseDto,
  PaginatedOrderResponseDto,
} from './dto/order-response.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { QueryOrderDto } from './dto/query-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@ApiTags('orders')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  //Create orders
  @Post()
  @ModerateThrottle()
  @ApiOperation({
    summary: 'Create a new order',
  })
  @ApiBody({
    type: CreateOrderDto,
  })
  @ApiCreatedResponse({
    description: 'Order created successfully',
    type: OrderApiResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid data or insufficient stock',
  })
  @ApiNotFoundResponse({
    description: 'Cart not found or empty',
  })
  @ApiTooManyRequestsResponse({
    description: 'Too many requests - rate limit exceed',
  })
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @GetUser('id') userId: string,
  ) {
    return this.ordersService.create(userId, createOrderDto);
  }

  // Get All Orders (admin only)
  @Get('admin/all')
  @Roles(Role.ADMIN)
  @RelaxedThrottle()
  @ApiOperation({
    summary: '[ADMIN] Get all orders (paginated)',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: String,
  })
  @ApiResponse({
    description: 'List of products',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: getSchemaPath(OrderResponseDto) },
        },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
      },
    },
  })
  @ApiForbiddenResponse({ description: 'Admin access required' })
  async findAllForAdmin(@Query() queryOrderDto: QueryOrderDto) {
    return this.ordersService.findAllForAdmin(queryOrderDto);
  }

  // Get the current user orders
  @Get()
  @RelaxedThrottle()
  @ApiOperation({
    summary: 'Get all orders for current user (paginated)',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
  })
  @ApiOkResponse({
    description: 'List of user orders',
    type: PaginatedOrderResponseDto,
  })
  findAll(@Query() query: QueryOrderDto, @GetUser('id') userId: string) {
    return this.ordersService.findAll(userId, query);
  }

  //ADMIN: Get order by ID
  @Get('admin/:id')
  @Roles(Role.ADMIN)
  @RelaxedThrottle()
  @ApiOperation({
    summary: '[ADMIN]: Get order by id',
  })
  @ApiParam({
    name: 'id',
    description: 'Order ID',
  })
  @ApiOkResponse({
    description: 'Order details',
    type: OrderApiResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Order not found',
  })
  @ApiForbiddenResponse({
    description: 'Admin access required',
  })
  async findOrderById(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  //User: Get own order by id
  @Get(':id')
  @RelaxedThrottle()
  @ApiOperation({
    summary: 'Get an order by ID for current user',
  })
  @ApiParam({
    name: 'id',
    description: 'Order ID',
  })
  @ApiOkResponse({
    description: 'Order details',
    type: OrderApiResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Order not found',
  })
  async findOne(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.ordersService.findOne(id, userId);
  }

  //ADMIN update
  @Patch('admin/id')
  @Roles(Role.ADMIN)
  @ModerateThrottle()
  @ApiOperation({
    summary: '[ADMIN] Update any order',
  })
  @ApiParam({
    name: 'id',
    description: 'Order ID',
  })
  @ApiBody({
    type: UpdateOrderDto,
  })
  @ApiOkResponse({
    description: 'Order update successfully',
    type: OrderApiResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Order not found',
  })
  @ApiForbiddenResponse({
    description: 'Admin access required',
  })
  async updateAdmin(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.update(id, updateOrderDto);
  }

  // User: update own order
  @Patch(':id')
  @ModerateThrottle()
  @ApiOperation({
    summary: 'Update your own order',
  })
  @ApiParam({
    name: 'id',
    description: 'Order ID',
  })
  @ApiBody({
    type: UpdateOrderDto,
  })
  @ApiResponse({
    description: 'Order updated successfully',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @GetUser('id') userId: string,
  ) {
    return await this.ordersService.update(id, updateOrderDto, userId);
  }

  //ADMIN: Cancel an order
  @Delete('admin/:id')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: '[ADMIN] cancel order by ID',
  })
  @ApiProperty({
    name: 'id',
    description: 'Order ID',
  })
  @ApiOkResponse({
    description: 'Order cancelled!',
    type: OrderApiResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Order not found',
  })
  async cancelAdmin(@Param('id') id: string) {
    return this.ordersService.cancel(id);
  }

  // User cancel own order
  @Delete(':id')
  @ApiOperation({
    summary: 'Cancel order by ID',
  })
  @ApiProperty({
    name: 'id',
    description: 'Order ID',
  })
  @ApiOkResponse({
    description: 'Order cancelled!',
    type: OrderApiResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Order not found',
  })
  async cancel(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.ordersService.cancel(id, userId);
  }
}
