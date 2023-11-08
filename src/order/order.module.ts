import { Module } from '@nestjs/common';
import { CartService } from 'src/cart/cart.service';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { DatabaseModule } from 'src/provider/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [OrderService, CartService],
  controllers: [OrderController],
})
export class OrderModule {}
