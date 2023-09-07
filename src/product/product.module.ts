import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { DatabaseModule } from 'src/provider/database/database.module';
import { CartService } from 'src/cart/cart.service';

@Module({
  imports: [DatabaseModule],
  providers: [ProductService, CartService],
  controllers: [ProductController],
})
export class ProductModule {}
