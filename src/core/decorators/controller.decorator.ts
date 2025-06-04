import 'reflect-metadata';
import { CONTROLLER_METADATA } from '../constants';

/**
 * Controller装饰器 - 用于标记一个类为控制器
 * @param prefix 路由前缀
 */
export function Controller(prefix: string = ''): ClassDecorator {
  return (target: object) => {
    Reflect.defineMetadata(CONTROLLER_METADATA, prefix, target);
  };
}