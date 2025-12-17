// src/modules/auth/decorators/current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedUser } from '../types/auth-response.type';

export interface IAuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

// Type utility to cleanly define decorator return type
type CurrentUserReturn<K extends keyof AuthenticatedUser | undefined> =
  K extends keyof AuthenticatedUser
    ? AuthenticatedUser[K] | undefined
    : AuthenticatedUser | undefined;

export const CurrentUser = createParamDecorator(
  <K extends keyof AuthenticatedUser | undefined>(
    data: K,
    ctx: ExecutionContext,
  ): CurrentUserReturn<K> => {
    const req = ctx.switchToHttp().getRequest<IAuthenticatedRequest>();
    const user = req.user;
    console.log('Current User Decorator: ', user);

    if (data !== undefined) {
      // user may be undefined → safe optional access
      return user?.[data] as CurrentUserReturn<K>;
    }

    // return full user
    return user as CurrentUserReturn<K>;
  },
);
