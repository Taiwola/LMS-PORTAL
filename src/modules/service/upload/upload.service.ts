import { Injectable } from '@nestjs/common';
import {
  UploadApiResponse,
  UploadApiErrorResponse,
  v2 as cloudinary,
} from 'cloudinary';
import * as streamifier from 'streamifier';
import * as fs from 'fs';

export type CloudinaryType = UploadApiErrorResponse | UploadApiResponse;

@Injectable()
export class UploadService {
  async uploadFile(file: Express.Multer.File): Promise<CloudinaryType> {
    return new Promise<CloudinaryType>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  upload(file: Express.Multer.File): Promise<any> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        file.path,
        {
          resource_type: 'image',
        },
        (error, result) => {
          if (error) {
            console.log('file did not upload');
            reject(error);
          } else {
            console.log('file uploaded successfully');
            fs.unlinkSync(file.path);
            resolve(result);
          }
        },
      );
    });
  }

  uploadMultipleFiles(files: Express.Multer.File[]): Promise<CloudinaryType[]> {
    const uploadPromises = files.map((file) => {
      return this.upload(file);
    });

    return Promise.all(uploadPromises);
  }

  uploadVideo(file: Express.Multer.File): Promise<any> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        file.path,
        {
          resource_type: 'video',
          chunk_size: 18335602,
        },
        (error, result) => {
          if (error) {
            console.log('video did not upload');
            reject(error);
          } else {
            console.log('Video uploaded successfully');
            fs.unlinkSync(file.path);
            resolve(result);
          }
        },
      );
    });
  }

  uploadDoc(file: Express.Multer.File): Promise<any> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        file.path,
        { resource_type: 'raw' },
        function (err, result) {
          if (err) {
            reject(err); // Reject the promise if there's an error
          } else {
            // Delete the local file after successful upload
            fs.unlinkSync(file.path);

            // Resolve the promise with the Cloudinary URL
            resolve(result);
          }
        },
      );
    });
  }
}
