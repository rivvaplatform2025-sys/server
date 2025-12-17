import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IAuthenticatedRequest } from './current-user.decorator';

export const CurrentOrganization = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): string | undefined => {
    const req = ctx.switchToHttp().getRequest<IAuthenticatedRequest>();
    return req.user?.organizationId;
  },
);
