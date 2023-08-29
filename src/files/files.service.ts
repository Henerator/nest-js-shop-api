import { Injectable } from '@nestjs/common';
import { path } from 'app-root-path';
import { format } from 'date-fns';
import { ensureDir, writeFile } from 'fs-extra';
import { FileResponse } from './dto/file.response';

@Injectable()
export class FilesService {
  async saveFiles(files: Express.Multer.File[]): Promise<FileResponse[]> {
    const dateFolder = format(new Date(), 'yyyy-MM-dd');
    const uploadFolder = `${path}/uploads/${dateFolder}`;
    await ensureDir(uploadFolder);

    const responses: FileResponse[] = [];
    for (const file of files) {
      await writeFile(`${uploadFolder}/${file.originalname}`, file.buffer);
      responses.push({
        url: `${dateFolder}/${file.originalname}`,
        name: file.originalname,
      });
    }

    return responses;
  }
}
