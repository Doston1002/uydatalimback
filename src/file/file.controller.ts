import {
  BadRequestException,
  Controller,
  HttpCode,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('save')
  @HttpCode(200)
  @UseInterceptors(
    FileInterceptor('image', {
      // ✅ SECURITY FIX: File type validation - rasmlar va PDF (books uchun)
      fileFilter: (req, file, cb) => {
        const allowedImageTypes = /\/(jpg|jpeg|png|gif|webp)$/;
        const isPdf = file.mimetype === 'application/pdf';

        if (!file.mimetype.match(allowedImageTypes) && !isPdf) {
          return cb(
            new BadRequestException(
              'Faqat rasm fayllar (jpg, jpeg, png, gif, webp) yoki PDF ruxsat etilgan',
            ),
            false,
          );
        }
        cb(null, true);
      },
      // ✅ File size limit - 50MB (katta PDF fayllar uchun)
      limits: {
        fileSize: 50 * 1024 * 1024, // 50MB
      },
    }),
  )
  async saveFile(@UploadedFile() file: Express.Multer.File, @Query('folder') folder?: string) {
    if (!file) {
      throw new BadRequestException('Fayl yuklanmadi');
    }
    return this.fileService.saveFile(file, folder);
  }

  @Post('save-pdf')
  @HttpCode(200)
  @UseInterceptors(
    FileInterceptor('pdf', {
      // ✅ SECURITY FIX: File type validation - faqat PDF
      fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'application/pdf') {
          return cb(new BadRequestException('Faqat PDF fayllar ruxsat etilgan'), false);
        }
        cb(null, true);
      },
      // ✅ File size limit - max 50MB for PDF
      limits: {
        fileSize: 50 * 1024 * 1024, // 50MB
      },
    }),
  )
  async savePdfFile(@UploadedFile() file: Express.Multer.File, @Query('folder') folder?: string) {
    if (!file) {
      throw new BadRequestException('Fayl yuklanmadi');
    }
    return this.fileService.saveFile(file, folder);
  }
}
