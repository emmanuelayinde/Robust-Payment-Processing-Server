import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Logger } from '@nestjs/common';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;

    const now = Date.now();

    return next.handle().pipe(
      tap({
        next: (data) => {
          this.logger.log(`${method} ${url} ${Date.now() - now}ms`);
        },
        error: (error) => {
          this.logger.error(
            `${method} ${url} ${Date.now() - now}ms`,
            error.stack,
          );
        },
      }),
    );
  }
}