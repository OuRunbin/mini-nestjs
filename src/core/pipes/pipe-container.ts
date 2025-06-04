import { Container } from '../di/container';
import { PipeTransform } from '../interfaces/pipe.interface';
import { Type } from '../interfaces/type.interface';

/**
 * 管道容器 - 管理和应用管道
 */
export class PipeContainer {
  private readonly globalPipes: Array<Type<PipeTransform>> = [];

  constructor(private readonly container: Container) {}

  /**
   * 添加全局管道
   * @param pipe 管道类
   */
  addGlobalPipe(pipe: Type<PipeTransform>): void {
    this.globalPipes.push(pipe);
  }

  /**
   * 应用管道转换
   * @param value 输入值
   * @param pipes 管道列表
   * @param metadata 元数据
   */
  async applyPipes<T = any>(value: T, pipes: Array<Type<PipeTransform>> = [], metadata?: any): Promise<any> {
    // 合并全局管道和特定管道
    const allPipes = [...this.globalPipes, ...pipes];
    
    // 如果没有管道，直接返回原值
    if (allPipes.length === 0) {
      return value;
    }

    // 依次应用所有管道
    let result = value;
    for (const pipeType of allPipes) {
      const pipe = this.container.get(pipeType);
      result = await pipe.transform(result, metadata);
    }

    return result;
  }
}