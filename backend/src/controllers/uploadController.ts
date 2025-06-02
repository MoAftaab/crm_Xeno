import express from 'express';
import multer from 'multer';
import csvParser from 'csv-parser';
import { Readable } from 'stream';
import { Types } from 'mongoose';
import { processCustomerRow, processOrderRow, generateCustomerSample, generateOrderSample, validateCustomerRow, validateOrderRow } from '../services/uploadService';
import { AuthenticatedRequest } from '../interfaces/interfaces';
import { CustomerCsvRow, OrderCsvRow } from '../interfaces/csv';
import { MulterFileInfo } from '../interfaces/types';
import { Request, Response } from '../types/express';

// Configure multer for file upload
const storage = multer.memoryStorage();
const uploadMiddleware = multer({
  storage,
  fileFilter: (
    _req, 
    file, 
    cb
  ) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      // For rejection in Multer, we need to pass null and false
      cb(null, false);
      // We can't use the cb for error handling directly due to typing constraints
      // The error will be handled elsewhere
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Import customers from CSV
export const importCustomers = async (req: AuthenticatedRequest, res: express.Response): Promise<void> => {
  try {
    const uploadPromise = new Promise((resolve, reject) => {
      uploadMiddleware.single('file')(req as unknown as Request, res, async (err: any) => {
        if (err) {
          console.error('File upload error:', err);
          reject({
            status: 400,
            success: false,
            message: err.message || 'Error uploading file',
          });
          return;
        }

        if (!req.file) {
          reject({
            status: 400,
            success: false,
            message: 'No file uploaded',
          });
          return;
        }

        if (!req.user || !req.user.id) {
          reject({
            status: 401,
            success: false,
            message: 'User not authenticated',
          });
          return;
        }

        // Process the uploaded file
        try {
          const userId = new Types.ObjectId(req.user.id);
          const results: any[] = [];
          const errors: Array<{ row: number; message: string }> = [];
          let rowCount = 0;
          let headerValidated = false;

          const readableStream = Readable.from(req.file.buffer.toString('utf-8'));

          readableStream
            .pipe(csvParser())
            .on('data', async (data: CustomerCsvRow) => {
              rowCount++;
              
              // Validate CSV structure on first row
              if (!headerValidated) {
                headerValidated = true;
                
                // Check if required fields exist in the headers
                for (const field of ['name', 'email']) {
                  if (!(field in data)) {
                    errors.push({ 
                      row: 0, 
                      message: `Required column '${field}' is missing in the CSV file` 
                    });
                    return;
                  }
                }
              }
              
              try {
                // Validate the data first
                const validation = validateCustomerRow(data);
                if (!validation.valid) {
                  errors.push({ row: rowCount, message: validation.error || 'Invalid data' });
                  return;
                }
                
                // Sanitize inputs before processing
                Object.keys(data).forEach(key => {
                  if (typeof data[key] === 'string') {
                    data[key] = data[key].trim();
                  }
                });
                
                const processedCustomer = await processCustomerRow(data, userId);
                results.push(processedCustomer);
              } catch (e: any) {
                errors.push({ row: rowCount, message: e.message });
              }
            })
            .on('end', () => {
              resolve({ results, errors, rowCount });
            })
            .on('error', (err) => {
              reject({
                status: 500,
                success: false,
                message: 'Error processing CSV file',
                error: err.message,
              });
            });
        } catch (error) {
          reject({
            status: 500,
            success: false,
            message: 'Error processing file',
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      });
    });

    const { results, errors, rowCount } = await uploadPromise as { 
      results: any[];
      errors: Array<{ row: number; message: string }>;
      rowCount: number;
    };

    if (rowCount === 0) {
      res.status(400).json({
        success: false,
        message: 'CSV file is empty or contains only headers',
      });
      return;
    }

    if (errors.length > 0) {
      if (errors.length === rowCount) {
        res.status(400).json({
          success: false,
          message: 'All rows in the file failed validation',
          failures: errors,
        });
      } else {
        res.status(207).json({
          success: true,
          message: `File processed with some errors. ${results.length} processed, ${errors.length} failed.`,
          processedCount: results.length,
          failedCount: errors.length,
          failures: errors,
        });
      }
    } else {
      res.status(200).json({
        success: true,
        message: 'File processed successfully',
        count: results.length,
      });
    }
  } catch (error) {
    const errorResponse = error as { status?: number; message: string };
    res.status(errorResponse.status || 500).json({ 
      success: false, 
      message: errorResponse.message || 'Internal server error' 
    });
  }
};

// Import orders from CSV
export const importOrders = async (req: AuthenticatedRequest, res: express.Response): Promise<void> => {
  try {
    const uploadPromise = new Promise((resolve, reject) => {
      uploadMiddleware.single('file')(req as unknown as Request, res, async (err: any) => {
        if (err) {
          reject({
            status: 400,
            success: false,
            message: err.message || 'Error uploading file',
          });
          return;
        }

        if (!req.file) {
          reject({
            status: 400,
            success: false,
            message: 'No file uploaded',
          });
          return;
        }

        if (!req.user || !req.user.id) {
          reject({
            status: 401,
            success: false,
            message: 'User not authenticated',
          });
          return;
        }

        try {
          const userId = new Types.ObjectId(req.user.id);
          const results: any[] = [];
          const errors: Array<{ row: number; message: string }> = [];
          let rowCount = 0;
          let headerValidated = false;

          const readableStream = Readable.from(req.file.buffer.toString('utf-8'));

          readableStream
            .pipe(csvParser())
            .on('data', async (data: OrderCsvRow) => {
              rowCount++;
              
              if (!headerValidated) {
                headerValidated = true;
                for (const field of ['customer_identifier', 'total_amount', 'order_date']) {
                  if (!(field in data)) {
                    errors.push({ 
                      row: 0, 
                      message: `Required column '${field}' is missing in the CSV file` 
                    });
                    return;
                  }
                }
              }
              
              try {
                const validation = validateOrderRow(data);
                if (!validation.valid) {
                  errors.push({ row: rowCount, message: validation.error || 'Invalid data' });
                  return;
                }
                
                Object.keys(data).forEach(key => {
                  if (typeof data[key] === 'string') {
                    data[key] = data[key].trim();
                  }
                });
                
                const processedOrder = await processOrderRow(data, userId);
                results.push(processedOrder);
              } catch (e: any) {
                errors.push({ row: rowCount, message: e.message });
              }
            })
            .on('end', () => {
              resolve({ results, errors, rowCount });
            })
            .on('error', (err) => {
              reject({
                status: 500,
                success: false,
                message: 'Error processing CSV file',
                error: err.message,
              });
            });
        } catch (error) {
          reject({
            status: 500,
            success: false,
            message: 'Error processing file',
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      });
    });

    const { results, errors, rowCount } = await uploadPromise as { 
      results: any[];
      errors: Array<{ row: number; message: string }>;
      rowCount: number;
    };

    if (rowCount === 0) {
      res.status(400).json({
        success: false,
        message: 'CSV file is empty or contains only headers',
      });
      return;
    }

    if (errors.length > 0) {
      if (errors.length === rowCount) {
        res.status(400).json({
          success: false,
          message: 'All rows in the file failed validation',
          failures: errors,
        });
      } else {
        res.status(207).json({
          success: true,
          message: `File processed with some errors. ${results.length} processed, ${errors.length} failed.`,
          processedCount: results.length,
          failedCount: errors.length,
          failures: errors,
        });
      }
    } else {
      res.status(200).json({
        success: true,
        message: 'File processed successfully',
        count: results.length,
      });
    }
  } catch (error) {
    const errorResponse = error as { status?: number; message: string };
    res.status(errorResponse.status || 500).json({ 
      success: false, 
      message: errorResponse.message || 'Internal server error' 
    });
  }
};

// Generate sample CSV data
export const generateSampleData = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const csvContent = await generateCustomerSample();
    
    // Set headers for file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=sample.csv');
    
    // Send the CSV content
    res.send(csvContent);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating sample data',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Generate order sample CSV data
export const generateOrderSampleData = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const csvContent = await generateOrderSample();
    
    // Set headers for file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=order_sample.csv');
    
    // Send the CSV content
    res.send(csvContent);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating sample data',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
