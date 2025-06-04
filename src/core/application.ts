import * as express from 'express';
import { Application as ExpressApplication } from 'express';
import { Container } from './di/container';
import { ModuleLoader } from './module/module-loader';
import { RouterExplorer, ControllerRoute } from './router/router-explorer';
import { MiddlewareContainer } from './middleware/middleware-container';
import { PipeContainer } from './pipes/pipe-container';
import { Type } from './interfaces/type.interface';
import { MiddlewareFunction, Middleware } from './interfaces/middleware.interface';
import { PipeTransform } from './interfaces/pipe.interface';

/**
 * MiniNestJS应用类 - 整合所有组件并提供应用启动功能
 */
export class MiniNestApplication {
  private readonly expressApp: ExpressApplication;
  private readonly container: Container;
  private readonly moduleLoader: ModuleLoader;
  private readonly routerExplorer: RouterExplorer;
  private readonly middlewareContainer: MiddlewareContainer;
  private readonly pipeContainer: PipeContainer;
  private routes: ControllerRoute[] = [];

  constructor() {
    // 创建Express应用
    this.expressApp = express();
    
    // 初始化容器和组件
    this.container = new Container();
    this.moduleLoader = new ModuleLoader(this.container);
    this.middlewareContainer = new MiddlewareContainer(this.container);
    this.pipeContainer = new PipeContainer(this.container);
    this.routerExplorer = new RouterExplorer(this.container, this.pipeContainer);
    
    // 配置默认中间件
    this.expressApp.use(express.json());
    this.expressApp.use(express.urlencoded({ extended: true }));
  }

  /**
   * 创建应用实例
   * @param module 根模块类
   */
  static create(module: Type<any>): MiniNestApplication {
    const app = new MiniNestApplication();
    app.loadModule(module);
    return app;
  }

  /**
   * 加载模块
   * @param module 模块类
   */
  loadModule(module: Type<any>): this {
    this.moduleLoader.loadModule(module);
    return this;
  }

  /**
   * 添加全局中间件
   * @param middleware 中间件函数或类
   */
  use(middleware: MiddlewareFunction | Type<Middleware>): this {
    this.middlewareContainer.addGlobalMiddleware(middleware);
    return this;
  }

  /**
   * 添加全局管道
   * @param pipe 管道类
   */
  useGlobalPipes(pipe: Type<PipeTransform>): this {
    this.pipeContainer.addGlobalPipe(pipe);
    return this;
  }

  /**
   * 获取Express应用实例
   */
  getHttpAdapter(): ExpressApplication {
    return this.expressApp;
  }

  /**
   * 启动应用
   * @param port 端口号
   * @param callback 回调函数
   */
  async listen(port: number, callback?: () => void): Promise<void> {
    // 应用中间件
    this.middlewareContainer.applyMiddlewares(this.expressApp);
    
    // 注册路由
    const controllers = this.moduleLoader.getAllControllers();
    this.routes = this.routerExplorer.explore(this.expressApp, controllers);
    
    // 添加错误处理中间件
    this.expressApp.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.error(err.stack);
      res.status(500).json({
        statusCode: 500,
        message: err.message || 'Internal Server Error',
      });
    });
    
    // 启动服务器
    return new Promise<void>((resolve) => {
      this.expressApp.listen(port, () => {
        console.log(`MiniNestJS应用已启动，监听端口: ${port}`);
        if (callback) callback();
        resolve();
      });
    });
  }

  /**
   * 获取所有注册的路由
   */
  getRoutes(): ControllerRoute[] {
    return this.routes;
  }

  /**
   * 获取所有控制器
   */
  getControllers(): any[] {
    return this.moduleLoader.getAllControllers();
  }

  /**
   * 关闭应用
   */
  close(): void {
    // 清除容器和模块
    this.container.clear();
    this.moduleLoader.clear();
  }
}