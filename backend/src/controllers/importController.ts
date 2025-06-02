import express from 'express';
import { Redis } from 'ioredis';
import { redisClient } from '../config/redis';
import { processUpload } from '../services/importService';
import { CustomerCsvRow, OrderCsvRow } from '../interfaces/csv';
import { AuthenticatedRequest } from '../interfaces/interfaces';

export const importData = async (req: AuthenticatedRequest, res: express.Response): Promise<void> => {
  try {
    const stream = req.file?.buffer.toString();
    const dataType = req.body.type as 'customer' | 'order';

    if (!stream) {
      res.status(400).json({ message: 'No file provided' });
      return;
    }

    if (!dataType) {
      res.status(400).json({ message: 'Data type not specified' });
      return;
    }

    const rows: Array<CustomerCsvRow | OrderCsvRow> = [];
    let rowCount = 0;
    const errors: Array<{ row: number; message: string }> = [];

    const lines = stream.split('\n');
    const headers = lines[0].split(',');

    for (let i = 1; i < lines.length; i++) {
      rowCount++;
      const values = lines[i].split(',');
      const row: Record<string, string> = {};

      headers.forEach((header, index) => {
        row[header.trim()] = values[index]?.trim() || '';
      });

      try {
        rows.push(row as CustomerCsvRow | OrderCsvRow);
      } catch (error) {
        errors.push({
          row: rowCount,
          message: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    if (errors.length === rowCount) {
      res.status(400).json({
        success: false,
        message: 'All rows failed validation',
        errors
      });
      return;
    }

    const result = await processUpload(rows, dataType, req.user?.id);

    res.status(200).json({
      success: true,
      message: `Processed ${result.processed} rows with ${result.errors.length} errors`,
      errors: result.errors
    });

  } catch (error) {
    console.error('Import error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing import',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
