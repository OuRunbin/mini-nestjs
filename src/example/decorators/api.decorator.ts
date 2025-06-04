import { createClassDecorator, createMethodDecorator } from '../../core/decorators/custom-decorator.factory';

// API文档元数据键
export const API_TAG_METADATA = 'api:tag';
export const API_OPERATION_METADATA = 'api:operation';

/**
 * API标签接口 - 用于控制器分组
 */
export interface ApiTagOptions {
  name: string;
  description?: string;
}

/**
 * API操作接口 - 用于路由方法描述
 */
export interface ApiOperationOptions {
  summary: string;
  description?: string;
  deprecated?: boolean;
  responses?: Record<string, { description: string }>;
}

/**
 * ApiTag装饰器 - 用于标记控制器的API分组
 * @param options 标签选项
 */
export const ApiTag = (options: ApiTagOptions): ClassDecorator => {
  return createClassDecorator(API_TAG_METADATA, options);
};

/**
 * ApiOperation装饰器 - 用于描述API操作
 * @param options 操作选项
 */
export const ApiOperation = (options: ApiOperationOptions): MethodDecorator => {
  return createMethodDecorator(API_OPERATION_METADATA, options);
};

/**
 * 从类中提取API标签信息
 * @param target 目标类
 */
export function getApiTag(target: object): ApiTagOptions | undefined {
  return Reflect.getMetadata(API_TAG_METADATA, target);
}

/**
 * 从方法中提取API操作信息
 * @param method 目标方法
 */
export function getApiOperation(method: Function): ApiOperationOptions | undefined {
  return Reflect.getMetadata(API_OPERATION_METADATA, method);
}