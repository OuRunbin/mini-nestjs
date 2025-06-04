import 'reflect-metadata';
import { INJECTABLE_METADATA } from '../constants';

/**
 * Injectable装饰器 - 用于标记一个类为可注入的服务
 */
export function Injectable(): ClassDecorator {
  return (target: object) => {
    Reflect.defineMetadata(INJECTABLE_METADATA, true, target);
  };
}