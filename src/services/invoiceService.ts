import { supabase } from "../lib/supabase";

export async function getInvoices() {
  const { data: invoices, error: invoiceError } = await supabase
    .from("invoices")
    .select("*")
    .order("invoice_date", { ascending: false });

  if (invoiceError) {
    throw invoiceError;
  }

  if (!invoices || invoices.length === 0) {
    return [];
  }

  const customerIds = [
    ...new Set(invoices.map((invoice) => invoice.customer_id)),
  ];

  const tripIds = [
    ...new Set(invoices.map((invoice) => invoice.trip_id)),
  ];

  const { data: customers, error: customerError } = await supabase
    .from("customers")
    .select("id, customer_name")
    .in("id", customerIds);

  if (customerError) {
    throw customerError;
  }

  const { data: trips, error: tripError } = await supabase
    .from("trips")
    .select(
      "id, pickup_location, delivery_location, trip_date"
    )
    .in("id", tripIds);

  if (tripError) {
    throw tripError;
  }

  return invoices.map((invoice) => ({
    ...invoice,

    customers:
      customers?.find(
        (customer) => customer.id === invoice.customer_id
      ) ?? null,

    trips:
      trips?.find(
        (trip) => trip.id === invoice.trip_id
      ) ?? null,
  }));
}

export async function createInvoice(
  companyId: string,
  customerId: string,
  tripId: string,
  invoiceNumber: string,
  invoiceDate: string,
  dueDate: string,
  subtotal: number,
  taxAmount: number,
  totalAmount: number,
  paymentStatus: "unpaid" | "partial" |"paid" | "overdue",
) {
  const {data, error} = await supabase
  .from("invoices")
  .insert({
    company_id: companyId,
    customer_id: customerId,
    trip_id: tripId,
    invoice_number: invoiceNumber,
    invoice_date: invoiceDate,
    due_date: dueDate,
    subtotal,
    tax_amount: taxAmount,
    total_amount: totalAmount,
    payment_status: paymentStatus,
  })
  .select()
  .single();

  if (error) throw error;

  return data;
}

export async function createInvoiceWithItems(
  companyId: string,
  customerId: string,
  tripId: string,
  invoiceNumber: string,
  invoiceDate: string,
  dueDate: string,
  taxAmount: number,
  paymentStatus: "unpaid" | "partial" |"paid" | "overdue",
  items: {
    description: string;
    quantity: number;
    unit_price: number;
  }[],
) {
  const { data, error } = await supabase.rpc("create_invoice_with_items", {
    p_company_id: companyId,
    p_customer_id: customerId,
    p_trip_id: tripId,
    p_invoice_number: invoiceNumber,
    p_invoice_date: invoiceDate,
    p_due_date: dueDate,
    p_tax_amount: taxAmount,
    p_payment_status: paymentStatus,
    p_items: items,
  },
  );

  if (error) throw error;
  
  return data;
}

export async function updateInvoiceWithItems(
  invoiceId: string,
  customerId: string,
  tripId: string,
  invoiceDate: string,
  dueDate: string,
  taxAmount: number,
  paymentStatus: "unpaid" | "partial" |"paid" | "overdue",
  items: {
    description: string;
    quantity: number;
    unit_price: number;
  }[],
) {
  const { data, error } = await supabase.rpc("update_invoice_with_items", {
    p_invoice_id: invoiceId,
    p_customer_id: customerId,
    p_trip_id: tripId,
    p_invoice_date: invoiceDate,
    p_due_date: dueDate,
    p_tax_amount: taxAmount,
    p_payment_status: paymentStatus,
    p_items: items,
  },
);

  if (error) throw error;

  return data;
}


export async function deleteInvoice(invoiceId: string) {
  const { data, error } = await supabase.rpc("delete_invoice", {
    p_invoice_id: invoiceId,
  });

  if (error) throw error;

  return data;
}
