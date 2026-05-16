import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const payload = exception instanceof HttpException ? exception.getResponse() : null;

    const details = typeof payload === 'object' ? payload : undefined;
    const error = typeof payload === 'string' ? payload : (details as { message?: string })?.message || 'Internal server error';

    response.status(status).json({
      success: false,
      error,
      details: {
        ...(details || {}),
        timestamp: new Date().toISOString(),
        path: request.url,
      },
    });
  }
}
