import 'reflect-metadata';
import { RequestMethod, METHOD_METADATA, ROUTE_METADATA } from '../constants';

/**
 * 创建路由装饰器的工厂函数
 * @param method HTTP方法
 */
const createMappingDecorator = (method: RequestMethod) => (
  path: string = ''
): MethodDecorator => {
  return (target: object, key: string | symbol, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(METHOD_METADATA, method, descriptor.value);
    Reflect.defineMetadata(ROUTE_METADATA, path, descriptor.value);
    return descriptor;
  };
};

/**
 * GET请求装饰器
 */
export const Get = createMappingDecorator(RequestMethod.GET);

/**
 * POST请求装饰器
 */
export const Post = createMappingDecorator(RequestMethod.POST);

/**
 * PUT请求装饰器
 */
export const Put = createMappingDecorator(RequestMethod.PUT);

/**
 * DELETE请求装饰器
 */
export const Delete = createMappingDecorator(RequestMethod.DELETE);

/**
 * PATCH请求装饰器
 */
export const Patch = createMappingDecorator(RequestMethod.PATCH);

/**
 * OPTIONS请求装饰器
 */
export const Options = createMappingDecorator(RequestMethod.OPTIONS);

/**
 * HEAD请求装饰器
 */
export const Head = createMappingDecorator(RequestMethod.HEAD);

/**
 * 所有HTTP方法装饰器
 */
export const All = createMappingDecorator(RequestMethod.ALL);