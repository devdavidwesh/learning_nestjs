import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../entities/user.entity';

export const ROLES_KEY = 'roles';

//roles decorator marks the routes with the roles that are allowed to access them
// => roles guard will later read these metadata

export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
