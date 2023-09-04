import { Item } from './item.entity';

export class Cart {
  userId: number;
  items: Item[];
  totalPrice: number;
}
