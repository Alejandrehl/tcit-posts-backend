import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeormConfig from './config/typeorm.config';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      useFactory: () => typeormConfig(),
    }),
    PostsModule,
  ],
})
export class AppModule {}
