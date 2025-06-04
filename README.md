# Mini NestJS 框架

这是一个简化版的NestJS框架实现，用于学习和理解NestJS的核心概念和工作原理。本项目模拟了NestJS的架构和API设计，帮助开发者深入理解框架背后的设计模式和实现细节。

## 核心概念

本项目实现了NestJS的以下核心功能：

1. **装饰器系统** - 实现类似NestJS的`@Controller`、`@Get`、`@Post`等装饰器
2. **依赖注入** - 简化版的依赖注入容器
3. **模块化** - 模块注册和管理
4. **中间件** - 支持类中间件和函数中间件
5. **管道** - 用于数据转换和验证
6. **守卫** - 用于请求授权验证
7. **拦截器** - 用于在请求处理前后执行逻辑
8. **异常过滤器** - 用于统一处理异常
9. **自定义装饰器** - 支持创建自定义元数据装饰器
10. **API文档** - 基于装饰器的简单API文档生成

## 项目结构

```
src/
├── core/                 # 框架核心实现
│   ├── constants.ts      # 常量定义
│   ├── application.ts    # 应用类
│   ├── factory.ts        # 应用工厂
│   ├── decorators/       # 装饰器实现
│   ├── di/              # 依赖注入实现
│   ├── interfaces/      # 接口定义
│   ├── middleware/      # 中间件实现
│   ├── module/          # 模块加载器
│   ├── pipes/           # 管道实现
│   └── router/          # 路由实现
├── example/             # 示例应用
│   ├── app.module.ts    # 根模块
│   ├── controllers/     # 控制器示例
│   ├── decorators/      # 自定义装饰器示例
│   ├── filters/         # 异常过滤器示例
│   ├── guards/          # 守卫示例
│   ├── interceptors/    # 拦截器示例
│   ├── middleware/      # 中间件示例
│   ├── pipes/           # 管道示例
│   ├── services/        # 服务示例
│   ├── test.http        # HTTP请求测试文件
│   └── utils/           # 工具类
└── main.ts              # 应用入口
```

## 使用方法

1. 安装依赖：

```bash
npm install
```

2. 运行示例应用：

```bash
npm run start
```

3. 开发模式（自动重启）：

```bash
npm run dev
```

4. 访问API：

```
http://localhost:3000/users         # 用户API
http://localhost:3000/docs          # API文档界面
http://localhost:3000/api-docs      # API文档JSON数据
```

5. 测试API：

可以使用 `src/example/test.http` 文件测试API（如果你的编辑器支持，如VS Code + REST Client插件）。

## 学习资源

通过阅读源码，你可以学习到：

1. TypeScript装饰器的使用方法
2. 依赖注入的实现原理
3. 元数据反射的应用
4. Express与自定义框架的集成
5. 模块化设计思想

## 与完整NestJS的区别

本项目是一个简化实现，与完整的NestJS框架相比：

1. 功能更精简，专注于核心概念的实现
2. 实现了基础的异常过滤器、拦截器、守卫等功能，但不如官方框架完善
3. 没有实现完整的生命周期钩子和事件系统
4. 没有实现微服务、GraphQL、WebSockets等高级功能
5. 性能和稳定性不如官方框架

## 扩展功能

### 自定义装饰器

框架提供了创建自定义装饰器的工厂函数，可以轻松创建类、方法和参数装饰器。示例见 `src/example/decorators/api.decorator.ts`。

### API文档

使用自定义装饰器实现了简单的API文档生成功能，可以通过访问 `/docs` 路径查看。

### 认证守卫

实现了一个简单的API密钥认证守卫，可以在 `main.ts` 中取消注释启用。

## 贡献

欢迎提交问题和改进建议！