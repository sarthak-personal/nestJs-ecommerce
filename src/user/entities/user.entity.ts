import { Role } from 'src/auth/enums/role.enum';

export class User {
  username: string;
  email: string;
  password: string;
  roles: Role[];
}
