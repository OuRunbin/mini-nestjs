import { Request, Response, NextFunction } from 'express';
import { Injectable } from '../../core/decorators';

/**
 * 异常接口
 */
export interface Exception {
  message: string;
  statusCode: number;
  stack?: string;
}

/**
 * 异常过滤器 - 处理应用中的异常
 */
@Injectable()
export class ExceptionFilter {
  /**
   * 捕获并处理异常
   * @param exception 异常对象
   * @param req 请求对象
   * @param res 响应对象
   * @param next 下一个中间件函数
   */
  catch(exception: any, req: Request, res: Response, next: NextFunction): void {
    const status = exception.statusCode || 500;
    const message = exception.message || '服务器内部错误';
    
    const errorResponse = {
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: req.url,
      method: req.method,
    };
    
    console.error(`[异常] ${req.method} ${req.url}`, exception.stack);
    
    res.status(status).json(errorResponse);
  }
}

/**
 * 创建异常中间件
 * @param filter 异常过滤器实例
 */
export function createExceptionMiddleware(filter: ExceptionFilter) {
  return (err: any, req: Request, res: Response, next: NextFunction) => {
    filter.catch(err, req, res, next);
  };
}