// Global type declarations that apply to the entire project

import * as express from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any;
      file?: {
        buffer: Buffer;
        originalname: string;
        mimetype: string;
        size: number;
      };
    }
  }
}

declare module 'express' {
  interface Request {
    user?: any;
    file?: {
      buffer: Buffer;
      originalname: string;
      mimetype: string;
      size: number;
    };
  }
}

declare module 'csv-parser' {
  import { Transform } from 'stream';
  function csvParser(options?: any): Transform;
  export = csvParser;
}

export {};
