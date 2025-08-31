import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  constructor() {}

  async catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    let statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException && exception.message
        ? exception.message
        : 'Error';


    const errors =
      statusCode === HttpStatus.BAD_REQUEST
        ? ((exception as HttpException)?.getResponse()['message'] ?? undefined)
        : undefined;

    const errorResponse = {
      statusCode,
      status: false,
      timestamp: new Date().toISOString(),
      message,
      errors,
      trace: process.env.APP_ENV === 'local' ? exception : undefined,
    };

    if (statusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
      const errorDetails = {
        ...errorResponse,
        stack: exception instanceof Error ? exception.stack : undefined,
      };
      this.logger.error(JSON.stringify(errorDetails));
    }

    response.status(statusCode).json(errorResponse);
  }
}
