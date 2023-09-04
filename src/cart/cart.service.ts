import { Injectable } from '@nestjs/common';
import { Cart } from './entities/cart.entity';
import { PrismaService } from 'src/provider/database/prisma.service';
import { ItemDTO } from 'src/user/dto/item.dto';

@Injectable()
export class CartService {
  constructor(private prismaService: PrismaService) {}

  async createCart(
    userId: number,
    itemDTO: ItemDTO,
    subTotalPrice: number,
    totalPrice: number,
  ): Promise<Cart> {
    const newCart = await this.prismaService.cart.create({
      data: {
        userId,
        totalPrice,
      },
      include: {
        items: true,
      },
    });

    const newItem = await this.prismaService.item.create({
      data: {
        ...itemDTO,
        subTotalPrice,
        cart: {
          connect: {
            cartId: newCart.cartId,
          },
        },
      },
    });
    newCart.items.push(newItem);

    return newCart;
  }

  async getCart(userId: number): Promise<Cart> {
    const cart = await this.prismaService.cart.findUnique({
      where: { userId },
      include: {
        items: true,
      },
    });
    return cart;
  }

  async deleteCart(userId: number): Promise<Cart> {
    const deletedCart = await this.prismaService.cart.delete({
      where: { userId },
      include: {
        items: true,
      },
    });
    return deletedCart;
  }

  private recalculateCart(cart: Cart) {
    cart.totalPrice = 0;
    cart.items.forEach((item) => {
      cart.totalPrice += item.quantity * item.price;
    });
  }

  async addItemToCart(userId: number, itemDTO: ItemDTO): Promise<Cart> {
    const { productId, quantity, price } = itemDTO;
    const subTotalPrice = quantity * price;

    const cart = await this.getCart(userId);

    if (cart) {
      const itemIndex = cart.items.findIndex(
        (item) => item.productId == productId,
      );

      if (itemIndex > -1) {
        const item = cart.items[itemIndex];
        item.quantity = Number(item.quantity) + Number(quantity);
        item.subTotalPrice = item.quantity * item.price;

        cart.items[itemIndex] = item;
        this.recalculateCart(cart);
      } else {
        cart.items.push({ ...itemDTO, subTotalPrice });
        this.recalculateCart(cart);
      }
      return cart;
    } else {
      const newCart = await this.createCart(
        userId,
        itemDTO,
        subTotalPrice,
        price,
      );
      return newCart;
    }
  }

  async removeItemFromCart(userId: number, productId: number): Promise<any> {
    const cart = await this.getCart(userId);

    const itemIndex = cart.items.findIndex(
      (item) => item.productId == productId,
    );

    if (itemIndex > -1) {
      cart.items.splice(itemIndex, 1);
      return cart;
    }
  }
}
