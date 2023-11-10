import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/provider/database/prisma.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { CustomUser } from './entities/customUser.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async addUser(createUserDTO: CreateUserDTO): Promise<CustomUser> {
    try {
      if (
        !createUserDTO.username ||
        !createUserDTO.email ||
        !createUserDTO.password
      ) {
        throw new BadRequestException(
          'Invalid input. Username, email, and password are required.',
        );
      }

      // Check for existing user
      const existingUser = await this.prismaService.user.findFirst({
        where: {
          OR: [
            { username: createUserDTO.username },
            { email: createUserDTO.email },
          ],
        },
      });

      if (existingUser) {
        throw new ConflictException('User already exists');
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(createUserDTO.password, 10);

      // Create a new user
      const newUser = await this.prismaService.user.create({
        data: {
          username: createUserDTO.username,
          email: createUserDTO.email,
          password: hashedPassword,
          roles: createUserDTO.roles,
        },
      });

      return newUser as CustomUser;
    } catch (error) {
      throw error;
    }
  }

  async findUser(username: string): Promise<CustomUser | undefined> {
    try {
      if (!username) {
        throw new BadRequestException('Invalid input. Username is required.');
      }

      const user = await this.prismaService.user.findUnique({
        where: { username },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user as CustomUser;
    } catch (error) {
      throw error;
    }
  }
}
