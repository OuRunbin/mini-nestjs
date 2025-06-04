import 'reflect-metadata';

/**
 * 自定义装饰器工厂 - 用于创建自定义元数据装饰器
 * @param metadataKey 元数据键
 * @param metadataValue 元数据值
 */
export function createClassDecorator(metadataKey: string, metadataValue: any): ClassDecorator {
  return (target: object) => {
    Reflect.defineMetadata(metadataKey, metadataValue, target);
    // 不返回值，符合ClassDecorator类型定义
  };
}

/**
 * 创建方法装饰器
 * @param metadataKey 元数据键
 * @param metadataValue 元数据值
 */
export function createMethodDecorator(metadataKey: string, metadataValue: any): MethodDecorator {
  return (target: object, key: string | symbol, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(metadataKey, metadataValue, descriptor.value);
    return descriptor;
  };
}

/**
 * 创建参数装饰器
 * @param metadataKey 元数据键
 * @param index 参数索引
 * @param data 附加数据
 */
export function createParamDecorator(metadataKey: string) {
  return (data?: any): ParameterDecorator => {
    return (target: object, key: string | symbol, index: number) => {
      const params = Reflect.getMetadata(metadataKey, target.constructor, key) || [];
      params.push({
        index,
        data,
      });
      Reflect.defineMetadata(metadataKey, params, target.constructor, key);
    };
  };
}