import { Request, Response, NextFunction } from 'express';
import { Injectable } from '../../core/decorators';
import { Middleware } from '../../core/interfaces';

/**
 * 日志中间件 - 记录请求信息
 */
@Injectable()
export class LoggerMiddleware implements Middleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl } = req;
    const startTime = Date.now();
    
    console.log(`[${new Date().toISOString()}] ${method} ${originalUrl} - 开始处理`);
    
    // 响应结束时记录处理时间
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      console.log(`[${new Date().toISOString()}] ${method} ${originalUrl} - ${res.statusCode} - ${duration}ms`);
    });
    
    next();
  }
}

/**
 * 函数式日志中间件
 */
export function loggerMiddleware(req: Request, res: Response, next: NextFunction): void {
  const { method, originalUrl } = req;
  const startTime = Date.now();
  
  console.log(`[${new Date().toISOString()}] ${method} ${originalUrl} - 开始处理`);
  
  // 响应结束时记录处理时间
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    console.log(`[${new Date().toISOString()}] ${method} ${originalUrl} - ${res.statusCode} - ${duration}ms`);
  });
  
  next();
}