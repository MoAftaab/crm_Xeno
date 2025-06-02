// Type declarations for external modules
declare namespace Express {
  export interface Request {
    user?: any;
    file?: {
      buffer: Buffer;
      originalname: string;
      mimetype: string;
      size: number;
    }
  }
}

// For Express Application type
declare module 'express-serve-static-core' {
  interface Express {
    // Add any custom properties here if needed
  }
}
