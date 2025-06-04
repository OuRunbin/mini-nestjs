import { Request, Response, NextFunction } from 'express';
import { Injectable } from '../../core/decorators';

/**
 * 拦截器接口
 */
export interface Interceptor {
  intercept(req: Request, res: Response, next: NextFunction): void;
}

/**
 * 日志拦截器 - 记录请求和响应信息
 */
@Injectable()
export class LoggingInterceptor implements Interceptor {
  intercept(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl, body } = req;
    const startTime = Date.now();
    
    console.log(`[拦截器] 请求开始 - ${method} ${originalUrl}`);
    if (Object.keys(body || {}).length > 0) {
      console.log(`[拦截器] 请求体:`, body);
    }
    
    // 保存原始的 res.send 方法
    const originalSend = res.send;
    
    // 重写 res.send 方法以拦截响应
    res.send = function(body) {
      const duration = Date.now() - startTime;
      console.log(`[拦截器] 响应完成 - ${method} ${originalUrl} - ${res.statusCode} - ${duration}ms`);
      
      // 调用原始的 send 方法
      return originalSend.call(this, body);
    };
    
    next();
  }
}

/**
 * 创建拦截器中间件
 * @param interceptor 拦截器实例
 */
export function createInterceptorMiddleware(interceptor: Interceptor) {
  return (req: Request, res: Response, next: NextFunction) => {
    interceptor.intercept(req, res, next);
  };
}