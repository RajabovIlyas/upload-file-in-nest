import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './file.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [FileController],
  imports: [TypeOrmModule.forFeature([File]), AuthModule],
  providers: [FileService],
})
export class FileModule {}
