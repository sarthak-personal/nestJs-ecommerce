import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { DatabaseModule } from 'src/provider/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
