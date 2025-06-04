import { Type } from './type.interface';

/**
 * 模块元数据接口
 */
export interface ModuleMetadata {
  /**
   * 导入的模块列表
   */
  imports?: Type<any>[];
  
  /**
   * 控制器列表
   */
  controllers?: Type<any>[];
  
  /**
   * 提供者列表
   */
  providers?: Type<any>[];
  
  /**
   * 导出的提供者列表
   */
  exports?: Type<any>[];
}