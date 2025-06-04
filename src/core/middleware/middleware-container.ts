import { Application, RequestHandler } from 'express';
import { Container } from '../di/container';
import { Middleware, MiddlewareFunction } from '../interfaces/middleware.interface';
import { Type } from '../interfaces/type.interface';

/**
 * 中间件容器 - 管理和应用中间件
 */
export class MiddlewareContainer {
  private readonly globalMiddlewares: Array<MiddlewareFunction | Type<Middleware>> = [];
  private readonly routeMiddlewares = new Map<string, Array<MiddlewareFunction | Type<Middleware>>>();

  constructor(private readonly container: Container) {}

  /**
   * 添加全局中间件
   * @param middleware 中间件函数或类
   */
  addGlobalMiddleware(middleware: MiddlewareFunction | Type<Middleware>): void {
    this.globalMiddlewares.push(middleware);
  }

  /**
   * 添加路由中间件
   * @param route 路由路径
   * @param middleware 中间件函数或类
   */
  addRouteMiddleware(route: string, middleware: MiddlewareFunction | Type<Middleware>): void {
    if (!this.routeMiddlewares.has(route)) {
      this.routeMiddlewares.set(route, []);
    }
    this.routeMiddlewares.get(route)!.push(middleware);
  }

  /**
   * 应用所有中间件到Express应用
   * @param app Express应用实例
   */
  applyMiddlewares(app: Application): void {
    // 应用全局中间件
    this.globalMiddlewares.forEach(middleware => {
      app.use(this.resolveMiddleware(middleware));
    });

    // 应用路由中间件
    this.routeMiddlewares.forEach((middlewares, route) => {
      middlewares.forEach(middleware => {
        app.use(route, this.resolveMiddleware(middleware));
      });
    });
  }

  /**
   * 解析中间件（函数或类）
   * @param middleware 中间件函数或类
   */
  private resolveMiddleware(middleware: MiddlewareFunction | Type<Middleware>): RequestHandler {
    if (typeof middleware === 'function' && !this.isClass(middleware)) {
      // 函数中间件
      return middleware as RequestHandler;
    } else {
      // 类中间件
      const middlewareInstance = this.container.get(middleware as Type<Middleware>);
      return (req, res, next) => middlewareInstance.use(req, res, next);
    }
  }

  /**
   * 判断一个函数是否为类构造函数
   * @param fn 要检查的函数
   */
  private isClass(fn: Function): boolean {
    return typeof fn === 'function' && /^\s*class\s+/.test(fn.toString());
  }
}