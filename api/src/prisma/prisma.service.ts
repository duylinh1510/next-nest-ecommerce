import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

/**
 * Service NestJS bọc PrismaClient: dùng driver `@prisma/adapter-pg` + `DATABASE_URL`
 * để kết nối Postgres, inject vào module khác thay vì tạo client thủ công.
 *
 * - onModuleInit / onModuleDestroy: mở/đóng kết nối theo vòng đời ứng dụng.
 * - cleanDatabase: chỉ cho môi trường dev/test — xóa dữ liệu mọi bảng qua delegate
 *   có `deleteMany()`; không dùng trên production.
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    /** Adapter cho Prisma 7+: kết nối qua pool `pg` thay vì URL tích hợp sẵn trong engine. */
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    });

    super({
      adapter,
      log:
        process.env.NODE_ENV === 'development'
          ? ['query', 'error', 'warn']
          : ['error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
    console.log('Database connected successfully!');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('Database disconnected!');
  }

  async cleanDatabase(): Promise<void> {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Cannot clean database in production');
    }

    /** Tên thuộc tính public trên client (user, product, …), bỏ key nội bộ bắt đầu bằng `_`. */
    const models = Reflect.ownKeys(this).filter(
      (key): key is string => typeof key === 'string' && !key.startsWith('_'),
    );

    const client = this as unknown as Record<string, unknown>;

    await Promise.all(
      models.map((modelKey) => {
        const delegate = client[modelKey];
        if (this.isDelegateWithDeleteMany(delegate)) {
          return delegate.deleteMany();
        }
        return Promise.resolve();
      }),
    );
  }

  /** Ràng buộc kiểu an toàn trước khi gọi `deleteMany()` trên delegate Prisma. */
  private isDelegateWithDeleteMany(
    value: unknown,
  ): value is { deleteMany: () => Promise<unknown> } {
    return (
      typeof value === 'object' &&
      value !== null &&
      'deleteMany' in value &&
      typeof (value as { deleteMany: unknown }).deleteMany === 'function'
    );
  }
}
