import { Prisma } from '@prisma/client';
import { Role } from 'src/auth/enums/role.enum';

export interface CustomUser extends Prisma.UserCreateInput {
  roles: Role[];
}
