import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/request/create-order.dto';
import { Order } from './entities/order.entity';
import { GetOrdersDto } from './dto/response/get-orders.dto';
import { GetOrderDto } from './dto/response/get-order.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  // Get an order by order number
  @Get('/order-by-number/:orderNumber')
  async getOrderByOrderNumber(
    @Request() req,
    @Param('orderNumber') orderNumber: string,
  ): Promise<GetOrderDto> {
    const userId = req.user.userId;
    return await this.orderService.getOrderByOrderNumber(orderNumber, userId);
  }

  // Get all orders of a specific user
  @Get('/user-orders')
  async getUserOrders(@Request() req): Promise<GetOrdersDto> {
    const userId = req.user.userId;
    return await this.orderService.getUserOrders(userId);
  }

  // Get all orders of all users
  @Get('/all-orders')
  async getAllOrders(): Promise<GetOrdersDto> {
    return await this.orderService.getAllOrders();
  }

  // Add a new order
  @Post()
  async addOrder(
    @Body() createdOrder: CreateOrderDto,
    @Request() req,
  ): Promise<Order> {
    const userId = req.user.userId;
    return await this.orderService.addOrder(userId, createdOrder);
  }

  // Cancel an order
  @UseGuards(JwtAuthGuard)
  @Put('/:id/cancel')
  async cancelOrder(@Request() req, @Param('id') id: string): Promise<Order> {
    const userId = req.user.userId;
    return await this.orderService.cancelOrder(id, userId);
  }

  // Mark an order as delivered
  @UseGuards(JwtAuthGuard)
  @Put('/:id/deliver')
  async markOrderAsDelivered(@Param('id') id: string): Promise<Order> {
    return await this.orderService.markOrderAsDelivered(Number(id));
  }
}