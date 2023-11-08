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
    try {
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
    } catch (error) {
      throw new Error('Failed to create cart');
    }
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

  async clearCart(userId: number): Promise<Cart> {
    const cart = await this.getCart(userId);
    await this.prismaService.item.deleteMany({
      where: { cartId: cart.cartId },
    });
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
      const existingItem = await this.prismaService.item.findUnique({
        where: {
          productId: productId,
        },
      });

      if (existingItem) {
        existingItem.quantity = existingItem.quantity + quantity;
        existingItem.subTotalPrice = existingItem.quantity * existingItem.price;

        const updatedItem = await this.prismaService.item.update({
          where: { itemId: existingItem.itemId },
          data: {
            quantity: existingItem.quantity,
            subTotalPrice: existingItem.subTotalPrice,
            cart: {
              connect: {
                cartId: cart.cartId,
              },
            },
          },
        });
        const itemIndex = cart.items.findIndex(
          (item) => item.itemId === existingItem.itemId,
        );
        cart.items[itemIndex] = updatedItem;
        this.recalculateCart(cart);
      } else {
        const newItem = await this.prismaService.item.create({
          data: {
            ...itemDTO,
            subTotalPrice,
            cart: {
              connect: {
                cartId: cart.cartId,
              },
            },
          },
        });
        cart.items.push(newItem);
        this.recalculateCart(cart);
      }
      const updatedCart = await this.updateCartInDB(cart);
      return updatedCart;
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
      cart.items[itemIndex].quantity = 0;
      await this.prismaService.item.delete({
        where: { itemId: cart.items[itemIndex].itemId },
      });
      cart.items.splice(itemIndex, 1);
      const updatedCart = await this.updateCartInDB(cart);
      return updatedCart;
    }
  }

  async updateCartInDB(cart: Cart) {
    const itemsData = cart.items.map((item) => ({
      where: { itemId: item.itemId },
      create: {
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        subTotalPrice: item.subTotalPrice,
      },
      update: {
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        subTotalPrice: item.subTotalPrice,
      },
    }));

    return await this.prismaService.cart.update({
      where: { cartId: cart.cartId },
      data: {
        userId: cart.userId,
        totalPrice: cart.totalPrice,
        items: { upsert: itemsData },
      },
      include: { items: true },
    });
  }
}
