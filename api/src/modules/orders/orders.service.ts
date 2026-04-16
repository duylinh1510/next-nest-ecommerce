import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import {
  OrderApiResponseDto,
  OrderResponseDto,
} from './dto/order-response.dto';
import {
  Order,
  OrderItem,
  OrderStatus,
  Prisma,
  Product,
  User,
} from '@prisma/client';
import { QueryOrderDto } from './dto/query-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  // Create Order
  async create(
    userId: string,
    createOrderDto: CreateOrderDto,
  ): Promise<OrderApiResponseDto<OrderResponseDto>> {
    const { items, shippingAddress } = createOrderDto;

    // kiểm tra xem product ở request có map với product trong DB hay không
    // kiểm tra xem stock của product đó còn đủ hay không
    for (const item of items) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        throw new NotFoundException(
          `Product with ID ${item.productId} not found`,
        );
      }

      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product ${product.name}. Availabe ${product.stock}, Requested: ${item.quantity}`,
        );
      }
    }

    // lặp qua mảng items (danh sách các món mà khách mua)
    // lấy price*quantity=sum
    // số 0 là giá trị khởi tạo
    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    // xác định khách hàng đang dùng giỏ hàng nào
    // vào DB check xem userId này có giỏ hàng nào đang xài mà chưa thanh toán hay không (checkedOut = false)
    // lấy cái mới tạo gần đây nhất
    const latestCart = await this.prisma.cart.findFirst({
      where: {
        userId,
        checkedOut: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // khởi tạo $transaction
    // mọi thứ trong $transaction này tuân thủ nguyên tắc All-or-Nothing
    // lõi ở đoạn này thì toàn bộ thao tác sẽ bị roll-back
    // bảo vệ database
    const order = await this.prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId,
          status: OrderStatus.PENDING,
          totalAmount: total,
          shippingAddress,
          cartId: latestCart?.id,
          // Prisma tự động tạo bảng Order trước
          // lấy ID vừa tạo và gắn vào OrderItems
          // và insert một loạt vào bảng phụ cùng lúc
          orderItems: {
            create: items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        // Eager Loading
        // Nó bảo Prisma rằng: "Tạo xong thì nhớ query lấy luôn thông tin chi tiết của mấy món hàng (products)
        // vừa mua để tôi trả về cho Frontend hiển thị biên lai nhé".
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
          user: true,
        },
      });

      // Chạy vòng lặp trừ kho
      // Thực hiện cùng lúc nhiều câu lệnh tx.product.update
      // tốc độ nhanh hơn xài vòng lặp thường
      await Promise.all(
        items.map((item) =>
          tx.product.update({
            where: { id: item.productId },
            // Hàm decrement là một Atomic Operation (phép toán nguyên tử) của Database.
            // Nó an toàn tuyệt đối khi có nhiều người cùng mua một món hàng cùng lúc
            // giúp tránh lỗi Race Condition (lỗi ghi đè dữ liệu).
            data: { stock: { decrement: item.quantity } },
          }),
        ),
      );

      return newOrder;
    });
    return this.wrap(order);
  }

  // Get all orders for admin
  async findAllForAdmin(query: QueryOrderDto): Promise<{
    data: OrderResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 10, status, search } = query;
    const skip = (page - 1) * limit;
    const where: Prisma.OrderWhereInput = {};
    if (status) where.status = status;
    if (search)
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { orderNumber: { contains: search, mode: 'insensitive' } },
      ];

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
          user: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      data: orders.map((o) => this.map(o)),
      total,
      page,
      limit,
    };
  }

  // Get user current orders
  async findAll(
    userId: string,
    query: QueryOrderDto,
  ): Promise<{
    data: OrderResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 10, status, search } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.OrderWhereInput = { userId };
    if (status) where.status = status;
    if (search) where.OR = [{ id: { contains: search, mode: 'insensitive' } }];

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
          user: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      data: orders.map((o) => this.map(o)),
      total,
      page,
      limit,
    };
  }

  // Find order by id (ADMIN)
  async findOne(
    id: string,
    userId?: string,
  ): Promise<OrderApiResponseDto<OrderResponseDto>> {
    const where: Prisma.OrderWhereInput = { id };
    if (userId) where.userId = userId;
    const order = await this.prisma.order.findFirst({
      where,
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return this.wrap(order);
  }

  // Update order by id (ADMIN)
  async update(
    id: string,
    updateOrderDto: UpdateOrderDto,
    userId?: string,
  ): Promise<OrderApiResponseDto<OrderResponseDto>> {
    const where: Prisma.OrderWhereInput = { id };

    if (userId) where.userId = userId;

    const existing = await this.prisma.order.findFirst({
      where,
    });
    if (!existing) throw new NotFoundException(`Order ${id} not found`);

    const updated = await this.prisma.order.update({
      where: { id },
      data: updateOrderDto,
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });

    return this.wrap(updated);
  }

  // Cancel an order
  async cancel(
    id: string,
    userId?: string,
  ): Promise<OrderApiResponseDto<OrderResponseDto>> {
    const where: Prisma.OrderWhereInput = {};
    if (userId) where.userId = userId;

    const order = await this.prisma.order.findFirst({
      where,
      include: { orderItems: true, user: true },
    });

    if (!order) {
      throw new NotFoundException(`Order ${id} not found`);
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Only pending orders can be cancelled');
    }

    const cancelled = await this.prisma.$transaction(async (tx) => {
      for (const item of order.orderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }

      return tx.order.update({
        where: { id },
        data: { status: OrderStatus.CANCELLED },
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
          user: true,
        },
      });
    });

    return this.wrap(cancelled);
  }

  // Lấy DTO từ hàm map, bỏ vào một cái "Hộp tiêu chuẩn" (Generic Response) rồi mới gửi cho Frontend.
  // Frontend dùng res.data.items để lấy danh sách hàng hóa để làm giao diện
  private wrap(
    order: Order & {
      orderItems: (OrderItem & { product: Product })[];
      user: User;
    },
  ): OrderApiResponseDto<OrderResponseDto> {
    return {
      success: true,
      message: 'Order retrieved successfully',
      data: this.map(order),
    };
  }

  // Chuyển đổi dữ liệu thô từ Database (Entity/Model) thành định dạng dữ liệu chuẩn bị gửi đi (DTO - Data Transfer Object).
  // Che giấu dữ liệu nhạy cảm: bỏ những cột chứa dữ liệu nhạy cảm như password chỉ giữ lại các cột cần thiết
  // Định dạng lại dữ liệu: Prisma trả về tiền tệ là kiểu dữ liệu Decimal, hàm map sẽ trả về number
  // Làm phẳng dữ liệu: Thay vì trả về một cục lồng nhau phức tạp,
  // hàm map sẽ "kéo" email của User ra ngoài thành cột userEmail nằm ngay trong Order cho Frontend dễ đọc.
  private map(
    order: Order & {
      orderItems: (OrderItem & { product: Product })[];
      user: User;
    },
  ): OrderResponseDto {
    return {
      id: order.id,
      userId: order.userId,
      status: order.status,
      total: Number(order.totalAmount),
      shippingAddress: order.shippingAddress ?? '',
      items: order.orderItems.map((item) => ({
        id: item.id,
        productId: item.productId,
        productName: item.product.name,
        quantity: item.quantity,
        price: Number(item.price),
        subTotal: Number(item.price) * item.quantity,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      })),
      ...(order.user && {
        userEmail: order.user.email,
        userName:
          `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim(),
      }),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }
}
