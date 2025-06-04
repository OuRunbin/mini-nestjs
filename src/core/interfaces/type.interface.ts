/**
 * 类型接口 - 表示一个构造函数类型
 */
export interface Type<T = any> extends Function {
  new (...args: any[]): T;
}

/**
 * 抽象类型接口 - 表示一个抽象类类型
 */
export interface Abstract<T = any> extends Function {
  prototype: T;
}