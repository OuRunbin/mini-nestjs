import { Injectable } from '../../core/decorators';

// 用户接口
export interface User {
  id: number;
  name: string;
  email: string;
}

/**
 * 用户服务 - 示例服务类
 */
@Injectable()
export class UserService {
  private users: User[] = [
    { id: 1, name: '张三', email: 'zhangsan@example.com' },
    { id: 2, name: '李四', email: 'lisi@example.com' },
    { id: 3, name: '王五', email: 'wangwu@example.com' },
  ];

  /**
   * 获取所有用户
   */
  findAll(): User[] {
    return this.users;
  }

  /**
   * 根据ID获取用户
   * @param id 用户ID
   */
  findById(id: number): User | undefined {
    return this.users.find(user => user.id === id);
  }

  /**
   * 创建用户
   * @param user 用户数据
   */
  create(user: Omit<User, 'id'>): User {
    const newUser = {
      id: this.users.length + 1,
      ...user,
    };
    this.users.push(newUser);
    return newUser;
  }

  /**
   * 更新用户
   * @param id 用户ID
   * @param userData 用户数据
   */
  update(id: number, userData: Partial<User>): User | undefined {
    const index = this.users.findIndex(user => user.id === id);
    if (index === -1) return undefined;

    const updatedUser = { ...this.users[index], ...userData };
    this.users[index] = updatedUser;
    return updatedUser;
  }

  /**
   * 删除用户
   * @param id 用户ID
   */
  delete(id: number): boolean {
    const index = this.users.findIndex(user => user.id === id);
    if (index === -1) return false;

    this.users.splice(index, 1);
    return true;
  }
}