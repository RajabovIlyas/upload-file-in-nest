import { FileService } from './file.service';
import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { of } from 'rxjs';
import { join } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { saveFileToStorage } from '../../helpers/upload-file.helper';
import { UploadFileDto } from './dto/upload-file.dto';
import constants from '../../common/constants';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

const {
  ERRORS: {
    MESSAGES: { FILE_NOT_FOUND },
  },
} = constants;

@Controller('file')
@UseGuards(JwtAuthGuard)
export class FileController {
  constructor(private fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', saveFileToStorage))
  upload(@UploadedFile() uploadFileDto: UploadFileDto) {
    return this.fileService.create(uploadFileDto);
  }

  @Get('list')
  getList(@Query() query: { page: number; limit: number }) {
    const { page = 1, limit = 10 } = query;
    return this.fileService.find(+page, +limit);
  }

  @Delete('delete/:id')
  deleteById(@Param('id') id: string) {
    return this.fileService.delete(+id);
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.fileService.findOne({ id: +id });
  }

  @Get('download/:id')
  async getFileById(@Param('id') id: string, @Res() res) {
    const file = await this.fileService.findOne({ id: +id });
    if (!file) {
      throw new NotFoundException(FILE_NOT_FOUND);
    }
    return of(res.sendFile(join(process.cwd(), file.path)));
  }

  @Put('update/:id')
  @UseInterceptors(FileInterceptor('file', saveFileToStorage))
  async updateFileById(
    @UploadedFile() uploadFileDto: UploadFileDto,
    @Param('id') id: string,
  ) {
    await this.fileService.updateById(+id, uploadFileDto);
    return { message: 'File changed successfully!', code: HttpStatus.OK };
  }
}
