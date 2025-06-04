import { Container } from '../di/container';
import { Type } from '../interfaces/type.interface';
import { MODULE_METADATA } from '../constants';
import { ModuleMetadata } from '../interfaces/module.interface';

/**
 * 模块加载器 - 负责加载和初始化模块
 */
export class ModuleLoader {
  private readonly loadedModules = new Set<Type<any>>();

  constructor(private readonly container: Container) {}

  /**
   * 加载模块
   * @param module 模块类
   */
  loadModule(module: Type<any>): void {
    // 如果模块已加载，则跳过
    if (this.loadedModules.has(module)) {
      return;
    }

    // 获取模块元数据
    const metadata = Reflect.getMetadata(MODULE_METADATA, module) as ModuleMetadata;
    if (!metadata) {
      throw new Error(`${module.name} 不是一个有效的模块`);
    }

    // 加载导入的模块
    if (metadata.imports) {
      metadata.imports.forEach(importedModule => this.loadModule(importedModule));
    }

    // 注册提供者
    if (metadata.providers) {
      metadata.providers.forEach(provider => this.container.addProvider(provider));
    }

    // 标记模块为已加载
    this.loadedModules.add(module);
  }

  /**
   * 获取模块的控制器
   * @param module 模块类
   */
  getControllers(module: Type<any>): Type<any>[] {
    const metadata = Reflect.getMetadata(MODULE_METADATA, module) as ModuleMetadata;
    return metadata?.controllers || [];
  }

  /**
   * 获取所有已加载模块的控制器
   */
  getAllControllers(): Type<any>[] {
    const controllers: Type<any>[] = [];
    
    this.loadedModules.forEach(module => {
      const moduleControllers = this.getControllers(module);
      controllers.push(...moduleControllers);
    });
    
    return controllers;
  }

  /**
   * 清除所有已加载的模块
   */
  clear(): void {
    this.loadedModules.clear();
  }
}