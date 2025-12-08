import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { ResponseDto } from 'src/shared/dto/response.dto';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor {
  intercept(_: ExecutionContext, next: CallHandler<T>) {
    return next.handle().pipe(
      map((data) => {
        const response: ResponseDto<T> = {
          success: true,
          timestamp: new Date().toISOString(),
          data,
        };
        return response;
      }),
    );
  }
}
