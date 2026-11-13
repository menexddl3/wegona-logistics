import { supabase } from "../lib/supabase";

export async function getInvoiceItems(invoiceId: string) {
  const { data, error } = await supabase
    .from("invoice_items")
    .select("*")
    .eq("invoice_id", invoiceId)
    .order("created_at");

    if (error) throw error;

    return data;
}

export async function addInvoiceItems(
  invoiceId: string,
  description: string,
  quantity: number,
  unitPrice: number,
  total: number,
) {
  const { data, error } = await supabase
    .from("invoice_items")
    .insert([
      {
        invoice_id: invoiceId,
        description,
        quantity,
        unit_price: unitPrice,
        total,
      },
    ])
    .select()
    .single()

    if (error) throw error;

    return data;
}

export async function updateInvoiceItem(
  id:string,
  description:string,
  quantity:number,
  unitPrice:number,
  total:number,
) {
  const { data, error } = await supabase
    .from("invoice_items")
    .update({
      description,
      quantity,
      unit_price:unitPrice,
      total,
    })
    .eq("id", id)
    .select()
    .single();

    if (error) throw error;

    return data;
}

export async function deleteInvoiceItem(id:string) {
  const { error } = await supabase
    .from("invoice_items")
    .delete()
    .eq("id", id);

    if (error) throw error;
}