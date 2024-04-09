import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { env } from '../env';

export interface StorageRepository {
  saveFile(filename: string, data: Buffer, mimetype: string): Promise<Output>
  getObject(filename: string): Promise<Output>
}

export class S3Adapter implements StorageRepository {
  private s3: S3Client;

  constructor() {
    this.s3 = new S3Client({
      apiVersion: 'latest',
      region: env.AWS_REGION,
      credentials: {
        accessKeyId: env.AWS_ACESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACESS_KEY
      }
    });
  }

  async saveFile(filename: string, data: Buffer, mimetype: string): Promise<Output> {
    try {
      await this.s3.send(new PutObjectCommand({
        Bucket: env.AWS_BUCKET,
        Key: filename,
        Body: data,
        ContentType: mimetype,
        ACL: 'public-read'
      }));

      return {
        success: true,
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch(e: any) { // TODO: type error
    // TODO: log
      return {
        success: false,
        message: e.message
      };
    }
  }

  async getObject(filename: string): Promise<Output> {
    try {
      const request = await this.s3.send(new GetObjectCommand({
        Bucket: env.AWS_BUCKET,
        Key: filename,
      }));

      const response = await request.Body!.transformToString();

      return {
        success: true,
        data: response
      };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch(e: any) { // TODO: type error
      // TODO: log
      return {
        success: false,
        message: e.message
      };
    }
  }
}

interface Output {
  success: boolean,
  data?: string,
  message?: string
}
