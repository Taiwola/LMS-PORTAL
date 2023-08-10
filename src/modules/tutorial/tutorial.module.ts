import { Module } from '@nestjs/common';
import { TutorialService } from './tutorial.service';
import { TutorialController } from './tutorial.controller';
import { TutorialCategoryModule } from '../tutorial-category/tutorial-category.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConfig } from '../../config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { Tutorial } from './entities/tutorial.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TutorialCategoryModule,
    UserModule,
    TypeOrmModule.forFeature([Tutorial]),
    JwtModule.registerAsync(jwtConfig),
  ],
  controllers: [TutorialController],
  providers: [TutorialService],
  exports: [TutorialService],
})
export class TutorialModule {}
