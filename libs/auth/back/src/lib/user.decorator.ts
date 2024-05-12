import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import dlv from 'dlv';

export const User = createParamDecorator(
  (userProp: Parameters<typeof dlv>[1], ctx: ExecutionContext) => {
    const {user} = ctx.switchToHttp().getRequest();
    return userProp
      ? dlv(user, userProp, null)
      : user;
  },
);
