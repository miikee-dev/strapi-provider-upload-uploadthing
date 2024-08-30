import type { ReadStream } from 'node:fs';
import { UTApi, UTFile } from "uploadthing/server"
import { Time } from '@uploadthing/shared';
import { UploadFileResult, UploadFilesOptions, FileEsque } from 'uploadthing/types';

export interface File {
  name: string;
  alternativeText?: string;
  caption?: string;
  width?: number;
  height?: number;
  formats?: Record<string, unknown>;
  hash: string;
  ext?: string;
  mime: string;
  size: number;
  sizeInBytes: number;
  url: string;
  previewUrl?: string;
  path?: string;
  provider?: string;
  provider_metadata?: Record<string, unknown>;
  stream?: ReadStream;
  buffer?: Buffer;
}


export interface UTApiOptions {
  apiKey?: string;
  logLevel?: LogLevel;
  defaultKeyType?: "fileKey" | "customId";
  signedURLExpires?: Time;
  ACL: string;
}

export type LogLevel = "error" | "warn" | "info" | "debug" | "trace";

export type InitOptions = ({ uTOptions: UTApiOptions }) & {
  [k: string]: any;
}


const getConfig = ({ uTOptions, }: InitOptions) => {
  const config = {
    ...uTOptions,
  };
  return config;
};

export default {
  init({ uTOptions }: InitOptions) {
    const config = getConfig({ uTOptions });
    const utapi = new UTApi(config);

    const upload = async (file: File) => {

      try {

        const utFile = new UTFile(
          [Buffer.from(file.buffer as any, 'binary')],
          file.name,
        )
        const utResponse: UploadFileResult = await utapi.uploadFiles(utFile);

        if (!utResponse || utResponse.error) {
          throw new Error(`Failed to upload image: ${utResponse?.error?.message || 'Unknown error'}`);
        }

        if (!utResponse.data) {
          throw new Error("Failed to upload image: No data returned");
        }

        const imageUrl = utResponse.data.url;
        if (!imageUrl) {
          throw new Error("Failed to upload image: url not returned");
        }

        const key = utResponse.data.key;
        if (!key) {
          throw new Error("Failed to upload image: key not returned");
        }

        file.url = utResponse.data?.url
        file.previewUrl = utResponse.data?.url
        file.provider_metadata = {
          "fileKey": utResponse.data?.key,
          "customId": utResponse.data?.customId
        }

      } catch (error) {
        console.error("Error in uploading file:", error);
        if (error instanceof Error) {
          console.error("Error message:", error.message);
          console.error("Error stack:", error.stack);
        }
        throw error;
      }
    }

    return {

      async upload(file: File) {
        return upload(file);
      },

      async delete(file: File) {
        try {
          const fileKey = file.provider_metadata?.fileKey as string;

          if (!fileKey) {
            throw new Error("Failed to upload image: key not returned");
          }

          return await utapi.deleteFiles(fileKey);

        } catch (error) {
          console.error("Error in deleting file:", error);
          if (error instanceof Error) {
            console.error("Error message:", error.message);
            console.error("Error stack:", error.stack);
          }
          throw error;
        }

      },

      async isPrivate() {
        return false;
      },

      async getSignedUrl() {
       
      },

    };
  },
};