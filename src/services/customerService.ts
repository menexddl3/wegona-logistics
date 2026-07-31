import {supabase} from "../lib/supabase";

export async function getCustomers() {
    const {data, error} = await supabase
    .from("customers")
    .select("*")
    .order("customer_name");

    if (error) {
        throw error;
    }

    return data;
}