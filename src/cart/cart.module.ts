import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { DatabaseModule } from 'src/provider/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [CartService],
  controllers: [CartController],
})
export class CartModule {}
