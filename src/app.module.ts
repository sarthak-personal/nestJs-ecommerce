import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { DatabaseModule } from './provider/database/database.module';
import { CartModule } from './cart/cart.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UserModule, ProductModule, DatabaseModule, CartModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
