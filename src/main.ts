import 'reflect-metadata';
import * as path from 'path';
import * as fs from 'fs';
import { createMiniNestApplication } from './core';
import { AppModule } from './example/app.module';
import { LoggerMiddleware, loggerMiddleware } from './example/middleware/logger.middleware';
import { ValidationPipe } from './example/pipes/validation.pipe';
import { ExceptionFilter, createExceptionMiddleware } from './example/filters/exception.filter';
import { LoggingInterceptor, createInterceptorMiddleware } from './example/interceptors/logging.interceptor';
import { AuthGuard, createGuardMiddleware } from './example/guards/auth.guard';
import { ApiDocsGenerator } from './example/utils/api-docs.generator';

async function bootstrap() {
  // 创建应用实例
  const app = createMiniNestApplication(AppModule);
  
  // 获取Express实例
  const expressApp = app.getHttpAdapter();
  
  // 添加拦截器（应在其他中间件之前）
  const loggingInterceptor = new LoggingInterceptor();
  expressApp.use(createInterceptorMiddleware(loggingInterceptor));
  
  // 添加认证守卫（可选，取消注释以启用API密钥验证）
  // const authGuard = new AuthGuard();
  // expressApp.use('/users', createGuardMiddleware(authGuard));
  
  // 添加全局中间件
  app.use(LoggerMiddleware); // 类中间件
  // app.use(loggerMiddleware); // 函数中间件
  
  // 添加全局管道
  app.useGlobalPipes(ValidationPipe);
  
  // 添加异常过滤器（应在最后添加）
  const exceptionFilter = new ExceptionFilter();
  expressApp.use(createExceptionMiddleware(exceptionFilter));
  
  // 添加API文档JSON路由
  expressApp.get('/api-docs', (req, res) => {
    const controllers = app.getControllers();
    const routes = app.getRoutes();
    const docsMiddleware = ApiDocsGenerator.createDocsMiddleware(controllers, routes);
    docsMiddleware(req, res);
  });
  
  // 添加API文档HTML查看器路由
  expressApp.get('/docs', (req, res) => {
    const viewerPath = path.join(__dirname, 'example/utils/api-docs-viewer.html');
    fs.readFile(viewerPath, 'utf8', (err, data) => {
      if (err) {
        res.status(500).send('无法加载文档查看器');
        return;
      }
      res.setHeader('Content-Type', 'text/html');
      res.send(data);
    });
  });
  
  // 启动应用
  await app.listen(3000, () => {
    console.log('示例应用已启动，访问 http://localhost:3000/users 查看API');
    console.log('访问 http://localhost:3000/docs 查看API文档界面');
    console.log('访问 http://localhost:3000/api-docs 查看API文档JSON数据');
    console.log('可以使用 src/example/test.http 文件测试API（如果你的编辑器支持）');
  });
}

// 启动应用
bootstrap().catch(err => {
  console.error('应用启动失败:', err);
});