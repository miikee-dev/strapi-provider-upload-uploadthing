/// <reference types="node" />
/// <reference types="node" />
import type { ReadStream } from 'node:fs';
import { Time } from '@uploadthing/shared';
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
export type InitOptions = ({
    uTOptions: UTApiOptions;
}) & {
    [k: string]: any;
};
declare const _default: {
    init({ uTOptions }: InitOptions): {
        upload(file: File): Promise<void>;
        delete(file: File): Promise<{
            readonly success: boolean;
            readonly deletedCount: number;
        }>;
        isPrivate(): Promise<boolean>;
        getSignedUrl(): Promise<void>;
    };
};
export default _default;
//# sourceMappingURL=index.d.ts.map