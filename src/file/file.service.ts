import { Injectable } from '@nestjs/common';
import { path } from 'app-root-path';
import { ensureDir, writeFile } from 'fs-extra';
import * as pathModule from 'path'; // ✅ SECURITY FIX: path module qo'shildi
import { FileResponse } from './file.interface';

@Injectable()
export class FileService {
  async saveFile(file: Express.Multer.File, folder: string = 'default'): Promise<FileResponse> {
    // ✅ SECURITY FIX: Folder name sanitization - path traversal attack himoyasi
    const sanitizedFolder = pathModule.basename(folder);
    const uploadFolder = `${path}/uploads/${sanitizedFolder}`;
    const uniqueId = Math.floor(Math.random() * 9999);
    await ensureDir(uploadFolder);

    // ✅ SECURITY FIX: File name sanitization - path traversal attack himoyasi
    const safeFilename = pathModule.basename(file.originalname);
    const filePath = `${uploadFolder}/${uniqueId}-${safeFilename}`;

    await writeFile(filePath, file.buffer);

    const response: FileResponse = {
      url: `/uploads/${sanitizedFolder}/${uniqueId}-${safeFilename}`,
      name: safeFilename,
    };

    return response;
  }
}
