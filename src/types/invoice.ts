export interface Invoice {
  id: string;
  created_at: string;

  company_id: string;
  customer_id: string;
  trip_id: string;

  invoice_number: string;
  invoice_date: string;
  due_date: string;

  subtotal: number;
  tax_amount: number | null;
  total_amount: number;

  payment_status: "unpaid" | "partial" | "paid" | "overdue";

  customers: {
    customer_name: string;
  } | null;

  trips: {
  pickup_location: string;
  delivery_location: string;
  trip_date: string;
}| null;
}

export interface InvoiceItem{
  id: string;
  created_at: string;

  invoice_id: string;
  
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

