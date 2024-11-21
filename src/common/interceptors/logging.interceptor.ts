import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Logger } from 'winston';
import { Inject } from '@nestjs/common';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(@Inject('winston') private readonly logger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;

    const now = Date.now();

    return next.handle().pipe(
      tap({
        next: (data) => {
          this.logger.info(`${method} ${url} ${Date.now() - now}ms`, {
            context: LoggingInterceptor.name,
          });
        },
        error: (error) => {
          this.logger.error(`${method} ${url} ${Date.now() - now}ms`, {
            stack: error.stack,
            context: LoggingInterceptor.name,
          });
        },
      }),
    );
  }
}




// import {
//   Injectable,
//   NestInterceptor,
//   ExecutionContext,
//   CallHandler,
// } from '@nestjs/common';
// import { Observable } from 'rxjs';
// import { tap } from 'rxjs/operators';
// import { Logger } from '@nestjs/common';

// @Injectable()
// export class LoggingInterceptor implements NestInterceptor {
//   private readonly logger = new Logger(LoggingInterceptor.name);

//   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
//     const request = context.switchToHttp().getRequest();
//     const method = request.method;
//     const url = request.url;

//     const now = Date.now();

//     return next.handle().pipe(
//       tap({
//         next: (data) => {
//           this.logger.log(`${method} ${url} ${Date.now() - now}ms`);
//         },
//         error: (error) => {
//           this.logger.error(
//             `${method} ${url} ${Date.now() - now}ms`,
//             error.stack,
//           );
//         },
//       }),
//     );
//   }
// }
