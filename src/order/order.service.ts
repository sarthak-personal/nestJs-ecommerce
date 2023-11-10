import { Injectable, NotFoundException } from '@nestjs/common';
import { Order } from './entities/order.entity';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from 'src/provider/database/prisma.service';
import { CreateOrderDto } from './dto/request/create-order.dto';
import { GetOrdersDto } from './dto/response/get-orders.dto';
import { GetOrderDto } from './dto/response/get-order.dto';
import { CartService } from 'src/cart/cart.service';

@Injectable()
export class OrderService {
  constructor(
    private prismaService: PrismaService,
    private cartService: CartService,
  ) {}

  async getAllOrders(): Promise<GetOrdersDto> {
    const orders = await this.prismaService.order.findMany({
      include: { shippingAddress: true, items: true },
    });
    return { orders };
  }

  async getUserOrders(userId: number): Promise<GetOrdersDto> {
    const orders = await this.prismaService.order.findMany({
      where: { userId },
      include: { shippingAddress: true, items: true },
    });
    return { orders };
  }

  async getOrderByOrderNumber(
    orderNumber: string,
    userId: number,
  ): Promise<GetOrderDto> {
    const order = await this.prismaService.order.findUnique({
      where: { orderNumber, userId },
      include: { shippingAddress: true, items: true },
    });

    return order;
  }

  async addOrder(
    userId: number,
    createOrderDto: CreateOrderDto,
  ): Promise<Order> {
    // Assuming createOrderDto.items is an array of items
    const itemData = createOrderDto.items.map((item) => ({
      productId: item.productId,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      subTotalPrice: item.subTotalPrice,
    }));

    const newOrder = {
      orderNumber: this.generateUniqueOrderNumber(),
      userId: userId,
      items: {
        create: itemData,
      },
      orderDate: new Date(),
      status: OrderStatus.PENDING,
      totalAmount: createOrderDto.totalAmount,
      paymentMethod: createOrderDto.paymentMethod,
      shippingAddress: {
        create: {
          street: createOrderDto.shippingAddress.street,
          city: createOrderDto.shippingAddress.city,
          state: createOrderDto.shippingAddress.state,
          postalCode: createOrderDto.shippingAddress.postalCode,
        },
      },
    };

    // Create the order in the database
    const prismaOrder = await this.prismaService.order.create({
      data: newOrder,
      include: { shippingAddress: true, items: true },
    });

    // Clean up the cart items
    await this.cartService.clearCart(userId);

    return prismaOrder;
  }

  generateUniqueOrderNumber(): string {
    // Generate a timestamp (e.g., current timestamp in milliseconds)
    const timestamp = Date.now();

    // Generate a random unique identifier (e.g., a random number or a hash)
    const uniqueIdentifier = Math.floor(Math.random() * 1000000); // Adjust the range as needed

    // Combine the timestamp and unique identifier to create the order number
    const orderNumber = `${timestamp}${uniqueIdentifier}`;

    return orderNumber;
  }

  async cancelOrder(orderNumber: string, userId: number): Promise<Order> {
    const cancelledOrder = await this.prismaService.order.findUnique({
      where: { orderNumber, userId },
      include: { shippingAddress: true, items: true },
    });

    // Handle additional logic for order cancellation.

    return cancelledOrder;
  }

  async markOrderAsDelivered(orderId: number): Promise<Order> {
    const deliveredOrder = await this.prismaService.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.DELIVERED },
      include: { shippingAddress: true, items: true },
    });

    // Handle additional logic for marking an order as delivered.

    return deliveredOrder;
  }

  async notFoundHelper(id: number): Promise<void> {
    const order = await this.prismaService.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException();
    }
  }
}
