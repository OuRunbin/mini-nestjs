import { Request, Response, NextFunction } from 'express';
import { Injectable } from '../../core/decorators';

/**
 * 守卫接口
 */
export interface Guard {
  canActivate(req: Request, res: Response, next: NextFunction): boolean | Promise<boolean>;
}

/**
 * 认证守卫 - 验证请求是否包含有效的API密钥
 */
@Injectable()
export class AuthGuard implements Guard {
  // 模拟的API密钥
  private readonly validApiKey = 'mini-nestjs-secret-key';
  
  /**
   * 验证请求是否可以继续处理
   * @param req 请求对象
   * @param res 响应对象
   * @param next 下一个中间件函数
   */
  canActivate(req: Request, res: Response, next: NextFunction): boolean {
    const apiKey = req.headers['x-api-key'] as string;
    
    // 检查API密钥是否有效
    if (!apiKey || apiKey !== this.validApiKey) {
      return false;
    }
    
    return true;
  }
}

/**
 * 创建守卫中间件
 * @param guard 守卫实例
 */
export function createGuardMiddleware(guard: Guard) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const canActivate = await guard.canActivate(req, res, next);
      
      if (canActivate) {
        next();
      } else {
        res.status(401).json({
          statusCode: 401,
          message: '未授权访问',
          timestamp: new Date().toISOString(),
          path: req.url,
        });
      }
    } catch (error) {
      next(error);
    }
  };
}