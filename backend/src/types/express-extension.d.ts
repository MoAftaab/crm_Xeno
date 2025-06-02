// This file fixes express import issues by augmenting the express module

import * as express from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any;
      file?: any;
    }
  }
}

declare module 'express' {
  export = express;
}
