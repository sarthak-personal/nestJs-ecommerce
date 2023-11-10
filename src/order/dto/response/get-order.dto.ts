import { Item } from 'src/cart/entities/item.entity';
import { OrderStatus } from '@prisma/client';
import { PaymentMethod } from '@prisma/client';
import { Address } from '@prisma/client';

export class GetOrderDto {
  id: number;
  orderNumber: string;
  items: Item[];
  orderDate: Date;
  status: OrderStatus;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  shippingAddress: Address;
}
