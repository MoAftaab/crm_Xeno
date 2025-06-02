import { CustomerCsvRow, OrderCsvRow } from '../interfaces/csv';
import Customer from '../models/Customer';
import Order from '../models/Order';
import { Types } from 'mongoose';
import { processCustomerRow, processOrderRow } from './uploadService';

interface ImportResult {
  processed: number;
  errors: Array<{ row: number; message: string }>;
}

export async function processUpload(
  rows: Array<CustomerCsvRow | OrderCsvRow>,
  type: 'customer' | 'order',
  userId?: string
): Promise<ImportResult> {
  const result: ImportResult = {
    processed: 0,
    errors: []
  };

  if (!userId) {
    throw new Error('User ID is required');
  }

  const userObjectId = new Types.ObjectId(userId);

  for (let i = 0; i < rows.length; i++) {
    try {
      if (type === 'customer') {
        await processCustomerRow(rows[i] as CustomerCsvRow, userObjectId);
      } else {
        await processOrderRow(rows[i] as OrderCsvRow, userObjectId);
      }
      result.processed++;
    } catch (error) {
      result.errors.push({
        row: i + 1,
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  return result;
}
