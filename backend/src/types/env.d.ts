// Global type declarations to fix TypeScript errors

declare module 'express' {
  export interface Request {
    user?: any;
    file?: any;
  }
}

declare module 'csv-parser';
declare module 'multer';
