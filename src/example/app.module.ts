import { Module } from '../core/decorators';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';

/**
 * 应用模块 - 示例应用的根模块
 */
@Module({
  controllers: [UserController],
  providers: [UserService],
})
export class AppModule {}