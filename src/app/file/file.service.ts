import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { File } from './file.entity';
import { Repository } from 'typeorm';
import { UploadFileDto } from './dto/upload-file.dto';
import { removeFile } from '../../helpers/remove-file.helper';
import constants from '../../common/constants';

const {
  ERRORS: {
    MESSAGES: { FILE_NOT_FOUND },
  },
} = constants;

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>,
  ) {}

  find(page: number, limit: number) {
    return this.fileRepository.find({
      take: limit,
      skip: limit * page - limit,
    });
  }

  create({ path, filename, mimetype, encoding, size }: UploadFileDto) {
    return this.fileRepository.save({
      path,
      name: filename,
      info: { encoding, mimetype, size },
    });
  }

  async updateById(
    id: number,
    { path, filename, mimetype, encoding, size }: UploadFileDto,
  ) {
    const file = await this.fileRepository.findOne({ where: { id } });
    removeFile(file.path);
    return this.fileRepository.update(id, {
      path,
      name: filename,
      info: { encoding, mimetype, size },
    });
  }

  async findOne(params: Partial<File>) {
    const file = await this.fileRepository.findOne({ where: params });
    if (!file) {
      throw new NotFoundException(FILE_NOT_FOUND);
    }
    return file;
  }

  async delete(id: number) {
    const file = await this.fileRepository.findOne({ where: { id } });
    removeFile(file.path);
    return this.fileRepository.remove(file);
  }
}
