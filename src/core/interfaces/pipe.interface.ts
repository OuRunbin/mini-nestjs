/**
 * 管道接口 - 用于数据转换和验证
 */
export interface PipeTransform<T = any, R = any> {
  /**
   * 转换方法 - 实现数据转换或验证逻辑
   * @param value 输入值
   * @param metadata 元数据
   */
  transform(value: T, metadata?: any): R;
}