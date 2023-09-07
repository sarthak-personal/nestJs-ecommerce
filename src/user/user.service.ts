import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/provider/database/prisma.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { CustomUser } from './entities/customUser.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async addUser(createUserDTO: CreateUserDTO): Promise<CustomUser> {
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
    const hashedPassword = await bcrypt.hash(createUserDTO.password, 10);
    const newUser = await this.prismaService.user.create({
      data: {
        username: createUserDTO.username,
        email: createUserDTO.email,
        password: hashedPassword,
        roles: createUserDTO.roles,
      },
    });
    return newUser as CustomUser;
  }

  async findUser(username: string): Promise<CustomUser | undefined> {
    const user = await this.prismaService.user.findUnique({
      where: { username },
    });
    return user as CustomUser;
  }
}
