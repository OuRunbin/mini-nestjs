import 'reflect-metadata';
import { PARAM_METADATA } from '../constants';

// 参数类型枚举
export enum ParamType {
  BODY = 'body',
  QUERY = 'query',
  PARAM = 'param',
  HEADERS = 'headers',
  REQUEST = 'request',
  RESPONSE = 'response',
}

/**
 * 创建参数装饰器的工厂函数
 * @param type 参数类型
 */
const createParamDecorator = (type: ParamType) => (
  data?: string
): ParameterDecorator => {
  return (target: object, key: string | symbol, index: number) => {
    const params = Reflect.getMetadata(PARAM_METADATA, target.constructor, key) || [];
    params.push({
      type,
      index,
      data,
    });
    Reflect.defineMetadata(PARAM_METADATA, params, target.constructor, key);
  };
};

/**
 * 请求体参数装饰器
 */
export const Body = createParamDecorator(ParamType.BODY);

/**
 * 查询参数装饰器
 */
export const Query = createParamDecorator(ParamType.QUERY);

/**
 * 路径参数装饰器
 */
export const Param = createParamDecorator(ParamType.PARAM);

/**
 * 请求头参数装饰器
 */
export const Headers = createParamDecorator(ParamType.HEADERS);

/**
 * 请求对象装饰器
 */
export const Req = createParamDecorator(ParamType.REQUEST);
export const Request = Req;

/**
 * 响应对象装饰器
 */
export const Res = createParamDecorator(ParamType.RESPONSE);
export const Response = Res;