import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { PrismaService } from 'src/provider/database/prisma.service';
import { CreateProductDto } from './dto/request/create-product.dto';
import { UpdateProductDto } from './dto/request/update-product.dto';
import { GetProductsDto } from './dto/response/get-products.dto';
import { GetProductDto } from './dto/response/get-product.dto';

@Injectable()
export class ProductService {
  constructor(private prismaService: PrismaService) {}

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
    id: number,
    updatedProductDto: UpdateProductDto,
  ): Promise<Product> {
    await this.notFoundHelper(id);
    return this.prismaService.product.update({
      where: { id },
      data: updatedProductDto,
    });
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
