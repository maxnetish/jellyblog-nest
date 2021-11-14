import { UserRole } from '@jellyblog-nest/utils/common';
import { SetMetadata } from '@nestjs/common';

/**
 * Require user role(s) for request;
 * if pass empty - require any authenticated user
 *
 * @param roles
 * @constructor
 */
export const RequireRole = (...roles: UserRole[]) => SetMetadata('requireRole', roles);
