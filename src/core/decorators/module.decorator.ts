import 'reflect-metadata';
import { MODULE_METADATA } from '../constants';
import { ModuleMetadata } from '../interfaces/module.interface';

/**
 * Module装饰器 - 用于定义一个模块
 * @param metadata 模块元数据
 */
export function Module(metadata: ModuleMetadata): ClassDecorator {
  return (target: object) => {
    Reflect.defineMetadata(MODULE_METADATA, metadata, target);
  };
}