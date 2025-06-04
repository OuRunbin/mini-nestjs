import { Application, Request, Response, NextFunction } from 'express';
import { Container } from '../di/container';
import { PipeContainer } from '../pipes/pipe-container';
import { Type } from '../interfaces/type.interface';
import { ParamType } from '../decorators/param.decorator';
import {
  CONTROLLER_METADATA,
  METHOD_METADATA,
  ROUTE_METADATA,
  PARAM_METADATA,
} from '../constants';

/**
 * 控制器路由信息
 */
export interface ControllerRoute {
  controller: any;
  path: string;
  method: string;
  handler: Function;
  handlerName: string;
}

/**
 * 路由探索器 - 负责解析控制器和路由，并注册到Express应用
 */
export class RouterExplorer {
  private routes: ControllerRoute[] = [];
  constructor(
    private readonly container: Container,
    private readonly pipeContainer: PipeContainer
  ) {}

  /**
   * 探索并注册控制器的所有路由
   * @param app Express应用实例
   * @param controllers 控制器类列表
   */
  explore(app: Application, controllers: Type<any>[]): ControllerRoute[] {
    // 清空路由列表
    this.routes = [];
    controllers.forEach(controller => this.registerController(app, controller));
    
    return this.routes;
  }

  /**
   * 注册单个控制器的所有路由
   * @param app Express应用实例
   * @param controller 控制器类
   */
  private registerController(app: Application, controller: Type<any>): void {
    // 获取控制器实例
    const controllerInstance = this.container.get(controller);
    
    // 获取控制器前缀
    const prefix = Reflect.getMetadata(CONTROLLER_METADATA, controller) || '';
    
    // 获取控制器的所有方法
    const prototype = Object.getPrototypeOf(controllerInstance);
    const methodNames = Object.getOwnPropertyNames(prototype)
      .filter(prop => prop !== 'constructor' && typeof prototype[prop] === 'function');
    
    // 注册每个路由方法
    methodNames.forEach(methodName => {
      const methodHandler = prototype[methodName];
      
      // 获取路由元数据
      const httpMethod = Reflect.getMetadata(METHOD_METADATA, methodHandler);
      const path = Reflect.getMetadata(ROUTE_METADATA, methodHandler) || '';
      
      // 如果没有HTTP方法元数据，则不是路由处理器
      if (!httpMethod) return;
      
      // 构建完整路径
      const fullPath = this.normalizePath(`/${prefix}/${path}`);
      
      // 添加到路由列表
      this.routes.push({
        controller: controllerInstance,
        path: fullPath,
        method: httpMethod,
        handler: methodHandler,
        handlerName: methodName
      });
      
      // 注册路由
      app[httpMethod](fullPath, async (req: Request, res: Response, next: NextFunction) => {
        try {
          // 解析参数
          const args = await this.resolveHandlerParams(req, res, next, controller, methodName);
          
          // 调用控制器方法
          const result = await controllerInstance[methodName](...args);
          
          // 如果已经发送了响应，则不再处理
          if (res.headersSent) return;
          
          // 发送响应
          if (result !== undefined) {
            res.send(result);
          }
        } catch (error) {
          next(error);
        }
      });
      
      console.log(`Mapped {${httpMethod.toUpperCase()}} route '${fullPath}'`);
    });
  }

  /**
   * 解析处理器参数
   * @param req 请求对象
   * @param res 响应对象
   * @param next 下一个中间件函数
   * @param controller 控制器类
   * @param methodName 方法名
   */
  private async resolveHandlerParams(
    req: Request,
    res: Response,
    next: NextFunction,
    controller: Type<any>,
    methodName: string
  ): Promise<any[]> {
    // 获取参数元数据
    const paramMetadata = Reflect.getMetadata(PARAM_METADATA, controller, methodName) || [];
    
    // 如果没有参数元数据，返回空数组
    if (paramMetadata.length === 0) {
      return [];
    }
    
    // 创建参数数组
    const args = Array(paramMetadata.length);
    
    // 解析每个参数
    for (const { index, type, data } of paramMetadata) {
      switch (type) {
        case ParamType.REQUEST:
          args[index] = req;
          break;
        case ParamType.RESPONSE:
          args[index] = res;
          break;
        case ParamType.BODY:
          args[index] = data ? req.body?.[data] : req.body;
          break;
        case ParamType.QUERY:
          args[index] = data ? req.query?.[data] : req.query;
          break;
        case ParamType.PARAM:
          args[index] = data ? req.params?.[data] : req.params;
          break;
        case ParamType.HEADERS:
          args[index] = data ? req.headers?.[data.toLowerCase()] : req.headers;
          break;
        default:
          args[index] = undefined;
      }
      
      // 应用管道转换
      if (args[index] !== undefined) {
        args[index] = await this.pipeContainer.applyPipes(args[index], [], {
          type,
          data,
          controller: controller.name,
          method: methodName,
        });
      }
    }
    
    return args;
  }

  /**
   * 规范化路径
   * @param path 路径
   */
  private normalizePath(path: string): string {
    // 移除多余的斜杠
    return path.replace(/\/+/g, '/');
  }
  
  /**
   * 获取所有注册的路由
   */
  getRoutes(): ControllerRoute[] {
    return this.routes;
  }
}