import { Module } from '@nestjs/common';
import { ItemDTO } from './dto/item.dto';

@Module({
  exports: [ItemDTO],
  providers: [ItemDTO],
})
export class UserModule {}
