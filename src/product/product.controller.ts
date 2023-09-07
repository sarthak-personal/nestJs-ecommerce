import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Put,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/request/create-product.dto';
import { Product } from './entities/product.entity';
import { UpdateProductDto } from './dto/request/update-product.dto';
import { GetProductsDto } from './dto/response/get-products.dto';
import { GetProductDto } from './dto/response/get-product.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  // Order of function with params matter
  @Get('/:id')
  async getProduct(@Param('id') id: string): Promise<GetProductDto> {
    return await this.productService.getProduct(Number(id));
  }

  @Get('')
  async getProducts(): Promise<GetProductsDto> {
    return await this.productService.getAllProducts();
  }

  @Post('')
  async addProduct(@Body() createdProduct: CreateProductDto): Promise<Product> {
    return await this.productService.addProduct(createdProduct);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  async updateProduct(
    @Request() req,
    @Param('id') id: string,
    @Body() updatedProduct: UpdateProductDto,
  ): Promise<Product> {
    return await this.productService.updateProduct(
      req.user.userId,
      Number(id),
      updatedProduct,
    );
  }

  @Delete('/:id')
  async deleteProduct(@Param('id') id: string): Promise<Product> {
    return await this.productService.deleteProduct(Number(id));
  }
}
