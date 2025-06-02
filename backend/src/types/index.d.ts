// Global type declarations to fix TypeScript errors

declare module 'csv-parser' {
  import { Transform } from 'stream';
  function csv(options?: any): Transform;
  export = csv;
}

declare module 'multer' {
  import { Request, RequestHandler } from 'express';
  
  namespace multer {
    interface File {
      fieldname: string;
      originalname: string;
      encoding: string;
      mimetype: string;
      size: number;
      destination: string;
      filename: string;
      path: string;
      buffer: Buffer;
    }
    
    interface Options {
      dest?: string;
      storage?: any;
      limits?: {
        fieldNameSize?: number;
        fieldSize?: number;
        fields?: number;
        fileSize?: number;
        files?: number;
        parts?: number;
        headerPairs?: number;
      };
      fileFilter?: (req: Request, file: File, callback: (error: Error | null, acceptFile: boolean) => void) => void;
      preservePath?: boolean;
    }
    
    interface StorageEngine {
      _handleFile(req: Request, file: File, callback: (error?: any, info?: Partial<File>) => void): void;
      _removeFile(req: Request, file: File, callback: (error: Error) => void): void;
    }
    
    interface DiskStorageOptions {
      destination?: string | ((req: Request, file: File, callback: (error: Error | null, destination: string) => void) => void);
      filename?: (req: Request, file: File, callback: (error: Error | null, filename: string) => void) => void;
    }
    
    function diskStorage(options: DiskStorageOptions): StorageEngine;
    function memoryStorage(): StorageEngine;
  }
  
  function multer(options?: multer.Options): {
    single: (fieldname: string) => RequestHandler;
    array: (fieldname: string, maxCount?: number) => RequestHandler;
    fields: (fields: Array<{ name: string, maxCount?: number }>) => RequestHandler;
    none: () => RequestHandler;
    any: () => RequestHandler;
  };
  
  export = multer;
}

// Extend Express Request interface
declare namespace Express {
  interface Request {
    user?: any;
    file?: any;
  }
}
