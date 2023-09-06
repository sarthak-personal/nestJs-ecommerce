import { Item } from './item.entity';

export class Cart {
  cartId: number;
  userId: number;
  items: Item[];
  totalPrice: number;
}
