import { Request, Response, NextFunction } from 'express';

/**
 * 中间件函数类型
 */
export type MiddlewareFunction = (req: Request, res: Response, next: NextFunction) => void;

/**
 * 中间件接口 - 类中间件必须实现此接口
 */
export interface Middleware {
  use(req: Request, res: Response, next: NextFunction): void;
}