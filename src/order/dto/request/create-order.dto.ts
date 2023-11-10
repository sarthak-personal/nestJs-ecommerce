import { Item } from 'src/cart/entities/item.entity';
import { PaymentMethod } from '@prisma/client';
import { Address } from '@prisma/client';

export class CreateOrderDto {
  items: Item[];
  totalAmount: number;
  paymentMethod: PaymentMethod;
  shippingAddress: Address;
}
