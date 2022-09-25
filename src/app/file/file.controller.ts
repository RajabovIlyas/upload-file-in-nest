import { FileService } from './file.service';
import {Controller} from "@nestjs/common";


@Controller('file')
export class FileController {
    constructor(private fileService: FileService) {}
}
