import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { PrismaService } from 'src/provider/database/prisma.service';
import { CreateProductDto } from './dto/request/create-product.dto';
import { UpdateProductDto } from './dto/request/update-product.dto';
import { GetProductsDto } from './dto/response/get-products.dto';
import { GetProductDto } from './dto/response/get-product.dto';
import { CartService } from 'src/cart/cart.service';

@Injectable()
export class ProductService {
  constructor(
    private prismaService: PrismaService,
    private cartService: CartService,
  ) {}

  async getAllProducts(): Promise<GetProductsDto> {
    const products = await this.prismaService.product.findMany();
    return { products };
  }

  async getProduct(id: number): Promise<GetProductDto> {
    await this.notFoundHelper(id);
    return await this.prismaService.product.findUnique({
      where: { id: id },
    });
  }

  async addProduct(createProductDto: CreateProductDto): Promise<Product> {
    const newProduct = await this.prismaService.product.create({
      data: createProductDto,
    });
    return newProduct;
  }

  async updateProduct(
    userId: number,
    id: number,
    updatedProductDto: UpdateProductDto,
  ): Promise<Product> {
    await this.notFoundHelper(id);
    const updatedProduct = await this.prismaService.product.update({
      where: { id },
      data: updatedProductDto,
    });

    const productIndex = await this.prismaService.item.findUnique({
      where: { productId: id },
    });
    if (productIndex) {
      const updatedItem = await this.prismaService.item.update({
        where: { productId: id },
        data: {
          name: updatedProductDto.name,
          price: updatedProductDto.price,
        },
      });
      const cart = await this.cartService.getCart(userId);
      const itemIndex = cart.items.findIndex(
        (item) => item.itemId === updatedItem.itemId,
      );
      if (itemIndex > -1) {
        cart.items[itemIndex] = updatedItem;
        this.cartService.updateCartInDB(cart);
      }
    }
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<Product> {
    await this.notFoundHelper(id);
    return await this.prismaService.product.delete({
      where: { id },
    });
  }

  async notFoundHelper(id: number): Promise<void> {
    const product = await this.prismaService.product.findUnique({
      where: { id: id },
    });

    if (!product) throw new NotFoundException();
  }
}
