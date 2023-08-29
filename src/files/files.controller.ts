import {
  Controller,
  HttpCode,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { FileResponse } from './dto/file.response';
import { FilesService } from './files.service';
import { MFile } from './mfile';

@Controller('files')
export class FilesController {
  constructor(private readonly service: FilesService) {}

  @Post('upload')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('files'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<FileResponse[]> {
    const filesToSave: MFile[] = [new MFile(file)];

    if (file.mimetype.includes('image')) {
      const buffer = await this.service.convertToWebP(file.buffer);
      filesToSave.push(
        new MFile({
          originalname: `${file.originalname.split('.')[0]}.webp`,
          buffer: buffer,
        }),
      );
    }

    return this.service.saveFiles(filesToSave);
  }
}
