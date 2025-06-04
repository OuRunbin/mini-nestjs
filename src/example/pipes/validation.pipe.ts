import { Injectable } from '../../core/decorators';
import { PipeTransform } from '../../core/interfaces';

/**
 * 验证管道 - 简单的数据验证示例
 */
@Injectable()
export class ValidationPipe implements PipeTransform {
  transform(value: any, metadata?: any): any {
    // 简单示例：检查值是否为空
    if (value === undefined || value === null) {
      throw new Error('验证失败：值不能为空');
    }
    
    // 如果是数字字符串，转换为数字
    if (typeof value === 'string' && !isNaN(Number(value))) {
      return Number(value);
    }
    
    return value;
  }
}

/**
 * 解析JSON管道 - 将字符串转换为JSON对象
 */
@Injectable()
export class ParseJsonPipe implements PipeTransform {
  transform(value: any, metadata?: any): any {
    if (typeof value !== 'string') {
      return value;
    }
    
    try {
      return JSON.parse(value);
    } catch (error) {
      throw new Error('无效的JSON字符串');
    }
  }
}