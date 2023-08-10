import { Module } from '@nestjs/common';
import { TutorialCategoryService } from './tutorial-category.service';
import { TutorialCategoryController } from './tutorial-category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { TutorialCategory } from './entities/tutorial-category.entity';
import { jwtConfig } from '../../config/jwt.config';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TutorialCategory]),
    JwtModule.registerAsync(jwtConfig),
    UserModule,
  ],
  controllers: [TutorialCategoryController],
  providers: [TutorialCategoryService],
  exports: [TutorialCategoryService],
})
export class TutorialCategoryModule {}
