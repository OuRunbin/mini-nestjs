import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '../../core/decorators';
import { UserService, User } from '../services/user.service';
import { ApiTag, ApiOperation } from '../decorators/api.decorator';

/**
 * 用户控制器 - 示例控制器类
 */
@ApiTag({ name: '用户管理', description: '用户资源的CRUD操作' })
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 获取所有用户
   */
  @ApiOperation({
    summary: '获取所有用户',
    description: '返回系统中所有用户的列表',
    responses: {
      '200': { description: '用户列表获取成功' }
    }
  })
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  /**
   * 根据ID获取用户
   */
  @ApiOperation({
    summary: '根据ID获取用户',
    description: '根据提供的用户ID返回特定用户信息',
    responses: {
      '200': { description: '用户信息获取成功' },
      '404': { description: '用户不存在' }
    }
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    const userId = parseInt(id, 10);
    const user = this.userService.findById(userId);
    
    if (!user) {
      return { statusCode: 404, message: '用户不存在' };
    }
    
    return user;
  }

  /**
   * 创建用户
   */
  @ApiOperation({
    summary: '创建新用户',
    description: '根据提供的用户数据创建新用户',
    responses: {
      '201': { description: '用户创建成功' }
    }
  })
  @Post()
  create(@Body() userData: Omit<User, 'id'>) {
    return this.userService.create(userData);
  }

  /**
   * 更新用户
   */
  @ApiOperation({
    summary: '更新用户信息',
    description: '根据提供的ID和数据更新用户信息',
    responses: {
      '200': { description: '用户更新成功' },
      '404': { description: '用户不存在' }
    }
  })
  @Put(':id')
  update(@Param('id') id: string, @Body() userData: Partial<User>) {
    const userId = parseInt(id, 10);
    const updatedUser = this.userService.update(userId, userData);
    
    if (!updatedUser) {
      return { statusCode: 404, message: '用户不存在' };
    }
    
    return updatedUser;
  }

  /**
   * 删除用户
   */
  @ApiOperation({
    summary: '删除用户',
    description: '根据提供的ID删除用户',
    responses: {
      '200': { description: '用户删除成功' },
      '404': { description: '用户不存在' }
    }
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    const userId = parseInt(id, 10);
    const deleted = this.userService.delete(userId);
    
    if (!deleted) {
      return { statusCode: 404, message: '用户不存在' };
    }
    
    return { statusCode: 200, message: '用户已删除' };
  }

  /**
   * 搜索用户
   */
  @ApiOperation({
    summary: '搜索用户',
    description: '根据名称搜索用户',
    responses: {
      '200': { description: '搜索结果' }
    }
  })
  @Get('search')
  search(@Query('name') name: string) {
    const users = this.userService.findAll();
    return users.filter(user => user.name.includes(name));
  }
}