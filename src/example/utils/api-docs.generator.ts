import { Request, Response } from 'express';
import { getApiTag, getApiOperation, ApiTagOptions, ApiOperationOptions } from '../decorators/api.decorator';

/**
 * API文档信息
 */
interface ApiDocumentation {
  title: string;
  description: string;
  version: string;
  tags: ApiTagOptions[];
  paths: Record<string, Record<string, ApiPathItem>>;
}

/**
 * API路径项
 */
interface ApiPathItem {
  summary: string;
  description?: string;
  deprecated?: boolean;
  responses: Record<string, { description: string }>;
}

/**
 * 控制器路由信息
 */
interface ControllerRoute {
  controller: any;
  path: string;
  method: string;
  handler: Function;
  handlerName: string;
}

/**
 * API文档生成器
 */
export class ApiDocsGenerator {
  private documentation: ApiDocumentation;
  
  constructor() {
    this.documentation = {
      title: 'Mini NestJS API',
      description: 'Mini NestJS框架示例API文档',
      version: '1.0.0',
      tags: [],
      paths: {}
    };
  }
  
  /**
   * 从控制器生成API文档
   * @param controllers 控制器列表
   * @param routes 路由信息
   */
  generateDocs(controllers: any[], routes: ControllerRoute[]): ApiDocumentation {
    // 处理标签
    controllers.forEach(controller => {
      const tagMetadata = getApiTag(controller);
      if (tagMetadata) {
        this.documentation.tags.push(tagMetadata);
      }
    });
    
    // 处理路径
    routes.forEach(route => {
      const { controller, path, method, handler, handlerName } = route;
      
      // 获取操作元数据
      const operationMetadata = getApiOperation(handler);
      if (!operationMetadata) return;
      
      // 获取控制器标签
      const tagMetadata = getApiTag(controller.constructor);
      const tagName = tagMetadata?.name || 'default';
      
      // 添加路径信息
      if (!this.documentation.paths[path]) {
        this.documentation.paths[path] = {};
      }
      
      this.documentation.paths[path][method.toLowerCase()] = {
        summary: operationMetadata.summary,
        description: operationMetadata.description,
        deprecated: operationMetadata.deprecated,
        responses: operationMetadata.responses || { '200': { description: 'Success' } },
      };
    });
    
    return this.documentation;
  }
  
  /**
   * 创建API文档中间件
   * @param controllers 控制器列表
   * @param routes 路由信息
   */
  static createDocsMiddleware(controllers: any[], routes: ControllerRoute[]) {
    const generator = new ApiDocsGenerator();
    const docs = generator.generateDocs(controllers, routes);
    
    return (req: Request, res: Response) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(docs, null, 2));
    };
  }
}