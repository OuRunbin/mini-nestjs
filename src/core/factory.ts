import { MiniNestApplication } from './application';
import { Type } from './interfaces/type.interface';

/**
 * 创建MiniNestJS应用实例
 * @param module 根模块类
 */
export function createMiniNestApplication(module: Type<any>): MiniNestApplication {
  return MiniNestApplication.create(module);
}