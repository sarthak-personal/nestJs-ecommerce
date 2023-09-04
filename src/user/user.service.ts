import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/provider/database/prisma.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async addUser(createUserDTO: CreateUserDTO): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDTO.password, 10);
    const newUser = await this.prismaService.user.create({
      data: {
        username: createUserDTO.username,
        email: createUserDTO.email,
        password: hashedPassword,
        roles: createUserDTO.roles,
      },
    });
    return newUser;
  }

  async findUser(username: string): Promise<User | undefined> {
    const user = await this.prismaService.user.findUnique({
      where: { username },
    });
    return user;
  }
}
