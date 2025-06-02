export interface CustomerCsvRow {
  customer_external_id?: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  [key: string]: any;
}

export interface OrderCsvRow {
  order_external_id?: string;
  customer_identifier: string;
  items_description: string;
  total_amount: string;
  order_date: string;
  status?: string;
  [key: string]: any;
}
