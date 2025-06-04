import 'reflect-metadata';
import { Type } from '../interfaces/type.interface';

/**
 * 依赖注入容器 - 负责管理和注入依赖
 */
export class Container {
  private providers = new Map<string, any>();

  /**
   * 添加提供者到容器
   * @param provider 提供者类
   */
  addProvider<T>(provider: Type<T>): void {
    const name = provider.name;
    if (!this.providers.has(name)) {
      const instance = this.resolve<T>(provider);
      this.providers.set(name, instance);
    }
  }

  /**
   * 获取提供者实例
   * @param provider 提供者类
   */
  get<T>(provider: Type<T>): T {
    const name = provider.name;
    if (!this.providers.has(name)) {
      this.addProvider(provider);
    }
    return this.providers.get(name);
  }

  /**
   * 解析并创建提供者实例
   * @param provider 提供者类
   */
  private resolve<T>(provider: Type<T>): T {
    // 获取构造函数的参数类型
    const paramTypes = Reflect.getMetadata('design:paramtypes', provider) || [];
    
    // 解析每个参数的依赖
    const dependencies = paramTypes.map((paramType: Type<any>) => {
      // 处理循环依赖
      if (paramType === provider) {
        throw new Error(`循环依赖检测到: ${provider.name}`);
      }
      
      // 递归解析依赖
      return this.get(paramType);
    });
    
    // 创建提供者实例
    return new provider(...dependencies);
  }

  /**
   * 清除容器中的所有提供者
   */
  clear(): void {
    this.providers.clear();
  }
}